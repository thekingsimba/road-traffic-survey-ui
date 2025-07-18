import React from 'react';

type Props = {
  label: string;
  children: React.ReactNode;
};

export const FilterPanelWrapper: React.FC<Props> = ({ label, children }) => (
  <div className='rounded-2xl border bg-white p-4 shadow-sm'>
    <label className='mb-2 block text-base font-medium'>{label}</label>
    {children}
  </div>
);
