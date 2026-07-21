"use client";

import ProgressHeader from "@/components/onboarding/ProgressHeader";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AIPreferencesPage() {
  const [modules, setModules] = useState<string[]>([]);
  const [level, setLevel] = useState("");
  const router = useRouter();
  const aiModules = [
    "AWR Analysis",
    "SQL Tuning",
    "Performance Monitoring",
    "OEM",
    "Health Checks",
    "Oracle Upgrades",
    "Cloud Migration",
    "Security",
    "Cost Optimization",
    "Capacity Planning",
  ];

	async function saveAndContinue() {
	  try {
		const res = await fetch("/api/account/save", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({
			step: "ai-preferences",
			aiModules: modules,
			aiExperience: level,
		  }),
		});

		if (!res.ok) {
		  const text = await res.text();
		  console.error(text);
		  alert("Unable to save your preferences.");
		  return;
		}

		router.push("/account/finish");
	  } catch (err) {
		console.error(err);
		alert("Something went wrong.");
	  }
	}

  function toggle(item: string) {
    if (modules.includes(item)) {
      setModules(modules.filter((x) => x !== item));
    } else {
      setModules([...modules, item]);
    }
  }

  return (
    <>
      <ProgressHeader
        step={4}
        totalSteps={5}
        title="AI Preferences"
        subtitle="Choose what AI DBA Assistant should focus on."
      />

      <div className="rounded-2xl border border-white/10 bg-navy-900/70 p-8">

        <h2 className="mb-5 text-xl font-semibold">
          AI Modules
        </h2>

        <div className="grid gap-3 md:grid-cols-2">

          {aiModules.map((item) => (

            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              className={`rounded-xl border p-4 text-left transition-all
              ${
                modules.includes(item)
                  ? "border-accent bg-accent text-white"
                  : "border-white/10 bg-white/5 hover:border-accent"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

        <div className="mt-10">

          <h2 className="mb-5 text-xl font-semibold">
            AI Experience
          </h2>

          <div className="grid gap-3 md:grid-cols-4">

            {[
              "Beginner",
              "Intermediate",
              "Advanced",
              "Expert",
            ].map((item) => (

              <button
                key={item}
                type="button"
                onClick={() => setLevel(item)}
                className={`rounded-xl border p-4 transition-all
                ${
                  level === item
                    ? "border-accent bg-accent text-white"
                    : "border-white/10 bg-white/5 hover:border-accent"
                }`}
              >
                {item}
              </button>

            ))}

          </div>

        </div>

        <div className="mt-10 flex justify-between">

          <button
            className="rounded-lg border border-white/20 px-6 py-3"
          >
            ← Back
          </button>

			<button
			  onClick={saveAndContinue}
			  className="rounded-lg bg-accent px-8 py-3 font-semibold"
			>
			  Save & Continue →
			</button>

        </div>

      </div>
    </>
  );
}