import React, { useState, useRef, useCallback } from 'react';
import type { AppSettings } from '../types';
import { LANGUAGES, MAX_FILE_SIZE_MB, MAX_FILE_SIZE_BYTES, MODELS } from '../constants';
import { UploadIcon, LinkIcon, SettingsIcon } from './icons/Icons';

interface MainScreenProps {
  onTranscribe: (source: File | string) => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ onTranscribe, settings, onSettingsChange }) => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdvancedOpen, setAdvancedOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        setError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
        setUrl('');
      }
    }
  };

  const handleTranscribeClick = () => {
    if (file) {
      onTranscribe(file);
    } else if (url) {
      onTranscribe(url);
    }
  };

  const handleSettingChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-light text-transparent bg-clip-text mb-2">
                KTM Transcriber
            </h1>
            <p className="text-slate-400">
                Transform your audio and video into accurate, readable text with the power of Gemini.
            </p>
        </div>

        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</div>}

        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="audio/*,video/*"
                />
                <button
                    onClick={triggerFileSelect}
                    className="flex-1 flex items-center justify-center gap-3 bg-slate-700 hover:bg-brand-primary transition-all duration-300 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light"
                >
                    <UploadIcon className="w-6 h-6" />
                    {file ? 'Change File' : 'Upload File'}
                </button>
            </div>
            {file && (
                <div className="text-center text-brand-light animate-fade-in">
                    Selected: <span className="font-medium text-slate-300">{file.name}</span>
                </div>
            )}
            
            <div className="flex items-center text-slate-500">
                <hr className="flex-grow border-slate-700"/>
                <span className="px-4">OR</span>
                <hr className="flex-grow border-slate-700"/>
            </div>

            <div className="relative">
                <LinkIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        setFile(null);
                        setError(null);
                    }}
                    placeholder="Paste YouTube, social media, or any media URL"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-colors"
                />
            </div>
        </div>

        <div className="mt-8">
            <button
                onClick={() => setAdvancedOpen(!isAdvancedOpen)}
                className="w-full flex justify-center items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <SettingsIcon className="w-5 h-5"/>
                Advanced Settings
            </button>
            {isAdvancedOpen && (
                <div className="mt-4 p-6 bg-slate-900/50 rounded-lg border border-slate-700 animate-fade-in space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-slate-300 mb-1">Language</label>
                            <select
                                id="language"
                                value={settings.language}
                                onChange={(e) => handleSettingChange('language', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 focus:ring-1 focus:ring-brand-primary outline-none"
                            >
                                {LANGUAGES.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="model" className="block text-sm font-medium text-slate-300 mb-1">AI Model</label>
                            <select
                                id="model"
                                value={settings.model}
                                onChange={(e) => handleSettingChange('model', e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 focus:ring-1 focus:ring-brand-primary outline-none"
                            >
                                {MODELS.map(model => <option key={model.value} value={model.value}>{model.label}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="customVocabulary" className="block text-sm font-medium text-slate-300 mb-1">Custom Vocabulary</label>
                        <textarea
                            id="customVocabulary"
                            value={settings.customVocabulary}
                            onChange={(e) => handleSettingChange('customVocabulary', e.target.value)}
                            placeholder="e.g., Gemini, AI Studio, UX, React"
                            rows={2}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 focus:ring-1 focus:ring-brand-primary outline-none resize-y"
                        ></textarea>
                         <p className="text-xs text-slate-500 mt-1">
                            Help the AI recognize specific names, acronyms, or jargon. Separate items with commas.
                        </p>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 pt-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" checked={settings.enablePunctuation} onChange={(e) => handleSettingChange('enablePunctuation', e.target.checked)} className="form-checkbox h-5 w-5 text-brand-primary bg-slate-600 border-slate-500 rounded focus:ring-brand-light"/>
                            <span className="text-slate-300">Auto Punctuation</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" checked={settings.enableDiarization} onChange={(e) => handleSettingChange('enableDiarization', e.target.checked)} className="form-checkbox h-5 w-5 text-brand-primary bg-slate-600 border-slate-500 rounded focus:ring-brand-light"/>
                            <span className="text-slate-300">Identify Speakers</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" checked={settings.enableSummarization} onChange={(e) => handleSettingChange('enableSummarization', e.target.checked)} className="form-checkbox h-5 w-5 text-brand-primary bg-slate-600 border-slate-500 rounded focus:ring-brand-light"/>
                            <span className="text-slate-300">Generate Summary</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" checked={settings.addTimestamps} onChange={(e) => handleSettingChange('addTimestamps', e.target.checked)} className="form-checkbox h-5 w-5 text-brand-primary bg-slate-600 border-slate-500 rounded focus:ring-brand-light"/>
                            <span className="text-slate-300">Add Timestamps</span>
                        </label>
                         <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" checked={settings.filterProfanity} onChange={(e) => handleSettingChange('filterProfanity', e.target.checked)} className="form-checkbox h-5 w-5 text-brand-primary bg-slate-600 border-slate-500 rounded focus:ring-brand-light"/>
                            <span className="text-slate-300">Filter Profanity</span>
                        </label>
                     </div>
                </div>
            )}
        </div>

        <div className="mt-8">
            <button
                onClick={handleTranscribeClick}
                disabled={!file && !url}
                className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-300 shadow-lg shadow-brand-primary/20"
            >
                Transcribe
            </button>
        </div>
      </div>
    </div>
  );
};