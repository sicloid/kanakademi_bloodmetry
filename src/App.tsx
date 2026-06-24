import { useState, useEffect } from 'react';
import { Play, Square, Pause, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSimulationTimer, TimerState } from './hooks/useSimulationTimer';

const COLORS = {
  CorporateRed: '#E60033',
  CorporateBlue: '#0A2240',
  LiveGreen: '#00FF55',
  InstitutionalGray: '#A0AAB5',
  ElectricWhite: '#FFFFFF',
  BackgroundPureBlack: '#000000'
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

// --- Radial Progress Gauge ---
function RadialProgressGauge({ progress, isRunning, remainingSeconds }: { progress: number, isRunning: boolean, remainingSeconds: number }) {
  const size = 300;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const halfCircumference = circumference / 2;
  
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let frame: number;
    let startTime = performance.now();
    const animate = (time: number) => {
      // 1500ms duration for 2PI phase
      const elapsed = time - startTime;
      const newPhase = (elapsed % 1500) / 1500 * 2 * Math.PI;
      setPhase(newPhase);
      frame = requestAnimationFrame(animate);
    };
    if (isRunning) {
      frame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(frame);
  }, [isRunning]);

  // Generate heartbeat path
  const innerRadius = radius * 0.7;
  const points = [];
  for (let i = 0; i <= 360; i += 5) {
    const angleRad = (i * Math.PI) / 180 - Math.PI / 2;
    const normalizedProgress = i / 360;
    
    let spike = 0;
    if (normalizedProgress >= 0.4 && normalizedProgress <= 0.6) {
      const localOffset = (normalizedProgress - 0.4) / 0.2;
      if (localOffset < 0.2) spike = Math.sin(localOffset * 5 * Math.PI) * 20;
      else if (localOffset < 0.4) spike = 0;
      else if (localOffset < 0.5) spike = -40;
      else if (localOffset < 0.7) spike = 45;
      else if (localOffset < 0.85) spike = 0;
      else spike = Math.sin((localOffset - 0.85) * 6.6 * Math.PI) * 15;
    } else {
      spike = Math.sin(normalizedProgress * 10 * Math.PI - phase) * 5;
    }
    
    const currentRadius = innerRadius + spike;
    const x = size / 2 + currentRadius * Math.cos(angleRad);
    const y = size / 2 + currentRadius * Math.sin(angleRad);
    points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
  }
  const heartbeatPath = points.join(' ') + ' Z';

  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
  const seconds = (remainingSeconds % 60).toString().padStart(2, '0');

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="rightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.CorporateRed} />
            <stop offset="25%" stopColor={COLORS.CorporateRed} />
            <stop offset="50%" stopColor={COLORS.CorporateBlue} />
            <stop offset="75%" stopColor={COLORS.CorporateRed} />
            <stop offset="100%" stopColor={COLORS.CorporateRed} />
          </linearGradient>
          <linearGradient id="leftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.CorporateRed} />
            <stop offset="25%" stopColor={COLORS.CorporateRed} />
            <stop offset="50%" stopColor={COLORS.CorporateBlue} />
            <stop offset="75%" stopColor={COLORS.CorporateRed} />
            <stop offset="100%" stopColor={COLORS.CorporateRed} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(160, 170, 181, 0.3)" strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Glow Track (visible when progress > 0) */}
        {progress > 0 && (
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(230, 0, 51, 0.06)" strokeWidth={strokeWidth * 2.5}
            strokeDasharray={`${halfCircumference * progress * 2} ${circumference}`}
            strokeDashoffset={0}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}

        {/* Right Arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="url(#rightGrad)" strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${halfCircumference} ${circumference}`}
          strokeDashoffset={halfCircumference - (halfCircumference * progress)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />

        {/* Left Arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="url(#leftGrad)" strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${halfCircumference} ${circumference}`}
          strokeDashoffset={halfCircumference - (halfCircumference * progress)}
          transform={`rotate(-90 ${size / 2} ${size / 2}) scale(1, -1) translate(0, -${size})`}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />

        {/* Heartbeat Graph */}
        {isRunning && (
          <path
            d={heartbeatPath}
            fill="none"
            stroke="rgba(230,0,51,0.5)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      
      {/* Center Countdown Text */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TickerText text={minutes} color={COLORS.ElectricWhite} fontSize="56px" fontWeight={300} />
          <div style={{
            color: COLORS.ElectricWhite,
            fontSize: '56px',
            fontWeight: 300,
            fontFamily: 'sans-serif',
            margin: '0 4px',
            paddingBottom: '8px',
            textShadow: `0 0 25px ${COLORS.ElectricWhite}99`
          }}>:</div>
          <TickerText text={seconds} color={COLORS.ElectricWhite} fontSize="56px" fontWeight={300} />
        </div>
      </div>
    </div>
  );
}

// --- Simulation Control Bar ---
function SimulationControlBar({ timerState, selectedDuration, onStart, onPause, onStop, onDurationSelect }: any) {
  return (
    <div style={{ width: '100%' }}>
      <div className="flex-col items-center w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {(timerState === TimerState.STOPPED || timerState === TimerState.FINISHED) ? (
            <motion.div
              key="stopped"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="flex-col w-full"
            >
              <div className="flex-row justify-around w-full mb-4">
                <button className={`btn-preset ${selectedDuration === 60 ? 'active' : ''}`} onClick={() => onDurationSelect(60)}>
                  <span>1 MIN</span>
                </button>
                <button className={`btn-preset ${selectedDuration === 180 ? 'active' : ''}`} onClick={() => onDurationSelect(180)}>
                  <span>3 MIN</span>
                </button>
                <button className={`btn-preset ${selectedDuration === 300 ? 'active' : ''}`} onClick={() => onDurationSelect(300)}>
                  <span>5 MIN</span>
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
              <button className="btn-outline flex-1" onClick={onStop}>
                <Square size={20} fill="currentColor" />
                <span>STOP</span>
              </button>
              {timerState === TimerState.RUNNING ? (
                <button className="btn-solid-gray flex-1" onClick={onPause}>
                  <Pause size={20} fill="currentColor" />
                  <span>PAUSE</span>
                </button>
              ) : (
                <button className="btn-primary flex-1" onClick={onStart}>
                  <Play size={20} fill="currentColor" />
                  <span>RESUME</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Main App ---
export default function App() {
  const timer = useSimulationTimer(300); // Default 5 mins
  const [animatedElapsed, setAnimatedElapsed] = useState(0);

  const unitsPerSecond = 229 / 60;
  const totalElapsedSeconds = timer.selectedDurationSeconds - timer.remainingSeconds;

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

  const progress = timer.selectedDurationSeconds > 0 ? (animatedElapsed / timer.selectedDurationSeconds) : 0;

  const formatNum = (n: number) => new Intl.NumberFormat('en-US').format(n);

  return (
    <div className="flex-col justify-between" style={{ minHeight: '100vh', background: COLORS.BackgroundPureBlack }}>
      
      {/* Scrollable Content Area */}
      <main className="flex-col items-center" style={{ flex: 1, padding: '16px 24px', paddingBottom: '100px', overflowY: 'auto' }}>
        
        {/* Header */}
        <div className="flex-col items-center mt-4">
          <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1.5px' }} className="text-gradient">
            TIME-BOUND SIMULATOR
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
            remainingSeconds={timer.remainingSeconds} 
          />
        </div>

        <div style={{ height: '32px' }} />

        {/* Simulation Controls */}
        <div style={{ width: '100%', maxWidth: '500px', marginBottom: '32px' }}>
          <SimulationControlBar 
            timerState={timer.timerState} 
            selectedDuration={timer.selectedDurationSeconds} 
            onStart={timer.onStart} 
            onPause={timer.onPause} 
            onStop={timer.onStop} 
            onDurationSelect={timer.onDurationSelect} 
          />
        </div>

        {/* Stats / Report Panel */}
        <div style={{ width: '100%', maxWidth: '500px' }}>
          {(timer.timerState === TimerState.FINISHED || timer.timerState === TimerState.PAUSED) ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-col items-center" 
              style={{ background: 'rgba(160, 170, 181, 0.3)', border: `1px solid ${COLORS.InstitutionalGray}`, borderRadius: '12px', padding: '20px' }}
            >
              <div className="text-gradient" style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '16px' }}>
                SIMULATION SUMMARY REPORT
              </div>
              <div className="flex-row w-full justify-around">
                <div className="flex-col items-center">
                  <span style={{ color: COLORS.InstitutionalGray, fontSize: '10px', fontWeight: 'bold' }}>UNITS SECURED</span>
                  <span style={{ color: COLORS.CorporateRed, fontSize: '28px', fontWeight: 900, fontFamily: 'monospace' }}>{formatNum(reportUnits)}</span>
                </div>
                <div className="flex-col items-center">
                  <span style={{ color: COLORS.InstitutionalGray, fontSize: '10px', fontWeight: 'bold' }}>LIVES SAVED</span>
                  <span style={{ color: COLORS.LiveGreen, fontSize: '28px', fontWeight: 900, fontFamily: 'monospace' }}>{formatNum(reportLives)}</span>
                </div>
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
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-row w-full justify-around items-center"
            >
              <div className="flex-col items-center">
                <span style={{ color: COLORS.InstitutionalGray, fontSize: '11px', fontWeight: 'bold' }}>UNITS SECURED</span>
                <span style={{ color: COLORS.ElectricWhite, fontSize: '36px', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatNum(unitsCollected)}</span>
              </div>
              <div style={{ height: '40px', width: '1px', background: COLORS.InstitutionalGray }} />
              <div className="flex-col items-center">
                <span style={{ color: COLORS.InstitutionalGray, fontSize: '11px', fontWeight: 'bold' }}>POTENTIAL LIVES SAVED</span>
                <span style={{ color: COLORS.LiveGreen, fontSize: '36px', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatNum(livesSaved)}</span>
              </div>
            </motion.div>
          )}
        </div>

      </main>
    </div>
  );
}
