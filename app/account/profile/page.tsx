"use client";
import ProgressHeader from "@/components/onboarding/ProgressHeader";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    companyName: "",
    jobTitle: "",
    yearsExperience: "",
    country: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  return (
   <>
		<ProgressHeader
		  step={1}
		  totalSteps={4}
		  title={`Welcome, ${session?.user?.name ?? "User"} 👋`}
		  subtitle="Let's personalize your AI DBA Assistant workspace."
		/>
        <div className="rounded-2xl border border-white/10 bg-navy-900/70 p-8">

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm">Full Name</label>

              <input
                name="fullName"
                value={form.fullName}
                onChange={updateField}
                className="w-full rounded-lg bg-black/30 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Email</label>

              <input
                value={form.email}
                disabled
                className="w-full rounded-lg bg-black/20 p-3 text-gray-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Phone Number
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
                className="w-full rounded-lg bg-black/30 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Company
              </label>

              <input
                name="companyName"
                value={form.companyName}
                onChange={updateField}
                className="w-full rounded-lg bg-black/30 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Job Title
              </label>

              <input
                name="jobTitle"
                value={form.jobTitle}
                onChange={updateField}
                className="w-full rounded-lg bg-black/30 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Years Experience
              </label>

              <input
                name="yearsExperience"
                value={form.yearsExperience}
                onChange={updateField}
                className="w-full rounded-lg bg-black/30 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Country
              </label>

              <input
                name="country"
                value={form.country}
                onChange={updateField}
                className="w-full rounded-lg bg-black/30 p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Time Zone
              </label>

              <input
                value={form.timezone}
                disabled
                className="w-full rounded-lg bg-black/20 p-3 text-gray-400"
              />
            </div>

          </div>

          <div className="mt-10 flex justify-end">
			<button
			  onClick={async () => {
				await fetch("/api/account/save", {
				  method: "POST",
				  headers: {
					"Content-Type": "application/json",
				  },
				  body: JSON.stringify(form),
				});

				window.location.href = "/account/professional";
			  }}
			  className="rounded-lg bg-accent px-8 py-3 font-semibold"
			>
			  Save & Continue →
			</button>			  

          </div>

        </div>
    </>
  );
}