import React, { useState } from "react";
import FileUpload from "@/components/FileUpload";
import ResultCard from "@/components/ResultCard";
import { analyzeCatImage } from "@/lib/gemini-api";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    breed: string;
    confidence: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setIsAnalyzing(true);
    setError(null);

    try {
      // Call the Gemini API to analyze the image
      const analysisResult = await analyzeCatImage(file);
      setResult(analysisResult);
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError("Failed to analyze the image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cat Breed Detector
          </h1>
          <p className="text-lg text-gray-600">
            Upload a photo of any cat and we'll identify its breed
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex justify-center">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            </div>
          )}

          {selectedImage && (
            <div className="flex justify-center">
              {isAnalyzing ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-lg text-gray-600">
                    Analyzing your image with AI...
                  </p>
                </div>
              ) : (
                result && (
                  <ResultCard
                    breedName={result.breed}
                    confidence={result.confidence}
                    imageUrl={selectedImage}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
