import { Prisma } from "@prisma/client";

import type { MovieEntry } from "@/types/movie-entry";

type MovieEntryRecord = {
  id: string;
  movieId: string;
  movie: {
    title: string;
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

export function mapMovieEntry(record: MovieEntryRecord): MovieEntry {
  return {
    id: record.id,
    movieId: record.movieId,
    title: record.movie.title,
    watchedAt: record.watchedAt.toISOString(),
    watchPlace: record.watchPlace,
    watchMethod: record.watchMethod,
    companions: record.companions,
    rating: record.rating ? record.rating.toNumber() : null,
    shortReview: record.shortReview,
    isSpoiler: record.isSpoiler,
    generatedCaptionCount: record._count.generatedCaptions,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
