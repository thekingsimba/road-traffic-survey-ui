import { useState, useEffect, useCallback } from 'react';
import { Grid } from '@components/Grid';
import { useTranslation } from 'react-i18next';
import { exportUsersCsv, getUsers } from './api';
import type { User, UserFilter } from '@shared/api/data.models';
import { FiltersModal } from './parts/FiltersModal';
import { Button } from '@components/Button/Button';
import { Icon } from '@components/Icon';
import { Typography } from '@components/Typography';
import { CreateUserButton } from './parts/CreateUserButton';
import type { RowAction } from '@components/Grid/types';
import { EditUserModal } from './parts/EditUserModal';
import type { DropdownMenuOption } from '@components/DropdownMenu/types';
import { FiltersBubbles, type BubbleConfig } from '@components/Grid/parts/FiltersBubbles';
import { countDefinedProps } from '@shared/utils/countDefinedProps';

export const UserComponent = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('full_name');
  const [sortDescending, setSortDescending] = useState(false);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const defaultFilters: UserFilter = {
    search: undefined,
    role: undefined
  };
  const [filters, setFilters] = useState<UserFilter>(defaultFilters);

  const columns = [
    { key: 'email', label: t('email') },
    { key: 'full_name', label: t('fullName') },
    { key: 'phone', label: t('phone') },
    { key: 'role', label: t('role') }
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
      const response = await getUsers({
        page: currentPage,
        limit: resultsPerPage,
        search: searchTerm,
        filter: filters,
      });

      setData(response.results?.docs ?? []);
      setTotalPages(response.results?.totalPages ?? 1);
    } catch (error) {
      console.error('Failed to fetch Users:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, resultsPerPage, searchTerm, filters]);

  const handleExportCsv = async () => {
    if (isDownloading)
      return;

    setIsDownloading(true);

    exportUsersCsv({
      search: searchTerm,
      filter: filters
    })
      .finally(() => {
        setIsDownloading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, currentPage, resultsPerPage, filters, fetchData]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const refetchUsers = useCallback(async () => {
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

  const handleFiltersApply = (newFilters: UserFilter) => {
    setFilters(newFilters);
    setIsFiltersModalOpen(false);
  };

  const buttonsBlock = (
    <div className='flex justify-end space-x-2'>
      <CreateUserButton onComplete={refetchUsers} />
      <Button
        onClick={() => handleExportCsv()}
        className='h-10 space-x-2 px-3 text-[13px]'
        disabled={isDownloading}
      >
        <Typography text={t('export')} weight='bold' className='text-inherit' />
        <Icon id='button-download' className='mb-[2px] size-[18px]' aria-hidden='true' />
      </Button>
    </div>);

  const transformedData = data.map((item) => {
    const roleValue = typeof item.role === 'object' && item.role?.name ? item.role.name : (typeof item.role === 'string' ? item.role : '-');
    return {
      id: item.id ?? '',
      email: item.email ?? '',
      full_name: item.full_name ?? '',
      phone: item.phone ?? '-',
      role: roleValue,
    };
  });

  const handleActionClick = (option: DropdownMenuOption<string>) => {
    const user = data.find((u) => u.id === option.value);
    if (user) setUserToEdit(user);
  };

  const bubblesConfig: BubbleConfig<UserFilter>[] = [
    {
      type: 'custom',
      label: t('role'),
      render: () => filters.role ? `${t('role')}: ${filters.role}` : null,
      handleClose: () => setFilters(prev => ({ ...prev, role: undefined }))
    }
  ];

  const appliedFiltersCount = countDefinedProps(filters, [['role']]);

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
      {userToEdit ? <EditUserModal
        user={userToEdit}
        isOpen={!!userToEdit}
        onClose={() => setUserToEdit(null)}
        onComplete={refetchUsers}
                    /> : null}
    </div>
  );
};
