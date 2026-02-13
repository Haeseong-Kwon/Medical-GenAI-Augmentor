'use client';

import React, { useState, useEffect } from 'react';
import AugmentationConfigurator from '@/components/augment/AugmentationConfigurator';
import StatusBoard from '@/components/augment/StatusBoard';
import SyntheticGallery from '@/components/augment/SyntheticGallery';
import ImpactChart from '@/components/augment/ImpactChart';
import AugmentReport from '@/components/reports/AugmentReport';
import { AugmentationJob, SyntheticSample, AugmentationModel, ValidationRecord, ControlNetParams } from '@/types/augmentor';
import { supabase } from '@/lib/supabase';
import { BrainCircuit, Layers, Database, ShieldCheck, BarChart4, ClipboardList } from 'lucide-react';




export default function AugmentPage() {
    const [activeTab, setActiveTab] = useState<'config' | 'eval'>('config');
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

    const handleStartJob = async (
        model: AugmentationModel,
        sampleCount: number,
        prompt: string,
        negativePrompt: string,
        conditioning: any,
        controlNet?: ControlNetParams
    ) => {
        setIsGenerating(true);

        const newJob: AugmentationJob = {
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            status: 'generating',
            model,
            sampleCount,
            prompt,
            negativePrompt,
            label: conditioning.label,
            guidanceScale: conditioning.guidanceScale,
            samplingSteps: conditioning.samplingSteps,
            seed: conditioning.seed,
            progress: 0,
            controlNet,
        };

        setJobs((prev) => [newJob, ...prev]);

        // Simulate Supabase Realtime & Generation Progress
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 8) + 2;

            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                finishJob(newJob.id);
            }

            setJobs((prev) =>
                prev.map((j) => (j.id === newJob.id ? { ...j, progress: currentProgress } : j))
            );

            // Simulate real-time sample arrival at 50% and 90%
            if (currentProgress === 50 || currentProgress === 90) {
                addMockSample(newJob.id);
            }
        }, 1000);
    };

    const addMockSample = (jobId: string) => {
        const newSample: SyntheticSample = {
            id: Math.random().toString(36).substr(2, 9),
            jobId,
            imageUrl: `https://picsum.photos/seed/${Math.random()}/512/512`,
            fidScore: 0.15 + Math.random() * 0.1,
            createdAt: new Date().toISOString(),
        };
        setSamples((prev: SyntheticSample[]) => [newSample, ...prev]);
    };

    const updateJobProgress = (jobId: string, progress: number) => {
        setJobs((prev: AugmentationJob[]) =>
            prev.map((j: AugmentationJob) => (j.id === jobId ? { ...j, progress, denoisingStep: Math.floor(progress / 2) } : j))
        );
    };

    const finishJob = (jobId: string) => {
        setJobs((prev) =>
            prev.map((j) => (j.id === jobId ? { ...j, status: 'completed', progress: 100 } : j))
        );
        setIsGenerating(false);
    };

    const handleUpdateSample = (sampleId: string, validation: ValidationRecord) => {
        setSamples((prev) =>
            prev.map((s) => (s.id === sampleId ? { ...s, isValidated: true, validation } : s))
        );
    };

    const handleExportDataset = () => {
        const validatedSamples = samples.filter(s => s.isValidated && s.validation?.isValid);
        if (validatedSamples.length === 0) return;

        const dataset = validatedSamples.map(s => ({
            id: s.id,
            image_url: s.imageUrl,
            label: s.label,
            fid_score: s.fidScore,
            validation: {
                score: s.validation?.score,
                notes: s.validation?.comment,
                author: s.validation?.author,
            }
        }));

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataset, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `medical_dataset_export_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

        alert(`Successfully exported ${validatedSamples.length} validated samples to JSON.`);
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

                <div className="max-w-[1400px] mx-auto space-y-12">
                    {/* Tab Navigation */}
                    <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 w-fit">
                        <button
                            onClick={() => setActiveTab('config')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'config' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            <Layers className="w-4 h-4" />
                            Augmentation Desk
                        </button>
                        <button
                            onClick={() => setActiveTab('eval')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'eval' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            <BarChart4 className="w-4 h-4" />
                            Impact Analysis
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-8">
                            {activeTab === 'config' ? (
                                <>
                                    <AugmentationConfigurator onStartJob={handleStartJob} isGenerating={isGenerating} />
                                    <SyntheticGallery
                                        samples={samples}
                                        onUpdateSample={handleUpdateSample}
                                        onExportDataset={handleExportDataset}
                                    />
                                </>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <ImpactChart />
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <AugmentReport
                                            jobCount={jobs.length}
                                            sampleCount={samples.length}
                                            avgFid={samples.length > 0 ? samples.reduce((acc: number, s: SyntheticSample) => acc + s.fidScore, 0) / samples.length : 0}
                                            validatedCount={samples.filter((s: SyntheticSample) => s.isValidated && s.validation?.isValid).length}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            <StatusBoard jobs={jobs} />

                        </div>
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
