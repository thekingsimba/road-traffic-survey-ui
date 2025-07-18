import type { HTMLAttributes } from 'react';

export type TextWeights = 'regular' | 'bold';

export type TextColors = 'regular' | 'secondary'

export type TypographyProps =
{
    id?: string;
    tag?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'span' | 'legend' | 'label';
    className?: string;
    text: string;
    weight?: TextWeights;
    color?: TextColors;
    interpolationsParams?: Record<string, string | number>;
  } & HTMLAttributes<HTMLElement>;
