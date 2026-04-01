import Anthropic from "@anthropic-ai/sdk";

import { env } from "@/lib/env";

const globalForAnthropic = globalThis as unknown as {
  anthropic?: Anthropic;
};

export const anthropic =
  globalForAnthropic.anthropic ??
  new Anthropic({
    apiKey: env.anthropicApiKey,
  });

if (process.env.NODE_ENV !== "production") {
  globalForAnthropic.anthropic = anthropic;
}
