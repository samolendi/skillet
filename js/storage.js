// ============================================================
// storage.js — localStorage persistence (multi-section)
// ============================================================

const STORAGE_KEY = 'design-strengths-quiz-v3';
const STORAGE_KEY_V2 = 'design-strengths-quiz-v2';

const Storage = {
  save(state) {
    try {
      const data = {
        responses: state.responses,
        currentSection: state.currentSection,
        currentIndex: state.currentIndex,
        timestamp: new Date().toISOString(),
        version: 3,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && data.version === 3) return data;
      }
      // Migrate from v2: keep S2/S3 responses, discard S1 (incompatible)
      const oldRaw = localStorage.getItem(STORAGE_KEY_V2);
      if (oldRaw) {
        const oldData = JSON.parse(oldRaw);
        if (oldData && oldData.version === 2 && oldData.responses) {
          const migrated = {};
          for (const key of Object.keys(oldData.responses)) {
            if (key.startsWith('s2_') || key.startsWith('s3_')) {
              migrated[key] = oldData.responses[key];
            }
          }
          const newData = {
            responses: migrated,
            currentSection: oldData.currentSection || 'preferences',
            currentIndex: 0,
            timestamp: new Date().toISOString(),
            version: 3,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
          localStorage.removeItem(STORAGE_KEY_V2);
          return newData;
        }
      }
      return null;
    } catch (e) {
      console.warn('Storage load failed:', e);
      return null;
    }
  },

  hasSavedProgress() {
    const data = this.load();
    return data !== null && Object.keys(data.responses || {}).length > 0;
  },

  getAnsweredCount() {
    const data = this.load();
    if (!data || !data.responses) return 0;
    return Object.keys(data.responses).length;
  },

  getTotalInputs() {
    let total = 0;
    for (const sec of SECTIONS) {
      const questions = SECTION_QUESTIONS[sec.id];
      for (const q of questions) {
        for (const dim of q.dimensions) {
          total++;
        }
      }
    }
    return total;
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Storage clear failed:', e);
    }
  },

  exportJSON(state) {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      responses: state.responses,
    }, null, 2);
  }
};
