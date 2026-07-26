import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  UserRound,
  CreditCard,
  BarChart3,
  Settings
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <div className="flex min-h-screen bg-slate-950">

      {/* Sidebar */}

      <aside className="w-72 border-r border-slate-800 bg-slate-900">

        <div className="border-b border-slate-800 p-6">

          <h1 className="text-2xl font-bold text-white">

            Business Center

          </h1>

          <p className="mt-1 text-sm text-slate-400">

            AI DBA Assistant

          </p>

        </div>

        <nav className="space-y-2 p-4">

          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LayoutDashboard size={20}/>
            Dashboard
          </Link>

          <Link
            href="/admin/crm"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Users size={20}/>
            CRM Leads
          </Link>

          <Link
            href="/admin/customers"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <UserRound size={20}/>
            Customers
          </Link>

          <Link
            href="/admin/subscriptions"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <CreditCard size={20}/>
            Subscriptions
          </Link>

          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <BarChart3 size={20}/>
            Analytics
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Settings size={20}/>
            Settings
          </Link>

        </nav>

      </aside>

      {/* Content */}

      <main className="flex-1">

        {children}

      </main>

    </div>

  );

}