import { Prisma } from "@prisma/client";

import type { MovieEntry, MovieEntryDetail } from "@/types/movie-entry";
import { prisma } from "@/lib/prisma";

type MovieLogListRecord = {
  id: string;
  movieId: string;
  movie: {
    externalMovieId: string | null;
    title: string;
    posterUrl: string | null;
  };
  watchedAt: Date;
  watchPlace: string | null;
  watchMethod: string;
  companions: string | null;
  rating: Prisma.Decimal | null;
  shortReview: string | null;
  isSpoiler: boolean;
  _count: {
    generatedCaptions: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

type MovieLogDetailRecord = {
  id: string;
  movieId: string;
  movie: {
    externalMovieId: string | null;
    title: string;
    originalTitle: string | null;
    releaseDate: Date | null;
    posterUrl: string | null;
    overview: string | null;
    runtime: number | null;
    genres: string[];
  };
  watchedAt: Date;
  watchPlace: string | null;
  watchMethod: string;
  companions: string | null;
  rating: Prisma.Decimal | null;
  shortReview: string | null;
  isSpoiler: boolean;
  generatedCaptions: Array<{
    id: string;
    tone: string;
    captionText: string;
    hashtagsText: string | null;
    versionNo: number;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

function toNumber(value: Prisma.Decimal | null) {
  return value ? value.toNumber() : null;
}

function mapMovieLogListItem(record: MovieLogListRecord): MovieEntry {
  return {
    id: record.id,
    movieId: record.movieId,
    externalMovieId: record.movie.externalMovieId,
    title: record.movie.title,
    posterUrl: record.movie.posterUrl,
    watchedAt: record.watchedAt.toISOString(),
    watchPlace: record.watchPlace,
    watchMethod: record.watchMethod,
    companions: record.companions,
    rating: toNumber(record.rating),
    shortReview: record.shortReview,
    isSpoiler: record.isSpoiler,
    generatedCaptionCount: record._count.generatedCaptions,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function mapMovieLogDetail(record: MovieLogDetailRecord): MovieEntryDetail {
  return {
    id: record.id,
    movieId: record.movieId,
    externalMovieId: record.movie.externalMovieId,
    title: record.movie.title,
    originalTitle: record.movie.originalTitle,
    releaseDate: record.movie.releaseDate?.toISOString() ?? null,
    posterUrl: record.movie.posterUrl,
    overview: record.movie.overview,
    runtime: record.movie.runtime,
    genres: record.movie.genres,
    watchedAt: record.watchedAt.toISOString(),
    watchPlace: record.watchPlace,
    watchMethod: record.watchMethod,
    companions: record.companions,
    rating: toNumber(record.rating),
    shortReview: record.shortReview,
    isSpoiler: record.isSpoiler,
    generatedCaptionCount: record.generatedCaptions.length,
    generatedCaptions: record.generatedCaptions.map((caption) => ({
      id: caption.id,
      tone: caption.tone,
      captionText: caption.captionText,
      hashtagsText: caption.hashtagsText,
      versionNo: caption.versionNo,
      createdAt: caption.createdAt.toISOString(),
    })),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function getUserMovieLogs(userId: string) {
  const items = await prisma.movieLog.findMany({
    where: {
      userId,
    },
    include: {
      movie: {
        select: {
          externalMovieId: true,
          title: true,
          posterUrl: true,
        },
      },
      _count: {
        select: {
          generatedCaptions: true,
        },
      },
    },
    orderBy: {
      watchedAt: "desc",
    },
  });

  return items.map((item) => mapMovieLogListItem(item as MovieLogListRecord));
}

export async function getUserMovieLogById(userId: string, id: string) {
  const item = await prisma.movieLog.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      movie: {
        select: {
          externalMovieId: true,
          title: true,
          originalTitle: true,
          releaseDate: true,
          posterUrl: true,
          overview: true,
          runtime: true,
          genres: true,
        },
      },
      generatedCaptions: {
        orderBy: {
          versionNo: "desc",
        },
      },
    },
  });

  return item ? mapMovieLogDetail(item as MovieLogDetailRecord) : null;
}
