"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import type { AuthFormState } from "@/features/auth/types/auth-form-state";
import { prisma } from "@/lib/prisma";

const defaultState: AuthFormState = {
  ok: false,
  message: "",
};

function getTrimmed(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function login(
  _prevState: AuthFormState = defaultState,
  formData: FormData,
): Promise<AuthFormState> {
  void _prevState;

  const email = getTrimmed(formData.get("email")).toLowerCase();
  const password = getTrimmed(formData.get("password"));

  if (!email || !password) {
    return { ok: false, message: "이메일과 비밀번호를 입력해 주세요." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/diary",
    });

    return { ok: true, message: "로그인되었습니다." };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." };
    }

    throw error;
  }
}

export async function signup(
  _prevState: AuthFormState = defaultState,
  formData: FormData,
): Promise<AuthFormState> {
  void _prevState;

  const name = getTrimmed(formData.get("name"));
  const email = getTrimmed(formData.get("email")).toLowerCase();
  const password = getTrimmed(formData.get("password"));
  const confirmPassword = getTrimmed(formData.get("confirmPassword"));

  if (!name || !email || !password || !confirmPassword) {
    return { ok: false, message: "이름, 이메일, 비밀번호를 모두 입력해 주세요." };
  }

  if (password.length < 8) {
    return { ok: false, message: "비밀번호는 8자 이상이어야 합니다." };
  }

  if (password !== confirmPassword) {
    return { ok: false, message: "비밀번호 확인이 일치하지 않습니다." };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return { ok: false, message: "이미 가입된 이메일입니다." };
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/diary",
    });

    return { ok: true, message: "회원가입이 완료되었습니다." };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, message: "회원가입 후 자동 로그인에 실패했습니다." };
    }

    throw error;
  }
}

export async function logout() {
  await signOut({
    redirectTo: "/",
  });
}
