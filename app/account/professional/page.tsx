"use client";

import ProgressHeader from "@/components/onboarding/ProgressHeader";
import { useState } from "react";
import { useRouter } from "next/navigation";



export default function ProfessionalPage() {

  const [form, setForm] = useState({
    currentRole: "",
    company: "",
    experience: "",
    teamSize: "",
  });

  const router = useRouter();
	
  const roles = [
    "Oracle DBA",
    "Senior DBA",
    "Lead DBA",
    "Database Architect",
    "Consultant",
    "Manager",
    "Other",  
  ];

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

	async function saveProfessional() {
	  try {
		const res = await fetch("/api/account/save", {
		  method: "POST",
		  headers: {
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify({
			step: "professional",
			currentRole: form.currentRole,
			companyName: form.company,
			yearsExperience: form.experience,
			teamSize: form.teamSize,
		  }),
		});

		if (!res.ok) {
		  alert("Unable to save.");
		  return;
		}

		router.push("/account/oracle-skills");
	  } catch (err) {
		console.error(err);
		alert("Something went wrong.");
	  }
	}
  return (
    <>
      <ProgressHeader
        step={2}
        totalSteps={5}
        title="Professional Profile"
        subtitle="Tell us about your current Oracle DBA role."
      />

      <div className="rounded-2xl border border-white/10 bg-navy-900/70 p-8">

        <div className="grid gap-6">

          <div>

            <label className="mb-3 block text-sm font-medium">
              Current Role
            </label>

            <div className="grid grid-cols-2 gap-3">

              {roles.map((role) => (

                <button
                  key={role}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      currentRole: role,
                    })
                  }
                  className={`rounded-xl border p-4 transition ${
                    form.currentRole === role
                      ? "border-accent bg-accent/20"
                      : "border-white/10 hover:border-accent"
                  }`}
                >
                  {role}
                </button>

              ))}

            </div>

          </div>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block">
                Company
              </label>

              <input
                name="company"
                value={form.company}
                onChange={updateField}
                className="w-full rounded-lg bg-black/30 p-3"
              />

            </div>

            <div>

              <label className="mb-2 block">
                Years of Experience
              </label>

              <input
                name="experience"
                value={form.experience}
                onChange={updateField}
                className="w-full rounded-lg bg-black/30 p-3"
              />

            </div>

            <div>

              <label className="mb-2 block">
                DBA Team Size
              </label>

              <select
                name="teamSize"
                value={form.teamSize}
                onChange={updateField}
                className="w-full rounded-lg bg-black/30 p-3"
              >
                <option value="">Select</option>
                <option>1-5</option>
                <option>6-20</option>
                <option>21-50</option>
                <option>50+</option>
              </select>

            </div>

          </div>

        </div>

			<div className="mt-10 flex justify-between">
			<button
			  onClick={() => router.push("/account/profile")}
			  className="rounded-lg border border-white/20 px-6 py-3"
			>
			  ← Back
			</button>

			<button
			  onClick={saveProfessional}
			  className="rounded-lg bg-accent px-8 py-3 font-semibold"
			>
			  Save & Continue →
			</button>


        </div>

      </div>
    </>
  );
}