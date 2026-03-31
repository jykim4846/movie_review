export type MovieEntry = {
  id: string;
  movieId: string;
  externalMovieId?: string | null;
  title: string;
  posterUrl?: string | null;
  watchedAt: string;
  watchPlace?: string | null;
  watchMethod: string;
  companions?: string | null;
  rating?: number | null;
  shortReview?: string | null;
  isSpoiler: boolean;
  generatedCaptionCount: number;
  createdAt: string;
  updatedAt: string;
};

export type GeneratedCaptionSummary = {
  id: string;
  tone: string;
  captionText: string;
  hashtagsText?: string | null;
  versionNo: number;
  createdAt: string;
};

export type MovieEntryDetail = MovieEntry & {
  originalTitle?: string | null;
  releaseDate?: string | null;
  overview?: string | null;
  runtime?: number | null;
  genres: string[];
  generatedCaptions: GeneratedCaptionSummary[];
};
