'use client';

import CustomerSignature from "@/components/jobsheet/CustomerSignature";
import { createClient } from "@/utils/supabase/client";



export default function FitterDashboard() {
  const supabase = createClient();
  const sampleJobId = "00000000-0000-0000-0000-000000000000"; 

  const handleJobCompletion = async (signData: {
    customerName: string;
    notes: string;
    signatureBlob: Blob | null;
  }) => {
    try {
      if (!signData.signatureBlob) return;
      
      const fileUid = crypto.randomUUID();
      const filePath = `${sampleJobId}/${fileUid}.png`;

      const { error: uploadError } = await supabase.storage
        .from('signatures')
        .upload(filePath, signData.signatureBlob, { contentType: 'image/png' });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('signatures').getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('job_completions').insert({
        job_id: sampleJobId,
        notes: signData.notes,
        customer_name_printed: signData.customerName,
        signature_image_url: data.publicUrl
      });

      if (dbError) throw dbError;

      await supabase
        .from('jobs')
        .update({ status: 'completed' })
        .eq('id', sampleJobId);

      alert('Job closed out, files logged, and master record status marked COMPLETED!');

    } catch (err) {
      // Fixed explicit 'any' warning by typing error output patterns safely
      const errorMessage = err instanceof Error ? err.message : 'Unknown write error occurred';
      console.error(err);
      alert(`Submission failure alert: ${errorMessage}`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black tracking-tight text-white">Fitter Task Portal</h1>
          <p className="text-slate-400 text-sm">Site Handover Handshakes</p>
        </div>
        <CustomerSignature jobId={sampleJobId} onCompleteJob={handleJobCompletion} />
      </div>
    </main>
  );
}