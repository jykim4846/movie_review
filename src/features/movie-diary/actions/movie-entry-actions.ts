"use server";

import { WatchMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import type { MovieEntryFormState } from "@/features/movie-diary/types/movie-entry-form-state";
import { hasRequiredServerEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const defaultState: MovieEntryFormState = {
  ok: false,
  message: "",
};

const watchMethods = new Set<string>(Object.values(WatchMethod));

function getTrimmed(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function parseMoviePayload(formData: FormData) {
  const externalMovieId = getTrimmed(formData.get("externalMovieId"));
  const title = getTrimmed(formData.get("title"));
  const originalTitle = getTrimmed(formData.get("originalTitle"));
  const releaseDate = getTrimmed(formData.get("releaseDate"));
  const posterUrl = getTrimmed(formData.get("posterUrl"));
  const overview = getTrimmed(formData.get("overview"));
  const runtimeRaw = getTrimmed(formData.get("runtime"));
  const genresRaw = getTrimmed(formData.get("genres"));
  const watchedAt = getTrimmed(formData.get("watchedAt"));
  const watchPlace = getTrimmed(formData.get("watchPlace"));
  const watchMethod = getTrimmed(formData.get("watchMethod"));
  const companions = getTrimmed(formData.get("companions"));
  const shortReview = getTrimmed(formData.get("shortReview"));
  const ratingRaw = getTrimmed(formData.get("rating"));
  const redirectTo = getTrimmed(formData.get("redirectTo"));
  const isSpoiler = formData.get("isSpoiler") === "on";

  return {
    externalMovieId,
    title,
    originalTitle,
    releaseDate,
    posterUrl,
    overview,
    runtimeRaw,
    genresRaw,
    watchedAt,
    watchPlace,
    watchMethod,
    companions,
    shortReview,
    ratingRaw,
    redirectTo,
    isSpoiler,
  };
}

function validateMoviePayload(payload: ReturnType<typeof parseMoviePayload>) {
  if (!payload.title) {
    return { ok: false, message: "영화 제목을 입력해 주세요." } as const;
  }
  if (!payload.watchedAt) {
    return { ok: false, message: "관람일을 입력해 주세요." } as const;
  }
  if (!payload.watchMethod || !watchMethods.has(payload.watchMethod)) {
    return { ok: false, message: "관람 방식을 선택해 주세요." } as const;
  }
  if (!payload.shortReview) {
    return { ok: false, message: "한줄 감상을 입력해 주세요." } as const;
  }

  const rating = payload.ratingRaw ? Number(payload.ratingRaw) : null;
  if (payload.ratingRaw && Number.isNaN(rating)) {
    return { ok: false, message: "별점 값이 올바르지 않습니다." } as const;
  }
  if (rating !== null && (rating < 0.5 || rating > 5 || (rating * 10) % 5 !== 0)) {
    return {
      ok: false,
      message: "별점은 0.5점부터 5점까지 0.5 단위로 입력해 주세요.",
    } as const;
  }

  const watchedAtDate = new Date(payload.watchedAt);
  if (Number.isNaN(watchedAtDate.getTime())) {
    return { ok: false, message: "관람일 형식이 올바르지 않습니다." } as const;
  }

  const releaseDateValue = payload.releaseDate ? new Date(payload.releaseDate) : null;
  const runtime = payload.runtimeRaw ? Number(payload.runtimeRaw) : null;
  const genres = payload.genresRaw
    ? payload.genresRaw.split("|").map((genre) => genre.trim()).filter(Boolean)
    : [];

  return {
    ok: true,
    data: {
      rating,
      watchedAtDate,
      releaseDateValue,
      runtime,
      genres,
    },
  } as const;
}

export async function createMovieEntry(
  _prevState: MovieEntryFormState = defaultState,
  formData: FormData,
): Promise<MovieEntryFormState> {
  void _prevState;

  if (!hasRequiredServerEnv()) {
    return { ok: false, message: "DATABASE_URL이 없어 저장 기능을 사용할 수 없습니다." };
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { ok: false, message: "로그인 후에 영화 기록을 저장할 수 있습니다." };
    }

    const payload = parseMoviePayload(formData);
    const validation = validateMoviePayload(payload);
    if (!validation.ok) {
      return validation;
    }

    await prisma.$transaction(async (tx) => {
      const movie = payload.externalMovieId
        ? await tx.movie.upsert({
            where: {
              externalMovieId: payload.externalMovieId,
            },
            update: {
              title: payload.title,
              originalTitle: payload.originalTitle || null,
              releaseDate: validation.data.releaseDateValue,
              posterUrl: payload.posterUrl || null,
              overview: payload.overview || null,
              runtime: validation.data.runtime,
              genres: validation.data.genres,
            },
            create: {
              externalMovieId: payload.externalMovieId,
              title: payload.title,
              originalTitle: payload.originalTitle || null,
              releaseDate: validation.data.releaseDateValue,
              posterUrl: payload.posterUrl || null,
              overview: payload.overview || null,
              runtime: validation.data.runtime,
              genres: validation.data.genres,
            },
          })
        : await tx.movie.create({
            data: {
              title: payload.title,
              originalTitle: payload.originalTitle || null,
              releaseDate: validation.data.releaseDateValue,
              posterUrl: payload.posterUrl || null,
              overview: payload.overview || null,
              runtime: validation.data.runtime,
              genres: validation.data.genres,
            },
          });

      await tx.movieLog.create({
        data: {
          userId: session.user.id,
          movieId: movie.id,
          watchedAt: validation.data.watchedAtDate,
          watchPlace: payload.watchPlace || null,
          watchMethod: payload.watchMethod as WatchMethod,
          companions: payload.companions || null,
          rating: validation.data.rating,
          shortReview: payload.shortReview,
          isSpoiler: payload.isSpoiler,
        },
      });
    });

    revalidatePath("/diary");
    revalidatePath("/logs");
    revalidatePath("/logs/new");

    if (payload.redirectTo) {
      redirect(payload.redirectTo);
    }

    return { ok: true, message: "영화 기록을 저장했습니다." };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "영화 기록 저장 중 오류가 발생했습니다." };
  }
}

export async function updateMovieEntry(
  _prevState: MovieEntryFormState = defaultState,
  formData: FormData,
): Promise<MovieEntryFormState> {
  void _prevState;

  if (!hasRequiredServerEnv()) {
    return { ok: false, message: "DATABASE_URL이 없어 수정 기능을 사용할 수 없습니다." };
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { ok: false, message: "로그인 후에 영화 기록을 수정할 수 있습니다." };
    }

    const id = getTrimmed(formData.get("id"));
    if (!id) {
      return { ok: false, message: "수정할 기록 ID가 없습니다." };
    }

    const payload = parseMoviePayload(formData);
    const validation = validateMoviePayload(payload);
    if (!validation.ok) {
      return validation;
    }

    const existingLog = await prisma.movieLog.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingLog) {
      return { ok: false, message: "수정할 기록을 찾을 수 없습니다." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.movie.update({
        where: {
          id: existingLog.movieId,
        },
        data: {
          externalMovieId: payload.externalMovieId || null,
          title: payload.title,
          originalTitle: payload.originalTitle || null,
          releaseDate: validation.data.releaseDateValue,
          posterUrl: payload.posterUrl || null,
          overview: payload.overview || null,
          runtime: validation.data.runtime,
          genres: validation.data.genres,
        },
      });

      await tx.movieLog.update({
        where: {
          id: existingLog.id,
        },
        data: {
          watchedAt: validation.data.watchedAtDate,
          watchPlace: payload.watchPlace || null,
          watchMethod: payload.watchMethod as WatchMethod,
          companions: payload.companions || null,
          rating: validation.data.rating,
          shortReview: payload.shortReview,
          isSpoiler: payload.isSpoiler,
        },
      });
    });

    revalidatePath("/diary");
    revalidatePath("/logs");
    revalidatePath(`/logs/${id}`);
    revalidatePath(`/logs/${id}/edit`);

    if (payload.redirectTo) {
      redirect(payload.redirectTo);
    }

    return { ok: true, message: "영화 기록을 수정했습니다." };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "영화 기록 수정 중 오류가 발생했습니다." };
  }
}

export async function deleteMovieEntry(id: string): Promise<void> {
  if (!hasRequiredServerEnv()) {
    return;
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return;
    }

    await prisma.movieLog.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });
    revalidatePath("/diary");
    revalidatePath("/logs");
  } catch (error) {
    console.error(error);
  }
}

export async function deleteMovieEntryAndRedirect(id: string, redirectTo: string): Promise<void> {
  await deleteMovieEntry(id);
  redirect(redirectTo);
}
