import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './config';

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

export async function analyzeImage(imageBase64: string, mimeType: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-002' });
    
    const result = await model.generateContent([
      config.AGRICULTURE_EXPERT_PROMPT,
      {
        inlineData: {
          mimeType,
          data: imageBase64.split(',')[1]
        }
      }
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image. Please check your API key and try again.');
  }
}

export async function generateTextResponse(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-002' });
    
    const result = await model.generateContent([
      config.AGRICULTURE_EXPERT_PROMPT,
      prompt
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating text response:', error);
    throw new Error('Failed to generate response. Please check your API key and try again.');
  }
} 