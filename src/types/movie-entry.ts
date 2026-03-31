export type MovieEntry = {
  id: string;
  title: string;
  watchedAt: string;
  watchedPlace?: string | null;
  oneLineReview: string;
  detailedReview?: string | null;
  instagramDraft?: string | null;
  createdAt: string;
  updatedAt: string;
};
