import { type FC } from 'react';
import { FilterPanelWrapper } from '@components/Filters/FilterPanelWrapper';
import { Input } from '@components/Input';
import { DateTime } from 'ts-luxon';
import { useTranslation } from 'react-i18next';

type Props = {
  label: string;
  beginKey: string;
  endKey: string;
  values: Record<string, string | null | undefined>;
  onChange: (field: string, isoUtc?: string | null) => void;
};

export const UtcDateTimeRangePicker: FC<Props> = ({ label, beginKey, endKey, values, onChange }) => {

  const { t } = useTranslation();
  const getDatePart = (date: string | null | undefined) =>
    date ? DateTime.fromISO(date).toISODate() : '';

  const getTimePart = (date: string | null | undefined) =>
    date ? DateTime.fromISO(date).toFormat('HH:mm') : '00:00';

  const handleDateChange = (field: string, value: string) => {
    const prevValue = values[field];
    const currentDate = DateTime.fromISO(value);

    const updated = prevValue
      ? currentDate.set({
          hour: DateTime.fromISO(prevValue).hour,
          minute: DateTime.fromISO(prevValue).minute,
        })
      : currentDate;

    onChange(field, updated.toISO());
  };

  const handleTimeChange = (field: string, value: string) => {
    const prevValue = values[field];
    if (!prevValue)
      return;

    const [hour = 0, minute = 0] = value.split(':').map(Number);

    onChange(field, DateTime.fromISO(prevValue).set({ hour, minute }).toISO());
  };

  return (
    <FilterPanelWrapper label={label}>
      {/* BEGIN */}
      <label className='text-[#5B616D] '>{t('from')}</label>
      <div className='my-2 flex space-x-2'>
        <Input
          type='date'
          value={getDatePart(values[beginKey]) ?? ''}
          onChange={(e) => handleDateChange(beginKey, e.target.value)}
          className='w-full'
          max='9999-01-01'
        />
        <Input
          value={getTimePart(values[beginKey]) ?? '00:00'}
          type='time'
          onChange={(e) => handleTimeChange(beginKey, e.target.value)}
          className='w-full'
          disabled={!values[beginKey]}
        />
      </div>

      {/* END */}
      <label className='text-[#5B616D] '>{t('to')}</label>
      <div className='mt-2 flex space-x-2'>
        <Input
          type='date'
          value={getDatePart(values[endKey]) ?? ''}
          onChange={(e) => handleDateChange(endKey, e.target.value)}
          className='w-full'
          max='9999-01-01'
        />
        <Input
          value={getTimePart(values[endKey]) ?? '00:00'}
          type='time'
          onChange={(e) => handleTimeChange(endKey, e.target.value)}
          className='w-full'
          disabled={!values[endKey]}
        />
      </div>
    </FilterPanelWrapper>
  );
};
