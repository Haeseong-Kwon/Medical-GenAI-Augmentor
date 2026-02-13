'use client';

import React, { useState } from 'react';
import { Beaker, Search, Sparkles, Send, Ban } from 'lucide-react';
import { AugmentationModel } from '@/types/augmentor';
import ConditioningPanel, { ConditioningParams } from './ConditioningPanel';

interface ConfiguratorProps {
    onStartJob: (model: AugmentationModel, sampleCount: number, prompt: string, negativePrompt: string, conditioning: ConditioningParams) => void;
    isGenerating: boolean;
}


export default function AugmentationConfigurator({ onStartJob, isGenerating }: ConfiguratorProps) {
    const [model, setModel] = useState<AugmentationModel>('Diffusion');
    const [sampleCount, setSampleCount] = useState(10);
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, distorted, artifact, text, signature');
    const [conditioning, setConditioning] = useState<ConditioningParams>({
        label: 'normal',
        guidanceScale: 7.5,
        samplingSteps: 50,
        seed: 42,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onStartJob(model, sampleCount, prompt, negativePrompt, conditioning);
    };

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <Beaker className="text-blue-400 w-6 h-6" />
                <h2 className="text-xl font-bold font-outfit">Augmentation Configurator</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Model Architecture</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setModel('GAN')}
                            className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${model === 'GAN'
                                ? 'bg-blue-600/40 border-blue-400 shadow-lg shadow-blue-500/20'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <Search className="w-5 h-5 text-blue-300" />
                            <span className="font-semibold text-sm">GAN</span>
                            <span className="text-[10px] text-blue-100/60">Fast & Structural</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setModel('Diffusion')}
                            className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${model === 'Diffusion'
                                ? 'bg-purple-600/40 border-purple-400 shadow-lg shadow-purple-500/20'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <Sparkles className="w-5 h-5 text-purple-300" />
                            <span className="font-semibold text-sm">Diffusion</span>
                            <span className="text-[10px] text-purple-100/60">High Fidelity</span>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Sample Generation Count</label>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={sampleCount}
                        onChange={(e) => setSampleCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-900 rounded-lg appearance-none cursor-pointer accent-blue-400"
                    />
                    <div className="flex justify-between text-xs text-blue-300 mt-2">
                        <span>1</span>
                        <span className="text-base font-bold text-blue-400">{sampleCount} samples</span>
                        <span>100</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">Detailed Prompt (Clinical Context)</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., T2-weighted axial brain MRI showing multiple sclerosis lesions in the periventricular region..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-white/20 h-24 resize-none mb-4"
                    />

                    <div className="relative">
                        <div className="absolute left-4 top-4 text-red-400">
                            <Ban className="w-4 h-4" />
                        </div>
                        <textarea
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            placeholder="Negative prompt (e.g., blurry, text...)"
                            className="w-full bg-red-950/20 border border-red-500/20 rounded-xl py-3 pl-10 pr-4 text-xs focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-red-400/20 h-16 resize-none"
                        />
                    </div>
                </div>

                <ConditioningPanel
                    params={conditioning}
                    onChange={setConditioning}
                    onGeneratePrompt={setPrompt}
                />


                <button
                    type="submit"
                    disabled={isGenerating || !prompt}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
                >
                    {isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Initialize Generation
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
