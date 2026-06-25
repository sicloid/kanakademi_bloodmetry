import { useState, useEffect } from 'react';

export const TimerState = {
  STOPPED: 0, RUNNING: 1, PAUSED: 2, FINISHED: 3
} as const;
export type TimerState = typeof TimerState[keyof typeof TimerState];

export function useSimulationTimer(initialDuration: number = 300) {
  const [selectedDurationSeconds, setSelectedDurationSeconds] = useState(initialDuration);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);

  useEffect(() => {
    let interval: number | null = null;
    
    if (timerState === TimerState.RUNNING) {
      interval = window.setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          if (selectedDurationSeconds > 0 && next >= selectedDurationSeconds) {
            setTimerState(TimerState.FINISHED);
            return selectedDurationSeconds;
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [timerState, selectedDurationSeconds]);

  const onStart = () => {
    if (timerState === TimerState.FINISHED) {
      setElapsedSeconds(0);
    }
    setTimerState(TimerState.RUNNING);
  };

  const onPause = () => {
    setTimerState(TimerState.PAUSED);
  };

  const onStop = () => {
    setTimerState(TimerState.STOPPED);
    setElapsedSeconds(0);
  };

  const onDurationSelect = (duration: number) => {
    if (timerState === TimerState.STOPPED) {
      setSelectedDurationSeconds(duration);
      setElapsedSeconds(0);
    }
  };

  const displaySeconds = selectedDurationSeconds > 0 
    ? selectedDurationSeconds - elapsedSeconds 
    : elapsedSeconds;

  return {
    selectedDurationSeconds,
    elapsedSeconds,
    displaySeconds,
    timerState,
    onStart,
    onPause,
    onStop,
    onDurationSelect
  };
}
