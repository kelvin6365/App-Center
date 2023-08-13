import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import classNames from 'classnames';

const TextInput = React.forwardRef<
  HTMLInputElement,
  ReturnType<UseFormRegister<any>> & {
    label?: string | null;
    errors: any;
    loading: boolean;
    icon?: React.ReactNode | null;
    placeholder?: string | null;
    type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'url';
  }
>(
  (
    {
      onChange,
      onBlur,
      name,
      label,
      errors,
      loading,
      icon,
      placeholder,
      type = 'text',
    },
    ref
  ) => {
    return (
      <div>
        {label && (
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </label>
        )}
        <div className="relative mb-2">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            className={classNames(
              'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
              icon != null && 'pl-10'
            )}
            name={name}
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder ?? ''}
            disabled={loading}
            type={type}
          />
        </div>
        {errors[name] && (
          <p className={'text-red-500 text-sm p-1'}>{errors[name]?.message}</p>
        )}
      </div>
    );
  }
);

export default TextInput;
