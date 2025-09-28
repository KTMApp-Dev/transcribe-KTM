import React, { useState, useCallback } from 'react';
import { MainScreen } from './components/MainScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultScreen } from './components/ResultScreen';
import { ScreenState, TranscriptionStatus } from './types';
import type { TranscriptionResult, AppSettings } from './types';
import { transcribeFile, transcribeUrl } from './services/geminiService';
import { DEFAULT_SETTINGS } from './constants';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.MAIN);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [transcriptionSource, setTranscriptionSource] = useState<File | string | null>(null);

  const handleTranscribe = useCallback(async (source: File | string) => {
    setTranscriptionSource(source);
    setScreen(ScreenState.LOADING);
    try {
      let transcript = '';
      if (typeof source === 'string') {
        transcript = await transcribeUrl(source, settings);
      } else {
        transcript = await transcribeFile(source, settings);
      }
      
      const isFailure = transcript.startsWith('Transcription Failed:');

      setResult({
        status: isFailure ? TranscriptionStatus.FAILURE : TranscriptionStatus.SUCCESS,
        title: isFailure ? 'Transcription Failed' : 'Transcription Successful',
        transcript: transcript,
      });
    } catch (error) {
      console.error(error);
      setResult({
        status: TranscriptionStatus.FAILURE,
        title: 'Transcription Failed',
        transcript: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setScreen(ScreenState.RESULT);
    }
  }, [settings]);
  
  const handleSettingsChange = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };

  const resetToMain = () => {
    setResult(null);
    setTranscriptionSource(null);
    setScreen(ScreenState.MAIN);
  }

  const renderContent = () => {
    switch (screen) {
      case ScreenState.LOADING:
        return <LoadingScreen source={transcriptionSource} />;
      case ScreenState.RESULT:
        return result && <ResultScreen result={result} onGoBack={resetToMain} onTranscribeAgain={resetToMain} />;
      case ScreenState.MAIN:
      default:
        return <MainScreen onTranscribe={handleTranscribe} settings={settings} onSettingsChange={handleSettingsChange}/>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-all duration-500">
      {renderContent()}
    </div>
  );
};

export default App;
