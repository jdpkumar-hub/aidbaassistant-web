"use client";

import ProgressHeader from "@/components/onboarding/ProgressHeader";
import { CheckCircle2, Rocket, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FinishPage() {
  const router = useRouter();

	async function finishSetup() {
	  try {
		const response = await fetch("/api/account/save", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({
			step: "finish",
		  }),
		});

		const result = await response.json();

		console.log("FINISH RESPONSE:", result);

		if (!response.ok) {
		  alert(result.error || "Failed to complete onboarding.");
		  return;
		}

		router.push("/dashboard");
	  } catch (err) {
		console.error(err);
		alert("Unexpected error completing onboarding.");
	  }
	}

  return (
    <>
      <ProgressHeader
        step={5}
        totalSteps={5}
        title="Setup Complete 🎉"
        subtitle="Your AI DBA Assistant workspace is ready."
      />

      <div className="rounded-2xl border border-white/10 bg-navy-900/70 p-10">

        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-8 flex justify-center">

            <div className="rounded-full bg-green-500/20 p-6">

              <CheckCircle2
                className="h-20 w-20 text-green-400"
              />

            </div>

          </div>

          <h2 className="text-4xl font-bold">
            Welcome to AI DBA Assistant
          </h2>

          <p className="mt-5 text-lg text-silver-400">
            Your onboarding is complete.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-2">

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">

              <Rocket className="mb-4 h-8 w-8 text-accent" />

              <h3 className="font-semibold">
                Personalized Dashboard
              </h3>

              <p className="mt-2 text-sm text-silver-400">
                Dashboard customized for your Oracle environment.
              </p>

            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">

              <Sparkles className="mb-4 h-8 w-8 text-accent" />

              <h3 className="font-semibold">
                AI Recommendations
              </h3>

              <p className="mt-2 text-sm text-silver-400">
                Personalized AWR, SQL Tuning and Health Check insights.
              </p>

            </div>

          </div>

          <div className="mt-12 rounded-xl bg-accent/10 p-6">

            <h3 className="text-xl font-semibold">
              Included in your workspace
            </h3>

            <div className="mt-6 grid gap-3 text-left md:grid-cols-2">

              <div>✅ AI AWR Analyzer</div>
              <div>✅ SQL Rewrite Assistant</div>
              <div>✅ Executive Dashboard</div>
              <div>✅ Health Score Engine</div>
              <div>✅ Bottleneck Detection</div>
              <div>✅ PDF Report Generator</div>
              <div>✅ AI Chat Assistant</div>
              <div>✅ Oracle Performance Insights</div>

            </div>

          </div>

          <button
            onClick={finishSetup}
            className="mt-12 rounded-xl bg-accent px-12 py-4 text-lg font-semibold hover:bg-accent-hover"
          >
            Launch AI DBA Assistant →
          </button>

        </div>

      </div>
    </>
  );
}