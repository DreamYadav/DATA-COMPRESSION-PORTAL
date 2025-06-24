import React, { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { FileInfo } from '../types';
import { readFileAsArrayBuffer, formatFileSize } from '../utils/fileUtils';

interface FileUploaderProps {
  onFileSelect: (file: FileInfo) => void;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, disabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);

  const handleFile = useCallback(async (file: File) => {
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const fileInfo: FileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        data: new Uint8Array(arrayBuffer)
      };
      setSelectedFile(fileInfo);
      onFileSelect(fileInfo);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }, [onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-blue-400 bg-blue-50/10 scale-105'
            : 'border-gray-600 hover:border-gray-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('fileInput')?.click()}
      >
        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={handleFileInput}
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-500' : 'bg-gray-700'} transition-colors`}>
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {dragActive ? 'Drop your file here' : 'Upload a file'}
            </h3>
            <p className="text-gray-400">
              Drag and drop or click to select a file to compress
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports all file types
            </p>
          </div>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <File className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{selectedFile.name}</p>
                <p className="text-gray-400 text-sm">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};