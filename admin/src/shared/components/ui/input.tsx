import * as React from "react";
import { cn } from "@shared/lib/utils";
import Search from "@assets/icons/search.svg";
import SearchWhite from "@assets/icons/search_white.svg";
import { IMaskInput } from 'react-imask';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasButton?: boolean;
  onButtonClick?: () => void;
  width?: string;
  height?: string;
  isFocused?: boolean;
  mask?: string;
  maskChar?: string | null;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      hasButton,
      onButtonClick,
      width = "",
      height = "",
      isFocused,
      mask,
      maskChar = null,
      ...props
    },
    ref
  ) => {
    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    return (
      <div className="relative flex items-center">
        {mask ? (
          <IMaskInput
            mask={mask}
            placeholderChar={maskChar || '_'}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-l-md border bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
              className,
              hasButton && "rounded-r-none"
            )}
            inputRef={ref}
            {...props}
            value={props.value?.toString() || ''}
          />
        ) : (
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-l-md border bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
              className,
              hasButton && "rounded-r-none"
            )}
            ref={ref}
            {...props}
          />
        )}
        {hasButton && (
          <button
            style={{ width, height }}
            type="button"
            onClick={onButtonClick}
            onMouseDown={handleMouseDown}
            className={cn(
              "flex items-center justify-center h-10 w-10 bg-2 rounded-r-md text-muted-foreground hover:text-primary border border-l-0 border-input",
              isFocused && "bg-[#00617A]"
            )}
          >
            {!isFocused ? (
              <Search className="opacity-50" />
            ) : (
              <SearchWhite />
            )}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };