import { useState, useEffect } from 'react';

export const TimerState = {
  STOPPED: 0, RUNNING: 1, PAUSED: 2, FINISHED: 3
} as const;
export type TimerState = typeof TimerState[keyof typeof TimerState];

export function useSimulationTimer(initialDuration: number = 300) {
  const [selectedDurationSeconds, setSelectedDurationSeconds] = useState(initialDuration);
  const [timerState, setTimerState] = useState<TimerState>(TimerState.STOPPED);
  
  // Real-time tracking variables to fix background throttling
  const [accumulatedMs, setAccumulatedMs] = useState(0);
  const [lastStartMs, setLastStartMs] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: number | null = null;
    
    if (timerState === TimerState.RUNNING && lastStartMs !== null) {
      // Run interval more frequently to ensure UI catches every second tick accurately
      interval = window.setInterval(() => {
        const now = Date.now();
        const totalElapsedMs = accumulatedMs + (now - lastStartMs);
        const currentSeconds = Math.floor(totalElapsedMs / 1000);
        
        if (selectedDurationSeconds > 0 && currentSeconds >= selectedDurationSeconds) {
          setElapsedSeconds(selectedDurationSeconds);
          setTimerState(TimerState.FINISHED);
          setAccumulatedMs(selectedDurationSeconds * 1000);
          setLastStartMs(null);
        } else {
          setElapsedSeconds(currentSeconds);
        }
      }, 250);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [timerState, lastStartMs, accumulatedMs, selectedDurationSeconds]);

  const onStart = () => {
    if (timerState === TimerState.FINISHED) {
      setAccumulatedMs(0);
      setElapsedSeconds(0);
    }
    setLastStartMs(Date.now());
    setTimerState(TimerState.RUNNING);
  };

  const onPause = () => {
    if (lastStartMs !== null) {
      setAccumulatedMs(prev => prev + (Date.now() - lastStartMs));
    }
    setLastStartMs(null);
    setTimerState(TimerState.PAUSED);
  };

  const onStop = () => {
    setTimerState(TimerState.STOPPED);
    setAccumulatedMs(0);
    setLastStartMs(null);
    setElapsedSeconds(0);
  };

  const onDurationSelect = (duration: number) => {
    if (timerState === TimerState.STOPPED) {
      setSelectedDurationSeconds(duration);
      setAccumulatedMs(0);
      setLastStartMs(null);
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
