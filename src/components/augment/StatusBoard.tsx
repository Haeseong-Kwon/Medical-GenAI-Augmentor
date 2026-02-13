'use client';

import React from 'react';
import { Activity, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { AugmentationJob } from '@/types/augmentor';

interface StatusBoardProps {
    jobs: AugmentationJob[];
}

export default function StatusBoard({ jobs }: StatusBoardProps) {
    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Activity className="text-green-400 w-6 h-6" />
                    <h2 className="text-xl font-bold font-outfit">Real-time Status</h2>
                </div>
                <div className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-[10px] uppercase font-bold text-green-300 animate-pulse">
                    Live Connection
                </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {jobs.length === 0 ? (
                    <div className="text-center py-12 text-white/40">
                        <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-sm italic">No active jobs found</p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div key={job.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-sm font-bold flex items-center gap-2">
                                        {job.model} Job #{job.id.slice(0, 4)}
                                        {job.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                        {job.status === 'generating' && <Activity className="w-4 h-4 text-blue-400 animate-pulse" />}
                                    </h3>
                                    <p className="text-[10px] text-white/50">{new Date(job.createdAt).toLocaleString()}</p>
                                </div>
                                <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${job.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                        job.status === 'generating' ? 'bg-blue-500/20 text-blue-400' :
                                            job.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {job.status}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-white/60">Progress</span>
                                    <span className="font-mono">{job.progress}%</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${job.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                                            }`}
                                        style={{ width: `${job.progress}%` }}
                                    />
                                </div>
                            </div>

                            <p className="mt-3 text-[11px] text-white/70 line-clamp-1 italic">
                                "{job.prompt}"
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
