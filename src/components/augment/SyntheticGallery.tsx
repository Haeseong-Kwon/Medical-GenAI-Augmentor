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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <LayoutGrid className="text-violet-600 w-6 h-6" />
                    <h2 className="text-xl font-bold font-outfit text-slate-900">Synthetic Data Gallery</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs text-slate-500">
                        <span className="text-emerald-600 font-bold">{validatedCount}</span> / {samples.length} Validated
                    </div>
                    <button
                        disabled={validatedCount === 0}
                        onClick={onExportDataset}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-20 shadow-md shadow-sky-500/20"
                    >
                        <FileJson className="w-4 h-4" />
                        Export Dataset
                    </button>
                </div>
            </div>

            {samples.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <p className="text-slate-400 italic">Initialize a job to see synthetic results</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {samples.map((sample) => (
                        <div
                            key={sample.id}
                            onClick={() => setSelectedSample(sample)}
                            className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer hover:border-sky-400 transition-all"
                        >
                            <img
                                src={sample.imageUrl}
                                alt="Synthetic medical image"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-900/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                                <div className="flex justify-between items-center text-white">
                                    <span className="text-[10px] font-bold text-sky-300">FID: {sample.fidScore.toFixed(3)}</span>
                                    <div className="flex gap-2">
                                        {sample.isValidated && (
                                            <div className={`p-1 rounded ${sample.validation?.isValid ? 'bg-emerald-500/30 text-emerald-300' : 'bg-red-500/30 text-red-300'}`}>
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                            </div>
                                        )}
                                        <Download className="w-3.5 h-3.5 text-white/70 hover:text-white" />
                                    </div>
                                </div>
                            </div>

                            {sample.isValidated && (
                                <div className="absolute top-2 right-2">
                                    <CheckCircle2 className={`w-5 h-5 ${sample.validation?.isValid ? 'text-emerald-500' : 'text-red-500'} drop-shadow-md bg-white rounded-full`} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedSample && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl overflow-hidden text-slate-800 shadow-xl animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                            <div className="flex-1 bg-slate-100 p-4 flex items-center justify-center relative min-h-[300px]">
                                <img
                                    src={selectedSample.imageUrl}
                                    alt="Synthetic Detail"
                                    className="max-w-full max-h-full object-contain"
                                />
                                <button
                                    onClick={() => setSelectedSample(null)}
                                    className="absolute top-4 right-4 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 p-2 rounded-full shadow-sm transition-all md:hidden"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="w-full md:w-80 p-6 flex flex-col border-t md:border-t-0 md:border-l border-slate-200">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold font-outfit mb-1 text-slate-900">Sample Details</h3>
                                        <p className="text-xs text-slate-500">ID: {selectedSample.id.slice(0, 8)}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedSample(null)}
                                        className="hidden md:block bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                        <div className="flex items-center gap-2 mb-3 text-sky-600">
                                            <BarChart3 className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Quality Metrics</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-sm text-slate-600">FID Score</span>
                                                <span className="text-xl font-mono font-bold text-emerald-600">{selectedSample.fidScore.toFixed(4)}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500"
                                                    style={{ width: `${Math.max(0, 100 - selectedSample.fidScore * 10)}%` }}
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500 leading-relaxed italic">
                                                * Lower FID scores indicate better structural alignment with training data.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                        <div className="flex items-center gap-2 mb-3 text-violet-600">
                                            <Info className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Metadata</span>
                                        </div>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Created</span>
                                                <span className="text-slate-800">{new Date(selectedSample.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Resolution</span>
                                                <span className="text-slate-800">512x512 px</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setValidatingSample(selectedSample)}
                                    className="mt-8 w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:opacity-90 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    Request Expert Validation
                                </button>
                                <button className="mt-2 w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
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
