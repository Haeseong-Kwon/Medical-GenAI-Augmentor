'use client';

import React, { useState } from 'react';
import { SyntheticSample, ValidationRecord } from '@/types/augmentor';
import { X, CheckCircle2, AlertCircle, Star, MessageSquare, ShieldCheck } from 'lucide-react';

interface ValidationModalProps {
    sample: SyntheticSample;
    onClose: () => void;
    onValidate: (record: ValidationRecord) => void;
}

export default function ValidationModal({ sample, onClose, onValidate }: ValidationModalProps) {
    const [score, setScore] = useState(0);
    const [comment, setComment] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (score === 0 || isValid === null) return;

        onValidate({
            isValid,
            score,
            comment,
            author: 'Expert Reviewer', // In real app, from auth session
            createdAt: new Date().toISOString(),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#0b0e14] border border-white/10 rounded-[2rem] w-full max-w-5xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col md:flex-row h-[90vh]">
                {/* Left: Image View */}
                <div className="flex-1 bg-black p-8 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-white/5">
                    <img
                        src={sample.imageUrl}
                        alt="Synthetic Medical Data"
                        className="max-w-full max-h-full object-contain shadow-2xl"
                    />
                    <div className="absolute top-6 left-6 flex gap-2">
                        <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                            Synthetic
                        </div>
                        {sample.label && (
                            <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-[10px] font-bold text-purple-300 uppercase tracking-widest">
                                Label: {sample.label}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Validation Form */}
                <div className="w-full md:w-[400px] p-8 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-blue-400 mb-1">
                                <ShieldCheck className="w-5 h-5" />
                                <h2 className="text-xl font-bold font-outfit uppercase tracking-tighter">Clinical Validation</h2>
                            </div>
                            <p className="text-xs text-white/40 italic">Expert verification protocol v2.1</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 flex-1">
                        {/* Validity Check */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Medical Validity</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsValid(true)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${isValid === true
                                            ? 'bg-green-600/20 border-green-500 shadow-lg shadow-green-500/10'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'
                                        }`}
                                >
                                    <CheckCircle2 className={`w-8 h-8 ${isValid === true ? 'text-green-400' : 'text-white/20'}`} />
                                    <span className="text-[10px] font-bold">LEGITIMATE</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsValid(false)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${isValid === false
                                            ? 'bg-red-600/20 border-red-500 shadow-lg shadow-red-500/10'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'
                                        }`}
                                >
                                    <AlertCircle className={`w-8 h-8 ${isValid === false ? 'text-red-400' : 'text-white/20'}`} />
                                    <span className="text-[10px] font-bold">ARTIFACTED</span>
                                </button>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Quality Rating</label>
                            <div className="flex justify-between items-center bg-white/5 rounded-2xl p-4 border border-white/10">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setScore(s)}
                                        className={`transition-all ${s <= score ? 'text-yellow-400 scale-110' : 'text-white/10 hover:text-white/30'}`}
                                    >
                                        <Star className="w-6 h-6 fill-current" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comment */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                                <MessageSquare className="w-3.5 h-3.5" />
                                Clinical Notes
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Describe any anomalies or specific clinical features observed..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-blue-500/50 transition-all min-h-[120px] resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={score === 0 || isValid === null}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-blue-500/20"
                        >
                            Submit Validation
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
