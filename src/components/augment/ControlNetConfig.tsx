'use client';

import React, { useState } from 'react';
import { Network, Upload, Sliders, Image as ImageIcon, X } from 'lucide-react';
import { ControlNetParams, ControlNetMode } from '@/types/augmentor';

interface ControlNetConfigProps {
    params: ControlNetParams;
    onChange: (params: ControlNetParams) => void;
}

export default function ControlNetConfig({ params, onChange }: ControlNetConfigProps) {
    const [preview, setPreview] = useState<string | null>(params.referenceImage || null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            onChange({ ...params, referenceImage: url });
        }
    };

    const removeImage = () => {
        setPreview(null);
        onChange({ ...params, referenceImage: undefined });
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2 text-purple-400">
                <Network className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">ControlNet Structural Guide</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reference Uploader */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-white/60">Reference Skeleton / Outline</label>
                    {preview ? (
                        <div className="relative aspect-square bg-black rounded-xl border border-white/10 overflow-hidden group">
                            <img src={preview} alt="Reference" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button
                                    onClick={removeImage}
                                    className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 cursor-pointer transition-all group">
                            <Upload className="w-8 h-8 text-white/20 group-hover:text-purple-400 mb-2 transition-colors" />
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">Upload Map</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                        </label>
                    )}
                </div>

                {/* Control Parameters */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-white/60">Extraction Mode</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['canny', 'depth'] as ControlNetMode[]).map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => onChange({ ...params, mode })}
                                    className={`py-2 px-3 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${params.mode === mode
                                            ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/40'
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
                                <Sliders className="w-4 h-4" />
                                Control Strength
                            </div>
                            <span className="text-xs font-mono text-purple-400">{params.strength.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.05"
                            value={params.strength}
                            onChange={(e) => onChange({ ...params, strength: parseFloat(e.target.value) })}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <div className="flex justify-between text-[10px] text-white/30">
                            <span>Balanced</span>
                            <span>Rigid Structure</span>
                        </div>
                    </div>

                    <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-3 flex gap-2">
                        <ImageIcon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-purple-200/60 leading-relaxed italic">
                            ControlNet helps maintain the <span className="text-purple-300 font-bold">anatomical structure</span> of the patient by using the uploaded map as a spatial constraint.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
