'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  Save, Building2, Mail, Percent, PoundSterling, 
  Users, Key, Bell, ShieldCheck, Palette, ShieldAlert,
  Loader2, Trash2
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ProfileSection from '@/components/forms/ProfileSection';
import SecuritySection from '@/components/forms/SecuritySection';

interface ExtendedSettings {
  company_name: string;
  contact_email: string;
  currency: string;
  tax_rate: number;
  logo_url: string;
  primary_color: string;
  working_hours_start: string;
  working_hours_end: string;
  notify_survey_complete: boolean;
  notify_customer_sms: boolean;
  stripe_public_key: string;
  stripe_secret_key: string;
  accounting_platform: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

type TabType = 'general' | 'account' | 'team' | 'notifications' | 'integrations' | 'security';

export default function AdvancedSettingsPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Data States
  const [settings, setSettings] = useState<ExtendedSettings>({
    company_name: '',
    contact_email: '',
    currency: 'GBP',
    tax_rate: 20,
    logo_url: '',
    primary_color: '#4f46e5',
    working_hours_start: '08:00',
    working_hours_end: '17:00',
    notify_survey_complete: true,
    notify_customer_sms: false,
    stripe_public_key: '',
    stripe_secret_key: '',
    accounting_platform: 'None',
  });
  const [team, setTeam] = useState<TeamMember[]>([]);

  // Fetch all dashboard variables on mount
  useEffect(() => {
    async function loadConfigurationData() {
      setLoading(true);
      
      // Pull Master Row Configurations
      const { data: config } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (config) {
        setSettings({
          company_name: config.company_name || '',
          contact_email: config.contact_email || '',
          currency: config.currency || 'GBP',
          tax_rate: Number(config.tax_rate) || 20,
          logo_url: config.logo_url || '',
          primary_color: config.primary_color || '#4f46e5',
          working_hours_start: config.working_hours_start || '08:00',
          working_hours_end: config.working_hours_end || '17:00',
          notify_survey_complete: config.notify_survey_complete ?? true,
          notify_customer_sms: config.notify_customer_sms ?? false,
          stripe_public_key: config.stripe_public_key || '',
          stripe_secret_key: config.stripe_secret_key || '',
          accounting_platform: config.accounting_platform || 'None',
        });
      }

      // Pull Active Team Profiles
      const { data: teamData } = await supabase.from('team_members').select('*').order('name');
      if (teamData) setTeam(teamData as TeamMember[]);

      setLoading(false);
    }
    loadConfigurationData();
  }, [supabase]);

  // Handle global adjustments push update
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('settings').upsert({ id: 1, ...settings });
    setSaving(false);
    
    if (error) alert(`Configuration save failed: ${error.message}`);
    else alert('System parameters synchronized successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm p-8">
        <Loader2 className="animate-spin" size={18} /> Loading system control workspace...
      </div>
    );
  }

  return (
    <div className="max-w-5xl p-6 text-white space-y-6">
      <PageHeader title="Control Panel Settings" />

      {/* Tabs Navigation Rail */}
      <div className="flex border-b border-slate-800 overflow-x-auto gap-2 no-scrollbar">
        {[
          { id: 'general', label: 'General & Branding', icon: Building2 },
          { id: 'account', label: 'My Profile & Security', icon: ShieldCheck },
          { id: 'team', label: 'Team Management', icon: Users },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'integrations', label: 'API & Integrations', icon: Key },
          { id: 'security', label: 'Audit & Logs', icon: ShieldCheck },

        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs uppercase tracking-wider border-b-2 transition whitespace-nowrap select-none ${
                activeTab === tab.id 
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Settings Forms Main Window Frame */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* TAB 1: GENERAL & BRANDING */}
        {activeTab === 'general' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Business Profiles */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2"><Building2 size={18} className="text-indigo-400"/> Corporate Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Business Naming Identification</label>
                  <input type="text" value={settings.company_name} onChange={e => setSettings({...settings, company_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Core System Despatch Email</label>
                  <input type="email" value={settings.contact_email} onChange={e => setSettings({...settings, contact_email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
            </div>

            {/* Financials & Localization */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2"><PoundSterling size={18} className="text-indigo-400"/> Operational Localization</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">System Currency Symbol</label>
                  <select value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500">
                    <option value="GBP">GBP (£) - British Pound Sterling</option>
                    <option value="EUR">EUR (€) - European Euro</option>
                    <option value="USD">USD ($) - United States Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Baseline Applied Tax/VAT (%)</label>
                  <input type="number" value={settings.tax_rate} onChange={e => setSettings({...settings, tax_rate: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Primary Branding Hex Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={settings.primary_color} onChange={e => setSettings({...settings, primary_color: e.target.value})} className="bg-transparent border-0 cursor-pointer h-10 w-12" />
                    <input type="text" value={settings.primary_color} onChange={e => setSettings({...settings, primary_color: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/*TAB: MY PROFILE & SECURITY (Email, Password, Personal Phone, Personal Address) */}   
        {activeTab === 'account' && (
        <div className="space-y-6 animate-fadeIn text-white">
    
            {/* Profile Identity Card Form */}
             <ProfileSection />

             {/* Security Credentials Update Form */}
            <SecuritySection />

             </div>
            )}

        {/* TAB 2: TEAM MANAGEMENT & ACCESS CONTROLS */}
        {activeTab === 'team' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Active Seats Deployment</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Control role allocations and workflow visibility constraints across deployment profiles.</p>
                </div>
                <button type="button" onClick={() => alert('User invitation engine logic can be bound into your profiles deployment table workflows.')} className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-xl text-xs font-bold transition">+ Invite Seat</button>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead className="bg-slate-900 border-b border-slate-800 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    <tr>
                      <th className="p-3">Team Member</th>
                      <th className="p-3">Access Assignment Group</th>
                      <th className="p-3">Status Pipeline State</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-300">
                    {team.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-900/40">
                        <td className="p-3">
                          <div className="font-bold text-white">{member.name}</div>
                          <div className="text-[11px] text-slate-500">{member.email}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-medium">{member.role}</span>
                        </td>
                        <td className="p-3">
                          <span className={`inline-block h-2 w-2 rounded-full mr-1.5 ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          <span className="text-xs capitalize">{member.status}</span>
                        </td>
                        <td className="p-3 text-right">
                          <button type="button" className="text-slate-500 hover:text-rose-400 p-1 transition"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATION ROUTING MAPS */}
        {activeTab === 'notifications' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6捷 animate-fadeIn">
            <div>
              <h3 className="text-base font-bold text-white">Automated Trigger Matrices</h3>
              <p className="text-xs text-slate-400 mt-0.5">Define automated communication boundaries across layout stages.</p>
            </div>
            <div className="space-y-4 divide-y divide-slate-800/60">
              <label className="flex items-start gap-4 cursor-pointer pt-1">
                <input type="checkbox" checked={settings.notify_survey_complete} onChange={e => setSettings({...settings, notify_survey_complete: e.target.checked})} className="mt-1 accent-indigo-600 h-4 w-4 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">Survey Processing Realtime Desk Notifications</div>
                  <div className="text-xs text-slate-400 mt-0.5">Email operational admins the moment field technicians lock room canvas diagrams.</div>
                </div>
              </label>
              <label className="flex items-start gap-4 cursor-pointer pt-4">
                <input type="checkbox" checked={settings.notify_customer_sms} onChange={e => setSettings({...settings, notify_customer_sms: e.target.checked})} className="mt-1 accent-indigo-600 h-4 w-4 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">Customer Deployment En-Route SMS Messages</div>
                  <div className="text-xs text-slate-400 mt-0.5">Dispatch automated alerts when assigned fitters toggle their status profile to &quot;in-progress&quot;.</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* TAB 4: API KEYS & THIRD-PARTY INTEGRATIONS */}
        {activeTab === 'integrations' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Payment Systems */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2"><Palette size={18} className="text-indigo-400"/> Stripe Core Gateway Configuration</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stripe Live Publishable Key</label>
                  <input type="password" value={settings.stripe_public_key} onChange={e => setSettings({...settings, stripe_public_key: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500" placeholder="pk_live_..." />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stripe Secret API Vault Token</label>
                  <input type="password" value={settings.stripe_secret_key} onChange={e => setSettings({...settings, stripe_secret_key: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500" placeholder="sk_live_..." />
                </div>
              </div>
            </div>

            {/* Invoicing Engines */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2"><Key size={18} className="text-indigo-400"/> Accounting System Synchronization</h3>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Primary Financial Sync Target</label>
                <select value={settings.accounting_platform} onChange={e => setSettings({...settings, accounting_platform: e.target.value})} className="w-full max-w-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500">
                  <option value="None">No Active Accounting Link</option>
                  <option value="Xero">Xero Account Hub Ledger</option>
                  <option value="QuickBooks">QuickBooks Online Core</option>
                  <option value="Sage">Sage Business Cloud Accounting</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COMPLIANCE, BACKUPS & SECURITY LOGS */}
        {activeTab === 'security' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 animate-fadeIn">
            <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-400">
              <ShieldAlert size={20} className="shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">System Compliance Logs Locked</h4>
                <p className="text-xs text-amber-400/80 mt-0.5">Audit tracking pipelines record immutable access fingerprints across your Supabase instance layers automatically.</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Emergency Core Utilities</h4>
              <button
                type="button"
                onClick={() => alert('Downloading application snapshot schemas...')}
                className="bg-slate-950 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition"
              >
                Download Core Workspace JSON Backup
              </button>
            </div>
          </div>
        )}

        {/* Persistent Form Submission Footer Action Controls */}
        {activeTab !== 'team' && activeTab !== 'security' && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition select-none"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? 'Synchronizing Customizations...' : 'Save Configuration Options'}
            </button>
          </div>
        )}

      </form>
    </div>
  );
}