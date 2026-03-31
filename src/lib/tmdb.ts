import { env, hasMovieApiEnv, hasRequiredServerEnv } from "@/lib/env";
import type {
  MovieSearchItem,
  MovieSearchResult,
  SelectedMovie,
  TmdbMovieDetail,
  TmdbMovieSearchResponse,
} from "@/features/movies/types/movie-api";
import { prisma } from "@/lib/prisma";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

class TmdbError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TmdbError";
  }
}

async function tmdbFetch<T>(path: string, searchParams?: URLSearchParams): Promise<T> {
  if (!hasMovieApiEnv()) {
    throw new TmdbError("TMDB API 설정이 없어 영화 검색을 사용할 수 없습니다.");
  }

  const url = new URL(`${TMDB_API_BASE_URL}${path}`);
  if (searchParams) {
    url.search = searchParams.toString();
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.tmdbApiReadAccessToken}`,
      Accept: "application/json",
    },
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    throw new TmdbError("영화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }

  return response.json() as Promise<T>;
}

function buildPosterUrl(path: string | null) {
  return path ? `${TMDB_IMAGE_BASE_URL}${path}` : null;
}

function getReleaseYear(releaseDate: string) {
  return releaseDate ? releaseDate.slice(0, 4) : null;
}

function mapMovieSearchItem(item: TmdbMovieSearchResponse["results"][number]): MovieSearchItem {
  return {
    id: String(item.id),
    title: item.title,
    originalTitle: item.original_title || null,
    releaseYear: getReleaseYear(item.release_date),
    posterUrl: buildPosterUrl(item.poster_path),
  };
}

function mapCachedMovieToSelectedMovie(movie: {
  externalMovieId: string | null;
  title: string;
  originalTitle: string | null;
  releaseDate: Date | null;
  posterUrl: string | null;
  overview: string | null;
  runtime: number | null;
  genres: string[];
}): SelectedMovie | null {
  if (!movie.externalMovieId) {
    return null;
  }

  return {
    externalMovieId: movie.externalMovieId,
    title: movie.title,
    originalTitle: movie.originalTitle,
    releaseDate: movie.releaseDate ? movie.releaseDate.toISOString().slice(0, 10) : null,
    posterUrl: movie.posterUrl,
    overview: movie.overview,
    runtime: movie.runtime,
    genres: movie.genres,
  };
}

export async function searchMovies(query: string): Promise<MovieSearchResult> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return {
      ok: true,
      items: [],
    };
  }

  try {
    const data = await tmdbFetch<TmdbMovieSearchResponse>(
      "/search/movie",
      new URLSearchParams({
        query: normalizedQuery,
        language: "ko-KR",
        include_adult: "false",
      }),
    );

    return {
      ok: true,
      items: data.results.map(mapMovieSearchItem),
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof TmdbError
          ? error.message
          : "영화 검색 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      items: [],
    };
  }
}

export async function getMovieById(movieId: string): Promise<SelectedMovie | null> {
  if (!movieId.trim()) {
    return null;
  }

  if (hasRequiredServerEnv()) {
    try {
      const cachedMovie = await prisma.movie.findUnique({
        where: {
          externalMovieId: movieId,
        },
      });

      const mappedMovie = cachedMovie ? mapCachedMovieToSelectedMovie(cachedMovie) : null;
      if (mappedMovie) {
        return mappedMovie;
      }
    } catch (error) {
      console.error(error);
    }
  }

  try {
    const data = await tmdbFetch<TmdbMovieDetail>(
      `/movie/${movieId}`,
      new URLSearchParams({ language: "ko-KR" }),
    );

    const mappedMovie = {
      externalMovieId: String(data.id),
      title: data.title,
      originalTitle: data.original_title || null,
      releaseDate: data.release_date || null,
      posterUrl: buildPosterUrl(data.poster_path),
      overview: data.overview || null,
      runtime: data.runtime,
      genres: data.genres.map((genre) => genre.name),
    } satisfies SelectedMovie;

    if (hasRequiredServerEnv()) {
      try {
        await prisma.movie.upsert({
          where: {
            externalMovieId: mappedMovie.externalMovieId,
          },
          update: {
            title: mappedMovie.title,
            originalTitle: mappedMovie.originalTitle,
            releaseDate: mappedMovie.releaseDate ? new Date(mappedMovie.releaseDate) : null,
            posterUrl: mappedMovie.posterUrl,
            overview: mappedMovie.overview,
            runtime: mappedMovie.runtime,
            genres: mappedMovie.genres,
          },
          create: {
            externalMovieId: mappedMovie.externalMovieId,
            title: mappedMovie.title,
            originalTitle: mappedMovie.originalTitle,
            releaseDate: mappedMovie.releaseDate ? new Date(mappedMovie.releaseDate) : null,
            posterUrl: mappedMovie.posterUrl,
            overview: mappedMovie.overview,
            runtime: mappedMovie.runtime,
            genres: mappedMovie.genres,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }

    return mappedMovie;
  } catch {
    return null;
  }
}
