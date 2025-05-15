import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
// You'll need to create an .env file with your API key
// or use another secure method to store it
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Analyzes a cat image using Google's Gemini API to detect the breed
 *
 * @param imageFile - The cat image file to analyze
 * @returns The detected breed and confidence score
 */
export async function analyzeCatImage(
  imageFile: File
): Promise<{ breed: string; confidence: number }> {
  try {
    // Convert the image file to the format required by Gemini
    const imageData = await fileToGenerativePart(imageFile);

    // Get the Gemini model that supports vision
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the prompt for Gemini
    const prompt =
      "This is an image of a cat. Please identify the breed with high confidence. " +
      "Respond in JSON format with two fields only: 'breed' (the detected cat breed) and " +
      "'confidence' (a number between 0 and 1 representing your confidence level). " +
      'For example: {"breed": "Persian", "confidence": 0.85}';

    // Send the request to Gemini
    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      // Extract JSON from the response (it might be surrounded by backticks or text)
      const jsonMatch = text.match(/\{.*\}/s);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      return {
        breed: parsedResponse.breed || "Unknown Breed",
        confidence: parsedResponse.confidence || 0.5,
      };
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      // Fallback response if parsing fails
      return {
        breed: "Detection Failed",
        confidence: 0,
      };
    }
  } catch (error) {
    console.error("Error analyzing cat image with Gemini:", error);
    throw error;
  }
}

/**
 * Converts a File object to a format suitable for the Gemini API
 */
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Extract the base64 data from the FileReader result
      const base64Data = reader.result as string;
      const base64EncodedData = base64Data.split(",")[1];
      resolve(base64EncodedData);
    };
    reader.readAsDataURL(file);
  });

  const base64EncodedData = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}
