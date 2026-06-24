import { useState, useEffect } from 'react';

export const TimerState = {
  STOPPED: 0, RUNNING: 1, PAUSED: 2, FINISHED: 3
} as const;
export type TimerState = typeof TimerState[keyof typeof TimerState];

export function useSimulationTimer(initialDuration: number = 300) {
  const [selectedDurationSeconds, setSelectedDurationSeconds] = useState(initialDuration);
  const [remainingSeconds, setRemainingSeconds] = useState(initialDuration);
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);

  useEffect(() => {
    let interval: number | null = null;
    
    if (timerState === TimerState.RUNNING && remainingSeconds > 0) {
      interval = window.setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setTimerState(TimerState.FINISHED);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (remainingSeconds === 0 && timerState === TimerState.RUNNING) {
      setTimerState(TimerState.FINISHED);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [timerState, remainingSeconds]);

  const onStart = () => {
    if (timerState === TimerState.FINISHED) {
      setRemainingSeconds(selectedDurationSeconds);
    }
    setTimerState(TimerState.RUNNING);
  };

  const onPause = () => {
    setTimerState(TimerState.PAUSED);
  };

  const onStop = () => {
    setTimerState(TimerState.STOPPED);
    setRemainingSeconds(selectedDurationSeconds);
  };

  const onDurationSelect = (duration: number) => {
    if (timerState === TimerState.STOPPED) {
      setSelectedDurationSeconds(duration);
      setRemainingSeconds(duration);
    }
  };

  return {
    selectedDurationSeconds,
    remainingSeconds,
    timerState,
    onStart,
    onPause,
    onStop,
    onDurationSelect
  };
}
