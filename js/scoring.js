// ============================================================
// scoring.js — Multi-section scoring, gap analysis, priority tiers
// ============================================================

const Scoring = {

  // ========== SECTION 1: PREFERENCES ==========
  // Combined Interest × Confidence (geometric mean)
  // Each statement has a single dimension (interest OR confidence)
  calculateS1(responses) {
    const results = [];
    for (const cat of S1_CATEGORIES) {
      const catResult = {
        id: cat.id, name: cat.name, color: cat.color,
        description: cat.description, subcategories: [],
        interest: 0, confidence: 0, combined: 0,
      };
      const catI = [], catC = [];

      for (const sub of cat.subcategories) {
        const subI = [], subC = [];
        for (const stmt of sub.statements) {
          const key = `${stmt.id}_${stmt.dimension}`;
          const val = responses[key];
          if (val !== undefined) {
            if (stmt.dimension === 'interest') { subI.push(val); catI.push(val); }
            else if (stmt.dimension === 'confidence') { subC.push(val); catC.push(val); }
          }
        }
        const si = mean(subI), sc = mean(subC);
        catResult.subcategories.push({
          id: sub.id, name: sub.name, subtitle: sub.subtitle,
          interest: si, confidence: sc, combined: geoMean(si, sc),
        });
      }
      catResult.interest = mean(catI);
      catResult.confidence = mean(catC);
      catResult.combined = geoMean(catResult.interest, catResult.confidence);
      results.push(catResult);
    }

    // Quadrant classification at subcategory level
    const strongest = [], highInterest = [], highConfidence = [], lowBoth = [];
    for (const cat of results) {
      for (const sub of cat.subcategories) {
        const item = { category: cat.name, subcategory: sub.name, interest: sub.interest, confidence: sub.confidence, color: cat.color };
        if (sub.interest >= 3 && sub.confidence >= 3) {
          strongest.push(item);
        } else if (sub.interest >= 3 && sub.confidence < 3) {
          highInterest.push(item);
        } else if (sub.confidence >= 3 && sub.interest < 3) {
          highConfidence.push(item);
        } else if (sub.interest <= 1 && sub.confidence <= 1) {
          lowBoth.push(item);
        }
      }
    }

    return {
      categories: results,
      ranked: [...results].sort((a, b) => b.combined - a.combined),
      quadrants: { strongest, highInterest, highConfidence, lowBoth },
    };
  },

  // ========== SECTION 2: ENVIRONMENT ==========
  // Importance score + Current satisfaction + Gap analysis
  calculateS2(responses) {
    const results = [];
    for (const cat of S2_CATEGORIES) {
      const catResult = {
        id: cat.id, name: cat.name, color: cat.color,
        description: cat.description, subcategories: [],
        importance: 0, current: 0, gap: 0,
      };
      const catImp = [], catCur = [];

      for (const sub of cat.subcategories) {
        const subImp = [];
        for (const stmt of sub.statements) {
          const v = responses[`${stmt.id}_importance`];
          if (v !== undefined) { subImp.push(v); catImp.push(v); }
        }
        // Current vs ideal statement
        let currentVal = null;
        if (sub.currentStatement) {
          currentVal = responses[`${sub.currentStatement.id}_current`];
          if (currentVal !== undefined) catCur.push(currentVal);
        }
        const imp = mean(subImp);
        catResult.subcategories.push({
          id: sub.id, name: sub.name, subtitle: sub.subtitle,
          importance: imp, current: currentVal, gap: currentVal !== null ? imp - currentVal : null,
        });
      }
      catResult.importance = mean(catImp);
      catResult.current = catCur.length ? mean(catCur) : null;
      catResult.gap = catResult.current !== null ? catResult.importance - catResult.current : null;
      results.push(catResult);
    }
    // Ranked by importance (descending)
    const ranked = [...results].sort((a, b) => b.importance - a.importance);
    // High-priority gaps: importance >= 3 AND gap >= 1.5 (on 0-4 scale)
    const gaps = results
      .filter(c => c.gap !== null && c.importance >= 3 && c.gap >= 1.5)
      .sort((a, b) => b.gap - a.gap);

    // Tier classification at subcategory level
    const urgentGaps = [], workingWell = [], lowPriority = [];
    for (const cat of results) {
      for (const sub of cat.subcategories) {
        const item = { category: cat.name, subcategory: sub.name, importance: sub.importance, current: sub.current, gap: sub.gap, color: cat.color };
        if (sub.importance >= 3) {
          if (sub.gap !== null && sub.gap >= 1.5) {
            urgentGaps.push(item);
          } else if (sub.current !== null && (sub.gap === null || sub.gap < 1)) {
            workingWell.push(item);
          }
        } else if (sub.importance <= 1) {
          lowPriority.push(item);
        }
      }
    }

    return { categories: results, ranked, gaps, tiers: { urgentGaps, workingWell, lowPriority } };
  },

  // ========== SECTION 3: ACCOMMODATIONS ==========
  // Need level + Non-negotiable flags
  calculateS3(responses) {
    const results = [];
    for (const cat of S3_CATEGORIES) {
      const catResult = {
        id: cat.id, name: cat.name, color: cat.color,
        description: cat.description, subcategories: [],
        needLevel: 0,
      };
      const catNeeds = [];

      for (const sub of cat.subcategories) {
        const subNeeds = [];
        const stmtResults = [];
        for (const stmt of sub.statements) {
          const v = responses[`${stmt.id}_need`];
          if (v !== undefined) { subNeeds.push(v); catNeeds.push(v); }
          stmtResults.push({ id: stmt.id, text: stmt.text, need: v ?? null });
        }
        const isNN = sub.nonNegotiableId ? responses[`${sub.nonNegotiableId}_toggle`] === 1 : false;
        catResult.subcategories.push({
          id: sub.id, name: sub.name, subtitle: sub.subtitle,
          needLevel: mean(subNeeds), nonNegotiable: isNN, statements: stmtResults,
        });
      }
      catResult.needLevel = mean(catNeeds);
      results.push(catResult);
    }
    const ranked = [...results].sort((a, b) => b.needLevel - a.needLevel);

    // Build priority tiers from subcategory level
    const nonNegotiable = [], highPriority = [], helpful = [];
    for (const cat of results) {
      for (const sub of cat.subcategories) {
        const item = { category: cat.name, subcategory: sub.name, needLevel: sub.needLevel, color: cat.color };
        if (sub.nonNegotiable && sub.needLevel >= 3) {
          nonNegotiable.push(item);
        } else if (sub.needLevel >= 3) {
          highPriority.push(item);
        } else if (sub.needLevel >= 1.5) {
          helpful.push(item);
        }
      }
    }
    return { categories: results, ranked, tiers: { nonNegotiable, highPriority, helpful } };
  },

  // ========== COMPLETION ==========
  sectionCompletion(sectionId, responses) {
    const questions = SECTION_QUESTIONS[sectionId];
    if (!questions) return { answered: 0, total: 0, percentage: 0 };
    let answered = 0, total = 0;
    for (const q of questions) {
      for (const dim of q.dimensions) {
        total++;
        if (responses[`${q.id}_${dim}`] !== undefined) answered++;
      }
    }
    return { answered, total, percentage: total > 0 ? Math.round((answered / total) * 100) : 0 };
  },

  categoryCompletion(sectionId, categoryId, responses) {
    const questions = SECTION_QUESTIONS[sectionId];
    if (!questions) return { answered: 0, total: 0, percentage: 0 };
    let answered = 0, total = 0;
    for (const q of questions) {
      if (q.categoryId !== categoryId) continue;
      for (const dim of q.dimensions) {
        total++;
        if (responses[`${q.id}_${dim}`] !== undefined) answered++;
      }
    }
    return { answered, total, percentage: total > 0 ? Math.round((answered / total) * 100) : 0 };
  },

  overallCompletion(responses) {
    let answered = 0, total = 0;
    for (const sec of SECTIONS) {
      const stats = this.sectionCompletion(sec.id, responses);
      answered += stats.answered;
      total += stats.total;
    }
    return { answered, total, percentage: total > 0 ? Math.round((answered / total) * 100) : 0 };
  },

  firstUnansweredInCategory(sectionId, categoryId, responses) {
    const questions = SECTION_QUESTIONS[sectionId];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (q.categoryId === categoryId) {
        for (const dim of q.dimensions) {
          if (responses[`${q.id}_${dim}`] === undefined) return i;
        }
      }
    }
    return questions.findIndex(q => q.categoryId === categoryId);
  },

  scoreColor(value) {
    if (value === null || value === undefined) return 'var(--surface-3)';
    if (value < 1)   return '#7C8CF5';
    if (value < 2)   return '#60A5FA';
    if (value < 2.5) return '#6EE7A0';
    if (value < 3)   return '#FBBF24';
    if (value < 3.5) return '#FB923C';
    return '#EF4444';
  },
};

function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function geoMean(a, b) {
  if (a === 0 && b === 0) return 0;
  return Math.sqrt(a * b);
}

// Display helpers: convert 0-4 internal to 1-5 display
function toDisplay(val) { return val !== null && val !== undefined ? ((val / 4) * 5).toFixed(1) : '—'; }
function toPct(val) { return val !== null && val !== undefined ? (val / 4) * 100 : 0; }
