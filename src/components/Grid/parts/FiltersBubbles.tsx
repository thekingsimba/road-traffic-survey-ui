import { useTranslation } from 'react-i18next';
import type { Dispatch, SetStateAction } from 'react';
import { FilterBubble } from '@components/FilterBubble';
import { getFilterTypeText } from '../helpers';

export type BubbleConfig<T> =
  | { type: 'range'; label: string; beginKey: keyof T; endKey: keyof T; formatValue?: (value: T[keyof T]) => string; }
  | { type: 'single'; label: string; key: keyof T; }
  | { type: 'list'; label: string; listKey: keyof T, filterTypeKey: keyof T; }
  | { type: 'custom'; label: string; render: (filters: T) => string | null; handleClose: VoidFunction };

type FiltersBubblesProps<T extends Record<string, unknown>> = {
  filters: T;
  setFilters: Dispatch<SetStateAction<T>>;
  config: BubbleConfig<T>[];
};

export const FiltersBubbles = <T extends Record<string, unknown>>({
  filters,
  setFilters,
  config,
}: FiltersBubblesProps<T>) => {
  const { t } = useTranslation();

  const removeFilters = (keys: (keyof T)[]) => {
    setFilters(prev => {
      const updated = { ...prev };

      keys.forEach(key => {
        updated[key] = undefined as T[keyof T];
      });

      return updated;
    });
  };

  return (
    <>
      {config.map((configItem) => {
        const key = `${configItem.label}-key`;

        switch (configItem.type) {
          case 'range': {
            const beginValue = filters[configItem.beginKey];
            const endValue = filters[configItem.endKey];

            if (!beginValue && !endValue) return null;

            return (
              <FilterBubble
                key={key}
                text={`${configItem.label}: ${beginValue ? `${t('from').toLowerCase()} ${configItem.formatValue?.(beginValue) ?? beginValue}` : ''} ${endValue ? `${t('to').toLowerCase()} ${configItem.formatValue?.(endValue) ?? endValue}` : ''}`}
                onClose={() => removeFilters([configItem.beginKey, configItem.endKey])}
              />
            );
          }

          case 'single': {
            const value = filters[configItem.key];
            if (!value) return null;

            return (
              <FilterBubble
                key={key}
                text={`${configItem.label}: ${t(String(value))}`}
                onClose={() => removeFilters([configItem.key])}
              />
            );
          }

          case 'list': {
            const items = filters[configItem.listKey];
            const operator = filters[configItem.filterTypeKey];

            if (!Array.isArray(items) || items.length === 0 || !operator) return null;

            return (
              <FilterBubble
                key={key}
                text={`${configItem.label}: ${getFilterTypeText(String(operator))}, ${items.map(item => t(String(item))).join(', ')}`}
                onClose={() => removeFilters([configItem.listKey])}
              />
            );
          }

          case 'custom': {
            const text = configItem.render(filters);
            if (!text) return null;

            return (
              <FilterBubble
                key={key}
                text={text}
                onClose={configItem.handleClose}
              />
            );
          }

          default:
            return null;
        }
      })}
    </>
  );
};
