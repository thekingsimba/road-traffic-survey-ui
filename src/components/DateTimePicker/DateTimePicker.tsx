import { useState, useEffect } from 'react';
import { Input } from '@components/Input/Input';


interface DateTimePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const DateTimePicker = ({ 
  label, 
  value, 
  onChange, 
  disabled = false 
}: DateTimePickerProps) => {
  const [dateValue, setDateValue] = useState('');
  const [timeValue, setTimeValue] = useState('');

  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value);
        setDateValue(date.toISOString().split('T')[0]);
        setTimeValue(date.toTimeString().slice(0, 5));
      } catch (error) {
        console.error('Invalid date value:', value);
      }
    } else {
      setDateValue('');
      setTimeValue('');
    }
  }, [value]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDateValue(newDate);
    
    if (newDate && timeValue) {
      const combinedDateTime = new Date(`${newDate}T${timeValue}`);
      onChange(combinedDateTime.toISOString());
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);
    
    if (dateValue && newTime) {
      const combinedDateTime = new Date(`${dateValue}T${newTime}`);
      onChange(combinedDateTime.toISOString());
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[13px] text-secondary mb-2 block">{label}</label>
      <div className="flex space-x-2">
        <Input
          type="date"
          value={dateValue}
          onChange={handleDateChange}
          disabled={disabled}
          className="flex-1"
        />
        <Input
          type="time"
          value={timeValue}
          onChange={handleTimeChange}
          disabled={disabled}
          className="flex-1"
        />
      </div>
    </div>
  );
};
