import { GoogleGenAI } from "@google/genai";
import { AppSettings } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we assume it's set.
  console.warn("API_KEY environment variable not set. Using a placeholder. The app will not function correctly.");
  process.env.API_KEY = "YOUR_API_KEY_HERE"; 
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const buildPrompt = (settings: AppSettings): string => {
    let prompt = `Transcribe the following audio/video content. The primary language is ${settings.language}.`;
    
    if (settings.enablePunctuation) {
        prompt += " Ensure proper punctuation is used throughout the transcript.";
    } else {
        prompt += " Do not add any punctuation.";
    }

    if (settings.enableDiarization) {
        prompt += " Identify different speakers and label them clearly (e.g., Speaker 1:, Speaker 2:).";
    }

    if (settings.addTimestamps) {
        prompt += " Include timestamps in the format [HH:MM:SS] at meaningful intervals or speaker changes.";
    }

    if (settings.filterProfanity) {
        prompt += " If any profanity is present, censor it using asterisks (e.g., f***).";
    }

    if (settings.customVocabulary.trim()) {
        prompt += ` Pay special attention to the following custom words, names, or acronyms and ensure they are transcribed correctly: ${settings.customVocabulary.trim()}.`;
    }

    prompt += " The output should be in well-structured Markdown format.";

    if (settings.enableSummarization) {
        prompt += "\n\nAfter the full transcription, provide a concise summary of the content under a '## Summary' heading.";
    }

    return prompt;
}

export const transcribeFile = async (file: File, settings: AppSettings): Promise<string> => {
  try {
    // Use the selected model, but fall back to a valid one if a placeholder is chosen.
    const model = settings.model.startsWith('gemini') ? settings.model : 'gemini-2.5-flash';
    const prompt = buildPrompt(settings);
    const audioPart = await fileToGenerativePart(file);

    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [
        { text: prompt },
        audioPart
      ] }],
    });

    return response.text;
  } catch (error) {
    console.error("Error transcribing file:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       return "Transcription Failed: Invalid API Key. Please ensure your API key is configured correctly.";
    }
    return `Transcription Failed: An unexpected error occurred. Details: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

export const transcribeUrl = async (url: string, settings: AppSettings): Promise<string> => {
    // NOTE: Direct client-side transcription from URLs (especially from social media) is not feasible 
    // due to CORS policies, download restrictions, and terms of service. 
    // This requires a backend server to fetch and process the media.
    // This function provides a mocked response to demonstrate UI flow.
    console.warn(`URL transcription for "${url}" is mocked. A backend is required for this feature.`);

    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

    return `## Mock Transcription for URL

This is a simulated transcription for the URL: \`${url}\`.

**Disclaimer:** In a real-world application, a server-side component would be necessary to download and process content from web links before sending it to the AI for transcription. This client-side demonstration mimics that process.

### Applied Settings:
- **Model:** ${settings.model}
- **Language:** ${settings.language}
- **Speaker Diarization:** ${settings.enableDiarization ? 'Enabled' : 'Disabled'}
- **Punctuation:** ${settings.enablePunctuation ? 'Enabled' : 'Disabled'}
- **Timestamps:** ${settings.addTimestamps ? 'Enabled' : 'Disabled'}
- **Profanity Filter:** ${settings.filterProfanity ? 'Enabled' : 'Disabled'}
- **Summary:** ${settings.enableSummarization ? 'Enabled' : 'Disabled'}
- **Custom Vocabulary:** ${settings.customVocabulary.trim() || 'None'}

The actual transcription would appear here.`;
};