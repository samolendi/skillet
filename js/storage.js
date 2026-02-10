// ============================================================
// storage.js — localStorage persistence (multi-section)
// ============================================================

const STORAGE_KEY = 'design-strengths-quiz-v2';

const Storage = {
  save(state) {
    try {
      const data = {
        responses: state.responses,
        currentSection: state.currentSection,
        currentIndex: state.currentIndex,
        timestamp: new Date().toISOString(),
        version: 2,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || data.version !== 2) return null;
      return data;
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
