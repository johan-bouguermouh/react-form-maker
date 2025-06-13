'use client';

import { useState } from 'react';
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
  FileUploaderProps,
} from '@/components/ReactFormMaker/enhancements/FileUploader/FileUploader';
import { Paperclip } from 'lucide-react';
import { DropzoneOptions } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface FileSvgDrawProps {
  placeholder?: string | undefined;
}

const FileSvgDraw = ({ placeholder }: FileSvgDrawProps) => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {placeholder || 'Max file size: 4MB'}
      </p>
    </>
  );
};

export interface DefaultFileUploaderProps
  extends Omit<FileUploaderProps, 'dropzoneOptions'>,
    React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  value: File[] | null;
  onValueChange: (value: File[] | null) => void;
  dropzoneOptions?: DropzoneOptions;
  className?: string;
}

const DefaultFileUploader = ({
  placeholder,
  ...props
}: DefaultFileUploaderProps) => {
  const [files, setFiles] = useState<File[] | null>(props.value || null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const handleOnchange = (files: File[] | null) => {
    setFiles(files);
    if (props.onValueChange) props.onValueChange(files);
  };

  return (
    <FileUploader
      value={files}
      onValueChange={handleOnchange}
      dropzoneOptions={props.dropzoneOptions || dropZoneConfig}
      className={cn(
        'relative bg-background rounded-lg p-2 border border-input shadow-sm',
        props.className,
      )}
    >
      <FileInput className="outline-dashed outline-1 outline-white">
        <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
          <FileSvgDraw placeholder={placeholder} />
        </div>
      </FileInput>
      <FileUploaderContent>
        {files &&
          files.length > 0 &&
          files.map((file, i) => (
            <FileUploaderItem key={i} index={i}>
              <Paperclip className="h-4 w-4 stroke-current" />
              <span>{file.name}</span>
            </FileUploaderItem>
          ))}
      </FileUploaderContent>
    </FileUploader>
  );
};

export default DefaultFileUploader;
