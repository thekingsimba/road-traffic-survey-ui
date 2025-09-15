import { apiCallHandler } from '@shared/api/fetchClient';
import type {
  CreateSurveyRequest,
  UpdateSurveyRequest,
  SurveyFilter,
  PaginatedSurveysResponse,
  SurveyResponse,
  SubmitCountingRequest,
  SubmitCountingResponse,
  CountingData
} from '@shared/api/data.models';



// Get all surveys with pagination and filters
export const getSurveys = async (params: {
  page: number;
  limit: number;
  search?: string;
  filter?: SurveyFilter;
}): Promise<PaginatedSurveysResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', params.page.toString());
  queryParams.append('limit', params.limit.toString());
  if (params.search) {
    queryParams.append('search', params.search);
  }
  if (params.filter?.status) {
    queryParams.append('status', params.filter.status);
  }

  return await apiCallHandler.get<PaginatedSurveysResponse>(`surveys?${queryParams.toString()}`).json();
};

// Get survey by ID
export const getSurveyById = async (id: string): Promise<SurveyResponse> => {
  return await apiCallHandler.get<SurveyResponse>(`surveys/${id}`).json();
};

// Create a new survey
export const createSurvey = async (surveyData: CreateSurveyRequest): Promise<SurveyResponse> => {
  return await apiCallHandler.post<SurveyResponse>('surveys/create', { json: surveyData }).json();
};

// Update an existing survey
export const updateSurvey = async (surveyData: UpdateSurveyRequest): Promise<SurveyResponse> => {
  return await apiCallHandler.put<SurveyResponse>(`surveys/${surveyData.id}`, { json: surveyData }).json();
};

// Delete a survey
export const deleteSurvey = async (id: string): Promise<{ message: string; error: boolean; code: number }> => {
  return await apiCallHandler.delete<{ message: string; error: boolean; code: number }>(`surveys/${id}`).json();
};

// Archive a survey (using end survey endpoint which sets status to archived)
export const archiveSurvey = async (id: string): Promise<SurveyResponse> => {
  return await apiCallHandler.put<SurveyResponse>(`surveys/${id}/end`).json();
};

// Export survey results as CSV
export const exportSurveyCsv = async (id: string): Promise<string> => {
  const { downloadFile } = await import('@shared/api/downloadFile');
  return await downloadFile({
    url: `surveys/${id}/export`,
    method: 'get'
  });
};

// Start a survey
export const startSurvey = async (id: string): Promise<SurveyResponse> => {
  return await apiCallHandler.put<SurveyResponse>(`surveys/${id}/start`).json();
};

// End a survey
export const endSurvey = async (id: string): Promise<SurveyResponse> => {
  return await apiCallHandler.put<SurveyResponse>(`surveys/${id}/end`).json();
};

// Get survey statistics
export const getSurveyStats = async (): Promise<{
  message: string;
  error: boolean;
  code: number;
  results: {
    totalSurveys: number;
    activeSurveys: number;
    inactiveSurveys: number;
    archivedSurveys: number;
    totalMotorcycles: number;
    totalCars: number;
    totalVehicles: number;
  };
}> => {
  return await apiCallHandler.get<{
    message: string;
    error: boolean;
    code: number;
    results: {
      totalSurveys: number;
      activeSurveys: number;
      inactiveSurveys: number;
      archivedSurveys: number;
      totalMotorcycles: number;
      totalCars: number;
      totalVehicles: number;
    };
  }>('surveys/stats/overview').json();
};

// Get all agents for dropdown selection
export const getAgents = async (): Promise<{
  message: string;
  error: boolean;
  code: number;
  results: {
    docs: Array<{
      id: string;
      full_name: string;
      email: string;
      role: { name: string };
    }>;
    totalDocs: number;
    page: number;
    limit: number;
    prevPage: number | null;
    nextPage: number | null;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
}> => {
  return await apiCallHandler.get<{
    message: string;
    error: boolean;
    code: number;
    results: {
      docs: Array<{
        id: string;
        full_name: string;
        email: string;
        role: { name: string };
      }>;
      totalDocs: number;
      page: number;
      limit: number;
      prevPage: number | null;
      nextPage: number | null;
      totalPages: number;
      hasPrevPage: boolean;
      hasNextPage: boolean;
    };
  }>('users/list?role=agent').json();
};

// Submit counting data for a survey
export const submitCountingData = async (countingData: SubmitCountingRequest): Promise<SubmitCountingResponse> => {
  return await apiCallHandler.post<SubmitCountingResponse>('surveys/counting/submit', { json: countingData }).json();
};

// Get counting data for a survey
export const getCountingData = async (surveyId: string): Promise<{
  message: string;
  error: boolean;
  code: number;
  results: {
    surveyId: string;
    startPointCounts: CountingData;
    endPointCounts: CountingData;
    lastUpdated: string;
  };
}> => {
  return await apiCallHandler.get<{
    message: string;
    error: boolean;
    code: number;
    results: {
      surveyId: string;
      startPointCounts: CountingData;
      endPointCounts: CountingData;
      lastUpdated: string;
    };
  }>(`surveys/${surveyId}/counting`).json();
};
