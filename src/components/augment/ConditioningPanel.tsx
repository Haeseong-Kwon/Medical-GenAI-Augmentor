'use client';

import React from 'react';
import { Thermometer, Layers, Hash, Info, Check } from 'lucide-react';

export interface ConditioningParams {
    label: string;
    guidanceScale: number;
    samplingSteps: number;
    seed: number;
}

interface ConditioningPanelProps {
    params: ConditioningParams;
    onChange: (params: ConditioningParams) => void;
    onGeneratePrompt?: (prompt: string) => void;
}

const DISEASE_LABELS = [
    { id: 'normal', name: 'Normal', description: 'Clear lung fields, no abnormalities' },
    { id: 'pneumonia', name: 'Pneumonia', description: 'Patchy opacities or consolidation' },
    { id: 'effusion', name: 'Effusion', description: 'Fluid accumulation in pleural space' },
    { id: 'cyst', name: 'Cyst', description: 'Well-defined fluid-filled cavity' },
    { id: 'nodule', name: 'Nodule', description: 'Discrete small rounded mass' },
];

export default function ConditioningPanel({ params, onChange, onGeneratePrompt }: ConditioningPanelProps) {
    const updateParam = <K extends keyof ConditioningParams>(key: K, value: ConditioningParams[K]) => {
        onChange({ ...params, [key]: value });
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-8">
            <div>
                <div className="flex items-center gap-2 mb-4 text-blue-400">
                    <Thermometer className="w-5 h-5" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Clinical Conditioning</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {DISEASE_LABELS.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => updateParam('label', item.id)}
                            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${params.label === item.id
                                ? 'bg-blue-600/20 border-blue-400/50 shadow-lg'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-bold ${params.label === item.id ? 'text-blue-300' : 'text-white'}`}>
                                    {item.name}
                                </span>
                                <div className="flex items-center gap-1">
                                    {params.label === item.id && (
                                        <div className="bg-blue-500 rounded-full p-0.5">
                                            <Check className="w-2 h-2 text-white" />
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            updateParam('label', item.id);
                                            onGeneratePrompt?.(`${item.name} analysis: ${item.description}`);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-blue-500/30 p-1 rounded text-[8px] font-bold uppercase"
                                    >
                                        Suggest
                                    </button>
                                </div>
                            </div>
                            <p className="text-[10px] text-white/40 leading-tight line-clamp-2">
                                {item.description}
                            </p>
                            {params.label === item.id && (
                                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* SLIDER: Guidance Scale */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-200">
                            <Layers className="w-4 h-4" />
                            Guidance Scale
                        </div>
                        <span className="text-xs font-mono text-blue-400">{params.guidanceScale.toFixed(1)}</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="30"
                        step="0.5"
                        value={params.guidanceScale}
                        onChange={(e) => updateParam('guidanceScale', parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[10px] text-white/30">
                        <span>Realistic</span>
                        <span>Creative</span>
                    </div>
                </div>

                {/* SLIDER: Sampling Steps */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
                            <Thermometer className="w-4 h-4" />
                            Sampling Steps
                        </div>
                        <span className="text-xs font-mono text-purple-400">{params.samplingSteps}</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        step="1"
                        value={params.samplingSteps}
                        onChange={(e) => updateParam('samplingSteps', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-[10px] text-white/30">
                        <span>Fast</span>
                        <span>High Def</span>
                    </div>
                </div>

                {/* INPUT: Seed */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-xs font-bold text-green-200">
                            <Hash className="w-4 h-4" />
                            Random Seed
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={params.seed}
                            onChange={(e) => updateParam('seed', parseInt(e.target.value) || 0)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-green-500/50 transition-all font-mono"
                        />
                        <button
                            type="button"
                            onClick={() => updateParam('seed', Math.floor(Math.random() * 999999))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-md hover:bg-green-500/20"
                        >
                            Shuffle
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <p className="text-[10px] text-blue-100/60 leading-relaxed italic">
                    Higher <span className="text-blue-300 font-bold">Guidance Scale</span> forces the model to follow the prompt more strictly, while more <span className="text-purple-300 font-bold">Sampling Steps</span> generally improve image quality but take longer to process.
                </p>
            </div>
        </div>
    );
}
