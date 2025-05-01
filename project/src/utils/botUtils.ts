/**
 * This file contains utility functions for the bot responses.
 * In a production environment, this would connect to an actual AI service.
 */

// Sample responses based on keywords to simulate AI understanding
const responses = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: "Hello there! I'm AgriGuard, your farming assistant. How can I help you today?"
  },
  {
    keywords: ['crop', 'plant', 'grow', 'seed', 'sow'],
    response: "I'd be happy to help with your crop questions. What specific crop are you growing, and what information do you need about it?"
  },
  {
    keywords: ['weather', 'rain', 'forecast', 'temperature', 'climate'],
    response: "Weather is a critical factor in farming. Based on your location data, the forecast shows mild conditions for the next few days. Would you like detailed weather information for your farm?"
  },
  {
    keywords: ['pest', 'disease', 'infection', 'bug', 'insect'],
    response: "I notice you're asking about pests or diseases. For the most accurate identification, please share photos of the affected plants. In the meantime, can you describe the symptoms you're seeing?"
  },
  {
    keywords: ['fertilizer', 'nutrient', 'soil', 'compost', 'manure'],
    response: "Soil health and proper fertilization are essential for good yields. What crops are you fertilizing, and what's the current condition of your soil? Have you done any soil tests recently?"
  },
  {
    keywords: ['water', 'irrigation', 'drought', 'moisture'],
    response: "Water management is crucial for sustainable farming. What irrigation system are you currently using? I can help optimize your water usage based on your specific crops and soil conditions."
  },
  {
    keywords: ['harvest', 'yield', 'collect', 'produce'],
    response: "Planning for harvest is important. Based on your planting dates and current crop conditions, I estimate your optimal harvest time is approaching. Would you like specific guidelines for your crops?"
  }
];

// Default responses when no keywords match
const defaultResponses = [
  "I'm here to help with any farming questions. Could you provide more details about your specific situation?",
  "As your agricultural assistant, I'd like to understand more about your farm. What crops are you currently growing?",
  "I'm analyzing your question. To provide the best advice, could you share more information about your agricultural needs?",
  "I'd be happy to assist with your farming operations. Could you elaborate on what specific help you need today?",
  "Thank you for your question. To give you the most relevant advice, could you tell me more about your farm size and the crops you're working with?"
];

export const generateBotResponse = async (
  userInput: string, 
  image: File | null
): Promise<string> => {
  // Convert input to lowercase for easier matching
  const input = userInput.toLowerCase();
  
  // Check if we have an image
  if (image) {
    return "Thank you for sharing this image. I can see details of your crop/field. Based on what I can observe, it appears to be in good condition, though I notice some potential signs that might need attention. Would you like me to analyze specific aspects of what's shown in the image?";
  }
  
  // Look for keyword matches
  for (const item of responses) {
    if (item.keywords.some(keyword => input.includes(keyword))) {
      return item.response;
    }
  }
  
  // If no matches, return a random default response
  const randomIndex = Math.floor(Math.random() * defaultResponses.length);
  return defaultResponses[randomIndex];
};