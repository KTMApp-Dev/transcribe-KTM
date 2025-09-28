export enum ScreenState {
  MAIN = 'MAIN',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
}

export enum TranscriptionStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export interface TranscriptionResult {
  status: TranscriptionStatus;
  transcript: string;
  title: string;
}

export interface AppSettings {
  language: string;
  model: string;
  enableDiarization: boolean;
  enablePunctuation: boolean;
  enableSummarization: boolean;
  addTimestamps: boolean;
  filterProfanity: boolean;
  customVocabulary: string;
}