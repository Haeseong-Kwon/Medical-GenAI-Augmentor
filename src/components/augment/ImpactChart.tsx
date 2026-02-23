'use client';

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, BarChart3, Activity, Zap } from 'lucide-react';

const accuracyData = [
    { epoch: 0, baseline: 0.50, augmented: 0.50 },
    { epoch: 10, baseline: 0.65, augmented: 0.72 },
    { epoch: 20, baseline: 0.72, augmented: 0.81 },
    { epoch: 30, baseline: 0.78, augmented: 0.88 },
    { epoch: 40, baseline: 0.82, augmented: 0.93 },
    { epoch: 50, baseline: 0.84, augmented: 0.96 },
];

const distributionData = [
    { label: 'Normal', count: 450, synthetic: 800 },
    { label: 'Effusion', count: 120, synthetic: 750 },
    { label: 'Pneumonia', count: 85, synthetic: 780 },
    { label: 'Cyst', count: 40, synthetic: 720 },
    { label: 'Nodule', count: 30, synthetic: 740 },
];

export default function ImpactChart() {
    return (
        <div className="space-y-6">
            {/* KPI Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap className="w-12 h-12 text-yellow-500" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Performance Boost</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-extrabold font-outfit text-slate-800">+14.2%</h3>
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" /> ∆ Accuracy
                        </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 italic">Validated on hold-out clinical set</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-12 h-12 text-sky-500" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">FID Stability Score</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-extrabold font-outfit text-slate-800">0.142</h3>
                        <span className="text-[10px] text-sky-600 font-bold tracking-tighter uppercase">Ultra High Fid</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 italic">Structural Structural Similarity index</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden group shadow-sm">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BarChart3 className="w-12 h-12 text-violet-500" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Dataset Balance Factor</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-extrabold font-outfit text-slate-800">0.98</h3>
                        <span className="text-[10px] text-violet-600 font-bold tracking-tighter uppercase">Minimizing Bias</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 italic">Shannon diversity index improved</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line Chart: Training Curve */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-sky-600 uppercase tracking-widest text-xs font-bold">
                        <Activity className="w-4 h-4" />
                        Accuracy Evaluation Delta
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={accuracyData}>
                                <defs>
                                    <linearGradient id="colorAug" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="epoch"
                                    stroke="#94a3b8"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={[0.4, 1.0]}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#334155' }}
                                    itemStyle={{ fontSize: '10px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="augmented"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorAug)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="baseline"
                                    stroke="#94a3b8"
                                    strokeWidth={2}
                                    fill="transparent"
                                    strokeDasharray="5 5"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                            <div className="w-3 h-0.5 bg-sky-500 rounded-full" />
                            With Synthetic Augmentation
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <div className="w-3 h-0.5 bg-slate-400 rounded-full border-t border-dashed border-slate-400" />
                            Baseline (Collected Clinical)
                        </div>
                    </div>
                </div>

                {/* Bar Chart: Distribution */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 text-violet-600 uppercase tracking-widest text-xs font-bold">
                        <BarChart3 className="w-4 h-4" />
                        Class Re-balancing Impact
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distributionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    stroke="#94a3b8"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#334155' }}
                                    itemStyle={{ fontSize: '10px' }}
                                />
                                <Bar dataKey="synthetic" fill="#8b5cf6" radius={[4, 4, 0, 0]} opacity={0.6} />
                                <Bar dataKey="count" fill="#cbd5e1" radius={[4, 4, 0, 0]} opacity={0.6} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-violet-600">
                            <div className="w-3 h-3 bg-violet-500 rounded-sm opacity-60" />
                            Synthetic Buffer
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <div className="w-3 h-3 bg-slate-400 rounded-sm opacity-60" />
                            Clinical Original
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
