import type { DropdownMenuOption } from '@components/DropdownMenu/types';
import type { IconIds } from '@components/Icon/Icon';
import type { ReactNode } from 'react';

export type GridProps = GridBaseProps & (GridWithActions | GridWithoutActions) & (SelectableGrid | NotSelectableGrid);

export type RowAction = {
  actionId: string;
  label: string;
  iconId: IconIds;
  iconClassName?: string;
}

type GridBaseProps = {
  columns: Column[];
  data: DataRow[];
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  resultsPerPage: number;
  sortBy: string;
  sortDescending: boolean;
  buttonsBlock?: ReactNode;
  filters?: Record<string, unknown>;
  showFilterButton?: boolean;
  loading?: boolean;
  onSearch: (value: string) => void;
  onPageChange: (page: number) => void;
  onResultsPerPageChange: (value: number) => void;
  onSort: (key: string) => void;
  onFiltersClick: VoidFunction;
  appliedFiltersCount: number;
  bubbles: ReactNode,
};

type GridWithActions = {
  actions: RowAction[];
  onActionClick: (item: DropdownMenuOption<string>) => void | Promise<void>;
};

type GridWithoutActions = {
  actions?: never[];
  onActionClick?: never;
};

type SelectableGrid = {
  onSelectedRowsChange: (selectedIds: Set<string>) => void;
  selectedRowIds: Set<string>;
}

type NotSelectableGrid = {
  onSelectedRowsChange?: never;
  selectedRowIds?: never;
}

type Column = {
  key: string;
  label: string;
  localize?: boolean
};

type DataRow = {
  id: string;
  [key: string]: string | number | null | undefined | ReactNode;
};
