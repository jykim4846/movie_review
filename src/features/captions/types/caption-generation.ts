export type CaptionGenerationRequest = {
  title: string;
  watchedAt: string;
  watchPlace: string | null;
  watchMethod: string;
  rating: number | null;
  shortReview: string | null;
  isSpoiler: boolean;
};

export type CaptionVariant = {
  tone: "CALM" | "EMOTIONAL" | "REVIEW";
  captionText: string;
};

export type CaptionGenerationResult = {
  captions: [CaptionVariant, CaptionVariant, CaptionVariant];
  hashtags: string[];
};
