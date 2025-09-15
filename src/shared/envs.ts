export const envs = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  VITE_CLIENT_ID_HEADER: import.meta.env.VITE_CLIENT_ID_HEADER || 'road-traffic-survey-ui'
};
