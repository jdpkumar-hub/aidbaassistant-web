"use client";

import { useState } from "react";
import LeadDrawer from "./LeadDrawer";

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  status: string;
  created_at: string;
};

interface CRMTableProps {
  leads: Lead[];
}

export default function CRMTable({ leads }: CRMTableProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function openLead(lead: Lead) {
    setSelectedLead(lead);
    setDrawerOpen(true);
  }

  function closeLead() {
    setDrawerOpen(false);
    setSelectedLead(null);
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-800">

        <table className="w-full">

          <thead className="bg-slate-900">

            <tr className="text-left">

              <th className="p-4 text-slate-300">Created</th>
              <th className="p-4 text-slate-300">Name</th>
              <th className="p-4 text-slate-300">Email</th>
              <th className="p-4 text-slate-300">Company</th>
              <th className="p-4 text-slate-300">Status</th>
              <th className="p-4 text-slate-300">Actions</th>

            </tr>

          </thead>

          <tbody>

            {leads?.map((lead) => (

              <tr
                key={lead.id}
                className="border-t border-slate-800 hover:bg-slate-900"
              >

                <td className="p-4 text-slate-400">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>

                <td className="p-4 font-medium text-white">
                  {lead.name}
                </td>

                <td className="p-4 text-slate-300">
                  {lead.email}
                </td>

                <td className="p-4 text-slate-300">
                  {lead.company}
                </td>

                <td className="p-4">

                  <span className="rounded-full bg-green-600 px-3 py-1 text-sm text-white">
                    {lead.status}
                  </span>

                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <button
                      onClick={() => openLead(lead)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      View
                    </button>

                    <button
                      className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                    >
                      Customer
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <LeadDrawer
        lead={selectedLead}
        open={drawerOpen}
        onClose={closeLead}
      />

    </>
  );
}