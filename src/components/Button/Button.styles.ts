import { cva } from 'class-variance-authority';

export const styles = cva(
  'relative flex size-fit flex-row items-center rounded-xl px-6 py-2 text-lg font-bold capitalize outline-[3px] transition focus:outline disabled:cursor-not-allowed disabled:bg-[#EBECF0] disabled:text-[#C3C6CC] disabled:outline-none',
  {
    variants: {
      intent: {
        primary: [
          'border border-black/25 bg-primary text-white outline-primary/25',
          'hover:bg-primary-high',
          'disabled:button-shadow disabled:border-none'
        ],
        'primary-light': [
          'bg-[#00629B1A] text-primary-high outline-[#00629B3D]',
          'hover:bg-[#00629B29]',
          'button-shadow'
        ],
        secondary: [
          'bg-[#F4F4F6] text-secondary outline-[#DDDFE4]',
          'hover:bg-[#EBECF0]',
          'button-shadow',
        ],
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  },
);
