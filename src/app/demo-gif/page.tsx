'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Beaker, CheckCircle2, BarChart3 } from 'lucide-react';

export default function DemoGifPage() {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Initializing...');
    const [showGraph, setShowGraph] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setStatus('Completed');
                    setTimeout(() => setShowGraph(true), 1000);
                    return 100;
                }
                if (prev > 0) setStatus('Generating...');
                return prev + 2;
            });
        }, 150);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-12 font-sans flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <Beaker className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Medical GenAI Augmentor</h1>
                            <p className="text-zinc-500 text-sm italic">"Generate Chest X-ray with Nodule"</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-2xl p-6 relative overflow-hidden h-[400px]">
                            {progress < 100 ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div
                                        className="w-full h-full opacity-40 mix-blend-overlay"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                                            filter: `blur(${10 - (progress / 10)}px)`,
                                            transform: `scale(${1 + (Date.now() % 100) / 1000})`
                                        }}
                                    />
                                    <Activity className="w-12 h-12 text-blue-400 animate-pulse mb-4 z-20" />
                                    <span className="text-xl font-mono font-bold text-blue-400 z-20">{progress}%</span>
                                    <span className="text-xs uppercase tracking-widest text-zinc-500 mt-2 z-20">{status}</span>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-blue-500/5">
                                    <div className="relative w-72 h-72 border-2 border-dashed border-blue-500/20 rounded-2xl flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
                                        <div className="z-10 text-center">
                                            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                            <p className="text-sm font-bold text-zinc-300">High-Resolution Synthetic Image</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-2xl p-6 h-[400px]">
                            <div className="flex items-center gap-3 mb-6">
                                <BarChart3 className="w-5 h-5 text-zinc-400" />
                                <h3 className="font-bold text-zinc-300">Data Distribution Analysis</h3>
                            </div>

                            {showGraph ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-xs text-zinc-500">
                                                <span>Class Alignment {i}</span>
                                                <span className="text-blue-400 font-mono">98.2% Match</span>
                                            </div>
                                            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500/50 rounded-full" style={{ width: '92%' }} />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                        <p className="text-[10px] text-green-300 leading-relaxed font-medium">
                                            Validation Complete: Synthetic data profile matches clinical ground truth within 1.8% variance.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-zinc-600 italic text-sm">
                                    Waiting for generation...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decorations */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
        </div>
    );
}
