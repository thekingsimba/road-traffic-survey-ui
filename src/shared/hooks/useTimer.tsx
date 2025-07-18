import { useEffect, useState } from 'react';

type TimerOptions = {
  seconds: number;
  defaultStarted?: boolean;
}

export const useTimer = ({ seconds, defaultStarted = false }: TimerOptions) => {
  const [currentSeconds, setCurrentSeconds] = useState(seconds);
  const [isActive, setIsActive] = useState(defaultStarted);

  const start = () => setIsActive(true);

  const restart = () => {
    setCurrentSeconds(seconds);
    setIsActive(true);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && currentSeconds === 0) {
      setIsActive(false);
    }

    if (isActive && currentSeconds > 0) {
      interval = setInterval(() => {
        setCurrentSeconds(prev => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };

  }, [isActive, currentSeconds]);

  return { currentSeconds, start, restart };
};
