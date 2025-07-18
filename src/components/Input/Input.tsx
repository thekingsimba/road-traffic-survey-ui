import type { FC } from 'react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import type { InputProps } from './types';
import { Icon } from '@components/Icon';
import { useTranslation } from 'react-i18next';

export const Input: FC<InputProps> = ({
  errorMsg,
  wrapperClassName,
  className,
  onChange,
  disabled,
  iconId,
  iconClassName,
  visibilityToggle,
  visibilityButtonClassName,
  visibilityIconClassName,
  maxLength = 50,
  type = 'text',
  ...props }) => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={twMerge('relative w-full', wrapperClassName)}>
      {iconId ? <Icon id={iconId} className={twMerge(`absolute text-secondary-low left-4 top-2 z-[1] ${disabled && 'text-[#C3C6CC]'}`, iconClassName)} /> : null}

      <input
        onChange={onChange}
        className={twMerge('rounded-xl bg-[#F9F9FA] border-[#DDDFE4] focus:bg-white placeholder:text-secondary focus:ring-[3px]',
          `${(errorMsg || errorMsg === '') && 'border-error ring-[3px] ring-[#F03D3D3D]'}`,
          `${disabled && 'text-[#C3C6CC] bg-[#F4F4F6] shadow-[inset_0px_1px_3px_0px_#0000000A] placeholder:text-[#C3C6CC]'}`,
          `${iconId && 'pl-11'}`,
          `${visibilityToggle && 'pr-11'}`,
          className)}
        type={visibilityToggle && !isVisible ? 'password' : type}
        disabled={disabled}
        {...props}
        autoComplete='off'
        maxLength={maxLength}
      />

      {visibilityToggle ?
        <button
          type='button'
          className={twMerge('size-fit absolute text-secondary-low top-[14px] right-4 cursor-pointer', visibilityButtonClassName)}
          onClick={() => setIsVisible(prev => !prev)}
          aria-label={isVisible ? t('hidePassword') : t('showPassword')}
        >
          <Icon
            id={isVisible ? 'eye' : 'eye-hide'}
            className={twMerge('size-5', visibilityIconClassName)}
          />
        </button> : null
      }

      {errorMsg
        ? (
          <div className='flex items-center space-x-[5px] pt-1 text-error'>
            <Icon id='warning' className='h-[13.5px] w-[15px]' aria-hidden='true' />
            <p role='alert' className='text-[13px] first-letter:capitalize'>
              {errorMsg}
            </p>
          </div>
        ) : null }
    </div>
  );
};
