'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '@/components/PageHeader';
import CustomerForm, { CustomerFormData } from '@/components/forms/CustomerForm';

interface JobCustomerRow {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
}

export default function CustomersPage() {
  const supabase = createClient();
  const [customers, setCustomers] = useState<JobCustomerRow[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // FIXED: Fetch function is encapsulated entirely inside useEffect to satisfy react-hooks rules cleanly
  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      const { data } = await supabase
        .from('jobs')
        .select('id, customer_name, customer_phone, customer_address')
        .not('customer_name', 'is', null) // Avoid pulling unassigned jobs
        .order('customer_name', { ascending: true });
      
      setCustomers((data as unknown as JobCustomerRow[]) || []);
      setLoading(false);
    }

    fetchCustomers();
  }, [supabase]);

  // FIXED: Replaced 'any' type to conform to TypeScript rules
  const handleAddCustomer = async (formData: CustomerFormData) => {
    const { error } = await supabase
      .from('jobs')
      .insert([
        {
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_address: formData.customer_address,
          status: 'pending' // Providing a fallback status required for new row initializations
        }
      ]);

    if (error) {
      alert(`Error adding customer records: ${error.message}`);
    } else {
      setIsFormOpen(false);
      
      // Safe post-mutation updates to sync UI state
      const { data } = await supabase
        .from('jobs')
        .select('id, customer_name, customer_phone, customer_address')
        .not('customer_name', 'is', null)
        .order('customer_name', { ascending: true });
      
      if (data) {
        setCustomers(data as unknown as JobCustomerRow[]);
      }
    }
  };

  return (
    <div className="relative">
      <PageHeader 
        title="Customers" 
        action={
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-600 px-4 py-2 rounded-xl text-sm font-bold text-white hover:bg-indigo-500 transition"
          >
            + Add Customer
          </button>
        } 
      />

      {loading ? (
        <p className="text-slate-400 text-sm">Synchronizing profiles...</p>
      ) : customers.length > 0 ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm text-slate-300 min-w-150">
              <thead className="bg-slate-800/50 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Installation Address</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((cust) => (
                  <tr key={cust.id} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/20 transition">
                    <td className="p-4 font-bold text-white">{cust.customer_name}</td>
                    <td className="p-4 text-slate-400">{cust.customer_phone}</td>
                    <td className="p-4 text-slate-400 max-w-xs truncate">{cust.customer_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center bg-slate-900 border border-slate-800 rounded-2xl p-12 text-slate-500">
          No records found. Click &quot;+ Add Customer&quot; to get started.
        </div>
      )}

      {/* Form Dialog Box */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <CustomerForm 
            onSubmit={handleAddCustomer} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </div>
      )}
    </div>
  );
}