'use client';

import React, { useState } from 'react';
import { LayoutGrid, Download, Info, BarChart3, X, ShieldCheck, FileJson, CheckCircle2 } from 'lucide-react';
import { SyntheticSample, ValidationRecord } from '@/types/augmentor';
import ValidationModal from '../gallery/ValidationModal';

interface SyntheticGalleryProps {
    samples: SyntheticSample[];
    onUpdateSample: (sampleId: string, validation: ValidationRecord) => void;
    onExportDataset: () => void;
}


export default function SyntheticGallery({ samples, onUpdateSample, onExportDataset }: SyntheticGalleryProps) {
    const [selectedSample, setSelectedSample] = useState<SyntheticSample | null>(null);
    const [validatingSample, setValidatingSample] = useState<SyntheticSample | null>(null);

    const validatedCount = samples.filter(s => s.isValidated && s.validation?.isValid).length;


    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <LayoutGrid className="text-purple-400 w-6 h-6" />
                    <h2 className="text-xl font-bold font-outfit">Synthetic Data Gallery</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs text-white/40">
                        <span className="text-green-400 font-bold">{validatedCount}</span> / {samples.length} Validated
                    </div>
                    <button
                        disabled={validatedCount === 0}
                        onClick={onExportDataset}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-20 shadow-lg shadow-blue-500/20"
                    >
                        <FileJson className="w-4 h-4" />
                        Export Dataset
                    </button>
                </div>
            </div>

            {samples.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                    <p className="text-white/40 italic">Initialize a job to see synthetic results</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {samples.map((sample) => (
                        <div
                            key={sample.id}
                            onClick={() => setSelectedSample(sample)}
                            className="group relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/5 cursor-pointer hover:border-blue-400/50 transition-all"
                        >
                            <img
                                src={sample.imageUrl}
                                alt="Synthetic medical image"
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-blue-300">FID: {sample.fidScore.toFixed(3)}</span>
                                    <div className="flex gap-2">
                                        {sample.isValidated && (
                                            <div className={`p-1 rounded ${sample.validation?.isValid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                            </div>
                                        )}
                                        <Download className="w-3.5 h-3.5 text-white/70 hover:text-white" />
                                    </div>
                                </div>
                            </div>

                            {sample.isValidated && (
                                <div className="absolute top-2 right-2">
                                    <CheckCircle2 className={`w-5 h-5 ${sample.validation?.isValid ? 'text-green-400' : 'text-red-400'} drop-shadow-md`} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedSample && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0f172a] border border-white/20 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                            <div className="flex-1 bg-black p-4 flex items-center justify-center relative min-h-[300px]">
                                <img
                                    src={selectedSample.imageUrl}
                                    alt="Synthetic Detail"
                                    className="max-w-full max-h-full object-contain"
                                />
                                <button
                                    onClick={() => setSelectedSample(null)}
                                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-all md:hidden"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="w-full md:w-80 p-6 flex flex-col border-t md:border-t-0 md:border-l border-white/10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold font-outfit mb-1">Sample Details</h3>
                                        <p className="text-xs text-white/40">ID: {selectedSample.id.slice(0, 8)}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedSample(null)}
                                        className="hidden md:block bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-center gap-2 mb-3 text-blue-300">
                                            <BarChart3 className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Quality Metrics</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-sm text-white/60">FID Score</span>
                                                <span className="text-xl font-mono font-bold text-green-400">{selectedSample.fidScore.toFixed(4)}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500"
                                                    style={{ width: `${Math.max(0, 100 - selectedSample.fidScore * 10)}%` }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-white/40 leading-relaxed italic">
                                                * Lower FID scores indicate better structural alignment with training data.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-center gap-2 mb-3 text-purple-300">
                                            <Info className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Metadata</span>
                                        </div>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-white/40">Created</span>
                                                <span>{new Date(selectedSample.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/40">Resolution</span>
                                                <span>512x512 px</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setValidatingSample(selectedSample)}
                                    className="mt-8 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    Request Expert Validation
                                </button>
                                <button className="mt-2 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Download PNG
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Expert Validation Modal */}
            {validatingSample && (
                <ValidationModal
                    sample={validatingSample}
                    onClose={() => setValidatingSample(null)}
                    onValidate={(record) => onUpdateSample(validatingSample.id, record)}
                />
            )}
        </div>
    );
}
