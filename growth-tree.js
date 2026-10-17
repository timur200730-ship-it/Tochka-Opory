/* ============================================================
   ДЕРЕВО РОСТА
   Визуализация прогресса в виде растущего дерева.
   ============================================================ */

(function(){
  const KEY = 'tochka_opory_v1';
  const MAX_LESSONS = 22;

  function loadData() {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : {}; } catch(e) { return {}; }
  }

  function render() {
    const container = document.getElementById('growthTreeWidget');
    if (!container) return;

    const d = loadData();
    const fin = (d.lessonsDone && d.lessonsDone.fin) ? d.lessonsDone.fin.length : 0;
    const psy = (d.lessonsDone && d.lessonsDone.psy) ? d.lessonsDone.psy.length : 0;
    const sup = (d.lessonsDone && d.lessonsDone.sup) ? d.lessonsDone.sup.length : 0;
    const total = fin + psy + sup;

    // Высота ствола: от 20 до 120
    const trunkHeight = 20 + (total / MAX_LESSONS) * 100;
    const topY = 180 - trunkHeight;

    // Генерируем листья
    let leaves = '';
    
    // Базовые листья (чтобы даже с 0 уроков было красиво)
    leaves += `<circle cx="90" cy="${topY}" r="16" fill="#4ad6c8" opacity="0.8"/>`;
    leaves += `<circle cx="110" cy="${topY}" r="16" fill="#4ad6c8" opacity="0.8"/>`;
    leaves += `<circle cx="100" cy="${topY - 12}" r="18" fill="#4ad6c8" opacity="0.9"/>`;

    // Динамические листья (по одному за каждый пройденный урок)
    for (let i = 0; i < total; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 28 + 10;
      const cx = 100 + Math.cos(angle) * dist;
      const cy = topY + Math.sin(angle) * dist;
      const r = 10 + Math.random() * 8;
      // Каждый 4-й лист — розовый (цветение)
      const color = (i % 4 === 0 && total > 15) ? '#ff5c8a' : '#4ad6c8';
      leaves += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.85"/>`;
    }

    let message = "Пройди первый урок, чтобы посадить семечко!";
    if (total > 0 && total < 8) message = "Твой росток пробивается! Продолжай в том же духе.";
    else if (total >= 8 && total < 15) message = "Саженец превращается в молодое дерево. Отличный прогресс!";
    else if (total >= 15 && total < MAX_LESSONS) message = "Дерево почти выросло! Осталось совсем немного.";
    else if (total === MAX_LESSONS) message = "Ты прошёл всё! Твоё дерево цветёт. 🎉";

    const styles = `
      .tree-card {
        padding: 28px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(74,214,200,.08), rgba(124,92,255,.05));
        border: 1px solid rgba(255,255,255,.12);
        color: #f2f2f7;
        font-family: 'Inter', sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      .tree-card h3 { font-size: 20px; font-weight: 800; margin-bottom: 6px; }
      .tree-card p.sub { font-size: 13.5px; color: #a1a1b5; margin-bottom: 16px; }
      .tree-svg { width: 100%; max-width: 260px; height: 240px; overflow: visible; }
      .tree-msg { font-size: 14.5px; color: #d1d1d6; margin-top: 16px; font-weight: 600; }
      .tree-progress-bar {
        width: 100%; max-width: 260px; height: 6px; border-radius: 999px;
        background: rgba(255,255,255,.08); margin-top: 12px; overflow: hidden;
      }
      .tree-progress-fill {
        height: 100%; border-radius: 999px;
        background: linear-gradient(90deg, #4ad6c8, #ff5c8a);
        transition: width 0.8s ease;
      }
    `;

    container.innerHTML = `
      <style>${styles}</style>
      <div class="tree-card">
        <h3>🌳 Дерево роста</h3>
        <p class="sub">Твой прогресс: ${total} из ${MAX_LESSONS} уроков</p>
        
        <svg class="tree-svg" viewBox="0 0 200 200">
          <defs>
            <filter id="treeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <!-- Земля -->
          <ellipse cx="100" cy="185" rx="60" ry="12" fill="#3e2723" />
          <!-- Ствол -->
          <path d="M 100 185 Q 100 150 100 ${topY}" 
                stroke="#5d4037" stroke-width="${8 + (total/MAX_LESSONS)*8}" 
                fill="none" stroke-linecap="round" />
          <!-- Листья -->
          <g filter="url(#treeGlow)">${leaves}</g>
        </svg>
        
        <div class="tree-msg">${message}</div>
        <div class="tree-progress-bar">
          <div class="tree-progress-fill" style="width: ${(total/MAX_LESSONS)*100}%"></div>
        </div>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', render);
})();
