import React, { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, className, ...props }, ref) => {
    const inputStyles = clsx(
      'px-4 py-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
      error
        ? 'border-red-500 focus:border-red-500'
        : 'border-slate-300 focus:border-blue-500',
      props.disabled && 'bg-slate-100 cursor-not-allowed',
      fullWidth && 'w-full',
      className
    );

    return (
      <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input ref={ref} className={inputStyles} {...props} />
        {error && <span className="text-sm text-red-500">{error}</span>}
        {helperText && !error && (
          <span className="text-sm text-slate-500">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

