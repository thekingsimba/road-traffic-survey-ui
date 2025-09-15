import { useState, useEffect } from 'react';
import { BaseModal } from '@components/BaseModal';
import { Button } from '@components/Button/Button';
import { Input } from '@components/Input/Input';

import { Typography } from '@components/Typography';
import { useTranslation } from 'react-i18next';
import { updateSurvey, getAgents } from '../api';
import type { Survey, UpdateSurveyRequest } from '@shared/api/data.models';
import { DateTimePicker } from '@components/DateTimePicker/DateTimePicker';

type EditSurveyModalProps = {
  survey: Survey;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
};

export const EditSurveyModal = ({ survey, isOpen, onClose, onComplete }: EditSurveyModalProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<Array<{ id: string; full_name: string; email: string }>>([]);
  const [formData, setFormData] = useState<UpdateSurveyRequest>({
    id: survey.id,
    name: survey.name,
    startPoint: survey.startPoint,
    endPoint: survey.endPoint,
    scheduledStartTime: survey.scheduledStartTime,
    scheduledEndTime: survey.scheduledEndTime,
    startPointAgent: typeof survey.startPointAgent === 'object' ? survey.startPointAgent.id : survey.startPointAgent || '',
    endPointAgent: typeof survey.endPointAgent === 'object' ? survey.endPointAgent.id : survey.endPointAgent || '',
    status: survey.status
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

  useEffect(() => {
    if (survey) {
      setFormData({
        id: survey.id,
        name: survey.name,
        startPoint: survey.startPoint,
        endPoint: survey.endPoint,
        scheduledStartTime: survey.scheduledStartTime,
        scheduledEndTime: survey.scheduledEndTime,
        startPointAgent: typeof survey.startPointAgent === 'object' ? survey.startPointAgent.id : survey.startPointAgent || '',
        endPointAgent: typeof survey.endPointAgent === 'object' ? survey.endPointAgent.id : survey.endPointAgent || '',
        status: survey.status
      });
    }
  }, [survey]);

  const handleInputChange = (field: keyof UpdateSurveyRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChangeEvent = (field: keyof UpdateSurveyRequest, e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateSurvey(formData);
      onComplete();
      onClose();
    } catch (error) {
      console.error('Failed to update survey:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const isFormValid = () => {
    return (
      formData.name?.trim() !== '' &&
      formData.startPoint?.trim() !== '' &&
      formData.endPoint?.trim() !== '' &&
      formData.scheduledStartTime !== '' &&
      formData.scheduledEndTime !== ''
    );
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onCloseHandler={handleClose}
      header={<Typography tag="h2" text={t('editSurvey')} weight="bold" className="text-[22px]" />}
      className="w-[600px] max-h-[80vh]"
    >
      <div className="p-6">
        <div className="mb-6">
          <Typography text={t('editSurveyDescription')} className="text-gray-600 mt-2" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] text-secondary mb-2 block">{t('surveyName')}</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => handleInputChangeEvent('name', e)}
                required
                placeholder={t('enterSurveyName')}
              />
            </div>

            <div>
              <label className="text-[13px] text-secondary mb-2 block">{t('startPoint')}</label>
              <Input
                value={formData.startPoint || ''}
                onChange={(e) => handleInputChangeEvent('startPoint', e)}
                required
                placeholder={t('enterStartPoint')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] text-secondary mb-2 block">{t('startPoint')}</label>
              <Input
                value={formData.startPoint || ''}
                onChange={(e) => handleInputChangeEvent('startPoint', e)}
                required
                placeholder={t('enterStartPoint')}
              />
            </div>

            <div>
              <label className="text-[13px] text-secondary mb-2 block">{t('endPoint')}</label>
              <Input
                value={formData.endPoint || ''}
                onChange={(e) => handleInputChangeEvent('endPoint', e)}
                required
                placeholder={t('enterEndPoint')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateTimePicker
              label={t('scheduledStartTime')}
              value={formData.scheduledStartTime || ''}
              onChange={(value) => handleInputChange('scheduledStartTime', value)}
              required
            />

            <DateTimePicker
              label={t('scheduledEndTime')}
              value={formData.scheduledEndTime || ''}
              onChange={(value) => handleInputChange('scheduledEndTime', value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] text-secondary mb-2 block">{t('startPointAgent')}</label>
              <select
                value={formData.startPointAgent || ''}
                onChange={(e) => handleInputChange('startPointAgent', e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-300 px-3 text-[15px]"
                aria-label={t('startPointAgent')}
              >
                <option value="">{t('selectStartPointAgent')}</option>
                {Array.isArray(agents) && agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.full_name} ({agent.email})
                  </option>
                ))}
              </select>
              <p className="text-[12px] text-gray-500 mt-1">{t('startPointAgentHelper')}</p>
            </div>

            <div>
              <label className="text-[13px] text-secondary mb-2 block">{t('endPointAgent')}</label>
              <select
                value={formData.endPointAgent || ''}
                onChange={(e) => handleInputChange('endPointAgent', e.target.value)}
                className="h-12 w-full rounded-xl border border-gray-300 px-3 text-[15px]"
                aria-label={t('endPointAgent')}
              >
                <option value="">{t('selectEndPointAgent')}</option>
                {Array.isArray(agents) && agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.full_name} ({agent.email})
                  </option>
                ))}
              </select>
              <p className="text-[12px] text-gray-500 mt-1">{t('endPointAgentHelper')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] text-secondary mb-2 block">{t('status')}</label>
              <select
                value={formData.status || ''}
                onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'inactive' | 'archived')}
                className="h-12 w-full rounded-xl border border-gray-300 px-3 text-[15px]"
                aria-label={t('status')}
              >
                <option value="">{t('selectStatus')}</option>
                <option value="active">{t('active')}</option>
                <option value="inactive">{t('inactive')}</option>
                <option value="archived">{t('archived')}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              intent="secondary"
              onClick={handleClose}
              disabled={loading}
              text={t('cancel')}
            />
            <Button
              type="submit"
              disabled={!isFormValid() || loading}
              text={t('update')}
            />
          </div>
        </form>
      </div>
    </BaseModal>
  );
};
