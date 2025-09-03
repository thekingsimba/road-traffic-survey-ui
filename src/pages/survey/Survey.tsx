import { useState, useEffect, useCallback } from 'react';
import { Grid } from '@components/Grid';
import { useTranslation } from 'react-i18next';
import { getSurveys } from './api';
import type { Survey, SurveyFilter } from '@shared/api/data.models';
import { FiltersModal } from './parts/FiltersModal';
import { CreateSurveyButton } from './parts/CreateSurveyButton';
import type { RowAction } from '@components/Grid/types';
import { EditSurveyModal } from './parts/EditSurveyModal';
import type { DropdownMenuOption } from '@components/DropdownMenu/types';
import { FiltersBubbles, type BubbleConfig } from '@components/Grid/parts/FiltersBubbles';
import { countDefinedProps } from '@shared/utils/countDefinedProps';

export const SurveyComponent = () => {
  const { t } = useTranslation();
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
    }
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getSurveys({
        page: currentPage,
        limit: resultsPerPage,
        search: searchTerm,
        filter: filters,
      });

      setData(response.results?.docs ?? []);
      setTotalPages(response.results?.totalPages ?? 1);
    } catch (error) {
      console.error('Failed to fetch Surveys:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, resultsPerPage, searchTerm, filters]);

  useEffect(() => {
    fetchData();
  }, [searchTerm, currentPage, resultsPerPage, filters, fetchData]);

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

  const buttonsBlock = (
    <div className='flex justify-end space-x-2'>
      <CreateSurveyButton onComplete={refetchSurveys} />
    </div>);

            const transformedData = data.map((item) => {
            const startPointAgentValue = typeof item.startPointAgent === 'object' && item.startPointAgent?.full_name
              ? item.startPointAgent.full_name
              : (typeof item.startPointAgent === 'string' ? item.startPointAgent : '-');

            const endPointAgentValue = typeof item.endPointAgent === 'object' && item.endPointAgent?.full_name
              ? item.endPointAgent.full_name
              : (typeof item.endPointAgent === 'string' ? item.endPointAgent : '-');

            return {
              id: item.id ?? '',
              name: item.name ?? '',
              startPoint: item.startPoint ?? '',
              endPoint: item.endPoint ?? '',
              status: item.status ? t(item.status) : '-',
              startPointAgent: startPointAgentValue,
              endPointAgent: endPointAgentValue,
              scheduledStartTime: item.scheduledStartTime ? new Date(item.scheduledStartTime).toLocaleString() : '-',
              scheduledEndTime: item.scheduledEndTime ? new Date(item.scheduledEndTime).toLocaleString() : '-',
            };
          });

  const handleActionClick = (option: DropdownMenuOption<string>) => {
    const survey = data.find((s) => s.id === option.value);
    if (survey) setSurveyToEdit(survey);
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
    </div>
  );
};

export default SurveyComponent;
