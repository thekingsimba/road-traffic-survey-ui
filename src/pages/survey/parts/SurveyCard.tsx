import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Survey } from '@shared/api/data.models';
import { useUserType } from '@shared/hooks/useUserType';

interface SurveyCardProps {
  survey: Survey;
  onEdit: (survey: Survey) => void;
  onStart?: (survey: Survey) => void;
}

export const SurveyCard: React.FC<SurveyCardProps> = ({ survey, onEdit, onStart }) => {
  const { t } = useTranslation();
  const { isAdmin, isAgent } = useUserType();

  const getAgentName = (agent: string | { full_name: string } | undefined): string => {
    if (typeof agent === 'object' && agent?.full_name) {
      return agent.full_name;
    }
    if (typeof agent === 'string') {
      return agent;
    }
    return '-';
  };

  const startPointAgentValue = getAgentName(survey.startPointAgent);
  const endPointAgentValue = getAgentName(survey.endPointAgent);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'archived':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'terminated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Use effective status for display and logic
  const displayStatus = survey.effectiveStatus || survey.status;

  // Get appropriate message for disabled button
  const getDisabledButtonMessage = () => {
    if (!survey.scheduledStartTime || !survey.scheduledEndTime) {
      return t('surveyTimeNotSet');
    }
    
    const now = new Date();
    const startTime = new Date(survey.scheduledStartTime);
    const endTime = new Date(survey.scheduledEndTime);
    
    if (now < startTime) {
      return t('waitingForStartTime');
    } else if (now > endTime) {
      return t('surveyTimeExpired');
    }
    
    if (displayStatus?.toLowerCase() === 'archived') {
      return t('surveyArchived');
    }
    
    if (displayStatus?.toLowerCase() === 'terminated') {
      return t('surveyTerminated');
    }
    
    return t('cannotStart');
  };

  // Render agent button (Start or disabled)
  const renderAgentButton = () => {
    // Check if survey can be started based on time window and status
    const canStart = (() => {
      // Check if survey is in a state that allows starting
      const status = displayStatus?.toLowerCase();
      if (status === 'archived' || status === 'terminated') {
        return false;
      }
      
      // Check time constraints
      if (!survey.scheduledStartTime || !survey.scheduledEndTime) {
        return false;
      }
      
      const now = new Date();
      const startTime = new Date(survey.scheduledStartTime);
      const endTime = new Date(survey.scheduledEndTime);
      
      // Can start if:
      // 1. Survey is active (regardless of time), OR
      // 2. Survey is inactive but current time is within the survey window
      return status === 'active' || (status === 'inactive' && now >= startTime && now <= endTime);
    })();
    
    if (canStart) {
      return (
        <button
          onClick={() => onStart?.(survey)}
          className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{t('start')}</span>
        </button>
      );
    }

    return (
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 text-sm font-medium py-2 px-4 rounded-md cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{getDisabledButtonMessage()}</span>
      </button>
    );
  };

  // Render action button based on user type
  const renderActionButton = () => {
    if (isAdmin) {
      return (
        <button
          onClick={() => onEdit(survey)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>{t('edit')}</span>
        </button>
      );
    }
    
    if (isAgent) {
      return renderAgentButton();
    }
    
    return null;
  };


  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header with Survey Name and Status */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
          {survey.name || '-'}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(displayStatus || '')}`}>
          {displayStatus ? t(displayStatus) : '-'}
        </span>
      </div>

      {/* Survey Details */}
      <div className="space-y-3">
        {/* Route Information */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">{t('startPoint')}</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {survey.startPoint || '-'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">{t('endPoint')}</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {survey.endPoint || '-'}
            </p>
          </div>
        </div>

        {/* Agents Information */}
        <div className="grid grid-cols-1 gap-3 pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{t('startPointAgent')}</p>
            <p className="text-sm text-gray-900 truncate">
              {startPointAgentValue}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{t('endPointAgent')}</p>
            <p className="text-sm text-gray-900 truncate">
              {endPointAgentValue}
            </p>
          </div>
        </div>

        {/* Schedule Information */}
        <div className="grid grid-cols-1 gap-3 pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{t('scheduledStartTime')}</p>
            <p className="text-sm text-gray-900">
              {survey.scheduledStartTime ? new Date(survey.scheduledStartTime).toLocaleString() : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{t('scheduledEndTime')}</p>
            <p className="text-sm text-gray-900">
              {survey.scheduledEndTime ? new Date(survey.scheduledEndTime).toLocaleString() : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        {renderActionButton()}
      </div>
    </div>
  );
};
