import { AppSettings } from './types';

export const LANGUAGES = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'fr-FR', label: 'French' },
  { value: 'de-DE', label: 'German' },
  { value: 'it-IT', label: 'Italian' },
  { value: 'ja-JP', label: 'Japanese' },
  { value: 'ko-KR', label: 'Korean' },
  { value: 'zh-CN', label: 'Chinese (Mandarin)' },
];

export const MODELS = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Fast & Efficient)' },
    // NOTE: The model below is a placeholder for UI demonstration.
    // The service will default to a valid model if this is selected.
    { value: 'aura-hf', label: 'Aura High-Fidelity (Premium)' },
];

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'en-US',
  model: 'gemini-2.5-flash',
  enableDiarization: true,
  enablePunctuation: true,
  enableSummarization: false,
  addTimestamps: false,
  filterProfanity: true,
  customVocabulary: '',
};

export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;