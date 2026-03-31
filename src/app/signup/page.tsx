import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignupForm } from "@/features/auth/components/signup-form";

export default async function SignupPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/diary");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <SignupForm />
    </main>
  );
}
