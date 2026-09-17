import React, { useEffect, useRef, useState } from 'react';
import { BlueQuestionAttempt } from '../../types/blue-test';
import { getSevenColorDefinition, getEffectiveAttemptValues } from '../../domain/blue-test/color-engine';
import { BlueTestFaceIndicator } from './BlueTestFaceIndicator';
import { playScoreEffect } from '../../audio/audio-service';
import {
  ArrowRight,
  RotateCcw,
  Edit3,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
} from 'lucide-react';

interface BlueTestResultReviewProps {
  attempt: BlueQuestionAttempt;
  totalQuestions?: number; // 49
  onNextQuestion: () => void;
  onOpenCorrection: () => void;
  onReplayEndBell?: () => void;
  isErrorState?: boolean;
  onRetrySave?: () => void;
}

export const BlueTestResultReview: React.FC<BlueTestResultReviewProps> = ({
  attempt,
  totalQuestions = 49,
  onNextQuestion,
  onOpenCorrection,
  onReplayEndBell,
  isErrorState = false,
  onRetrySave,
}) => {
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  // Interaction lock to prevent immediate key activation
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [keyReleasedSinceOpen, setKeyReleasedSinceOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsLocked(true);
    setKeyReleasedSinceOpen(false);

    const { effectiveCompletionRatio } = getEffectiveAttemptValues(attempt);
    playScoreEffect(effectiveCompletionRatio);

    const lockTimer = setTimeout(() => {
      setIsLocked(false);
    }, 500); // 500ms lock

    // Auto-focus primary button
    if (primaryButtonRef.current) {
      primaryButtonRef.current.focus();
    }

    return () => clearTimeout(lockTimer);
  }, [attempt.id]);

  // Handle global keydown/keyup for Space key continuation
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setKeyReleasedSinceOpen(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return;

      // Do not handle space if inside form input/textarea/editable
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (!isLocked && keyReleasedSinceOpen && !isErrorState) {
        e.preventDefault();
        onNextQuestion();
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLocked, keyReleasedSinceOpen, isErrorState, onNextQuestion]);

  const effectiveDef = getSevenColorDefinition(attempt.effectiveColor);
  const derivedDef = getSevenColorDefinition(attempt.derivedColorAtStop);

  const { effectiveElapsedSeconds, effectiveCompletionRatio } = getEffectiveAttemptValues(attempt);

  const isCorrected = attempt.completionMode === 'correction' || attempt.effectiveColor !== attempt.derivedColorAtStop;

  const displayEffectiveElapsed = effectiveElapsedSeconds.toFixed(1);
  const displayMax = attempt.maxTimeSecondsRaw.toFixed(1);
  const effectivePercentVal = Math.round(effectiveCompletionRatio * 100);

  const displayObservedElapsed = attempt.elapsedSecondsRaw.toFixed(1);
  const observedPercentVal = Math.round(attempt.completionRatio * 100);

  const isLastQuestion = attempt.globalQuestionOrder === totalQuestions;
  const isSessionEnd = attempt.questionInSession === 7;

  let primaryActionText = 'Next Question';
  if (isLastQuestion) {
    primaryActionText = 'View Test Summary';
  } else if (isSessionEnd) {
    primaryActionText = `Continue to Session ${attempt.sessionNumber + 1} Intro`;
  }

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'manual_end':
        return 'Manual End';
      case 'auto_max':
        return 'Auto Maximum';
      case 'manual_red':
        return 'Manual Red / False Start';
      case 'correction':
        return 'Teacher Corrected';
      default:
        return mode;
    }
  };

  return (
    <div className="bg-white border-2 border-slate-300 rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full mx-auto text-slate-900 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[88vh] sm:max-h-[85vh] overflow-hidden my-auto">
      {/* Top Banner (Header) */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4 bg-slate-50/80 shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-blue-100 text-blue-900 font-extrabold text-[11px] sm:text-xs rounded-full">
            Session {attempt.sessionNumber}
          </span>
          <span className="font-bold text-xs sm:text-sm text-slate-700">
            Q{attempt.globalQuestionOrder} / {totalQuestions}
          </span>
          <span className="text-[11px] sm:text-xs text-slate-500 hidden xs:inline">(Q{attempt.questionInSession} in Session)</span>
        </div>

        <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-slate-100 text-slate-700 text-[11px] sm:text-xs font-semibold rounded-lg flex items-center gap-1.5 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Recorded
        </span>
      </div>

      {/* Scrollable Body Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-5">
        {/* Persistence Error Notice */}
        {isErrorState && (
          <div className="p-3 sm:p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-900">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0" />
              <span>Result failed to save to storage. Please retry.</span>
            </div>
            {onRetrySave && (
              <button
                onClick={onRetrySave}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all text-xs shrink-0"
              >
                Retry Save
              </button>
            )}
          </div>
        )}

        {/* Main Measurement Headline */}
        <div className="text-center space-y-1 sm:space-y-2 py-1">
          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 font-bold">
            {isCorrected ? 'Effective Conscious Time (Teacher Rescored)' : 'Measured Conscious Time'}
          </p>
          <div className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-slate-900">
            {isCorrected ? (
              <>
                Effective <span className="text-blue-600">{displayEffectiveElapsed}s</span> / {displayMax}s ({effectivePercentVal}%)
              </>
            ) : (
              <>
                Ended at <span className="text-blue-600">{displayEffectiveElapsed}s</span> / {displayMax}s ({effectivePercentVal}%)
              </>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Raw precision: {effectiveElapsedSeconds.toFixed(4)}s
          </p>

          {/* Audit Trail Box if Corrected */}
          {isCorrected && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1 text-left">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <span className="px-1.5 py-0.5 bg-amber-600 text-white rounded text-[10px] uppercase font-black">Audit Log</span>
                Original Observed Measurement Preserved
              </div>
              <div className="text-[11px] text-amber-800 space-y-0.5 font-mono">
                <div title="Max Conscious Time">Max Conscious Time (MCT): <strong>{displayObservedElapsed}s</strong> ({observedPercentVal}%)</div>
                <div>Derived Color at Stop: <strong style={{ color: derivedDef.hex }}>{derivedDef.labelEn}</strong></div>
                {attempt.correctionReason && (
                  <div className="font-sans italic text-slate-600 pt-0.5">Reason: "{attempt.correctionReason}"</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 7-Color Result Badge */}
        <div
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 shadow-xs"
          style={{
            backgroundColor: `${effectiveDef.hex}15`,
            borderColor: effectiveDef.hex,
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md shrink-0"
              style={{ backgroundColor: effectiveDef.hex }}
            >
              {attempt.effectiveColor.substring(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                {effectiveDef.labelEn}
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-600">
                {effectivePercentVal}% of available conscious time ({displayEffectiveElapsed}s of {displayMax}s)
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-[11px] sm:text-xs space-y-0.5 w-full sm:w-auto border-t sm:border-t-0 border-slate-200/60 pt-1.5 sm:pt-0">
            <span className="block font-bold text-slate-700">Mode: {getModeLabel(attempt.completionMode)}</span>
            {attempt.completionMode === 'correction' && (
              <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded">
                Teacher Corrected
              </span>
            )}
          </div>
        </div>

        {/* Face Indicator Stopped */}
        <BlueTestFaceIndicator
          completionRatio={effectiveCompletionRatio}
          activeColor={attempt.effectiveColor}
          isStopped={true}
        />

        {/* Key Shortcut Hint */}
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl px-3 py-2 text-xs text-slate-600">
          <span className="flex items-center gap-1.5 font-semibold text-[11px] sm:text-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            Press Space to activate primary action
          </span>
          <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded-md font-mono text-slate-800 font-bold shadow-2xs text-[10px] sm:text-xs">
            Space
          </kbd>
        </div>
      </div>

      {/* Sticky Bottom Action Footer */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs p-3 sm:p-4 border-t border-slate-200 z-20 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0 shadow-md">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenCorrection}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-all flex items-center justify-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-600" /> Correct Result
          </button>

          {onReplayEndBell && (
            <button
              onClick={onReplayEndBell}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-all flex items-center justify-center gap-1"
              title="Replay End Bell"
            >
              <Volume2 className="w-3.5 h-3.5 text-slate-600" /> Bell
            </button>
          )}
        </div>

        <button
          ref={primaryButtonRef}
          onClick={onNextQuestion}
          disabled={isErrorState}
          className={`w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
            isErrorState
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 active:scale-95 ring-2 ring-blue-400/40 shadow-blue-600/30'
          }`}
        >
          <span>{primaryActionText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
