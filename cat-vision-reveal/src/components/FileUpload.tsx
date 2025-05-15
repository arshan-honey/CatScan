
import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "w-full max-w-md p-8 rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out",
        isDragging 
          ? "border-purple-500 bg-purple-50" 
          : "border-gray-300 bg-white hover:border-purple-400"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-purple-100">
          {isDragging ? (
            <ImageIcon className="w-8 h-8 text-purple-500" />
          ) : (
            <Upload className="w-8 h-8 text-purple-500" />
          )}
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            {isDragging ? "Drop your image here" : "Drag & drop your cat image"}
          </p>
          <p className="text-sm text-gray-500 mt-1">or click to browse</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-100 
                   rounded-lg hover:bg-purple-200 transition-colors cursor-pointer"
        >
          Select File
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
