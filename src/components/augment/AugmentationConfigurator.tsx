'use client';

import React, { useState } from 'react';
import { Beaker, Search, Sparkles, Send, Ban, Network } from 'lucide-react';
import { AugmentationModel, ControlNetParams } from '@/types/augmentor';
import ConditioningPanel, { ConditioningParams } from './ConditioningPanel';
import ControlNetConfig from './ControlNetConfig';

interface ConfiguratorProps {
    onStartJob: (
        model: AugmentationModel,
        sampleCount: number,
        prompt: string,
        negativePrompt: string,
        conditioning: ConditioningParams,
        controlNet?: ControlNetParams
    ) => void;
    isGenerating: boolean;
}


export default function AugmentationConfigurator({ onStartJob, isGenerating }: ConfiguratorProps) {
    const [model, setModel] = useState<AugmentationModel>('Diffusion');
    const [sampleCount, setSampleCount] = useState(10);
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, distorted, artifact, text, signature');
    const [showControlNet, setShowControlNet] = useState(false);
    const [conditioning, setConditioning] = useState<ConditioningParams>({
        label: 'normal',
        guidanceScale: 7.5,
        samplingSteps: 50,
        seed: 42,
    });
    const [controlNet, setControlNet] = useState<ControlNetParams>({
        mode: 'canny',
        strength: 0.8,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onStartJob(model, sampleCount, prompt, negativePrompt, conditioning, showControlNet ? controlNet : undefined);
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <Beaker className="text-sky-600 w-6 h-6" />
                <h2 className="text-xl font-bold font-outfit text-slate-900">Augmentation Configurator</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Model Architecture</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setModel('GAN')}
                            className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${model === 'GAN'
                                ? 'bg-sky-50 border-sky-400 shadow-sm text-sky-900'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                                }`}
                        >
                            <Search className="w-5 h-5 text-sky-500" />
                            <span className="font-semibold text-sm">GAN</span>
                            <span className="text-[10px] text-sky-600/70">Fast & Structural</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setModel('Diffusion')}
                            className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${model === 'Diffusion'
                                ? 'bg-violet-50 border-violet-400 shadow-sm text-violet-900'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                                }`}
                        >
                            <Sparkles className="w-5 h-5 text-violet-500" />
                            <span className="font-semibold text-sm">Diffusion</span>
                            <span className="text-[10px] text-violet-600/70">High Fidelity</span>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Sample Generation Count</label>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={sampleCount}
                        onChange={(e) => setSampleCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span>1</span>
                        <span className="text-base font-bold text-sky-600">{sampleCount} samples</span>
                        <span>100</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Detailed Prompt (Clinical Context)</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., T2-weighted axial brain MRI showing multiple sclerosis lesions in the periventricular region..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-400 text-slate-800 h-24 resize-none mb-4 shadow-inner"
                    />

                    <div className="relative">
                        <div className="absolute left-4 top-4 text-red-500">
                            <Ban className="w-4 h-4" />
                        </div>
                        <textarea
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            placeholder="Negative prompt (e.g., blurry, text...)"
                            className="w-full bg-red-50 border border-red-200 rounded-xl py-3 pl-10 pr-4 text-xs focus:ring-2 focus:ring-red-500 outline-none transition-all placeholder:text-red-300 text-red-900 h-16 resize-none"
                        />
                    </div>
                </div>

                <ConditioningPanel
                    params={conditioning}
                    onChange={setConditioning}
                    onGeneratePrompt={setPrompt}
                />

                <div>
                    <button
                        type="button"
                        onClick={() => setShowControlNet(!showControlNet)}
                        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${showControlNet ? 'bg-violet-100 text-violet-700 border border-violet-300' : 'bg-slate-100 text-slate-500 border border-transparent hover:bg-slate-200'
                            }`}
                    >
                        <Network className="w-4 h-4" />
                        ControlNet Constraints
                    </button>

                    {showControlNet && (
                        <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                            <ControlNetConfig params={controlNet} onChange={setControlNet} />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isGenerating || !prompt}
                    className="w-full py-4 bg-gradient-to-r from-sky-600 to-violet-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-sky-500/20"
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
