import { DropdownMenu } from '@components/DropdownMenu';
import type { FC } from 'react';
import { useState } from 'react';
import type { GridProps } from './types';
import { useTranslation } from 'react-i18next';
import { Icon } from '@components/Icon';
import { Typography } from '@components/Typography';
import { twMerge } from 'tailwind-merge';
import { Button } from '@components/Button';
import { Checkbox } from '@components/Checkbox';
import { Input } from '@components/Input';
import { FilterBubble } from '@components/FilterBubble';

export const Grid: FC<GridProps> = ({
  columns,
  data,
  onSearch,
  searchTerm,
  filters,
  showFilterButton = true,
  currentPage,
  totalPages,
  onPageChange,
  resultsPerPage,
  onResultsPerPageChange,
  onSort,
  sortBy,
  sortDescending,
  selectedRowIds,
  onSelectedRowsChange,
  actions,
  onActionClick,
  buttonsBlock,
  loading,
  onFiltersClick,
  appliedFiltersCount,
  bubbles,
}) => {
  const { t } = useTranslation();
  const [goToPage, setGoToPage] = useState<string>('');
  const hasActions = actions && actions.length > 0;

  const handleGoToPage = () => {
    const page = parseInt(goToPage, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
    setGoToPage('');
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allRowIds = new Set(data.map((row) => row.id));
      onSelectedRowsChange?.(allRowIds);
    } else {
      onSelectedRowsChange?.(new Set());
    }
  };

  const handleRowSelect = (id: string) => {
    const updatedSelection = new Set(selectedRowIds);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id);
    } else {
      updatedSelection.add(id);
    }
    onSelectedRowsChange?.(updatedSelection);
  };

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage > totalPages - 4) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const areFiltersEmpty = (filters: Record<string, unknown>): boolean => {
    return Object.values(filters).every((value) => {
      if (Array.isArray(value)) {
        return value.length === 0;
      }
      return value === '' || value === null || value === undefined;
    });
  };

  return (
    <div className='rounded-xl bg-white p-4 shadow-md'>
      <div className='flex justify-between'>
        {/* Search Input and Filter Button */}
        <div className='flex flex-wrap justify-start'>
          {/* Search Input */}
          <div className='mr-2 flex max-h-10 items-center space-x-4'>
            <div className='relative'>
              <Input
                name='search'
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e: { target: { value: string } }) => onSearch(e.target.value)}
                className='h-10 w-64 rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700 shadow-sm focus:ring focus:ring-blue-500'
              />
              <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='size-4 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-4.35-4.35M16.65 10.35a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z' />
                </svg>
              </div>
            </div>
            {showFilterButton ? <Button
              onClick={onFiltersClick}
              className='flex h-10 space-x-2 px-3 text-[13px]'
                                >
              <Typography
                text={`${t('filters')}${appliedFiltersCount > 0 ? ` (${appliedFiltersCount})` : ''}`}
                weight='bold'
                className='text-inherit'
              />
              <Icon id='button-filter' className='size-[15px]' aria-hidden='true' />
            </Button> : null}
          </div>
          {/* Bubbles */}
          {searchTerm ?
            <FilterBubble
              text={`${t('search')}: ${searchTerm}`}
              onClose={() => onSearch('')}
            /> : null
          }
          {bubbles}
        </div>
        {buttonsBlock}
      </div>
      {/* Conditional Rendering for Empty States */}
      {loading ? (
        <div className='flex w-full items-center justify-center'>
          <Icon id='loader' className='size-[18px] animate-spin' />
        </div>
          ) : data.length === 0 ? (
            <div className='text-center text-gray-500'>
              {searchTerm || (filters && !areFiltersEmpty(filters))
                ? t('noMatchingRecordsFound')
                : t('noRecordsToDisplay')}
            </div>
          ) : (
            <>
              <table className='w-full border-collapse text-left'>
                <thead>
                  <tr>
                    {/* Checkbox Column */}
                    {onSelectedRowsChange && selectedRowIds ? (
                      <th className='border-b p-2'>
                        <Checkbox
                          onChange={handleSelectAll}
                          checked={selectedRowIds?.size === data.length && data.length > 0}
                          className='size-4'
                        />
                      </th>) : null}
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className='cursor-pointer select-none border-b p-2 text-sm font-medium text-secondary'
                        onClick={() => onSort(col.key)}
                      >
                        <div className='flex items-center space-x-1 text-secondary'>
                          {sortBy === col.key && <Icon id='arrow' className={`${sortDescending ? 'rotate-90' : '-rotate-90'} size-3`} />}
                          <Typography text={col.label} className='text-[13px] text-inherit' weight='bold' />
                        </div>
                      </th>
                    ))}
                    {hasActions ? <th className='sticky right-0 z-[1] border-b bg-white p-2 text-center text-[13px] font-bold text-secondary first-letter:capitalize'>{t('actions')}</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.id} className='group relative border-b hover:bg-gray-50'>
                      {/* Checkbox for Row */}
                      {onSelectedRowsChange && selectedRowIds ? (
                        <td className='p-2'>
                          <Checkbox
                            checked={selectedRowIds?.has(row.id)}
                            onChange={() => handleRowSelect(row.id)}
                            className='size-4'
                          />
                        </td>) : null}

                      {columns.map((col) => {
                          const cellValue = row[col.key];
                          const localizedValue = typeof cellValue === 'string' && col.localize
                            ? t(cellValue)
                            : cellValue;

                          return (
                            <td key={col.key} className='p-2 text-sm'>
                              {localizedValue}
                            </td>
                          );
                        })}
                      {hasActions ?
                        <td className='sticky right-0 z-[1] bg-white p-2 text-center group-hover:bg-gray-50'>
                          {actions.length === 1 ? (
                            <button
                              onClick={() => onActionClick?.({ value: row.id, ...actions[0] })}
                              className='group flex w-full items-center justify-center p-1 text-secondary hover:text-primary'
                              title={t(actions[0].label)}
                            >
                              <Icon id={actions[0].iconId} className={twMerge('size-4', actions[0].iconClassName)} />
                            </button>
                          ) : (
                            <DropdownMenu
                              handleClick={(_, option) => onActionClick?.(option)}
                              classNames={{
                                trigger: 'min-h-[20px] inline-block align-middle',
                                portalWrapper: 'rounded-xl border-[#EBECF0] p-2',
                                optionWrapper: 'px-4 min-h-10 rounded-md',
                              }}
                              options={actions?.map(action => ({
                                ...action,
                                value: row.id,
                                view: (
                                  <div className='group flex min-h-10 w-full min-w-40 items-center justify-start space-x-2'>
                                    <Icon
                                      id={action.iconId}
                                      className={twMerge('group-hover:text-primary text-secondary', action.iconClassName)}
                                    />
                                    <Typography
                                      text={t(action.label)}
                                      className='text-[13px] capitalize text-secondary group-hover:text-primary'
                                    />
                                  </div>
                                )
                              })) ?? []}
                            />
                          )}
                        </td> : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
      {/* Pagination */}
      <div className='mt-4 flex items-center justify-between rounded-lg bg-white pb-[6px] pl-2 pr-4 pt-4'>
        {/* Pagination Controls */}
        <div className='flex items-center'>
          {/* Previous Button */}
          <Button
            intent='secondary'
            className='mr-4 flex size-8 items-center justify-center rounded-md p-0'
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Icon id='chevron' className='h-3 w-2 rotate-180' />
          </Button>

          {/* Page Numbers */}
          <div className='flex items-center space-x-1'>
            {renderPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={`flex size-8 items-center justify-center rounded-md text-[12px] font-bold ${
                  currentPage === page
                    ? 'bg-[#166298] text-white'
                    : 'text-secondary hover:bg-gray-200'
                }`}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <Button
            intent='secondary'
            className='ml-4 flex size-8 items-center justify-center rounded-md p-0'
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Icon id='chevron' className='h-3 w-2' />
          </Button>
        </div>

        <div className='flex items-center space-x-2'>
          {/* Go to Page Input */}
          <div className='flex items-center space-x-1'>
            <span className='whitespace-nowrap text-[13px] text-secondary'>{t('goToPage')}</span>
            <Input
              value={goToPage}
              placeholder={t('number')}
              onChange={(e: { target: { value: string } }) => setGoToPage(e.target.value)}
              className='mr-1 h-8 w-16 rounded-md border-none px-2 pb-[9px] text-[12px] placeholder:text-[12px]'
            />
            <Button
              intent='secondary'
              onClick={handleGoToPage}
              text={t('go')}
              className='flex size-8 justify-center rounded-md p-2 text-[12px] font-bold'
            />
          </div>

          {/* Separator */}
          <div className='h-7 w-px bg-[#EBECF0]' />

          {/* Results Per Page Selector */}
          <div className='flex items-center space-x-2'>
            <span className='text-[13px] text-secondary'>{t('resultsPerPage')}</span>
            <select
              value={resultsPerPage}
              onChange={(e) => onResultsPerPageChange(parseInt(e.target.value, 10))}
              className='h-8 w-[54px] cursor-pointer rounded-md border-none bg-[#F9F9FA] p-0 pl-2 text-[12px] text-regular shadow-sm focus:ring focus:ring-[#00629B3D]'
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
