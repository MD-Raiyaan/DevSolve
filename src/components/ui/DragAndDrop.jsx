"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  FileIcon,
  ImageIcon,
  FileText,
  FileArchive,
  FileAudio,
  FileVideo,
  X,
} from "lucide-react";

const getIconForType = (type) => {
  if (type.startsWith("image/"))
    return <ImageIcon className="w-8 h-8 text-blue-400" />;
  if (type.startsWith("audio/"))
    return <FileAudio className="w-8 h-8 text-pink-400" />;
  if (type.startsWith("video/"))
    return <FileVideo className="w-8 h-8 text-purple-400" />;
  if (type.includes("pdf"))
    return <FileText className="w-8 h-8 text-red-400" />;
  if (type.includes("zip") || type.includes("compressed"))
    return <FileArchive className="w-8 h-8 text-yellow-400" />;
  return <FileIcon className="w-8 h-8 text-gray-500" />;
};


const FileDropzone = ({ onFilesUpload, previewFiles = [] }) => {
  const [files, setFiles] = useState([]);

 useEffect(() => {
  if (!previewFiles || previewFiles.length === 0) return;

  const fetchFileObjects = async () => {
    try {
      const previews = await Promise.all(
        previewFiles.map(async (fileData) => {
          const response = await fetch(fileData.url);
          const blob = await response.blob();

          const file = new File([blob], fileData.name, {
            type: fileData.type,
            lastModified: new Date().getTime(),
          });

          return {
            file,
            preview: fileData.url,
          };
        })
      );

      setFiles(previews);
    } catch (error) {
      console.error("Failed to fetch and create File objects", error);
    }
  };

  fetchFileObjects();
}, [previewFiles]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const updatedFiles = acceptedFiles.map((file) => {
        const preview = file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null;
        return { file, preview };
      });

      const newFiles = [...files, ...updatedFiles];
      setFiles(newFiles);
      onFilesUpload?.(newFiles.map((f) => f.file));
    },
    [files, onFilesUpload]
  );

  const removeFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
    onFilesUpload?.(updated.map((f) => f.file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [], // Accept only image types
    },
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-6 transition cursor-pointer
        flex flex-col items-center justify-center text-center
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
            : "border-gray-300 dark:border-gray-600"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <FileIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          <p className="text-gray-600 dark:text-gray-300">
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop files or click to upload"}
          </p>
          <p className="text-xs text-gray-400 text-center">
            Supports multiple image files (PNG, JPG, etc.)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {files.map((f, index) => (
            <div
              key={index}
              className="relative border p-3 rounded-lg shadow-sm bg-white dark:bg-gray-900"
            >
              {f.preview && f.file.type?.startsWith("image/") ? (
                <img
                  src={f.preview}
                  alt={f.file.name}
                  className="w-full h-40 object-contain rounded-md"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  {getIconForType(f.file.type || "")}
                  <p
                    className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center mt-2 truncate w-full"
                    title={f.file.name}
                  >
                    {f.file.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    ({f.file.type || "Unknown"},{" "}
                    {f.file.size ? (f.file.size / 1024).toFixed(1) : "?"} KB)
                  </p>
                </div>
              )}

              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-1 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileDropzone;