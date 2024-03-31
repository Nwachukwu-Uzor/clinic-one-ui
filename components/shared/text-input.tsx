import React, { forwardRef, ComponentProps } from "react";

type Props = {
  label?: string | React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  noError?: boolean;
} & ComponentProps<"input">;

export const TextInput = forwardRef<HTMLInputElement, Props>(
  (
    { label, id, rightIcon, leftIcon, error, noError = false, ...props },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label ? (
          <label htmlFor={id} className="font-medium text-sm">
            {label}
          </label>
        ) : null}
        <div className="relative">
          {leftIcon ? (
            <span className="absolute left-1 z-20 top-[50%] -translate-y-[50%] text-fade">
              {leftIcon}
            </span>
          ) : null}
          <input
            {...props}
            ref={ref}
            className={`relative w-full bg-gray-100 py-1.5 px-2 border-none outline-none focus:border-none focus:outline-none focus:ring-[0.5px] focus:ring-purple-600 rounded-md duration-50 placeholder:opacity-70 placeholder:text-xs disabled:cursor-not-allowed disabled:opacity-70 placeholder:text-fade ${
              rightIcon ? "pr-6" : ""
            } ${leftIcon ? "pl-6" : ""}`}
          />
          {rightIcon ? (
            <span className="absolute right-1 z-20 top-[50%] -translate-y-[50%] text-fade">
              {rightIcon}
            </span>
          ) : null}
        </div>
        {noError ? null : (
          <p className="h-1 mt-0.5 text-red-500 text-xs">{error}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
