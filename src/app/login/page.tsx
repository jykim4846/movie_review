import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/features/auth/components/login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/diary");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <LoginForm />
    </main>
  );
}
