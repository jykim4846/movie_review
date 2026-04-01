import { env, hasMovieApiEnv } from "@/lib/env";
import type {
  MovieSearchItem,
  MovieSearchResult,
  SelectedMovie,
  TmdbMovieDetail,
  TmdbMovieSearchResponse,
} from "@/features/movies/types/movie-api";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780";

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
  if (searchParams) url.search = searchParams.toString();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.tmdbApiReadAccessToken}`,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new TmdbError("영화 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }

  return response.json() as Promise<T>;
}

function buildPosterUrl(path: string | null) {
  return path ? `${TMDB_IMAGE_BASE_URL}${path}` : null;
}

function mapMovieSearchItem(item: TmdbMovieSearchResponse["results"][number]): MovieSearchItem {
  return {
    id: String(item.id),
    title: item.title,
    originalTitle: item.original_title || null,
    releaseYear: item.release_date ? item.release_date.slice(0, 4) : null,
    posterUrl: buildPosterUrl(item.poster_path),
  };
}

export async function searchMovies(query: string): Promise<MovieSearchResult> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return { ok: true, items: [] };

  try {
    const data = await tmdbFetch<TmdbMovieSearchResponse>(
      "/search/movie",
      new URLSearchParams({ query: normalizedQuery, language: "ko-KR", include_adult: "false" }),
    );
    return { ok: true, items: data.results.map(mapMovieSearchItem) };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof TmdbError
          ? error.message
          : "영화 검색 중 오류가 발생했습니다.",
      items: [],
    };
  }
}

export async function getMovieById(movieId: string): Promise<SelectedMovie | null> {
  if (!movieId.trim()) return null;

  try {
    const data = await tmdbFetch<TmdbMovieDetail>(
      `/movie/${movieId}`,
      new URLSearchParams({ language: "ko-KR" }),
    );

    return {
      externalMovieId: String(data.id),
      title: data.title,
      originalTitle: data.original_title || null,
      releaseDate: data.release_date || null,
      posterUrl: buildPosterUrl(data.poster_path),
      overview: data.overview || null,
      runtime: data.runtime,
      genres: data.genres.map((g) => g.name),
    } satisfies SelectedMovie;
  } catch {
    return null;
  }
}
