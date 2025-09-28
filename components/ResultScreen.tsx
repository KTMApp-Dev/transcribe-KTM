import React, { useState, useEffect } from 'react';
import type { TranscriptionResult } from '../types';
import { TranscriptionStatus } from '../types';
import { CheckCircleIcon, ExclamationCircleIcon, CopyIcon, ArrowLeftIcon, RefreshIcon } from './icons/Icons';

interface ResultScreenProps {
  result: TranscriptionResult;
  onGoBack: () => void;
  onTranscribeAgain: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onGoBack, onTranscribeAgain }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');

  const handleCopy = () => {
    navigator.clipboard.writeText(result.transcript)
      .then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy'), 2000);
      })
      .catch(err => {
        setCopyStatus('Failed!');
        console.error('Failed to copy text: ', err);
        setTimeout(() => setCopyStatus('Copy'), 2000);
      });
  };
  
  const isSuccess = result.status === TranscriptionStatus.SUCCESS;

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700">
            <div className="text-center mb-6">
                <div className={`inline-flex items-center gap-3 text-2xl font-bold ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                    {isSuccess ? <CheckCircleIcon className="w-8 h-8"/> : <ExclamationCircleIcon className="w-8 h-8"/>}
                    <h2>{result.title}</h2>
                </div>
            </div>

            <div className="relative bg-slate-900/70 p-6 rounded-lg border border-slate-700 max-h-[50vh] overflow-y-auto">
                <button 
                    onClick={handleCopy}
                    className="absolute top-3 right-3 bg-slate-700 hover:bg-brand-primary p-2 rounded-md transition-colors"
                    title={copyStatus}
                >
                    <CopyIcon className="w-5 h-5"/>
                </button>
                <div className="prose prose-invert prose-slate max-w-none whitespace-pre-wrap selection:bg-brand-primary/50">
                   {result.transcript}
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    onClick={onGoBack}
                    className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 transition-colors text-white font-semibold py-3 px-4 rounded-lg"
                >
                    <ArrowLeftIcon className="w-5 h-5"/>
                    Go Back
                </button>
                <button
                    onClick={onTranscribeAgain}
                    className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary transition-colors text-white font-bold py-3 px-4 rounded-lg"
                >
                    <RefreshIcon className="w-5 h-5"/>
                    Transcribe Again
                </button>
            </div>
        </div>
    </div>
  );
};