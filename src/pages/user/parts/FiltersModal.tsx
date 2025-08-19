import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { UserFilter } from '@shared/api/data.models';
import { FilterPanelWrapper } from '@components/Filters/FilterPanelWrapper';
import { Select } from '@components/Select';
import { FilterFooter } from '@components/Filters/FilterFooter';
import { BaseSideModal } from '@components/BaseSideModal';

type FiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: UserFilter) => void;
  onReset: () => void;
  initialFilters: UserFilter;
};

export const FiltersModal: React.FC<FiltersModalProps> = ({
  isOpen,
  onClose,
  onApply,
  onReset,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<UserFilter>(initialFilters);
  const { t } = useTranslation();

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleApply = () => {
    onApply(filters);
  };

  const roleOptions = [
    { label: t('user'), value: 'user' },
    { label: t('agent'), value: 'agent' },
    { label: t('admin'), value: 'admin' },
  ];

  const countingPostOptions = [
    { label: t('start'), value: 'start' },
    { label: t('end'), value: 'end' },
  ];

  return (
    <BaseSideModal
      headerText={t('filters')}
      isOpen={isOpen}
      onCloseHandler={onClose}
      className='flex h-screen w-[350px] flex-col bg-[#F4F4F6]'
      headerClassName='sticky top-0 z-[21] backdrop-blur-[96px] bg-[#FFFFFFA3] pr-4'
    >
      <div className='flex flex-1 flex-col justify-between'>
        <div className='flex-1 space-y-6 overflow-y-auto px-4 pt-4'>
          <FilterPanelWrapper label={t('role')}>
            <Select
              options={roleOptions}
              selected={
                filters.role === undefined ? [] :
                roleOptions.filter(o => o.value === filters.role)
              }
              onChange={(val) =>
                setFilters((prev: UserFilter) => ({
                  ...prev,
                  role: val[0]?.value ?? undefined,
                }))
              }
              getOptionKey={(option) => option.value.toString()}
              getOptionLabel={(option) => option.label}
              disableSearch
              multiSelect={false}
              placeholderKey={t('selectRole')}
            />
          </FilterPanelWrapper>

          <FilterPanelWrapper label={t('countingPost')}>
            <Select
              options={countingPostOptions}
              selected={
                filters.countingPost === undefined ? [] :
                countingPostOptions.filter(o => o.value === filters.countingPost)
              }
              onChange={(val) =>
                setFilters((prev: UserFilter) => ({
                  ...prev,
                  countingPost: (val[0]?.value as 'start' | 'end') ?? undefined,
                }))
              }
              getOptionKey={(option) => option.value.toString()}
              getOptionLabel={(option) => option.label}
              disableSearch
              multiSelect={false}
              placeholderKey={t('selectCountingPost')}
            />
          </FilterPanelWrapper>
        </div>
        <div>
          <FilterFooter onReset={onReset} onApply={handleApply} />
        </div>
      </div>
    </BaseSideModal>
  );
};
