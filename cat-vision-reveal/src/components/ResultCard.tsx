import React from "react";
import { Percent } from "lucide-react";

interface ResultCardProps {
  breedName: string;
  confidence: number;
  imageUrl: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  breedName,
  confidence,
  imageUrl,
}) => {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 animate-fade-in">
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={`Detected ${breedName}`}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          {breedName}
        </h3>

        <div className="flex items-center gap-2 mb-4">
          <Percent className="w-5 h-5 text-purple-500" />
          <span className="text-lg font-medium text-purple-600">
            {(confidence * 100).toFixed(1)}% Confidence
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${confidence * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
