import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import type { Survey, CountingData, SubmitCountingRequest } from '@shared/api/data.models';
import { submitCountingData } from '../survey/api';
import { useUserType } from '@shared/hooks/useUserType';
import { isAuthenticated, forceLogout } from '@shared/utils/authUtils';
import styles from './CountingPage.module.css';

export const CountingPage: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { user } = useUserType();
  const [survey, setSurvey] = useState<Survey | null>(null);

  const [counts, setCounts] = useState<CountingData>({
    motorcycle: 0,
    car: 0,
    truck: 0,
    bus: 0,
    pedestrian: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [canSubmit, setCanSubmit] = useState(false);
  const [submitAvailableTime, setSubmitAvailableTime] = useState<number | null>(null);

  // Load survey data from sessionStorage and check authentication
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      forceLogout('You must be logged in to access the counting page.');
      return;
    }

    const surveyData = sessionStorage.getItem('currentSurvey');
    console.log('Raw survey data from sessionStorage:', surveyData);
    
    if (surveyData) {
      try {
        const parsedSurvey = JSON.parse(surveyData);
        console.log('Parsed survey data:', parsedSurvey);
        console.log('Survey ID field:', parsedSurvey.id);
        console.log('Survey _id field:', parsedSurvey._id);
        console.log('All survey keys:', Object.keys(parsedSurvey));
        setSurvey(parsedSurvey);
        // Calculate when submit button should become available (2 minutes before survey end time)
        const endTime = new Date(parsedSurvey.scheduledEndTime).getTime();
        const submitAvailable = endTime - (2 * 60 * 1000); // 2 minutes before end time
        setSubmitAvailableTime(submitAvailable);
      } catch (error) {
        console.error('Failed to parse survey data:', error);
        setLocation('/surveys');
      }
    } else {
      console.log('No survey data found in sessionStorage');
      setLocation('/surveys');
    }
  }, [setLocation]);

  // Timer effect - countdown to submit button availability
  useEffect(() => {
    if (!submitAvailableTime) return;

    const timerInterval = setInterval(() => {
      const now = Date.now();
      const timeUntilSubmit = Math.max(0, Math.floor((submitAvailableTime - now) / 1000));
      
      setRemainingTime(timeUntilSubmit);
      setCanSubmit(now >= submitAvailableTime);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [submitAvailableTime]);

  const updateCount = (type: keyof CountingData, delta: number) => {
    setCounts(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const handleSubmit = async () => {
    if (!survey || !user) return;
    
    console.log('Survey data:', survey);
    console.log('Survey ID (id):', survey.id);
    console.log('Survey ID (_id):', survey._id);
    console.log('Using surveyId:', survey.id || survey._id);
    
    setIsSubmitting(true);
    try {
      // Determine counting post based on user's countingPost field
      const countingPost = (user as any).countingPost || 'start';
      
      // Prepare counting data
      const surveyId = survey.id || survey._id;
      if (!surveyId) {
        throw new Error('Survey ID not found');
      }
      
      const countingRequest: SubmitCountingRequest = {
        surveyId,
        counts,
        countingPost: countingPost as 'start' | 'end'
      };
      
      console.log('Submitting survey counts:', countingRequest);
      
      // Submit counting data to API
      const response = await submitCountingData(countingRequest);
      
      if (response.error) {
        throw new Error(response.message);
      }
      
      alert(t('surveySubmittedSuccessfully'));
      sessionStorage.removeItem('currentSurvey');
      setLocation('/surveys');
    } catch (error: any) {
      console.error('Failed to submit survey:', error);
      
      // Handle specific error cases
      if (error.message?.includes('Invalid login token') || error.message?.includes('Access denied')) {
        forceLogout('Your session has expired. Please log in again.');
      } else if (error.message?.includes('permission')) {
        alert('You do not have permission to submit counting data for this survey.');
      } else {
        alert(t('failedToSubmitSurvey'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setLocation('/surveys');
  };

  if (!survey) {
    return null;
  }

  const countingItems = [
    { key: 'motorcycle' as keyof CountingData, label: t('motorcycle'), icon: '🏍️' },
    { key: 'car' as keyof CountingData, label: t('car'), icon: '🚗' },
    { key: 'truck' as keyof CountingData, label: t('truck'), icon: '🚛' },
    { key: 'bus' as keyof CountingData, label: t('bus'), icon: '🚌' },
    { key: 'pedestrian' as keyof CountingData, label: t('pedestrian'), icon: '🚶' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Image with Blur Effect */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-110 ${styles.backgroundImage}`}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{survey.name}</h1>
                <p className="text-gray-600">
                  {survey.startPoint} → {survey.endPoint}
                </p>
              </div>
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>{t('back')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Counting Interface */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl space-y-4">
            {countingItems.map((item) => (
              <div
                key={item.key}
                className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  {/* Label */}
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xl font-semibold text-gray-800 uppercase tracking-wide">
                      {item.label}
                    </span>
                  </div>

                  {/* Counter Controls */}
                  <div className="flex items-center space-x-4">
                    {/* Minus Button */}
                    <button
                      onClick={() => updateCount(item.key, -1)}
                      disabled={counts[item.key] === 0}
                      className="w-12 h-12 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                      aria-label={`Decrease ${item.label} count`}
                      title={`Decrease ${item.label} count`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                      </svg>
                    </button>

                    {/* Count Display */}
                    <div className="w-20 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-inner">
                      <span className="text-2xl font-bold text-gray-800">
                        {counts[item.key]}
                      </span>
                    </div>

                    {/* Plus Button */}
                    <button
                      onClick={() => updateCount(item.key, 1)}
                      className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                      aria-label={`Increase ${item.label} count`}
                      title={`Increase ${item.label} count`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Timer Display */}
            <div className="pt-4">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-center space-x-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {canSubmit ? "00:00" : `${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}`}
                    </div>
                    <div className="text-sm text-gray-600">
                      {canSubmit ? t('submitAvailable') : `${t('submitIn')} ${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !canSubmit}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-xl font-bold py-4 px-8 rounded-xl transition-colors duration-200 shadow-lg flex items-center justify-center space-x-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                    <span>{t('submitting')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>{t('submitSurvey')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountingPage;
