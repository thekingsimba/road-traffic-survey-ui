import { useState, useEffect } from 'react';
import { BaseModal } from '@components/BaseModal';
import { Button } from '@components/Button/Button';
import { Input } from '@components/Input/Input';

import { Typography } from '@components/Typography';
import { useTranslation } from 'react-i18next';
import { createSurvey, getAgents } from '../api';
import type { CreateSurveyRequest } from '@shared/api/data.models';
import { DateTimePicker } from '@components/DateTimePicker/DateTimePicker';

type CreateSurveyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
};

export const CreateSurveyModal = ({ isOpen, onClose, onComplete }: CreateSurveyModalProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<Array<{ id: string; full_name: string; email: string }>>([]);
  const [formData, setFormData] = useState<CreateSurveyRequest>({
    name: '',
    startPoint: '',
    endPoint: '',
    scheduledStartTime: '',
    scheduledEndTime: '',
    startPointAgent: '',
    endPointAgent: ''
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await getAgents();
        if (response.results?.docs && Array.isArray(response.results.docs)) {
          setAgents(response.results.docs);
        } else {
          setAgents([]);
        }
      } catch (error) {
        console.error('Failed to fetch agents:', error);
        setAgents([]);
      }
    };

    if (isOpen) {
      fetchAgents();
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof CreateSurveyRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChangeEvent = (field: keyof CreateSurveyRequest, e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createSurvey(formData);
      onComplete();
    } catch (error) {
      console.error('Failed to create survey:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        startPoint: '',
        endPoint: '',
        scheduledStartTime: '',
        scheduledEndTime: '',
        startPointAgent: '',
        endPointAgent: ''
      });
      onClose();
    }
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.startPoint.trim() !== '' &&
      formData.endPoint.trim() !== '' &&
      formData.scheduledStartTime !== '' &&
      formData.scheduledEndTime !== ''
    );
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onCloseHandler={handleClose}
      header={<Typography tag='h2' text={t('createSurvey')} weight='bold' className='text-[22px]' />}
      className='w-[600px] max-h-[85vh]'
    >
      <div className='p-6 overflow-y-auto max-h-[calc(85vh-120px)]'>
        <div className='mb-6'>
          <Typography text={t('createSurveyDescription')} className='text-gray-600 mt-2' />
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-[13px] text-secondary mb-2 block'>{t('surveyName')}</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChangeEvent('name', e)}
                required
                placeholder={t('enterSurveyName')}
              />
            </div>

            <div>
              <label className='text-[13px] text-secondary mb-2 block'>{t('startPoint')}</label>
              <Input
                value={formData.startPoint}
                onChange={(e) => handleInputChangeEvent('startPoint', e)}
                required
                placeholder={t('enterStartPoint')}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-[13px] text-secondary mb-2 block'>{t('endPoint')}</label>
              <Input
                value={formData.endPoint}
                onChange={(e) => handleInputChangeEvent('endPoint', e)}
                required
                placeholder={t('enterEndPoint')}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <DateTimePicker
              label={t('scheduledStartTime')}
              value={formData.scheduledStartTime}
              onChange={(value) => handleInputChange('scheduledStartTime', value)}
            />

            <DateTimePicker
              label={t('scheduledEndTime')}
              value={formData.scheduledEndTime}
              onChange={(value) => handleInputChange('scheduledEndTime', value)}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-[13px] text-secondary mb-2 block'>{t('startPointAgent')}</label>
              <select
                value={formData.startPointAgent}
                onChange={(e) => handleInputChange('startPointAgent', e.target.value)}
                className='h-12 w-full rounded-xl border border-gray-300 px-3 text-[15px]'
                aria-label={t('startPointAgent')}
              >
                <option value=''>{t('selectStartPointAgent')}</option>
                {Array.isArray(agents) && agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.full_name} ({agent.email})
                  </option>
                ))}
              </select>
              <p className='text-[12px] text-gray-500 mt-1'>{t('startPointAgentHelper')}</p>
            </div>

            <div>
              <label className='text-[13px] text-secondary mb-2 block'>{t('endPointAgent')}</label>
              <select
                value={formData.endPointAgent}
                onChange={(e) => handleInputChange('endPointAgent', e.target.value)}
                className='h-12 w-full rounded-xl border border-gray-300 px-3 text-[15px]'
                aria-label={t('endPointAgent')}
              >
                <option value=''>{t('selectEndPointAgent')}</option>
                {Array.isArray(agents) && agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.full_name} ({agent.email})
                  </option>
                ))}
              </select>
              <p className='text-[12px] text-gray-500 mt-1'>{t('endPointAgentHelper')}</p>
            </div>
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <Button
              type='button'
              intent='secondary'
              onClick={handleClose}
              disabled={loading}
              text={t('cancel')}
            />
            <Button
              type='submit'
              disabled={!isFormValid() || loading}
              text={t('create')}
            />
          </div>
        </form>
      </div>
    </BaseModal>
  );
};
