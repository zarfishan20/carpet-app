'use client';

import React from 'react';
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  FileCheck2,
  Users,
  TrendingUp,
  ArrowRight,
  FileWarning
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { supabase } from "@/integrations/supabase/client";

// Initialize a stable QueryClient instance for this route container
const localQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Define strict inline types matching your schema to replace 'any'
// 1. Update your Customer interface to match Supabase's nullable fields exactly
interface Customer {
  id: string;
  name: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  source?: string | null;
  status?: string | null;
  created_at: string | null; // Changed from '?: string' to 'string | null'
}

interface Job {
  id: string;
  created_at: string | null;
  total_price: number | null;
  status: string | null;
  scheduled_date: string | null;
  assigned_fitter_id: string | null;
  customers: Customer | null;
}

interface ChartDataPoint {
  key: string;
  month: string;
  value: number;
}

function Err() {
  return <p className="text-sm text-palette-brick font-semibold">Couldn&apos;t load your data. Please refresh.</p>;
}

// 1. The Main Dashboard Implementation Block
function DashboardContent() {
  // Fetch live jobs secure pipeline via react-query
  const jobsQ = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, customers(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown) as Job[];
    },
  });

  // Fetch customers data pool
const customersQ = useQuery<Customer[]>({
  queryKey: ["customers"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    // Cast cleanly to prevent interface friction
    return (data as unknown) as Customer[];
  },
});

// Provide a rock-solid array fallback to fix the .length crash


  const jobs = jobsQ.data ?? [];
  const customers = customersQ.data ?? [];

  const isEmpty =
    !jobsQ.isLoading && !customersQ.isLoading &&
    jobs.length === 0 && customers.length === 0;

  // --- Real-Time Calculated Business Metrics ---
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Revenue this month (Sum of completed/invoiced jobs matching current month context)
  const monthlyRevenue = jobs
    .filter(j => {
      if (!j.created_at || !j.total_price) return false;
      const d = new Date(j.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && (j.status === 'COMPLETED' || j.status === 'INVOICED');
    })
    .reduce((sum, j) => sum + (j.total_price || 0), 0);

  // Open Leads: Jobs currently marked at the initial Survey stage
  const openLeadsJobs = jobs.filter((j) => j.status === "SURVEY_SUBMITTED");

  // Jobs this week 
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(now.setDate(now.getDate() + 6));
  const activeJobsThisWeek = jobs.filter((j) => {
    if (!j.scheduled_date) return false;
    const sd = new Date(j.scheduled_date);
    return sd >= startOfWeek && sd <= endOfWeek;
  });

  // Overdue Invoices simulation counter matching your layout schema 
  const overdueInvoicesCount = jobs.filter((j) => j.status === "QUOTE_SENT").length > 0 ? 1 : 0;

  // Bundle into matching state-compatible array format
  const stats = [
    { title: 'REVENUE THIS MONTH', value: `$${monthlyRevenue.toLocaleString()}`, sub: null, icon: TrendingUp },
    { title: 'OPEN LEADS', value: String(openLeadsJobs.length), sub: `${jobs.length} total entries`, icon: Users },
    { title: 'JOBS THIS WEEK', value: String(activeJobsThisWeek.length), sub: null, icon: FileCheck2 },
    { title: 'OVERDUE INVOICES', value: String(overdueInvoicesCount), sub: null, icon: FileWarning },
  ];

  const chartData = buildMonthlyRevenue(jobs);

  const upcomingJobsList = jobs
    .filter((j) => j.scheduled_date && ["APPROVED", "ASSIGNED", "EN_ROUTE"].includes(j.status || ''))
    .slice(0, 3);

  const pendingQuotesList = jobs
    .filter((j) => j.status === "QUOTE_SENT")
    .slice(0, 2);

  return (
    <div className="p-6 bg-palette-linen min-h-screen text-palette-ink space-y-6">
      
      {/* Header Identity Element */}
      <div className="space-y-1">
        <h2 className="text-3xl font-bold font-serif tracking-tight text-palette-ink">
          Good to see you
        </h2>
        <p className="text-sm text-palette-ink-muted">
          Here is how the shop is running today.
        </p>
      </div>

      {(jobsQ.isError || customersQ.isError) && <Err />}

      {isEmpty && (
        <div className="bg-palette-card border border-palette-rule rounded-xl flex flex-col items-center gap-4 px-6 py-12 text-center shadow-xs">
          <div className="grid size-14 place-items-center rounded-2xl bg-palette-terracotta/12 text-palette-terracotta">
            <Users className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-palette-walnut">Let&apos;s set up your studio</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-palette-ink-muted">
              Add customers, installation pipelines and quotes to explore the workspace engine.
            </p>
          </div>
        </div>
      )}

      {!isEmpty && (
        <>
          {/* Grid Row 1: KPI Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-palette-card border border-palette-rule rounded-xl p-4 flex flex-col justify-between min-h-[110px] shadow-xs">
                  <div className="flex justify-between items-start w-full">
                    <span className="text-[10px] font-bold tracking-wider text-palette-ink-muted uppercase">
                      {stat.title}
                    </span>
                    <Icon size={14} className="text-palette-terracotta/70" />
                  </div>
                  <div className="mt-2">
                    <h2 className="text-3xl font-bold tracking-tight text-palette-walnut font-mono">
                      {jobsQ.isLoading ? "..." : stat.value}
                    </h2>
                    {stat.sub && (
                      <p className="text-[11px] text-palette-ink-muted mt-0.5">{stat.sub}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid Row 2: Upcoming Jobs & Quotes Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Upcoming Jobs Board Panel */}
            <div className="bg-palette-card border border-palette-rule rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-lg text-palette-walnut">Upcoming jobs</h3>
                <button className="text-xs font-semibold text-palette-terracotta flex items-center gap-1 hover:text-palette-terracotta-light transition-colors cursor-pointer">
                  View all <ArrowRight size={12} />
                </button>
              </div>
              <div className="divide-y divide-palette-rule/60 space-y-3 pt-1">
                {jobsQ.isLoading ? (
                  <p className="text-xs text-palette-ink-muted py-2">Loading floor schedules...</p>
                ) : upcomingJobsList.length === 0 ? (
                  <p className="text-xs text-palette-ink-muted py-2">No active flooring jobs found.</p>
                ) : upcomingJobsList.map((job, idx) => {
                  const textures = ['bg-texture-lvp', 'bg-texture-hardwood', 'bg-texture-tile'];
                  const isToday = job.scheduled_date && new Date(job.scheduled_date).toDateString() === new Date().toDateString();
                  return (
                    <div key={job.id} className="flex items-center justify-between pt-3 first:pt-0">
                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-bold w-18 ${isToday ? 'text-palette-terracotta' : 'text-palette-ink-muted'}`}>
                          {isToday ? 'Today' : job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'TBD'}
                        </span>
                        <div className={`w-5 h-5 rounded border border-palette-walnut/15 shadow-inner shrink-0 ${textures[idx % textures.length]}`} />
                        <span className="text-xs font-medium text-palette-ink truncate max-w-[150px]">
                          {job.assigned_fitter_id ? 'Crew Assigned' : 'Unassigned Crew'}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full ${
                        job.status === 'APPROVED' ? 'bg-palette-slate/14 text-palette-slate' : 'bg-palette-amber/14 text-palette-amber'
                      }`}>
                        {job.status === 'APPROVED' ? 'Scheduled' : 'In Progress'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quotes Pending Board Panel */}
            <div className="bg-palette-card border border-palette-rule rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-bold text-lg text-palette-walnut">Quotes pending</h3>
                <button className="text-xs font-semibold text-palette-terracotta flex items-center gap-1 hover:text-palette-terracotta-light transition-colors cursor-pointer">
                  View all <ArrowRight size={12} />
                </button>
              </div>
              <div className="divide-y divide-palette-rule/60 space-y-3 pt-1">
                {jobsQ.isLoading ? (
                  <p className="text-xs text-palette-ink-muted py-2">Syncing estimates...</p>
                ) : pendingQuotesList.length === 0 ? (
                  <p className="text-xs text-palette-ink-muted py-2">No quotes pending review.</p>
                ) : pendingQuotesList.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between pt-3 first:pt-0">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-palette-ink">
                        {quote.customers?.name || 'Unknown Customer'}
                      </span>
                      <span className="text-[10px] font-mono text-palette-ink-muted tracking-wider mt-0.5">
                        Q-{quote.id.slice(0, 4).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-bold font-mono text-palette-walnut">
                      {quote.total_price ? `$${quote.total_price.toLocaleString()}` : '$0'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Row 3: Live Analytical Area Graph Component */}
          <div className="bg-palette-card border border-palette-rule rounded-xl p-5 shadow-xs space-y-6">
            <h3 className="font-serif font-bold text-base text-palette-walnut">
              Revenue, last 6 months
            </h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: -24, right: 0, top: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-palette-terracotta)" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="var(--color-palette-terracotta)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-palette-rule)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-palette-ink-muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-palette-ink-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-palette-card)",
                      border: "1px solid var(--color-palette-rule)",
                      borderRadius: 12,
                      fontSize: 12,
                      color: "var(--color-palette-walnut)"
                    }}
                    formatter={(value: unknown) => {
                      const numValue = Number(value || 0);
                      return [`$${numValue.toLocaleString()}`, "Revenue"];
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="var(--color-palette-terracotta)" strokeWidth={2} fill="url(#chartGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 2. Timeline Aggregator Function
function buildMonthlyRevenue(jobs: Job[]): ChartDataPoint[] {
  const months: ChartDataPoint[] = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${dt.getFullYear()}-${dt.getMonth()}`,
      month: dt.toLocaleString("en-US", { month: "short" }),
      value: 0,
    });
  }
  
  for (const j of jobs) {
    if (j.status !== "COMPLETED" && j.status !== "INVOICED") continue;
    if (!j.created_at) continue;
    const dt = new Date(j.created_at);
    const key = `${dt.getFullYear()}-${dt.getMonth()}`;
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.value += Number(j.total_price || 0);
  }
  return months;
}

// 3. Final Default Route Export wrapped in global app Query Client Provider
export default function DashboardPage() {
  return (
    <QueryClientProvider client={localQueryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}