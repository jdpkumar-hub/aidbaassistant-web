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

	const [form, setForm] = useState({
	  name: "",
	  email: "",
	  company: "",
	  phone: "",
	  status: "",
	  priority: "Normal",
	  notes: "",
	  follow_up_date: "",
	});

	useEffect(() => {
	  if (!lead) return;

	  setForm({
		name: lead.name,
		email: lead.email,
		company: lead.company,
		phone: lead.phone ?? "",
		status: lead.status,
		priority: lead.priority ?? "Normal",
		notes: lead.notes ?? "",
		follow_up_date: lead.follow_up_date ?? "",
	  });
	}, [lead]);

  if (!open || !lead) return null;
  
  return (
    <>
      {/* Background */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60"
      />

      {/* Drawer */}

      <div className="fixed right-0 top-0 z-50 h-screen w-[520px] overflow-auto border-l border-slate-800 bg-slate-950 shadow-2xl">

			<div className="flex items-center justify-between border-b border-slate-800 p-6">

			  <h2 className="text-2xl font-bold text-white">
				Lead Details
			  </h2>

			  <button
				onClick={onClose}
				className="text-slate-400 hover:text-white"
			  >
				✕
			  </button>

			</div>

			<div className="space-y-6 p-6">
				<div>
					<label className="mb-2 block text-sm text-slate-400"> Name </label>
					<input
						value={form.name}
						onChange={(e) =>
						  setForm({
							...form,
							name: e.target.value,
						  })
						}
						className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"/>
				</div>
				
				<div>
					<label className="mb-2 block text-sm text-slate-400"> Email </label>
					<input
						value={form.email}
						onChange={(e) =>
						  setForm({
							...form,
							email: e.target.value,
						  })
						}					

						className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"/>
				</div>
				
				<div>
					<label className="mb-2 block text-sm text-slate-400"> Company </label>
					<input
						value={form.company}
						onChange={(e) =>
						  setForm({
							...form,
							company: e.target.value,
						  })
						}					
						className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"/>
				</div>
				
				<div>
					<label className="mb-2 block text-sm text-slate-400"> Status </label>
					<select
						defaultValue={lead.status}
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
				
				<div>
					<label className="mb-2 block text-sm text-slate-400"> Phone </label>
					<input
						value={form.phone}
						onChange={(e) =>
						  setForm({
							...form,
							phone: e.target.value,
						  })
						}										

						className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"/>
				</div>  	
				<div>
					<label className="mb-2 block text-sm text-slate-400">
					Priority
					</label>
					<select
						defaultValue={lead.priority ?? "Normal"}
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
				<div>

					<label className="mb-2 block text-sm text-slate-400">
						Customer Message
					</label>

					<textarea
						rows={5}
						readOnly
						value={lead.message}
						className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-300"
					/>

				</div>
				<div>

					<label className="mb-2 block text-sm text-slate-400">
					Internal Notes
					</label>
					

					<textarea
						rows={5}
						defaultValue={lead.notes ?? ""}
						className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
					/>

				</div>
				
				<div>

					<label className="mb-2 block text-sm text-slate-400">
					Follow-up Date
					</label>

					<input
						type="date"
						defaultValue={lead.follow_up_date ?? ""}
						className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
					/>

				</div>
			  </div>

			  <div className="grid grid-cols-2 gap-4 pt-6">
				<button className="rounded-xl bg-green-600 py-3 text-white hover:bg-green-700">
				  Save  
				</button>
				<button className="rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700">
				  Email
				</button>

				<button className="rounded-xl bg-green-600 py-3 text-white hover:bg-green-700">
				  Convert
				</button>
				<button className="rounded-xl bg-green-600 py-3 text-white hover:bg-green-700">
				  Close
				</button>				

			

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

      <p className="mb-2 text-sm text-slate-400">
        {title}
      </p>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-white">
        {value}
      </div>

    </div>
  );
}