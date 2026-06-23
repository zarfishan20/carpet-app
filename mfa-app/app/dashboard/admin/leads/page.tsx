'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Mail, Phone, MapPin, Users, FileCheck2, TrendingUp, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Initialize local page QueryClient
const localQueryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false },
  },
});

interface CustomerSchema {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postcode: string;
  notes: string | null;
  address: string | null;
  created_at: string;
  status?: string | null;
}

type Draft = Partial<CustomerSchema>;

function LeadsContent() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const customersQ = useQuery<CustomerSchema[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as CustomerSchema[];
    },
  });

  const customers = customersQ.data ?? [];
  
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || (c.status === statusFilter);
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      const payload = {
        name: d.name?.trim() || "Unnamed",
        phone: d.phone?.trim() || "000",
        email: d.email?.trim() || null,
        address: [d.address_line1, d.address_line2, d.city, d.postcode].filter(Boolean).join(", "),
      };
      if (d.id) await supabase.from("customers").update(payload).eq("id", d.id);
      else await supabase.from("customers").insert([payload]);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      setOpen(false);
      toast.success("Saved!");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => await supabase.from("customers").delete().eq("id", id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      setDeleteId(null);
    }
  });

  return (
    <div className="p-6 bg-palette-linen min-h-screen text-palette-ink space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold font-serif text-palette-walnut">Leads</h2>
        <Button onClick={() => { setDraft({}); setOpen(true); }} className="bg-palette-terracotta text-white">
          <Plus className="size-4 mr-2" /> New lead
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-2 pb-4 border-b border-palette-rule">
        {['All', 'New', 'Contacted', 'Quoted', 'Won', 'Lost'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusFilter === s ? 'bg-palette-walnut text-white' : 'bg-white border border-palette-rule'}`}>
            {s}
          </button>
        ))}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-palette-ink-muted" />
          <Input placeholder="Search leads..." className="pl-9 bg-white border-palette-rule h-9" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

   {/* Grid Display: 2 cards on medium, 3 cards on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => (
          <div key={c.id} className="bg-palette-card border border-palette-rule rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-palette-terracotta/50 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-3">
                <p className="font-semibold text-palette-walnut truncate">{c.name}</p>
                {/* Status Badge */}
                <span className="px-2 py-0.5 rounded-full text-[9px] uppercase bg-palette-linen border border-palette-rule text-palette-walnut font-bold">
                  {c.status || "New"}
                </span>
              </div>
              
              <div className="space-y-1.5 text-[11px] text-palette-ink-muted">
                <p className="flex items-center gap-2"><Phone className="size-3" /> {c.phone}</p>
                <p className="flex items-center gap-2 truncate"><Mail className="size-3" /> {c.email}</p>
              </div>
            </div>

            <div className="flex justify-end gap-1 border-t border-palette-rule/40 pt-3 mt-4">
              <Button variant="ghost" size="icon" className="size-8" onClick={() => { setDraft(c); setOpen(true); }}>
                <Pencil className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-palette-brick" onClick={() => setDeleteId(c.id)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-palette-card">
          <DialogHeader><DialogTitle>Edit Lead</DialogTitle></DialogHeader>
          <Input value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Name" />
          <DialogFooter><Button onClick={() => save.mutate(draft)}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LeadsPage() {
  return (
    <QueryClientProvider client={localQueryClient}>
      <LeadsContent />
    </QueryClientProvider>
  );
}