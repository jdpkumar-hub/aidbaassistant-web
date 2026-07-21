"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

	useEffect(() => {
		async function checkProfile() {
		  const res = await fetch("/api/profile/status");
		  const profile = await res.json();

		  console.log(profile);

		  if (!profile.authenticated) return;

		  if (profile.profileCompleted) {
			console.log("Going to dashboard");
			router.replace("/dashboard");
		  } else {
			console.log("Going to profile");
			router.replace("/account/profile");
		  }
		}
	  if (status === "authenticated") {
		checkProfile();
	  }
	}, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking login...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-8">
        <h1 className="mb-6 text-2xl font-bold">
          AI DBA Assistant
        </h1>

        <button
          onClick={() => signIn("google")}
          className="mb-4 w-full rounded bg-blue-600 p-3 text-white"
        >
          Continue with Google
        </button>

        <button
          onClick={() => signIn("github")}
          className="w-full rounded bg-gray-800 p-3 text-white"
        >
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}