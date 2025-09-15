import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Grid } from '@components/Grid';
import { useTranslation } from 'react-i18next';
import { getSurveys, archiveSurvey, exportSurveyCsv, deleteSurvey } from './api';
import type { Survey, SurveyFilter } from '@shared/api/data.models';
import { FiltersModal } from './parts/FiltersModal';
import { CreateSurveyButton } from './parts/CreateSurveyButton';
import type { RowAction } from '@components/Grid/types';
import { EditSurveyModal } from './parts/EditSurveyModal';
import { SurveyCard } from './parts/SurveyCard';
import type { DropdownMenuOption } from '@components/DropdownMenu/types';
import { FiltersBubbles, type BubbleConfig } from '@components/Grid/parts/FiltersBubbles';
import { countDefinedProps } from '@shared/utils/countDefinedProps';
import { useUserType } from '@shared/hooks/useUserType';
import { useUserStore } from '@shared/stores/userStore';
import { BaseModal } from '@components/BaseModal';
import { Button } from '@components/Button';
import { Typography } from '@components/Typography';
import { Icon } from '@components/Icon';

export const SurveyComponent = () => {
  const { t } = useTranslation();
  const { isAdmin } = useUserType();
  const [, setLocation] = useLocation();
  const { isAuthorized, accessToken, user } = useUserStore();

  // Debug user state
  console.log('🔥 SurveyComponent - isAdmin:', isAdmin);
  console.log('🔥 SurveyComponent - isAuthorized:', isAuthorized);
  console.log('🔥 SurveyComponent - accessToken:', accessToken ? 'present' : 'missing');
  console.log('🔥 SurveyComponent - user:', user);
  console.log('🔥 SurveyComponent - localStorage user data:', localStorage.getItem('user-storage'));
  const [data, setData] = useState<Survey[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortDescending, setSortDescending] = useState(false);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [surveyToEdit, setSurveyToEdit] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'archive' | 'delete' | null;
    survey: Survey | null;
  }>({
    isOpen: false,
    type: null,
    survey: null,
  });
  const defaultFilters: SurveyFilter = {
    search: undefined,
    status: undefined
  };
  const [filters, setFilters] = useState<SurveyFilter>(defaultFilters);

            const columns = [
            { key: 'name', label: t('surveyName') },
            { key: 'startPoint', label: t('startPoint') },
            { key: 'endPoint', label: t('endPoint') },
            { key: 'status', label: t('status') },
            { key: 'startPointAgent', label: t('startPointAgent') },
            { key: 'endPointAgent', label: t('endPointAgent') },
            { key: 'scheduledStartTime', label: t('scheduledStartTime') },
            { key: 'scheduledEndTime', label: t('scheduledEndTime') }
          ];

  const actionsConfig: RowAction[] = [
    {
      actionId: 'edit',
      label: t('edit'),
      iconId: 'pencil',
      iconClassName: 'mr-[2px] size-[18px]',
    },
    {
      actionId: 'archive',
      label: t('archive'),
      iconId: 'completed',
      iconClassName: 'mr-[2px] size-[18px]',
    },
    {
      actionId: 'export',
      label: t('export'),
      iconId: 'button-download',
      iconClassName: 'mr-[2px] size-[18px]',
    },
    {
      actionId: 'delete',
      label: t('delete'),
      iconId: 'cross',
      iconClassName: 'mr-[2px] size-[18px]',
    }
  ];

  const fetchData = useCallback(async () => {
    console.log('🔥 fetchData called');
    setLoading(true);
    try {
      console.log('🔥 Fetching surveys with params:', { page: currentPage, limit: resultsPerPage, search: searchTerm, filter: filters });
      const response = await getSurveys({
        page: currentPage,
        limit: resultsPerPage,
        search: searchTerm,
        filter: filters,
      });

      console.log('🔥 Fetched survey data:', response.results?.docs);
      console.log('🔥 Raw API response:', response);
      console.log('🔥 First survey object:', response.results?.docs?.[0]);
      console.log('🔥 Response structure:', {
        hasResults: !!response.results,
        hasDocs: !!response.results?.docs,
        docsLength: response.results?.docs?.length,
        firstDocKeys: response.results?.docs?.[0] ? Object.keys(response.results.docs[0]) : 'no first doc'
      });
      setData(response.results?.docs ?? []);
      setTotalPages(response.results?.totalPages ?? 1);
    } catch (error) {
      console.error('🔥 Failed to fetch Surveys:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, resultsPerPage, searchTerm, filters]);

  useEffect(() => {
    console.log('🔥 useEffect triggered - calling fetchData');
    fetchData();
  }, [searchTerm, currentPage, resultsPerPage, filters, fetchData]);

  // Test API call directly
  useEffect(() => {
    const testApiCall = async () => {
      try {
        console.log('🔥 Testing API call directly...');
        const response = await fetch('http://localhost:5000/api/surveys?page=1&limit=10');
        console.log('🔥 Direct API response status:', response.status);
        const data = await response.json();
        console.log('🔥 Direct API response data:', data);
      } catch (error) {
        console.error('🔥 Direct API call error:', error);
      }
    };

    // Run test after a short delay
    setTimeout(testApiCall, 1000);
  }, []);

  // Add polling for real-time updates
  useEffect(() => {
    const checkForUpcomingSurveys = () => {
      const now = new Date();
      const hasUpcomingSurvey = data.some(survey => {
        if (!survey.scheduledStartTime) return false;
        const startTime = new Date(survey.scheduledStartTime);
        const timeDiff = startTime.getTime() - now.getTime();
        // Check if survey starts within the next 5 minutes
        return timeDiff > 0 && timeDiff <= 5 * 60 * 1000;
      });

      return hasUpcomingSurvey;
    };

    // Poll every 30 seconds by default
    let interval = setInterval(() => {
      fetchData();
    }, 30000);

    // If there are surveys starting soon, poll more frequently (every 10 seconds)
    const checkInterval = setInterval(() => {
      if (checkForUpcomingSurveys()) {
        clearInterval(interval);
        interval = setInterval(() => {
          fetchData();
        }, 10000); // Poll every 10 seconds when surveys are starting soon
      } else {
        clearInterval(interval);
        interval = setInterval(() => {
          fetchData();
        }, 30000); // Back to 30 seconds
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(checkInterval);
    };
  }, [fetchData, data]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const refetchSurveys = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleResultsPerPageChange = (value: number) => {
    setResultsPerPage(value);
    setCurrentPage(1);
  };

  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSortDescending(!sortDescending);
    } else {
      setSortBy(columnKey);
      setSortDescending(false);
    }
  };

  const handleFiltersApply = (newFilters: SurveyFilter) => {
    setFilters(newFilters);
    setIsFiltersModalOpen(false);
  };

  const buttonsBlock = isAdmin ? (
    <div className='flex justify-end space-x-2'>
      <CreateSurveyButton onComplete={refetchSurveys} />
    </div>
  ) : null;

  const transformedData = data.map((item, index) => {
    console.log(`🔥 Transforming survey ${index}:`, item);
    console.log(`🔥 Survey ${index} id field:`, item.id);
    console.log(`🔥 Survey ${index} _id field:`, item._id);

              const startPointAgentValue = (() => {
                if (typeof item.startPointAgent === 'object' && item.startPointAgent?.full_name) {
                  return item.startPointAgent.full_name;
                }
                if (typeof item.startPointAgent === 'string') {
                  return item.startPointAgent;
                }
                return '-';
              })();

              const endPointAgentValue = (() => {
                if (typeof item.endPointAgent === 'object' && item.endPointAgent?.full_name) {
                  return item.endPointAgent.full_name;
                }
                if (typeof item.endPointAgent === 'string') {
                  return item.endPointAgent;
                }
                return '-';
              })();

    const transformedItem = {
      id: item.id ?? item._id ?? '',
              name: item.name ?? '',
              startPoint: item.startPoint ?? '',
              endPoint: item.endPoint ?? '',
              status: (item.effectiveStatus || item.status) ? t(item.effectiveStatus || item.status) : '-',
              startPointAgent: startPointAgentValue,
              endPointAgent: endPointAgentValue,
              scheduledStartTime: item.scheduledStartTime ? new Date(item.scheduledStartTime).toLocaleString() : '-',
              scheduledEndTime: item.scheduledEndTime ? new Date(item.scheduledEndTime).toLocaleString() : '-',
            };

    console.log(`🔥 Transformed survey ${index}:`, transformedItem);
    return transformedItem;
          });

  const handleActionClick = (option: DropdownMenuOption<string>) => {
    console.log('🔥 Action clicked:', option);
    console.log('🔥 Available surveys in data:', data);
    console.log('🔥 Looking for survey with ID:', option.value);

    // Try to find survey in data array
    let survey = data.find((s) => s.id === option.value);
    console.log('🔥 Found survey in data:', survey);

    // If not found in data array, create a minimal survey object with just the ID
    if (!survey && option.value) {
      console.log('🔥 Survey not found in data, creating minimal survey object');
      survey = { id: option.value } as Survey;
    }

    if (!survey || !survey.id) {
      console.error('🔥 Survey not found for ID:', option.value);
      console.error('🔥 Available survey IDs:', data.map(s => s.id));
      return;
    }

    console.log('🔥 Using survey object:', survey);

    switch (option.actionId) {
      case 'edit':
        console.log('🔥 Opening edit modal');
        setSurveyToEdit(survey);
        break;
      case 'archive':
        console.log('🔥 Opening archive confirmation');
        setConfirmModal({
          isOpen: true,
          type: 'archive',
          survey: survey,
        });
        break;
      case 'export':
        console.log('🔥 Starting CSV export');
        handleExportCsv(survey);
        break;
      case 'delete':
        console.log('🔥 Opening delete confirmation');
        setConfirmModal({
          isOpen: true,
          type: 'delete',
          survey: survey,
        });
        break;
      default:
        console.log('🔥 Unknown action:', option.actionId);
        break;
    }
  };

  const handleExportCsv = async (survey: Survey) => {
    console.log('🔥 handleExportCsv called with survey:', survey);
    console.log('🔥 isActionLoading state:', isActionLoading);
    console.log('🔥 survey.id:', survey.id);

    if (isActionLoading || !survey.id) {
      console.log('🔥 Export cancelled - isActionLoading:', isActionLoading, 'survey.id:', survey.id);
      return;
    }

    console.log('🔥 Starting CSV export for survey ID:', survey.id);
    console.log('🔥 Setting isActionLoading to true');
    setIsActionLoading(true);

    try {
      console.log('🔥 Calling exportSurveyCsv function...');
      const result = await exportSurveyCsv(survey.id);
      console.log('🔥 CSV export successful:', result);
    } catch (error) {
      console.error('🔥 Failed to export survey CSV:', error);
    } finally {
      console.log('🔥 Setting isActionLoading to false');
      setIsActionLoading(false);
    }
  };

  const handleArchiveSurvey = async () => {
    if (!confirmModal.survey || isActionLoading || !confirmModal.survey.id) return;

    setIsActionLoading(true);
    try {
      await archiveSurvey(confirmModal.survey.id);
      await refetchSurveys();
      setConfirmModal({ isOpen: false, type: null, survey: null });
    } catch (error) {
      console.error('Failed to archive survey:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteSurvey = async () => {
    if (!confirmModal.survey || isActionLoading || !confirmModal.survey.id) return;

    setIsActionLoading(true);
    try {
      await deleteSurvey(confirmModal.survey.id);
      await refetchSurveys();
      setConfirmModal({ isOpen: false, type: null, survey: null });
    } catch (error) {
      console.error('Failed to delete survey:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleStartSurvey = (survey: Survey) => {
    // Find the original survey data from the data array
    const originalSurvey = data.find(s => s.id === survey.id);
    console.log('Survey clicked:', survey);
    console.log('Original survey found:', originalSurvey);
    console.log('Survey ID:', originalSurvey?.id);

    if (originalSurvey) {
      // Store original survey data in sessionStorage and navigate to counting page
      sessionStorage.setItem('currentSurvey', JSON.stringify(originalSurvey));
      console.log('Stored in sessionStorage:', JSON.stringify(originalSurvey));
      setLocation('/counting');
    } else {
      console.error('Original survey data not found');
    }
  };

  const bubblesConfig: BubbleConfig<SurveyFilter>[] = [
    {
      type: 'custom',
      label: t('status'),
      render: () => filters.status ? `${t('status')}: ${t(filters.status)}` : null,
      handleClose: () => setFilters(prev => ({ ...prev, status: undefined }))
    }
  ];

  const appliedFiltersCount = countDefinedProps(filters, [['status']]);

  // Render table view for admin
  if (isAdmin) {
    return (
      <div className='page-without-header h-screen bg-[#F4F4F6] p-6 md:pt-24'>
        <div className='mb-6' />
        <Grid
          columns={columns}
          data={transformedData}
          searchTerm={searchTerm}
          onSearch={handleSearch}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortBy={sortBy}
          sortDescending={sortDescending}
          resultsPerPage={resultsPerPage}
          onResultsPerPageChange={handleResultsPerPageChange}
          filters={filters}
          buttonsBlock={buttonsBlock}
          loading={loading}
          actions={actionsConfig}
          onActionClick={(option) => handleActionClick(option)}
          onFiltersClick={() => setIsFiltersModalOpen(true)}
          appliedFiltersCount={appliedFiltersCount}
          bubbles={<FiltersBubbles filters={filters} setFilters={setFilters} config={bubblesConfig} />}
        />
        <FiltersModal
          isOpen={isFiltersModalOpen}
          onClose={() => setIsFiltersModalOpen(false)}
          onApply={handleFiltersApply}
          onReset={() => setFilters(defaultFilters)}
          initialFilters={filters}
        />
        {surveyToEdit ? (
          <EditSurveyModal
            survey={surveyToEdit}
            isOpen={!!surveyToEdit}
            onClose={() => setSurveyToEdit(null)}
            onComplete={refetchSurveys}
          />
        ) : null}

        {/* Confirmation Modal */}
        <BaseModal
          isOpen={confirmModal.isOpen}
          onCloseHandler={() => setConfirmModal({ isOpen: false, type: null, survey: null })}
          header={
            <Typography
              text={confirmModal.type === 'archive' ? t('archiveSurvey') : t('deleteSurvey')}
              weight='bold'
              className='text-[22px] capitalize'
            />
          }
          className='w-[324px]'
        >
          <div className='flex flex-col'>
            <Typography
              text={
                confirmModal.type === 'archive'
                  ? t('areYouSureWantToArchiveSurvey', { surveyName: confirmModal.survey?.name })
                  : t('areYouSureWantToDeleteSurvey', { surveyName: confirmModal.survey?.name })
              }
              className='p-6 text-[15px] text-secondary first-letter:capitalize'
            />

            <div className='flex w-full justify-between space-x-4 border-t px-6 pb-6 pt-4'>
              <Button
                type='button'
                intent='secondary'
                onClick={() => setConfirmModal({ isOpen: false, type: null, survey: null })}
                className='h-12 w-full justify-center text-[15px]'
                disabled={isActionLoading}
              >
                {t('cancel')}
              </Button>
              <Button
                type='button'
                intent='primary'
                onClick={confirmModal.type === 'archive' ? handleArchiveSurvey : handleDeleteSurvey}
                className='h-12 w-full justify-center text-[15px]'
                disabled={isActionLoading}
              >
                {isActionLoading && <Icon id='button-loading' className='animate-spin mr-2' />}
                {confirmModal.type === 'archive' ? t('archive') : t('delete')}
              </Button>
            </div>
          </div>
        </BaseModal>
      </div>
    );
  }

  // Render card view for agents
  return (
    <div className='page-without-header h-screen bg-[#F4F4F6] p-6 md:pt-24'>
      <div className='mb-6' />

      {/* Search and Filters for Agent View */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6'>
        <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
          <div className='flex-1 w-full'>
            <input
              type='text'
              placeholder={t('searchSurveys')}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
          <button
            onClick={() => setIsFiltersModalOpen(true)}
            className='px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 flex items-center space-x-2'
          >
            <svg className='size-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' />
            </svg>
            <span>{t('filters')}</span>
            {appliedFiltersCount > 0 && (
              <span className='bg-blue-500 text-white text-xs rounded-full px-2 py-1'>
                {appliedFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Applied Filters Bubbles */}
        {appliedFiltersCount > 0 && (
          <div className='mt-4'>
            <FiltersBubbles filters={filters} setFilters={setFilters} config={bubblesConfig} />
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full size-8 border-b-2 border-blue-600' />
        </div>
      ) : null}

      {/* Cards Grid - 4 cards per row */}
      {!loading && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {data.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onEdit={setSurveyToEdit}
              onStart={handleStartSurvey}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-400 mb-4'>
            <svg className='mx-auto size-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>{t('noSurveysFound')}</h3>
          <p className='text-gray-500'>{t('noSurveysDescription')}</p>
        </div>
      )}

      {/* Pagination for Agent View */}
      {!loading && data.length > 0 && totalPages > 1 && (
        <div className='mt-8 flex justify-center'>
          <div className='flex items-center space-x-2'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {t('previous')}
            </button>

            <div className='flex space-x-1'>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {t('next')}
            </button>
          </div>
        </div>
      )}

      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        onApply={handleFiltersApply}
        onReset={() => setFilters(defaultFilters)}
        initialFilters={filters}
      />
      {surveyToEdit ? (
        <EditSurveyModal
          survey={surveyToEdit}
          isOpen={!!surveyToEdit}
          onClose={() => setSurveyToEdit(null)}
          onComplete={refetchSurveys}
        />
      ) : null}
    </div>
  );
};

export default SurveyComponent;
