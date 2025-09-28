import React, { useState, useEffect } from 'react';

const messages = [
  "Warming up the AI model...",
  "Analyzing audio patterns...",
  "Converting speech to text...",
  "Applying punctuation and formatting...",
  "Finalizing the transcript...",
  "Almost there, Gemini is thinking hard!"
];

interface LoadingScreenProps {
  source: File | string | null;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ source }) => {
    const [message, setMessage] = useState(messages[0]);
    const [progress, setProgress] = useState(0);

    // Effect for cycling through messages
    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = messages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    // Effect for simulating progress bar
    useEffect(() => {
        // Animate to 90% over a simulated duration. It will stop at 90%
        // until the transcription is actually complete.
        const animationDuration = 30 * 1000; // 30 seconds
        const targetProgress = 90;
        let startTime: number;
        let frameId: number;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const newProgress = Math.min(targetProgress, (elapsed / animationDuration) * targetProgress);
            setProgress(newProgress);
            if (elapsed < animationDuration) {
                frameId = requestAnimationFrame(step);
            }
        };
        frameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameId);
    }, []);

    const getSourceName = () => {
        if (!source) return '';
        if (typeof source === 'string') {
            const displayUrl = source.length > 60 ? `${source.substring(0, 57)}...` : source;
            return `From URL: ${displayUrl}`;
        }
        return `File: ${source.name}`;
    }

    return (
        <div className="flex flex-col items-center justify-center text-center animate-fade-in w-full max-w-lg">
            <div className="w-16 h-16 border-4 border-slate-600 border-t-brand-light rounded-full animate-spin mb-6"></div>
            <h2 className="text-3xl font-bold text-white mb-2 animate-pulse-fast">Transcribing</h2>
            <p className="text-slate-400 mb-4 text-sm truncate w-full px-4 h-5">{getSourceName()}</p>
            
            <div className="w-full bg-slate-700 rounded-full h-2.5 my-4 overflow-hidden border border-slate-600">
                <div 
                    className="bg-gradient-to-r from-brand-primary to-brand-light h-full rounded-full transition-all duration-300 ease-linear" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <p className="text-slate-400 transition-opacity duration-500 h-5">{message}</p>
        </div>
    );
};
