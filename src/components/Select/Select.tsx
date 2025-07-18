import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

type SelectProps<T> = {
  options: T[];
  selected: T[];
  onChange: (values: T[]) => void;
  label?: string;
  placeholderKey?: string;
  getOptionKey: (option: T) => string;
  getOptionLabel: (option: T) => string;
  disableSearch?: boolean;
  multiSelect?: boolean;
  fixedFirst?: boolean;
};

export function Select<T>({
  options,
  selected,
  onChange,
  label,
  placeholderKey = 'selectFilter',
  getOptionKey,
  getOptionLabel,
  disableSearch = false,
  multiSelect = true,
  fixedFirst = false,
}: SelectProps<T>) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropUp, setDropUp] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current && !disableSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen, disableSearch]);

  const handleSelect = (option: T) => {
    const optionKey = getOptionKey(option);
    const isSelected = selected.some((s) => getOptionKey(s) === optionKey);

    if (multiSelect) {
      if (isSelected) {
        if (fixedFirst && getOptionKey(selected[0]) === optionKey) return;
        onChange(selected.filter((s) => getOptionKey(s) !== optionKey));
      } else {
        onChange([...selected, option]);
      }
    } else {
      onChange([option]);
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!fixedFirst) onChange([]);
    else onChange([selected[0]]);
  };

  const filteredOptions = options.filter((opt) =>
    getOptionLabel(opt).toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = () => {
    if (!isOpen && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const dropdownHeight = 150; // Approximate dropdown height
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      setDropUp(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight);
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${!label ? 'mb-2' : ''}`}>
      {label ? <label className='mb-1 block p-1 text-sm font-medium text-gray-700'>{label}</label> : null}

      <button
        type='button'
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        onClick={handleToggle}
        className={twMerge(
          'flex w-full items-center justify-between rounded-xl border bg-[#F9F9FA] px-3 py-2 text-sm transition-all duration-150',
          'border-[#DDDFE4] placeholder:text-secondary focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#0066FF33]',
          isOpen && 'ring-[3px] ring-[#0066FF33] border-blue-500'
        )}
      >
        <span className={`truncate p-1 ${selected.length ? 'text-black-700' : 'text-[15px] text-gray-500'}`}>
          {selected.length ? selected.map((s) => getOptionLabel(s)).join(', ') : t(placeholderKey)}
        </span>
        <div className='flex items-center space-x-2'>
          {selected.length > 0 && (!fixedFirst || selected.length > 1) && (
            <button
              type='button'
              onClick={handleClear}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClear(e)}
              className='text-gray-400 hover:text-red-500 focus:outline-none'
              title={t('clear')}
              aria-label={t('clear') ?? 'Clear'}
            >
              ✕
            </button>
          )}
          <svg
            className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </div>
      </button>

      {isOpen ? <div
        className={twMerge(
            'absolute z-10 w-full overflow-hidden rounded-xl border bg-white shadow-lg',
            dropUp ? 'bottom-full mb-1' : 'mt-1'
          )}
                >
        {!disableSearch && (
        <div className='border-b bg-white px-3 py-2'>
          <input
            ref={searchInputRef}
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search') ?? 'Search...'}
            className='w-full rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500'
            maxLength={50}
          />
        </div>
          )}

        <div className='max-h-60 overflow-y-auto'>
          {filteredOptions.length === 0 ? (
            <div className='p-3 text-sm text-gray-500'>{t('noResultsFound')}</div>
            ) : (
              filteredOptions.map((option) => {
                const optionKey = getOptionKey(option);
                const isChecked = selected.some((s) => getOptionKey(s) === optionKey);

                return (
                  <div
                    key={optionKey}
                    className={`flex cursor-pointer items-center px-4 py-2 text-sm hover:bg-gray-100 ${
                      !multiSelect && isChecked ? 'bg-blue-50 font-medium text-blue-600' : ''
                    }`}
                    onClick={() => handleSelect(option)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelect(option)}
                    role='option'
                    tabIndex={0}
                    aria-selected={isChecked}
                  >
                    {multiSelect ? <input
                      type='checkbox'
                      checked={isChecked}
                      onChange={() => handleSelect(option)}
                      className='mr-2'
                      disabled={fixedFirst ? getOptionKey(selected[0]) === optionKey : false}
                                   /> : null}
                    <span>{getOptionLabel(option)}</span>
                  </div>
                );
              })
            )}
        </div>
      </div> : null}
    </div>
  );
}
