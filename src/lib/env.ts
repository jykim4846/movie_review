export const env = {
  groqApiKey: process.env.GROQ_API_KEY ?? "",
  tmdbApiReadAccessToken: process.env.TMDB_API_READ_ACCESS_TOKEN ?? "",
} as const;

export function hasOpenAiEnv() {
  return Boolean(env.groqApiKey);
}

export function hasMovieApiEnv() {
  return Boolean(env.tmdbApiReadAccessToken);
}
