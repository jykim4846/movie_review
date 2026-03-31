export const env = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "무비 다이어리",
  authSecret: process.env.AUTH_SECRET ?? "",
  tmdbApiReadAccessToken: process.env.TMDB_API_READ_ACCESS_TOKEN ?? "",
} as const;

export function hasRequiredServerEnv() {
  return Boolean(env.databaseUrl);
}

export function hasMovieApiEnv() {
  return Boolean(env.tmdbApiReadAccessToken);
}
