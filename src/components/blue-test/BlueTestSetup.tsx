import React, { useState } from 'react';
import { Learner } from '../../types/common';
import { AudioSettings } from '../../types/blue-test';
import { generateDefaultBluePackage } from '../../domain/blue-test/timing-engine';
import { LearnerSetupModule } from './LearnerSetupModule';
import { Sparkles, Play, Volume2, ListOrdered, FileSpreadsheet, ChevronDown, ChevronUp, Layers, HelpCircle, Bell, Clock } from 'lucide-react';

interface BlueTestSetupProps {
  selectedLearner: Learner | null;
  onSelectLearner: (learner: Learner) => void;
  audioSettings: AudioSettings;
  onUpdateAudioSettings: (settings: AudioSettings) => void;
  onStartTest: () => void;
  onOpenAdminFixture: () => void;
  onOpenAudioManagement?: () => void;
}

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
  label: string;
}

const ToggleSwitch: React.FC<SwitchProps> = ({ checked, onChange, id, label }) => {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-slate-300'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

/* Collapsible Autoplay Setup Component */
export const AutoplaySetupSection: React.FC<{
  audioSettings: AudioSettings;
  onUpdateAudioSettings: (settings: AudioSettings) => void;
}> = ({ audioSettings, onUpdateAudioSettings }) => {
  const [isOpen, setIsOpen] = useState(true);

  const isTestIntroOn = Boolean(audioSettings?.autoplayTestIntro ?? audioSettings?.autoplayPackageIntro);
  const isSessionIntroOn = Boolean(audioSettings?.autoplaySessionIntro);
  const isChallengeAudioOn = Boolean(audioSettings?.autoplayChallengeAudio ?? audioSettings?.autoplayQuestionCue ?? audioSettings?.autoplayQuestionNumber);

  const activeCount = [isTestIntroOn, isSessionIntroOn, isChallengeAudioOn].filter(Boolean).length;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs transition-all space-y-4">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl p-1 -m-1"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-xs">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Autoplay Setup</h3>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                activeCount > 0 
                  ? 'bg-blue-50 text-blue-700 border-blue-200/80' 
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {activeCount} of 3 enabled
              </span>
            </div>
            <p className="text-xs text-slate-500">Automated narration and question audio triggers</p>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="pt-2 border-t border-slate-100 space-y-3.5">
          {/* Switch 1: Auto Play Test Intro */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-colors">
            <div className="flex items-start gap-3 min-w-0 pr-3">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div>
                <label htmlFor="switch-test-intro" className="font-bold text-slate-800 text-xs cursor-pointer block">
                  Auto Play Test Intro
                </label>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Automatically plays Blue Test introduction audio at the start of observation.
                </p>
              </div>
            </div>
            <ToggleSwitch
              id="switch-test-intro"
              label="Auto Play Test Intro"
              checked={isTestIntroOn}
              onChange={(checked) =>
                onUpdateAudioSettings({
                  ...audioSettings,
                  autoplayTestIntro: checked,
                  autoplayPackageIntro: checked,
                })
              }
            />
          </div>

          {/* Switch 2: Auto Play Session Intro */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-colors">
            <div className="flex items-start gap-3 min-w-0 pr-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <label htmlFor="switch-session-intro" className="font-bold text-slate-800 text-xs cursor-pointer block">
                  Auto Play Session Intro
                </label>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Automatically plays Session intro audio when advancing between Sessions 1–7.
                </p>
              </div>
            </div>
            <ToggleSwitch
              id="switch-session-intro"
              label="Auto Play Session Intro"
              checked={isSessionIntroOn}
              onChange={(checked) =>
                onUpdateAudioSettings({
                  ...audioSettings,
                  autoplaySessionIntro: checked,
                })
              }
            />
          </div>

          {/* Switch 3: Auto Play Challenge Audio */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-colors">
            <div className="flex items-start gap-3 min-w-0 pr-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <label htmlFor="switch-challenge-audio" className="font-bold text-slate-800 text-xs cursor-pointer block">
                  Auto Play Challenge Audio
                </label>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Automatically plays unique Question / Challenge prompt audio when entering questions.
                </p>
              </div>
            </div>
            <ToggleSwitch
              id="switch-challenge-audio"
              label="Auto Play Challenge Audio"
              checked={isChallengeAudioOn}
              onChange={(checked) =>
                onUpdateAudioSettings({
                  ...audioSettings,
                  autoplayChallengeAudio: checked,
                  autoplayQuestionCue: checked,
                  autoplayQuestionNumber: checked,
                })
              }
            />
          </div>

          {/* Switch 4: Clock Sound Loop (1 Medium Sound) */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-colors">
            <div className="flex items-start gap-3 min-w-0 pr-3">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <label htmlFor="switch-clock-sound" className="font-bold text-slate-800 text-xs cursor-pointer block">
                  Clock Sound Loop (Medium Clock)
                </label>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Plays 1 steady medium clock sound loop during timing. Enable or disable anytime.
                </p>
              </div>
            </div>
            <ToggleSwitch
              id="switch-clock-sound"
              label="Clock Sound Loop"
              checked={Boolean(audioSettings?.timerSoundEnabled)}
              onChange={(checked) =>
                onUpdateAudioSettings({
                  ...audioSettings,
                  timerSoundEnabled: checked,
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const BlueTestSetup: React.FC<BlueTestSetupProps> = ({
  selectedLearner,
  onSelectLearner,
  audioSettings,
  onUpdateAudioSettings,
  onStartTest,
  onOpenAdminFixture,
  onOpenAudioManagement,
}) => {
  const defaultPkg = generateDefaultBluePackage();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Blue Test Setup Header */}
      <div className="bg-gradient-to-r from-blue-900/20 via-slate-900 to-indigo-900/20 border border-blue-500/30 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Blue Test 7-Color Timing Engine
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              1-1 Learner Observation Setup
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Exactly 7 sessions × 7 questions (49 questions total). Threshold Conscious Time (TCT) models start at 0s and scale up to 77.0s across 7 exponential sessions.
            </p>
          </div>

          <button
            onClick={onStartTest}
            disabled={!selectedLearner}
            className={`w-full md:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2.5 ${
              selectedLearner 
                ? 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/25 ring-2 ring-blue-400/40' 
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            Launch Observation Room
          </button>
        </div>
      </div>

      {/* Main Grid: Compact Learner CRUD Module & Autoplay Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compact Learner Setup & Management Module */}
        <LearnerSetupModule
          selectedLearner={selectedLearner}
          onSelectLearner={onSelectLearner}
        />

        {/* Collapsible Autoplay Setup Module */}
        <div className="space-y-6">
          <AutoplaySetupSection
            audioSettings={audioSettings}
            onUpdateAudioSettings={onUpdateAudioSettings}
          />

          {/* Secondary Controls & Audio Studio */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              Additional Narration Controls
            </h4>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
              <div>
                <p className="font-bold text-slate-800">Package End Narration</p>
                <p className="text-slate-500 text-[11px]">Autoplay when Q49 finalizes</p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(audioSettings?.autoplayPackageEnd)}
                onChange={(e) =>
                  onUpdateAudioSettings({ ...audioSettings, autoplayPackageEnd: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
              <div>
                <p className="font-bold text-slate-800">Start & End Bell Audio Chimes</p>
                <p className="text-slate-500 text-[11px]">Synthesizer bell audio triggers</p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(audioSettings?.enableBells)}
                onChange={(e) =>
                  onUpdateAudioSettings({ ...audioSettings, enableBells: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500"
              />
            </label>

            {onOpenAudioManagement && (
              <button
                onClick={onOpenAudioManagement}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-blue-300" />
                Manage Gemini TTS Audio Assets Studio
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Package Structure & Admin Review Link */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-blue-600" />
            Standard Package: {defaultPkg.name}
          </h4>
          <p className="text-xs text-slate-500">
            Contains 7 sessions, 49 max conscious timing thresholds calculated via raw model L_n = 1.86^n.
          </p>
        </div>

        <button
          onClick={onOpenAdminFixture}
          className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4 text-slate-600" />
          Review 49-Row Fixture
        </button>
      </div>
    </div>
  );
};

