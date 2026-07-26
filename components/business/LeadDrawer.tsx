"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  message: string;
  status: string;
  priority?: string;
  notes?: string;
  follow_up_date?: string;
  assigned_to?: string;
  created_at: string;
};

interface LeadDrawerProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
}

export default function LeadDrawer({
  lead,
  open,
  onClose,
}: LeadDrawerProps) {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    status: "New",
    priority: "Normal",
    notes: "",
    follow_up_date: "",
  });

  useEffect(() => {
    if (!lead) return;

    setForm({
      name: lead.name ?? "",
      email: lead.email ?? "",
      company: lead.company ?? "",
      phone: lead.phone ?? "",
      status: lead.status ?? "New",
      priority: lead.priority ?? "Normal",
      notes: lead.notes ?? "",
      follow_up_date: lead.follow_up_date ?? "",
    });

  }, [lead]);

  if (!open || !lead) return null;

	const saveLead = async () => {
		if (!lead) return;	
		const currentLead = lead;	
		try {
		setLoading(true);	
		const response = await fetch(`/api/admin/leads/${currentLead.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Unable to update lead");
      }

      alert("Lead updated successfully.");
      window.location.reload();
      onClose();	  

    } catch (err) {

      console.error(err);

      alert("Failed to save changes.");

    } finally {

      setLoading(false);

    }

  }
async function convertCustomer() {
    if (!lead) return;
    const currentLead = lead;
    if (!confirm("Convert this lead into a customer?")) {
        return;
    }
    try {
        setLoading(true);
        const response = await fetch("/api/admin/customers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: currentLead.id,
                name: form.name,
                email: form.email,
                company: form.company,
                phone: form.phone,
            }),
        });

        if (!response.ok) {
            throw new Error("Conversion failed.");
        }

        alert("Customer created successfully.");

        window.location.reload();

    } catch (err) {

        console.error(err);

        alert("Unable to convert customer.");

    } finally {

        setLoading(false);

    }

}  
async function deleteLead() {
  if (!lead) return;

  const currentLead = lead;

  if (!confirm("Delete this lead?")) return;

  try {
    setLoading(true);

    const response = await fetch(
      `/api/admin/leads/${currentLead.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    alert("Lead deleted.");

    window.location.reload();

  } catch (err) {
    console.error(err);
    alert("Unable to delete lead.");
  } finally {
    setLoading(false);
  }
}
	return (
	  <>
		<div
		  onClick={onClose}
		  className="fixed inset-0 z-40 bg-black/60"
		/>

		<div className="fixed right-0 top-0 z-50 h-screen w-[520px] overflow-y-auto border-l border-slate-800 bg-slate-950 shadow-2xl">

		  <div className="flex items-center justify-between border-b border-slate-800 p-6">

			<h2 className="text-2xl font-bold text-white">
			  Lead Details
			</h2>

			<button
			  onClick={onClose}
			  className="text-2xl text-slate-400 hover:text-white"
			>
			  ×
			</button>

		  </div>

		  <div className="space-y-6 p-6">

			{/* Name */}

			<div>

			  <label className="mb-2 block text-sm text-slate-400">
				Name
			  </label>

			  <input
				value={form.name}
				onChange={(e) =>
				  setForm({
					...form,
					name: e.target.value,
				  })
				}
				className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
			  />

			</div>

			{/* Email */}

			<div>

			  <label className="mb-2 block text-sm text-slate-400">
				Email
			  </label>

			  <input
				value={form.email}
				onChange={(e) =>
				  setForm({
					...form,
					email: e.target.value,
				  })
				}
				className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
			  />

			</div>

			{/* Company */}

			<div>

			  <label className="mb-2 block text-sm text-slate-400">
				Company
			  </label>

			  <input
				value={form.company}
				onChange={(e) =>
				  setForm({
					...form,
					company: e.target.value,
				  })
				}
				className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
			  />

			</div>

			{/* Phone */}

			<div>

			  <label className="mb-2 block text-sm text-slate-400">
				Phone
			  </label>

			  <input
				value={form.phone}
				onChange={(e) =>
				  setForm({
					...form,
					phone: e.target.value,
				  })
				}
				className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
			  />

			</div>

			{/* Status */}

			<div>

			  <label className="mb-2 block text-sm text-slate-400">
				Status
			  </label>

			  <select
				value={form.status}
				onChange={(e) =>
				  setForm({
					...form,
					status: e.target.value,
				  })
				}
				className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
			  >
				<option>New</option>
				<option>Contacted</option>
				<option>Demo Scheduled</option>
				<option>Qualified</option>
				<option>Converted</option>
				<option>Closed</option>
			  </select>

			</div>

			{/* Priority */}

			<div>

			  <label className="mb-2 block text-sm text-slate-400">
				Priority
			  </label>

			  <select
				value={form.priority}
				onChange={(e) =>
				  setForm({
					...form,
					priority: e.target.value,
				  })
				}
				className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
			  >
				<option>Low</option>
				<option>Normal</option>
				<option>High</option>
				<option>Critical</option>
			  </select>

			</div>

			<Field
			  title="Created"
			  value={new Date(lead.created_at).toLocaleString()}
			/>

			{/* Customer Message */}

			<div>

			  <label className="mb-2 block text-sm text-slate-400">
				Customer Message
			  </label>

			  <textarea
				rows={4}
				readOnly
				value={lead.message}
				className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-300"
			  />

			</div>

			{/* Internal Notes */}

			<div>

			  <label className="mb-2 block text-sm text-slate-400">
				Internal Notes
			  </label>

			  <textarea
				rows={5}
				value={form.notes}
				onChange={(e) =>
				  setForm({
					...form,
					notes: e.target.value,
				  })
				}
				className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
			  />

			</div>

			{/* Follow-up */}

			<div>

			  <label className="mb-2 block text-sm text-slate-400">
				Follow-up Date
			  </label>

			  <input
				type="date"
				value={form.follow_up_date}
				onChange={(e) =>
				  setForm({
					...form,
					follow_up_date: e.target.value,
				  })
				}
				className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
			  />

			</div>

			<div className="grid grid-cols-2 gap-4 pt-4">

			  <button
				onClick={saveLead}
				disabled={loading}
				className="rounded-xl bg-green-600 py-3 text-white hover:bg-green-700 disabled:opacity-50"
			  >
				{loading ? "Saving..." : "Save"}
			  </button>

			  <button
				onClick={onClose}
				className="rounded-xl bg-slate-700 py-3 text-white hover:bg-slate-600"
			  >
				Close
			  </button>

			  <button
				className="rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700"
			  >
				Email
			  </button>
				<button
				  onClick={convertCustomer}
				  disabled={loading}
				  className="rounded-xl bg-indigo-600 py-3 text-white hover:bg-indigo-700"
				>
				  Convert Customer
				</button>			  
				<button
					onClick={deleteLead}
					disabled={loading}
					className="rounded-xl bg-red-600 py-3 text-white hover:bg-red-700"
				>
					Delete
				</button>
			</div>

		  </div>

		</div>

	  </>
	);
}

function Field({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-400">
        {title}
      </label>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-white">
        {value}
      </div>
    </div>
  );
}