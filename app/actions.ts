'use server';

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export type SummaryState = {
  error: string | null;
  summary: string | null;
};

export async function summarizeFile(prevState: SummaryState, formData: FormData): Promise<SummaryState> {
  const file = formData.get('file') as File;

  if (!file || file.size === 0) {
    return { error: 'Please upload a valid file.', summary: null };
  }

  try {
    const text = await file.text();

    const { text: summary } = await generateText({
      model: google('gemini-2.5-flash'),
      system: 'You are an expert assistant. Your task is to accurately and concisely summarize the content uploaded by the user. Highlight the key points and provide a comprehensive overview without losing important details.',
      prompt: `Please summarize the following document content:\n\n${text}`,
    });

    return { error: null, summary };
  } catch (err: any) {
    console.error('Error in summarizeFile:', err);
    return { error: 'Failed to summarize file: ' + err.message, summary: null };
  }
}
