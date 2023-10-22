import React from 'react';
import {
  Input as MInput,
  Typography,
  InputProps,
} from '@material-tailwind/react';
import { ensuredForwardRef } from 'react-use';
import clsx from 'clsx';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: { [key: string]: any };
  label?: string;
  placeholder?: string;
  readOnly?: boolean;
  enableErrorText?: boolean;
  type?: 'text' | 'password' | 'email' | 'url';
  helperText?: string;
};

const TextInput = ensuredForwardRef<
  HTMLInputElement,
  Props & Omit<InputProps, 'error'>
>(
  (
    {
      error,
      label,
      placeholder,
      readOnly = false,
      enableErrorText = true,
      onChange,
      onBlur,
      value,
      name,
      id,
      defaultValue,
      disabled,
      hidden,
      type = 'text',
      helperText,
      variant,
      icon,
      autoFocus,
    }: Props & Omit<InputProps, 'error' | 'type'>,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <div className={clsx(hidden && 'hidden')}>
        <MInput
          inputRef={ref}
          onChange={onChange}
          onBlur={onBlur}
          label={label}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          containerProps={{
            className: 'min-w-full',
          }}
          type={type}
          disabled={disabled}
          readOnly={readOnly}
          error={!!error}
          name={name}
          hidden={hidden}
          id={id}
          variant={variant}
          icon={icon}
          autoFocus={autoFocus}
          autoComplete={'off'}
        />
        {helperText && (
          <Typography
            variant="small"
            color="gray"
            className="flex items-center gap-1 mt-2 font-normal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 -mt-px"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            {helperText}
          </Typography>
        )}
        {!hidden && enableErrorText && error?.message && (
          <Typography
            variant="small"
            color="red"
            className="flex items-center gap-1 mt-2 font-normal"
          >
            {error.message}
          </Typography>
        )}
      </div>
    );
  }
);

export default TextInput;
