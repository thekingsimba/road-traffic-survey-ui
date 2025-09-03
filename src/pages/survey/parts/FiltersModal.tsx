import { useState } from 'react';
import { BaseModal } from '@components/BaseModal';
import { Button } from '@components/Button/Button';

import { Typography } from '@components/Typography';
import { useTranslation } from 'react-i18next';
import type { SurveyFilter } from '@shared/api/data.models';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: SurveyFilter) => void;
  onReset: () => void;
  initialFilters: SurveyFilter;
}

export const FiltersModal = ({ 
  isOpen, 
  onClose, 
  onApply, 
  onReset, 
  initialFilters 
}: FiltersModalProps) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<SurveyFilter>(initialFilters);

  const handleFilterChange = (field: keyof SurveyFilter, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    onReset();
    setFilters(initialFilters);
  };

  const handleClose = () => {
    setFilters(initialFilters);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onCloseHandler={handleClose}
      header={<Typography tag="h2" text={t('filters')} weight="bold" className="text-[22px]" />}
      className="w-[400px]"
    >
      <div className="p-6">
        <div className="mb-6">
          <Typography text={t('filterSurveysDescription')} className="text-gray-600 mt-2" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[13px] text-secondary mb-2 block">{t('status')}</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value as 'active' | 'inactive' | 'archived' | undefined)}
              className="h-12 w-full rounded-xl border border-gray-300 px-3 text-[15px]"
              aria-label={t('status')}
            >
              <option value="">{t('allStatuses')}</option>
              <option value="active">{t('active')}</option>
              <option value="inactive">{t('inactive')}</option>
              <option value="archived">{t('archived')}</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              intent="secondary"
              onClick={handleReset}
              text={t('reset')}
            />
            <Button
              type="button"
              intent="secondary"
              onClick={handleClose}
              text={t('cancel')}
            />
            <Button
              onClick={handleApply}
              text={t('apply')}
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
