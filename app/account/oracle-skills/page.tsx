"use client";

import ProgressHeader from "@/components/onboarding/ProgressHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OracleSkillsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(item: string) {
    setSelected(prev => prev.includes(item)
      ? prev.filter(x => x !== item)
      : [...prev, item]);
  }

  const groups = [
    { title: "Oracle Versions", items: ["11g","12c","18c","19c","21c","23ai"] },
    { title: "Core Technologies", items: ["RAC","ASM","Data Guard","GoldenGate","OEM","RMAN","Data Pump","Partitioning","TDE","Multitenant"] },
    { title: "Cloud", items: ["AWS","OCI","Azure","GCP"] },
    { title: "Operating Systems", items: ["Linux","Windows","Solaris","AIX"] },
    { title: "Automation", items: ["Shell","Python","Ansible","Terraform","GitHub Actions","Jenkins"] },
  ];

  async function saveAndContinue() {
    await fetch("/api/account/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: "oracle", dbaSkills: selected })
    });
    router.push("/account/ai-preferences");
  }

  return (
    <>
      <ProgressHeader
        step={3}
        totalSteps={5}
        title="Oracle Skills"
        subtitle="Select the technologies you work with."
      />

      <div className="rounded-2xl border border-white/10 bg-navy-900/70 p-8">
        {groups.map(group => (
          <div key={group.title} className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">{group.title}</h2>
            <div className="flex flex-wrap gap-3">
              {group.items.map(item => (
                <button
                  key={item}
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.currentTarget.blur();
                    toggle(item);
                  }}
                  className={selected.includes(item)
                    ? "rounded-xl border border-accent bg-accent px-5 py-3 text-white"
                    : "rounded-xl border border-white/10 bg-white/5 px-5 py-3 hover:border-accent"}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-10 flex justify-between">
          <button onClick={() => router.push("/account/professional")}
            className="rounded-lg border border-white/20 px-6 py-3">
            ← Back
          </button>

          <button onClick={saveAndContinue}
            className="rounded-lg bg-accent px-8 py-3 font-semibold">
            Save & Continue →
          </button>
        </div>
      </div>
    </>
  );
}
