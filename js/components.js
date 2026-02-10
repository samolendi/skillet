// ============================================================
// components.js — Multi-section render functions
// ============================================================

const Components = {

  // ========== LANDING ==========
  landing(hasSaved) {
    return `
      <div class="landing">
        <h1 class="landing__title">Design<br>Strengths</h1>
        <p class="landing__subtitle">
          A self-assessment across 3 areas: your design preferences,
          ideal work environment, and accommodation needs.
        </p>
        <div class="landing__actions">
          ${hasSaved
            ? `<button class="btn btn-primary" data-action="continue">Continue</button>
               <button class="btn btn-secondary" data-action="start-fresh">Start fresh</button>`
            : `<button class="btn btn-primary" data-action="start">Begin</button>`
          }
        </div>
      </div>`;
  },

  // ========== SECTION SELECT ==========
  sectionSelect(responses) {
    const overall = Scoring.overallCompletion(responses);
    let cards = '';
    for (const sec of SECTIONS) {
      const comp = Scoring.sectionCompletion(sec.id, responses);
      const done = comp.percentage === 100;
      cards += `
        <div class="section-card" data-action="goto-section" data-section="${sec.id}" tabindex="0" role="button" aria-label="${sec.name} — ${comp.percentage}% complete">
          <div class="section-card__icon">${sec.icon}</div>
          <div class="section-card__info">
            <div class="section-card__top">
              <span class="section-card__name">${sec.shortName}</span>
              ${done ? '<span class="section-card__badge">Complete</span>' : `<span class="section-card__pct">${comp.percentage}%</span>`}
            </div>
            <p class="section-card__desc">${sec.description}</p>
            <div class="category-card__progress">
              <div class="category-card__progress-fill" style="width:${comp.percentage}%; background:#fff"></div>
            </div>
          </div>
        </div>`;
    }
    return `
      <div class="overview">
        <div class="overview__header">
          <h1 class="overview__title">Your assessment</h1>
          <p class="overview__desc">${overall.percentage}% complete across all sections</p>
        </div>
        <div class="progress-bar"><div class="progress-bar__fill" style="width:${overall.percentage}%"></div></div>
        <div class="section-cards">${cards}</div>
        <div class="overview__footer">
          ${overall.percentage === 100 ? '<button class="btn btn-primary" data-action="view-all-results">View all results</button>' : ''}
          <button class="btn btn-ghost" data-action="back-to-landing">\u2190 Back</button>
        </div>
      </div>`;
  },

  // ========== CATEGORY OVERVIEW (per section) ==========
  categoryOverview(sectionId, responses) {
    const section = SECTIONS.find(s => s.id === sectionId);
    const categories = ALL_CATEGORIES[sectionId];
    const comp = Scoring.sectionCompletion(sectionId, responses);
    const allComplete = comp.percentage === 100;

    let cards = '';
    for (const cat of categories) {
      const catComp = Scoring.categoryCompletion(sectionId, cat.id, responses);
      cards += `
        <div class="category-card" style="--card-color:${cat.color}" data-action="goto-category" data-section="${sectionId}" data-category="${cat.id}" tabindex="0" role="button">
          <div class="category-card__top">
            <span class="category-card__name">${cat.name}</span>
            <span class="category-card__count">${catComp.percentage}%</span>
          </div>
          <p class="category-card__desc">${cat.description}</p>
          <div class="category-card__progress">
            <div class="category-card__progress-fill" style="width:${catComp.percentage}%"></div>
          </div>
        </div>`;
    }
    return `
      <div class="overview">
        <div class="overview__header">
          <h1 class="overview__title">${section.name}</h1>
          <p class="overview__desc">${section.description}</p>
        </div>
        <div class="progress-bar"><div class="progress-bar__fill" style="width:${comp.percentage}%"></div></div>
        <div class="category-cards">${cards}</div>
        <div class="overview__footer">
          ${allComplete ? `<button class="btn btn-primary" data-action="view-section-results" data-section="${sectionId}">View results</button>` : ''}
          <button class="btn btn-ghost" data-action="goto-sections">\u2190 All sections</button>
        </div>
      </div>`;
  },

  // ========== QUESTION SCREEN (all types) ==========
  question(sectionId, index, responses) {
    const questions = SECTION_QUESTIONS[sectionId];
    const q = questions[index];
    if (!q) return '<p>Question not found.</p>';
    const total = questions.length;

    let scalesHtml = '';

    if (q.type === 'toggle') {
      // Non-negotiable toggle
      const key = `${q.id}_toggle`;
      const checked = responses[key] === 1;
      scalesHtml = `
        <div class="toggle-group">
          <label class="toggle-option">
            <input type="checkbox" ${checked ? 'checked' : ''} data-action="toggle" data-key="${key}" style="--scale-color:${q.categoryColor}">
            <span class="toggle-option__track"><span class="toggle-option__thumb"></span></span>
            <span class="toggle-option__label">Non-negotiable</span>
          </label>
        </div>`;
    } else {
      // Scale inputs for each dimension
      for (const dim of q.dimensions) {
        const key = `${q.id}_${dim}`;
        const currentVal = responses[key];
        const labels = SCALE_LABELS[dim] || SCALE_LABELS.interest;
        let options = '';
        for (let i = 0; i < 5; i++) {
          options += `
            <label class="scale-option">
              <input type="radio" name="${key}" value="${i}" ${currentVal === i ? 'checked' : ''}
                data-action="rate" data-key="${key}" data-value="${i}"
                style="--scale-color:${q.categoryColor}" aria-label="${labels[i]}">
              <span class="scale-option__label">${labels[i]}</span>
            </label>`;
        }
        // Friendly dimension label
        const dimLabel = dim === 'current' ? 'Current reality' : dim;
        scalesHtml += `
          <div class="scale-group">
            <div class="scale-group__label" id="label-${key}">${dimLabel}</div>
            <div class="scale-row" role="radiogroup" aria-labelledby="label-${key}">${options}</div>
          </div>`;
      }
    }

    const isFirst = index === 0;
    const isLast = index === total - 1;

    return `
      <div class="question-screen">
        <div class="question-topbar">
          <span class="question-topbar__label">${index + 1} / ${total}</span>
          <button class="question-topbar__close" data-action="goto-category-overview" data-section="${sectionId}">Overview</button>
        </div>
        <div class="question-progress">
          <div class="question-progress__fill" style="width:${((index + 1) / total) * 100}%; background:${q.categoryColor}"></div>
        </div>
        <div class="question-content" aria-live="polite">
          <div class="question-meta">
            <span class="question-meta__dot" style="background:${q.categoryColor}"></span>
            <span class="question-meta__category">${q.categoryName}</span>
            <span class="question-meta__sub">\u00b7 ${q.subcategoryName}</span>
          </div>
          <h2 class="question-statement">${q.statement}</h2>
          ${scalesHtml}
        </div>
        <div class="question-nav">
          <button class="nav-btn" data-action="prev" ${isFirst ? 'disabled' : ''}><span class="nav-arrow">\u2190</span> Back</button>
          ${isLast
            ? `<button class="nav-btn nav-btn--next" data-action="finish-section" data-section="${sectionId}">Done <span class="nav-arrow">\u2192</span></button>`
            : `<button class="nav-btn nav-btn--next" data-action="next">Next <span class="nav-arrow">\u2192</span></button>`}
        </div>
      </div>`;
  },

  // ========== RESULTS SCREENS ==========

  // Section 1 results: ranked strengths
  resultsS1(responses) {
    const data = Scoring.calculateS1(responses);
    let summaryBars = '', sections = '';

    for (const cat of data.ranked) {
      summaryBars += scoreRow(cat.name, toPct(cat.combined), cat.color, toDisplay(cat.combined));
    }

    for (const cat of data.ranked) {
      let subRows = '';
      for (const sub of cat.subcategories) {
        subRows += `
          <div class="sub-score-row">
            <span class="sub-score-row__label">${sub.name}</span>
            <div class="sub-score-row__bar-wrap"><div class="sub-score-row__bar" style="width:${toPct(sub.combined)}%; background:${cat.color}" data-width="${toPct(sub.combined)}"></div></div>
            <span class="sub-score-row__value">${toDisplay(sub.combined)}</span>
          </div>
          <div class="dimension-row">
            <span class="dimension-row__label">Interest</span>
            <div class="dimension-row__bar-wrap"><div class="dimension-row__bar" style="width:${toPct(sub.interest)}%; background:color-mix(in srgb,${cat.color} 70%,white)" data-width="${toPct(sub.interest)}"></div></div>
            <span class="dimension-row__value">${toDisplay(sub.interest)}</span>
          </div>
          <div class="dimension-row">
            <span class="dimension-row__label">Confidence</span>
            <div class="dimension-row__bar-wrap"><div class="dimension-row__bar" style="width:${toPct(sub.confidence)}%; background:color-mix(in srgb,${cat.color} 40%,white)" data-width="${toPct(sub.confidence)}"></div></div>
            <span class="dimension-row__value">${toDisplay(sub.confidence)}</span>
          </div>`;
      }
      sections += drilldownSection(cat, toDisplay(cat.combined), subRows);
    }

    return resultsShell('Your Design Strengths', 'Ranked by combined interest and confidence.', 'Ranked by combined score', summaryBars, sections, 'preferences');
  },

  // Section 2 results: environment needs + gap analysis
  resultsS2(responses) {
    const data = Scoring.calculateS2(responses);
    let summaryBars = '', sections = '', gapHtml = '';

    for (const cat of data.ranked) {
      summaryBars += scoreRow(cat.name, toPct(cat.importance), cat.color, toDisplay(cat.importance));
    }

    for (const cat of data.ranked) {
      let subRows = '';
      for (const sub of cat.subcategories) {
        subRows += `
          <div class="sub-score-row">
            <span class="sub-score-row__label">${sub.name}</span>
            <div class="sub-score-row__bar-wrap"><div class="sub-score-row__bar" style="width:${toPct(sub.importance)}%; background:${cat.color}" data-width="${toPct(sub.importance)}"></div></div>
            <span class="sub-score-row__value">${toDisplay(sub.importance)}</span>
          </div>`;
        if (sub.current !== null && sub.current !== undefined) {
          subRows += `
          <div class="dimension-row">
            <span class="dimension-row__label">Current</span>
            <div class="dimension-row__bar-wrap"><div class="dimension-row__bar" style="width:${toPct(sub.current)}%; background:color-mix(in srgb,${cat.color} 50%,white)" data-width="${toPct(sub.current)}"></div></div>
            <span class="dimension-row__value">${toDisplay(sub.current)}</span>
          </div>`;
          if (sub.gap !== null && sub.gap > 0) {
            subRows += `<div class="gap-indicator" style="padding-left:36px;font-size:0.75rem;color:#F87171;margin-bottom:8px">Gap: ${((sub.gap / 4) * 5).toFixed(1)} points</div>`;
          }
        }
      }
      sections += drilldownSection(cat, toDisplay(cat.importance), subRows);
    }

    if (data.gaps.length > 0) {
      let gapRows = '';
      for (const g of data.gaps) {
        gapRows += `
          <div class="score-row">
            <span class="score-row__label">${g.name}</span>
            <div class="score-row__bar-wrap"><div class="score-row__bar" style="width:${toPct(g.gap)}%; background:#F87171" data-width="${toPct(g.gap)}"></div></div>
            <span class="score-row__value" style="color:#F87171">${toDisplay(g.gap)}</span>
          </div>`;
      }
      gapHtml = `
        <div class="results-summary" style="border-left:3px solid #F87171">
          <div class="results-summary__title">Areas of concern</div>
          <p style="color:var(--text-dim);font-size:0.85rem;margin-bottom:16px">High importance but low current satisfaction</p>
          ${gapRows}
        </div>`;
    }

    return resultsShell('Ideal Work Environment', 'What matters most to you, ranked by importance.', 'Ranked by importance', summaryBars, gapHtml + sections, 'environment');
  },

  // Section 3 results: accommodation tiers
  resultsS3(responses) {
    const data = Scoring.calculateS3(responses);
    let summaryBars = '', sections = '';

    for (const cat of data.ranked) {
      summaryBars += scoreRow(cat.name, toPct(cat.needLevel), cat.color, toDisplay(cat.needLevel));
    }

    // Priority tiers
    let tiersHtml = '';
    if (data.tiers.nonNegotiable.length) {
      tiersHtml += tierBlock('Non-negotiable', '#EF4444', data.tiers.nonNegotiable);
    }
    if (data.tiers.highPriority.length) {
      tiersHtml += tierBlock('High priority', '#FB923C', data.tiers.highPriority);
    }
    if (data.tiers.helpful.length) {
      tiersHtml += tierBlock('Helpful', '#60A5FA', data.tiers.helpful);
    }

    for (const cat of data.ranked) {
      let subRows = '';
      for (const sub of cat.subcategories) {
        const nnBadge = sub.nonNegotiable ? '<span style="background:#EF4444;color:#fff;font-size:0.65rem;padding:2px 6px;border-radius:4px;margin-left:8px;font-weight:600">NON-NEGOTIABLE</span>' : '';
        subRows += `
          <div class="sub-score-row">
            <span class="sub-score-row__label">${sub.name}${nnBadge}</span>
            <div class="sub-score-row__bar-wrap"><div class="sub-score-row__bar" style="width:${toPct(sub.needLevel)}%; background:${cat.color}" data-width="${toPct(sub.needLevel)}"></div></div>
            <span class="sub-score-row__value">${toDisplay(sub.needLevel)}</span>
          </div>`;
      }
      sections += drilldownSection(cat, toDisplay(cat.needLevel), subRows);
    }

    return resultsShell('Essential Accommodations', 'Ranked by need level, with non-negotiable items flagged.', 'Ranked by need level', summaryBars, tiersHtml + sections, 'accommodations');
  },

  // All results combined
  allResults(responses) {
    const s1 = Scoring.sectionCompletion('preferences', responses);
    const s2 = Scoring.sectionCompletion('environment', responses);
    const s3 = Scoring.sectionCompletion('accommodations', responses);

    let content = '';

    if (s1.percentage > 0) {
      content += `<div class="results-tab" data-action="view-section-results" data-section="preferences" tabindex="0" role="button">
        <span class="results-tab__icon">\u2726</span>
        <span class="results-tab__name">Design Strengths</span>
        <span class="results-tab__pct">${s1.percentage}%</span>
        <span class="results-section__chevron">\u203a</span>
      </div>`;
    }
    if (s2.percentage > 0) {
      content += `<div class="results-tab" data-action="view-section-results" data-section="environment" tabindex="0" role="button">
        <span class="results-tab__icon">\u25c8</span>
        <span class="results-tab__name">Work Environment</span>
        <span class="results-tab__pct">${s2.percentage}%</span>
        <span class="results-section__chevron">\u203a</span>
      </div>`;
    }
    if (s3.percentage > 0) {
      content += `<div class="results-tab" data-action="view-section-results" data-section="accommodations" tabindex="0" role="button">
        <span class="results-tab__icon">\u25c7</span>
        <span class="results-tab__name">Accommodations</span>
        <span class="results-tab__pct">${s3.percentage}%</span>
        <span class="results-section__chevron">\u203a</span>
      </div>`;
    }

    return `
      <div class="results">
        <div class="results__header">
          <h1 class="results__title">Your Results</h1>
          <p class="results__subtitle">Tap a section to view detailed results.</p>
        </div>
        <div class="results-tabs">${content}</div>
        <div class="results__actions">
          <button class="btn btn-secondary" data-action="goto-sections">\u2190 Edit answers</button>
          <button class="btn btn-ghost" data-action="export-json">Export JSON</button>
          <button class="btn btn-ghost" data-action="reset">Start over</button>
        </div>
      </div>`;
  },
};

// ========== Shared render helpers ==========

function scoreRow(label, pct, color, display) {
  return `
    <div class="score-row">
      <span class="score-row__label">${label}</span>
      <div class="score-row__bar-wrap"><div class="score-row__bar" style="width:${pct}%; background:${color}" data-width="${pct}"></div></div>
      <span class="score-row__value">${display}</span>
    </div>`;
}

function drilldownSection(cat, displayScore, innerHtml) {
  return `
    <div class="results-section">
      <div class="results-section__header" data-action="toggle-section" data-section="${cat.id}" tabindex="0" role="button" aria-expanded="false">
        <span class="results-section__dot" style="background:${cat.color}"></span>
        <span class="results-section__name">${cat.name}</span>
        <span class="results-section__score" style="color:${cat.color}">${displayScore}</span>
        <span class="results-section__chevron">\u203a</span>
      </div>
      <div class="results-section__body" id="section-${cat.id}">
        <div class="results-section__inner">${innerHtml}</div>
      </div>
    </div>`;
}

function tierBlock(title, color, items) {
  let rows = '';
  for (const item of items) {
    rows += `
      <div class="tier-item">
        <span class="tier-item__dot" style="background:${item.color}"></span>
        <span class="tier-item__name">${item.subcategory}</span>
        <span class="tier-item__cat">${item.category}</span>
      </div>`;
  }
  return `
    <div class="results-summary" style="border-left:3px solid ${color}">
      <div class="results-summary__title" style="color:${color}">${title}</div>
      ${rows}
    </div>`;
}

function resultsShell(title, subtitle, summaryTitle, summaryBars, body, sectionId) {
  return `
    <div class="results">
      <div class="results__header">
        <h1 class="results__title">${title}</h1>
        <p class="results__subtitle">${subtitle}</p>
      </div>
      <div class="results-summary">
        <div class="results-summary__title">${summaryTitle}</div>
        ${summaryBars}
      </div>
      ${body}
      <div class="results__actions">
        <button class="btn btn-secondary" data-action="goto-category-overview" data-section="${sectionId}">\u2190 Edit answers</button>
        <button class="btn btn-ghost" data-action="view-all-results">All results</button>
        <button class="btn btn-ghost" data-action="export-json">Export JSON</button>
      </div>
    </div>`;
}
