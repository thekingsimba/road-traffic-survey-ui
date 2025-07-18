import { envs } from '@shared/envs';
import { t } from 'i18next';

const App = () => {
  return (
    <div className='flex h-full flex-col items-center justify-center'>
      <div className='text-red-500'>{t('hello')}, Premmplus admin ui</div>
      <div>Base URL is: {envs.VITE_API_BASE_URL}</div>
    </div>
  );
};

export default App;
