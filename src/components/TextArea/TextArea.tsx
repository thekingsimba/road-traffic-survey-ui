import type { DetailedHTMLProps, TextareaHTMLAttributes, FC } from 'react';
import { twMerge } from 'tailwind-merge';

type TextAreaProps = {
  errorMsg?: string;
  wrapperClassName?: string;
} & DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;

export const TextArea: FC<TextAreaProps> = ({
  errorMsg,
  wrapperClassName,
  className,
  placeholder,
  disabled,
  onChange,
  ...props }) => {

  return (
    <div className={twMerge('relative w-full', wrapperClassName)}>
      <textarea
        onChange={onChange}
        className={twMerge('rounded-lg bg-[#F9F9FA] border-[#DDDFE4] focus:bg-white placeholder:text-secondary',
          `${disabled && 'text-[#C3C6CC] bg-[#F4F4F6] shadow-[inset_0px_1px_3px_0px_#0000000A] placeholder:text-[#C3C6CC]'}`,
          `${(errorMsg || errorMsg === '') && 'border-error ring-[3px] ring-[#F03D3D3D]'}`,
          className)}
        disabled={disabled}
        placeholder={placeholder}
        {...props}
        autoComplete='off'
      />
      { errorMsg
        ? <p role='alert' data-testid='textarea-error-alert' className='pt-[4px] text-[13px] text-error first-letter:capitalize'>
          { errorMsg }
        </p>
        : null }
    </div>
  );
};
