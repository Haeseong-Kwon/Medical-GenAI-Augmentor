'use client';

import React, { useState, useEffect } from 'react';
import AugmentationConfigurator from '@/components/augment/AugmentationConfigurator';
import StatusBoard from '@/components/augment/StatusBoard';
import SyntheticGallery from '@/components/augment/SyntheticGallery';
import { AugmentationJob, SyntheticSample, AugmentationModel } from '@/types/augmentor';
import { supabase } from '@/lib/supabase';
import { BrainCircuit, Layers, Database } from 'lucide-react';

export default function AugmentPage() {
    const [jobs, setJobs] = useState<AugmentationJob[]>([]);
    const [samples, setSamples] = useState<SyntheticSample[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock data for initial view
    useEffect(() => {
        // In a real app, we would fetch from Supabase
        // const fetchJobs = async () => {
        //   const { data } = await supabase.from('augmentation_jobs').select('*').order('created_at', { ascending: false });
        //   if (data) setJobs(data);
        // };
        // fetchJobs();
    }, []);

    const handleStartJob = async (model: AugmentationModel, sampleCount: number, prompt: string) => {
        setIsGenerating(true);

        const newJob: AugmentationJob = {
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            status: 'generating',
            model,
            sampleCount,
            prompt,
            progress: 0,
        };

        setJobs((prev) => [newJob, ...prev]);

        // Simulate progress
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 15) + 5;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                finishJob(newJob.id);
            }

            setJobs((prev) =>
                prev.map((j) => (j.id === newJob.id ? { ...j, progress: currentProgress } : j))
            );
        }, 1500);
    };

    const finishJob = (jobId: string) => {
        setJobs((prev) =>
            prev.map((j) => (j.id === jobId ? { ...j, status: 'completed', progress: 100 } : j))
        );
        setIsGenerating(false);

        // Generate mock samples
        const job = jobs.find(j => j.id === jobId);
        const mockSamples: SyntheticSample[] = Array.from({ length: 4 }).map((_, i) => ({
            id: Math.random().toString(36).substr(2, 9),
            jobId,
            imageUrl: `https://picsum.photos/seed/${Math.random()}/512/512`, // Placeholder images
            fidScore: 0.12 + Math.random() * 0.05,
            createdAt: new Date().toISOString(),
        }));

        setSamples((prev) => [...mockSamples, ...prev]);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-blue-400 mb-2">
                            <BrainCircuit className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em]">Guardion Platform</span>
                        </div>
                        <h1 className="text-4xl font-extrabold font-outfit tracking-tight">
                            Medical <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">GenAI Augmentor</span>
                        </h1>
                        <p className="text-white/40 mt-1 max-w-xl text-sm italic">
                            Empowering clinical researchers with high-fidelity, privacy-preserving synthetic medical imaging datasets.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex flex-col items-center">
                            <Layers className="w-4 h-4 text-blue-400 mb-1" />
                            <span className="text-xl font-bold font-mono">{jobs.length}</span>
                            <span className="text-[10px] text-white/40 uppercase font-bold">Total Jobs</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex flex-col items-center">
                            <Database className="w-4 h-4 text-purple-400 mb-1" />
                            <span className="text-xl font-bold font-mono">{samples.length}</span>
                            <span className="text-[10px] text-white/40 uppercase font-bold">Samples</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Controls */}
                    <div className="lg:col-span-2 space-y-8">
                        <AugmentationConfigurator onStartJob={handleStartJob} isGenerating={isGenerating} />
                        <SyntheticGallery samples={samples} />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <StatusBoard jobs={jobs} />
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .font-outfit {
          font-family: 'Outfit', sans-serif;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
        </div>
    );
}
