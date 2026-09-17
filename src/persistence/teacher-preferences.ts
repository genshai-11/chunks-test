export interface TeacherAudioSettings {
  autoplayTestIntro: boolean;
  autoplaySessionIntro: boolean;
  autoplayChallengeAudio: boolean;
  timerSoundEnabled: boolean;
  timerSoundVolume: number;
}

const DEFAULT_SETTINGS: TeacherAudioSettings = {
  autoplayTestIntro: false,
  autoplaySessionIntro: false,
  autoplayChallengeAudio: true, // Default to true based on previous Green Test? Will check below
  timerSoundEnabled: true,
  timerSoundVolume: 0.5
};

export class TeacherPreferencesService {
  static async getPreferences(): Promise<TeacherAudioSettings> {
    try {
      const res = await fetch('/api/teacher-preferences');
      if (res.ok) {
        const data = await res.json();
        return { ...DEFAULT_SETTINGS, ...data };
      }
    } catch (e) {
      console.warn('Failed to load teacher preferences from backend', e);
      throw e;
    }
    return DEFAULT_SETTINGS;
  }

  static async savePreferences(prefs: Partial<TeacherAudioSettings>): Promise<void> {
    const res = await fetch('/api/teacher-preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs)
    });
    if (!res.ok) {
      throw new Error('Failed to save teacher preferences');
    }
  }
}
