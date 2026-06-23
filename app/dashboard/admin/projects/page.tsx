'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import PageHeader from '@/components/PageHeader';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectForm, { ProjectFormData } from '@/components/forms/ProjectForm';

interface ProjectRow {
  id: string;
  customer_name: string;
  address: string;
  status: string;
  fitter: string;
  date: string;
  notes: string;
}

export default function ProjectsPage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Solves the previous useEffect dependency rule cleanly
  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('id, customer_name, address, status, fitter, date, notes')
        .order('date', { ascending: true });

      if (!error && data) {
        setProjects(data as unknown as ProjectRow[]);
      }
      setLoading(false);
    }

    fetchProjects();
  }, [supabase]);

  const handleCreateProject = async (formData: ProjectFormData) => {
    const { error } = await supabase
      .from('projects')
      .insert([
        {
          customer_name: formData.customer_name,
          address: formData.address,
          status: 'pending',
          fitter: formData.fitter,
          date: formData.date,
          notes: formData.notes
        }
      ]);

    if (error) {
      alert(`Database error: ${error.message}`);
    } else {
      setIsFormOpen(false);
      // Hot re-fetch the list data
      const { data } = await supabase
        .from('projects')
        .select('id, customer_name, address, status, fitter, date, notes')
        .order('date', { ascending: true });
      if (data) setProjects(data as unknown as ProjectRow[]);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Projects" 
        action={
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-600 px-4 py-2 rounded-xl text-sm font-bold text-white hover:bg-indigo-500 transition"
          >
            + New Project
          </button>
        } 
      />

      {loading ? (
        <p className="text-slate-400 text-sm">Syncing with database...</p>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            /* FIXED: Props passed here now explicitly match ProjectCardProps */
            <ProjectCard 
              key={proj.id}
              id={proj.id}
              customerName={proj.customer_name}
              address={proj.address}
              fitter={proj.fitter}
              date={proj.date}
              status={proj.status}
            />
          ))}
        </div>
      ) : (
        <div className="text-center bg-slate-900 border border-slate-800 rounded-2xl p-12 text-slate-500">
          No records found in projects table.
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <ProjectForm 
            onSubmit={handleCreateProject} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </div>
      )}
    </div>
  );
}