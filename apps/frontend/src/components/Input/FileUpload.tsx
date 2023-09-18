import React, { useState } from 'react';
import { UseFormRegister } from 'react-hook-form';

const FileUpload = React.forwardRef<
  HTMLInputElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ReturnType<UseFormRegister<any>> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors: any;
    loading: boolean;
    accept?: string;
  }
>(({ onChange, onBlur, name, errors, loading, accept = 'image/*' }, ref) => {
  const [files, setFiles] = useState<FileList | null>(null);
  return (
    <>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          {(files?.length ?? 0) > 0 ? (
            <div className="relative flex h-full pointer-events-none">
              {['jpg', 'jpeg', 'png'].indexOf(
                files?.[0].name.split('.').pop() ?? ''
              ) !== -1 ? (
                <img
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  src={URL.createObjectURL(files![0])}
                  alt="preview"
                  className="h-full p-8 mx-auto"
                />
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                <center className="px-4 my-auto">{files![0].name}</center>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
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
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 1024x1024px)
              </p>
            </div>
          )}
          <input
            id="dropzone-file"
            type="file"
            className="absolute top-0 bottom-0 left-0 right-0 opacity-0"
            accept={accept}
            name={name}
            ref={ref}
            onChange={(e) => {
              onChange(e);
              setFiles(e.target?.files);
            }}
            onBlur={onBlur}
            disabled={loading}
          />
        </label>
      </div>
      {errors[name] != null && (
        <p className={'text-red-500 text-sm p-1'}>{errors[name]?.message}</p>
      )}
    </>
  );
});

export default FileUpload;
