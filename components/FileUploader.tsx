"use client";

import { Input } from "@/components/ui/input";
import { Upload, ImageIcon, X } from "lucide-react";
import { useRef } from "react";
import { FC } from "react";

interface FileUploaderProps {
  icon: React.ReactNode;
  placeholder: string;
  hint: string;
  accept: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const FileUploader: FC<FileUploaderProps> = ({
  icon,
  placeholder,
  hint,
  accept,
  value,
  onChange,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <div
        className={`upload-dropzone ${value ? "upload-dropzone-uploaded" : ""} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleClick}
      >
        {!value ? (
          <>
            <div className="upload-dropzone-icon">{icon}</div>
            <p className="upload-dropzone-text">{placeholder}</p>
            <p className="upload-dropzone-hint">{hint}</p>
          </>
        ) : (
          <div className="flex items-center justify-between w-full px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="shrink-0">{icon}</div>
              <div className="flex-1">
                <p className="upload-dropzone-text text-sm text-left">
                  {value.name}
                </p>
                <p className="upload-dropzone-hint text-xs text-left">
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              className="upload-dropzone-remove"
              onClick={handleRemove}
              type="button"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default FileUploader;
