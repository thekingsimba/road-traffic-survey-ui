import { cva } from 'class-variance-authority';
import { type FC, createElement } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import type { TypographyProps } from './types';

const styles = cva('text-inherit', {
  variants: {
    weight: {
      regular: 'font-normal',
      bold: 'font-bold',
    },
    color: {
      regular: 'text-regular',
      secondary: 'text-secondary'
    }
  },
});

/**
 * Primary component for any kind of typography on page.
 * @example
 * ```tsx
 * <Typography text="login" />
 * ```
 */
export const Typography: FC<TypographyProps> = ({
  id,
  text,
  tag = 'p',
  weight = 'regular',
  color = 'regular',
  interpolationsParams = {},
  className,
  ...rest
}) => {
  const { t } = useTranslation();
  const translatedText = t(text, { ...interpolationsParams });

  return createElement(
    tag,
    {
      'id': id,
      'className': twMerge(styles({ weight, color }), 'font-sans', className),
      ...rest
    },
    translatedText,
  );
};
