import type { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type CheckboxProps = {
  className?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

/**
 * Simple UI component for displaying boolean. `stateValue` should be handled outside of Checkbox itself
 * @example
 * ```tsx
 * const App = () => {
 *  const [checked, setChecked] = useState(false);
 *  return <Checkbox checked={checked} />
 * }
 * ```
 */
export const Checkbox: FC<CheckboxProps> = ({ className, disabled, ...props }) => (
  <input
    type='checkbox'
    className={twMerge(
      'rounded-[5px]',
      `${disabled && 'hover:border-[#C3C6CC] text-secondary-low cursor-not-allowed'}`,
       className)}
    disabled={disabled}
    {...props}
  />
);
