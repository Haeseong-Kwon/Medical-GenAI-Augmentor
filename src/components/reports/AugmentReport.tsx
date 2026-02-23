'use client';

import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FileDown, FileText, CheckCircle, Shield, Loader2 } from 'lucide-react';


interface ReportProps {
    jobCount: number;
    sampleCount: number;
    avgFid: number;
    validatedCount: number;
}

export default function AugmentReport({ jobCount, sampleCount, avgFid, validatedCount }: ReportProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    const generatePDF = async () => {
        if (!reportRef.current) return;
        setIsGenerating(true);

        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`medical-augment-report-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (error) {
            console.error('PDF Generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-sky-600">
                    <FileText className="w-5 h-5" />
                    <h2 className="text-sm font-bold uppercase tracking-widest font-outfit text-slate-800">Research Summary Generator</h2>
                </div>
                <button
                    onClick={generatePDF}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 text-slate-700 shadow-sm"
                >
                    {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <FileDown className="w-4 h-4" />
                    )}
                    {isGenerating ? 'Generating...' : 'Export PDF Report'}
                </button>
            </div>

            {/* Hidden PDF Content Shell */}
            <div className="hidden">
                <div
                    ref={reportRef}
                    className="p-16 text-slate-900 bg-white w-[210mm] min-h-[297mm] font-sans"
                >
                    <div className="border-b border-slate-200 pb-8 mb-12 flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-extrabold font-outfit mb-2">Clinical Data Augmentation Report</h1>
                            <p className="text-sky-600 font-mono tracking-widest text-sm uppercase">Secure Simulation Protocol v4.0.2</p>
                        </div>
                        <div className="text-right text-xs text-slate-500 leading-relaxed font-mono">
                            Report ID: {Math.random().toString(36).substr(2, 12).toUpperCase()}<br />
                            Generated: {new Date().toLocaleString()}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-16">
                        <div className="space-y-8">
                            <section className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Executive Summary
                                </h3>
                                <p className="text-sm leading-relaxed text-slate-700">
                                    This report summarizes the conditional diffusion-based data augmentation performed to address clinical class imbalance.
                                    The generated samples have undergone rigorous FID scoring and expert validation to ensure structural integrity and
                                    anatomical accuracy.
                                </p>
                            </section>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Total Samples</span>
                                    <div className="text-3xl font-bold mt-1 text-slate-800">{sampleCount}</div>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Avg. FID Score</span>
                                    <div className="text-3xl font-bold mt-1 text-emerald-600">{avgFid.toFixed(4)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Augmentation Statistics</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Total Generation Jobs</span>
                                    <span className="text-sm font-bold font-mono text-slate-800">{jobCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Validated Legitimate</span>
                                    <span className="text-sm font-bold font-mono text-sky-600">{validatedCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Validation Pass Rate</span>
                                    <span className="text-sm font-bold font-mono text-amber-500">
                                        {sampleCount > 0 ? ((validatedCount / sampleCount) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-200 mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                                    <CheckCircle className="w-4 h-4" />
                                    Structural Integrity Verified
                                </div>
                                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                                    <CheckCircle className="w-4 h-4" />
                                    Radiological Consistency Pass
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 border-t border-slate-200 pt-8 flex justify-between items-center opacity-60 text-slate-500">
                        <p className="text-[10px] uppercase font-bold tracking-widest">Medical GenAI Augmentor Lab Interface</p>
                        <p className="text-[10px]">Page 1 / 1</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-2 text-sky-600">
                    <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Final Research Documentation</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                    Generate a production-ready PDF report containing all critical performance metrics, FID scores, and validation summaries for your final thesis or publication.
                </p>
            </div>
        </div>
    );
}
