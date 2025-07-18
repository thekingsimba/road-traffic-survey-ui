import { type SearchParamsOption } from 'ky';
import { apiCallHandler } from './fetchClient';

type DownloadFileArgs = {
  url: string;
  searchParams?: SearchParamsOption;
  urlContainerId?: string
  useScreenerApiClient?: boolean;
  fileNameArg?: string;
} & (PostProps | GetProps);

type PostProps = {
  method?: 'post';
  data?: Record<string, unknown>;
};

type GetProps = {
  method?: 'get';
  data?: never;
};

export const downloadFile = async ({
  url,
  searchParams,
  data,
  method = 'get',
  urlContainerId,
  fileNameArg,
}: DownloadFileArgs) => {
  const api = apiCallHandler;

  const response = method === 'post'
    ? await api.post(url, { searchParams, json: data })
    : await api.get(url);

const fileName =
  fileNameArg ??
  response.headers.get('Content-Disposition')
    ?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)?.[1]
    ?.replace(/['"]/g, '') ?? 'downloaded_file';

  const blobData = await response.blob();
  const blobUrl = window.URL.createObjectURL(blobData);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = fileName;

  let elementToAppendUrl: HTMLElement;
  if (urlContainerId) {
    const container = document.getElementById(urlContainerId);

    if (!container)
      throw new Error('Container not found');

    elementToAppendUrl = container;
  } else {
    elementToAppendUrl = document.body;
  }

  elementToAppendUrl.appendChild(a);

  a.click();

  elementToAppendUrl.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);

  return fileName;
};
