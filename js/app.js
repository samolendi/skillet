// ============================================================
// app.js — Multi-section state machine, routing, events
// ============================================================

const App = {
  state: {
    screen: 'landing',       // landing | sections | category-overview | question | results | section-results
    currentSection: 'preferences',
    currentIndex: 0,
    responses: {},
  },

  root: null,

  init() {
    this.root = document.getElementById('main');

    const saved = Storage.load();
    if (saved) {
      this.state.responses = saved.responses || {};
      this.state.currentSection = saved.currentSection || 'preferences';
      this.state.currentIndex = saved.currentIndex || 0;
    }

    window.addEventListener('hashchange', () => this.handleHash());
    this.root.addEventListener('click', (e) => this.handleClick(e));
    this.root.addEventListener('change', (e) => this.handleChange(e));
    this.root.addEventListener('keydown', (e) => this.handleKeydown(e));

    if (window.location.hash) {
      this.handleHash();
    } else {
      this.render();
    }
  },

  navigate(screen, params = {}) {
    this.state.screen = screen;
    Object.assign(this.state, params);

    let hash = `#${screen}`;
    if (screen === 'question') hash = `#q/${this.state.currentSection}/${this.state.currentIndex}`;
    else if (screen === 'category-overview') hash = `#overview/${this.state.currentSection}`;
    else if (screen === 'section-results') hash = `#results/${this.state.currentSection}`;
    history.replaceState(null, '', hash);

    this.render();
    this.save();
  },

  handleHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return this.navigate('landing');

    if (hash.startsWith('q/')) {
      const parts = hash.split('/');
      const sec = parts[1];
      const idx = parseInt(parts[2], 10);
      if (SECTION_QUESTIONS[sec] && !isNaN(idx) && idx >= 0 && idx < SECTION_QUESTIONS[sec].length) {
        return this.navigate('question', { currentSection: sec, currentIndex: idx });
      }
    }
    if (hash.startsWith('overview/')) {
      const sec = hash.split('/')[1];
      if (ALL_CATEGORIES[sec]) return this.navigate('category-overview', { currentSection: sec });
    }
    if (hash.startsWith('results/')) {
      const sec = hash.split('/')[1];
      if (ALL_CATEGORIES[sec]) return this.navigate('section-results', { currentSection: sec });
    }
    if (hash === 'sections') return this.navigate('sections');
    if (hash === 'results') return this.navigate('results');
    if (hash === 'landing') return this.navigate('landing');

    this.navigate('landing');
  },

  render() {
    let html = '';
    const { screen, currentSection, currentIndex, responses } = this.state;

    switch (screen) {
      case 'landing':
        html = Components.landing(Storage.hasSavedProgress());
        break;
      case 'sections':
        html = Components.sectionSelect(responses);
        break;
      case 'category-overview':
        html = Components.categoryOverview(currentSection, responses);
        break;
      case 'question':
        html = Components.question(currentSection, currentIndex, responses);
        break;
      case 'section-results':
        if (currentSection === 'preferences') html = Components.resultsS1(responses);
        else if (currentSection === 'environment') html = Components.resultsS2(responses);
        else if (currentSection === 'accommodations') html = Components.resultsS3(responses);
        break;
      case 'results':
        html = Components.allResults(responses);
        break;
      default:
        html = Components.landing(false);
    }

    this.root.innerHTML = html;

    // Animate bars
    if (screen === 'section-results' || screen === 'results') {
      requestAnimationFrame(() => {
        this.root.querySelectorAll('[data-width]').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      });
    }

    this.root.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  },

  handleClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;

    switch (action) {
      case 'start':
      case 'start-fresh':
        if (action === 'start-fresh') {
          Storage.clear();
          this.state.responses = {};
        }
        this.navigate('sections');
        break;

      case 'continue':
        this.navigate('sections');
        break;

      case 'back-to-landing':
        this.navigate('landing');
        break;

      case 'goto-sections':
        this.navigate('sections');
        break;

      case 'goto-section': {
        const sec = target.dataset.section;
        this.navigate('category-overview', { currentSection: sec });
        break;
      }

      case 'goto-category-overview': {
        const sec = target.dataset.section;
        this.navigate('category-overview', { currentSection: sec });
        break;
      }

      case 'goto-category': {
        const sec = target.dataset.section;
        const catId = target.dataset.category;
        const idx = Scoring.firstUnansweredInCategory(sec, catId, this.state.responses);
        this.navigate('question', { currentSection: sec, currentIndex: idx });
        break;
      }

      case 'prev': {
        if (this.state.currentIndex > 0) {
          this.navigate('question', { currentIndex: this.state.currentIndex - 1 });
        }
        break;
      }

      case 'next': {
        const total = SECTION_QUESTIONS[this.state.currentSection].length;
        if (this.state.currentIndex < total - 1) {
          this.navigate('question', { currentIndex: this.state.currentIndex + 1 });
        }
        break;
      }

      case 'finish-section': {
        const sec = target.dataset.section;
        this.navigate('category-overview', { currentSection: sec });
        break;
      }

      case 'view-section-results': {
        const sec = target.dataset.section;
        this.navigate('section-results', { currentSection: sec });
        break;
      }

      case 'view-all-results':
        this.navigate('results');
        break;

      case 'toggle-section': {
        const sectionId = target.dataset.section;
        const body = document.getElementById(`section-${sectionId}`);
        if (body) {
          const isOpen = body.classList.contains('results-section__body--open');
          body.classList.toggle('results-section__body--open');
          target.setAttribute('aria-expanded', !isOpen);
        }
        break;
      }

      case 'export-json': {
        const json = Storage.exportJSON(this.state);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'design-strengths-results.json';
        a.click();
        URL.revokeObjectURL(url);
        break;
      }

      case 'reset':
        if (confirm('This will clear all your answers. Are you sure?')) {
          Storage.clear();
          this.state.responses = {};
          this.state.currentIndex = 0;
          this.state.currentSection = 'preferences';
          this.navigate('landing');
        }
        break;

      case 'rate':
        break;
    }
  },

  handleChange(e) {
    const input = e.target;
    if (!input.dataset) return;

    if (input.dataset.action === 'rate') {
      this.state.responses[input.dataset.key] = parseInt(input.dataset.value, 10);
      this.save();
    }

    if (input.dataset.action === 'toggle') {
      this.state.responses[input.dataset.key] = input.checked ? 1 : 0;
      this.save();
    }
  },

  handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target.closest('[data-action]');
      if (target && target.getAttribute('role') === 'button') {
        e.preventDefault();
        target.click();
      }
    }

    if (this.state.screen === 'question') {
      if (e.key === 'ArrowLeft' && !e.target.matches('input')) {
        e.preventDefault();
        if (this.state.currentIndex > 0) {
          this.navigate('question', { currentIndex: this.state.currentIndex - 1 });
        }
      }
      if (e.key === 'ArrowRight' && !e.target.matches('input')) {
        e.preventDefault();
        const total = SECTION_QUESTIONS[this.state.currentSection].length;
        if (this.state.currentIndex < total - 1) {
          this.navigate('question', { currentIndex: this.state.currentIndex + 1 });
        }
      }
    }
  },

  save() {
    Storage.save(this.state);
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
