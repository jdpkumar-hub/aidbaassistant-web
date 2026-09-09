import { supabaseAdmin } from "@/lib/supabase-admin";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CRMTable from "@/components/business/CRMTable";

export default async function CRMDashboard() {

  const { data: leads } = await supabaseAdmin
    .from("crm_leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (

    <div className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold text-white">
          CRM Dashboard
        </h1>
			<div className="mb-8 grid gap-6 md:grid-cols-4">

				<div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
					<p className="text-sm text-slate-400">Total Leads</p>
					<h2 className="mt-2 text-3xl font-bold text-white">
						{leads?.length || 0}
					</h2>
				</div>

				<div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
					<p className="text-sm text-slate-400">New Today</p>
					<h2 className="mt-2 text-3xl font-bold text-green-400">
						{leads?.length || 0}
					</h2>
				</div>

				<div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
					<p className="text-sm text-slate-400">Customers</p>
					<h2 className="mt-2 text-3xl font-bold text-cyan-400">
						0
					</h2>
				</div>

				<div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
					<p className="text-sm text-slate-400">Revenue</p>
					<h2 className="mt-2 text-3xl font-bold text-yellow-400">
						¥0
					</h2>
				</div>

			</div>
			<div className="mb-6 flex items-center justify-between">

				<input
					type="text"
					placeholder="Search leads..."
					className="w-96 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
				/>

				<button
					className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
				>
					+ New Lead
				</button>

			</div>			
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <CRMTable leads={leads || []} />
        </div>
      </div>
    </div>
  );
}