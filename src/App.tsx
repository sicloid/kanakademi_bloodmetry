import { useState, useEffect } from 'react';
import { Play, Square, Pause, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSimulationTimer, TimerState } from './hooks/useSimulationTimer';

const COLORS = {
  CorporateRed: '#E60033',
  CorporateBlue: '#0A2240',
  LiveGreen: '#00A040',
  InstitutionalGray: '#7A8B99',
  ElectricWhite: '#FFFFFF',
  BackgroundMain: '#F8F9FA'
};

// --- TickerText ---
function TickerText({ text, color, fontSize, fontWeight }: { text: string, color: string, fontSize: string, fontWeight: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {text.split('').map((char, index) => (
        <div key={index} style={{ position: 'relative', height: fontSize, width: `calc(${fontSize} * 0.6)` }}>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={char}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                color,
                fontSize,
                fontWeight,
                fontFamily: 'sans-serif',
                textShadow: `0 0 25px ${color}99`, // 0.6 alpha glow
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              {char}
            </motion.div>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// --- RadialProgressGauge ---
function RadialProgressGauge({ progress, isRunning, currentSeconds, isInfinite }: { progress: number, isRunning: boolean, currentSeconds: number, isInfinite: boolean }) {
  const size = 300;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const halfCircumference = circumference / 2;
  
  // Removed phase animation as requested

  // Removed heartbeat generator as requested

  const minutes = Math.floor(currentSeconds / 60).toString().padStart(2, '0');
  const seconds = (currentSeconds % 60).toString().padStart(2, '0');

  const visualProgress = isInfinite ? 0.8 : progress;
  const dashOffset = halfCircumference - (halfCircumference * visualProgress);
  const backgroundStroke = isInfinite ? 'rgba(230, 0, 51, 0.15)' : 'rgba(160, 170, 181, 0.3)';

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="rightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.CorporateRed} />
            <stop offset="100%" stopColor={COLORS.CorporateBlue} />
          </linearGradient>
          <linearGradient id="leftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.CorporateRed} />
            <stop offset="100%" stopColor={COLORS.CorporateBlue} />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={backgroundStroke} strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Glow Tracks & Arcs Wrapper */}
        <g className={isInfinite && isRunning ? 'spin-infinite' : ''} style={{ transformOrigin: 'center' }}>
          {/* Glow Tracks (visible when progress > 0 or infinite) */}
          {(visualProgress > 0) && (
          <>
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke="url(#rightGrad)" strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${halfCircumference} ${circumference}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              filter="url(#glow)"
              opacity={0.85}
              style={{ transition: isRunning ? 'stroke-dashoffset 1s linear' : 'none' }}
            />
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke="url(#leftGrad)" strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${halfCircumference} ${circumference}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2}) scale(1, -1) translate(0, -${size})`}
              filter="url(#glow)"
              opacity={0.85}
              style={{ transition: isRunning ? 'stroke-dashoffset 1s linear' : 'none' }}
            />
          </>
        )}

        {/* Right Arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="url(#rightGrad)" strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${halfCircumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: isRunning ? 'stroke-dashoffset 1s linear' : 'none' }}
        />

        {/* Left Arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="url(#leftGrad)" strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${halfCircumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2}) scale(1, -1) translate(0, -${size})`}
          style={{ transition: isRunning ? 'stroke-dashoffset 1s linear' : 'none' }}
        />
      </g>

        {/* Removed Heartbeat Graph */}
      </svg>
      
      {/* Center Countdown Text */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', filter: 'drop-shadow(0 0 10px rgba(10, 34, 64, 0.2))' }}>
          <TickerText text={minutes} color={COLORS.CorporateBlue} fontSize="56px" fontWeight={300} />
          <div style={{
            color: COLORS.CorporateBlue,
            fontSize: '56px',
            fontWeight: 300,
            fontFamily: 'sans-serif',
            margin: '0 4px',
            paddingBottom: '8px'
          }}>:</div>
          <TickerText text={seconds} color={COLORS.CorporateBlue} fontSize="56px" fontWeight={300} />
        </div>
      </div>
    </div>
  );
}

// --- Simulation Control Bar ---
function SimulationControlBar({ timerState, selectedDuration, onStart, onPause, onStop, onDurationSelect }: any) {
  return (
    <div className="flex-col items-center w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {(timerState === TimerState.STOPPED || timerState === TimerState.FINISHED) ? (
          <motion.div
            key="stopped"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex-col w-full"
          >
            <div className="flex-row justify-around w-full" style={{ marginBottom: '16px' }}>
                <button className={`btn-preset ${selectedDuration === 60 ? 'active' : ''}`} onClick={() => onDurationSelect(60)}>
                  <span>1 MIN</span>
                </button>
                <button className={`btn-preset ${selectedDuration === 180 ? 'active' : ''}`} onClick={() => onDurationSelect(180)}>
                  <span>3 MIN</span>
                </button>
                <button className={`btn-preset ${selectedDuration === 300 ? 'active' : ''}`} onClick={() => onDurationSelect(300)}>
                  <span>5 MIN</span>
                </button>
                <button className={`btn-preset ${selectedDuration === 0 ? 'active' : ''}`} onClick={() => onDurationSelect(0)}>
                  <span style={{ fontSize: '18px' }}>∞</span>
                </button>
              </div>
              <button className="btn-primary w-full" onClick={onStart}>
                <Play size={20} fill="currentColor" />
                <span>{timerState === TimerState.FINISHED ? "RESTART SIMULATOR" : "LAUNCH SIMULATOR"}</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="running"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="flex-row w-full" style={{ gap: '16px' }}
            >
              <button className="btn-outline" style={{ flex: 1 }} onClick={onStop}>
                <Square size={20} fill="currentColor" />
                <span style={{ marginLeft: '8px' }}>STOP</span>
              </button>
              {timerState === TimerState.RUNNING ? (
                <button className="btn-solid-gray" style={{ flex: 1 }} onClick={onPause}>
                  <Pause size={20} fill="currentColor" />
                  <span style={{ marginLeft: '8px' }}>PAUSE</span>
                </button>
              ) : (
                <button className="btn-primary" style={{ flex: 1 }} onClick={onStart}>
                  <Play size={20} fill="currentColor" />
                  <span style={{ marginLeft: '8px' }}>RESUME</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}

// --- Main App ---
export default function App() {
  const timer = useSimulationTimer(0); // Default to ∞ mode
  const [animatedElapsed, setAnimatedElapsed] = useState(0);

  const unitsPerSecond = 229 / 60;
  const totalElapsedSeconds = timer.elapsedSeconds;
  const isInfinite = timer.selectedDurationSeconds === 0;

  // Smooth animation for elapsed
  useEffect(() => {
    let frame: number;
    const animate = () => {
      setAnimatedElapsed(prev => {
        const diff = totalElapsedSeconds - prev;
        if (Math.abs(diff) < 0.01) return totalElapsedSeconds;
        return prev + diff * 0.1; // Smooth interpolation
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [totalElapsedSeconds]);

  // If stopped and reset, instantly reset animation
  useEffect(() => {
    if (timer.timerState === TimerState.STOPPED) {
      setAnimatedElapsed(0);
    }
  }, [timer.timerState]);

  const unitsCollected = Math.floor(animatedElapsed * unitsPerSecond);
  const livesSaved = unitsCollected * 3;

  const reportUnits = Math.floor(totalElapsedSeconds * unitsPerSecond);
  const reportLives = reportUnits * 3;

  const progress = isInfinite ? 0 : (timer.selectedDurationSeconds > 0 ? (totalElapsedSeconds / timer.selectedDurationSeconds) : 0);

  const formatNum = (n: number) => new Intl.NumberFormat('en-US').format(n);

  return (
    <div className="flex-col justify-between" style={{ minHeight: '100vh', background: COLORS.BackgroundMain }}>
      
      {/* Scrollable Content Area */}
      <main className="flex-col items-center" style={{ flex: 1, padding: '24px 24px', paddingBottom: '32px', overflowY: 'auto' }}>
        
        {/* Header */}
        <div className="flex-col items-center mt-4 text-center">
          <img src="/logo.png" alt="KanAkademi Logo" style={{ height: '80px', marginBottom: '8px' }} />
          <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1.5px' }} className="text-gradient">
            BloodMetry Simulator
          </div>
          <div style={{ color: COLORS.InstitutionalGray, fontSize: '12px', fontWeight: 500, marginTop: '4px' }}>
            KanAkademi Global Impact Projection
          </div>
        </div>

        <div style={{ height: '32px' }} />

        {/* Centerpiece: Radial Progress Ring */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '16px' }}>
          <RadialProgressGauge 
            progress={progress} 
            isRunning={timer.timerState === TimerState.RUNNING} 
            currentSeconds={totalElapsedSeconds}
            isInfinite={isInfinite}
          />
        </div>

        <div style={{ height: '32px' }} />

        {/* Dynamic Layout matching Android */}
        <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Running Stats (only when NOT finished/paused) */}
          {(timer.timerState !== TimerState.FINISHED && timer.timerState !== TimerState.PAUSED) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-col w-full items-center"
            >
              <div className="flex-row w-full justify-around items-center">
                <div className="flex-col items-center">
                  <span style={{ color: COLORS.InstitutionalGray, fontSize: '11px', fontWeight: 'bold' }}>UNITS USED</span>
                  <span style={{ color: COLORS.CorporateBlue, fontSize: '36px', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatNum(unitsCollected)}</span>
                </div>
                <div style={{ height: '40px', width: '1px', background: COLORS.InstitutionalGray, opacity: 0.3 }} />
                <div className="flex-col items-center">
                  <span style={{ color: COLORS.InstitutionalGray, fontSize: '11px', fontWeight: 'bold' }}>POTENTIAL LIVES SAVED</span>
                  <span style={{ color: COLORS.LiveGreen, fontSize: '36px', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatNum(livesSaved)}</span>
                </div>
              </div>
              <div style={{ color: COLORS.CorporateBlue, fontSize: '13px', fontWeight: 500, fontStyle: 'italic', marginTop: '24px', textAlign: 'center', maxWidth: '85%' }}>
                "Around 118.5 million units of donated blood are collected globally every year."
              </div>
            </motion.div>
          )}

          {/* Control Bar */}
          <div style={{ 
             borderTop: `1px solid rgba(160, 170, 181, 0.2)`, 
             paddingTop: '32px',
             width: '100%' 
          }}>
            <SimulationControlBar 
              timerState={timer.timerState} 
              selectedDuration={timer.selectedDurationSeconds} 
              onStart={timer.onStart} 
              onPause={timer.onPause} 
              onStop={timer.onStop} 
              onDurationSelect={timer.onDurationSelect} 
            />
          </div>

          {/* Summary Report (only when finished/paused) */}
          {(timer.timerState === TimerState.FINISHED || timer.timerState === TimerState.PAUSED) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-col items-center" 
              style={{ background: 'rgba(160, 170, 181, 0.1)', border: `1px solid rgba(160, 170, 181, 0.3)`, borderRadius: '12px', padding: '24px', width: '100%' }}
            >
              <div className="text-gradient" style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1.5px', marginBottom: '24px' }}>
                SIMULATION SUMMARY REPORT
              </div>
              <div className="flex-row w-full justify-around">
                <div className="flex-col items-center">
                  <span style={{ color: COLORS.InstitutionalGray, fontSize: '10px', fontWeight: 'bold', marginBottom: '8px' }}>UNITS USED</span>
                  <span style={{ color: COLORS.CorporateRed, fontSize: '32px', fontWeight: 900, fontFamily: 'monospace' }}>{formatNum(reportUnits)}</span>
                </div>
                <div className="flex-col items-center">
                  <span style={{ color: COLORS.InstitutionalGray, fontSize: '10px', fontWeight: 'bold', marginBottom: '8px' }}>LIVES SAVED</span>
                  <span style={{ color: COLORS.LiveGreen, fontSize: '32px', fontWeight: 900, fontFamily: 'monospace' }}>{formatNum(reportLives)}</span>
                </div>
              </div>
              <div style={{ color: COLORS.CorporateBlue, fontSize: '13px', fontWeight: 500, fontStyle: 'italic', marginTop: '24px', textAlign: 'center' }}>
                "Around 118.5 million units of donated blood are collected globally every year."
              </div>
              {timer.timerState === TimerState.FINISHED && (
                <div style={{ width: '100%', marginTop: '24px' }}>
                  <button className="bg-gradient flex-row items-center justify-center w-full" style={{ border: 'none', height: '48px', borderRadius: '8px', gap: '8px', cursor: 'pointer' }}>
                    <Info size={18} color={COLORS.ElectricWhite} />
                    <span style={{ color: COLORS.ElectricWhite, fontWeight: 500, fontSize: '14px' }}>Explore KanAkademi Resources</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </div>

      </main>
    </div>
  );
}
