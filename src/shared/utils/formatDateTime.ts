const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
};

export const toGridDate = (isoString: string | undefined | null): string =>
  isoString ? new Date(isoString).toLocaleString('en-US', options).replace(',', '') : '';
