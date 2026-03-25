import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = ({ label, id, error, className, ...props }) => {
  return (
    <div className={twMerge(clsx("flex flex-col space-y-1.5", className))}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={clsx(
          "px-3 py-2 bg-white border outline-none shadow-sm border-gray-300 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 block w-full rounded-xl sm:text-sm focus:ring-1 transition-all",
          error && "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
