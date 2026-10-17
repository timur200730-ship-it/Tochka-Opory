/* ============================================================
   ДЕРЕВО РОСТА (Премиум-дизайн с анимацией)
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

    // Высота ствола
    const trunkHeight = 30 + (total / MAX_LESSONS) * 80;
    const topY = 190 - trunkHeight;
    
    // Генерируем слои листвы (от темного к светлому)
    let leavesBack = '';
    let leavesFront = '';
    let flowers = '';

    // Базовые листья (даже если 0 уроков)
    leavesBack += `<circle cx="100" cy="${topY}" r="35" fill="#1e3a34" opacity="0.8"/>`;
    leavesBack += `<circle cx="80" cy="${topY+10}" r="25" fill="#1e3a34" opacity="0.8"/>`;
    leavesBack += `<circle cx="120" cy="${topY+10}" r="25" fill="#1e3a34" opacity="0.8"/>`;

    for (let i = 0; i < total; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 30 + 10;
      const cx = 100 + Math.cos(angle) * dist;
      const cy = topY + Math.sin(angle) * dist;
      const r = 12 + Math.random() * 10;
      
      // Светящиеся листья
      leavesFront += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#4ad6c8" opacity="0.9" filter="url(#glow)"/>`;
      
      // Розовые цветы (если прогресс > 50%)
      if (total > 11 && i % 3 === 0) {
        flowers += `<circle cx="${cx+5}" cy="${cy-5}" r="4" fill="#ff5c8a" filter="url(#glow-pink)"/>`;
      }
    }

    let message = "Пройди первый урок, чтобы посадить семечко!";
    if (total > 0 && total < 8) message = "Твой росток пробивается! Продолжай.";
    else if (total >= 8 && total < 15) message = "Молодое дерево набирает силу. Отличный темп!";
    else if (total >= 15 && total < MAX_LESSONS) message = "Дерево почти выросло! Осталось немного.";
    else if (total === MAX_LESSONS) message = "Ты прошёл всё! Твоё дерево цветёт. 🎉";

    const styles = `
      .tree-card {
        padding: 30px;
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(30,30,40,0.8) 0%, rgba(11,11,18,0.9) 100%);
        border: 1px solid rgba(74,214,200,0.2);
        box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 0 30px rgba(74,214,200,0.05);
        color: #f2f2f7;
        font-family: 'Inter', sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .tree-card h3 { font-size: 22px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.5px; }
      .tree-card p.sub { font-size: 14px; color: #a1a1b5; margin-bottom: 20px; }
      
      .tree-svg { width: 100%; max-width: 280px; height: 260px; overflow: visible; }
      
      /* Анимация покачивания */
      @keyframes sway {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(3deg); }
        100% { transform: rotate(0deg); }
      }
      .tree-group { transform-origin: 100px 190px; animation: sway 6s ease-in-out infinite; }
      
      .tree-msg { font-size: 15px; color: #4ad6c8; margin-top: 10px; font-weight: 700; letter-spacing: 0.3px; }
      
      .tree-progress-bar {
        width: 100%; max-width: 240px; height: 8px; border-radius: 999px;
        background: rgba(255,255,255,.06); margin-top: 16px; overflow: hidden;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
      }
      .tree-progress-fill {
        height: 100%; border-radius: 999px;
        background: linear-gradient(90deg, #4ad6c8, #ff5c8a);
        box-shadow: 0 0 10px rgba(74,214,200,0.6);
        transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;

    container.innerHTML = `
      <style>${styles}</style>
      <div class="tree-card">
        <h3>🌳 Дерево роста</h3>
        <p class="sub">Твой прогресс: ${total} из ${MAX_LESSONS} уроков</p>
        
        <svg class="tree-svg" viewBox="0 0 200 200">
          <defs>
            <!-- Свечение для зеленых листьев -->
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <!-- Свечение для розовых цветов -->
            <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <!-- Градиент для ствола -->
            <linearGradient id="trunkGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stop-color="#2c1a12" />
              <stop offset="100%" stop-color="#5d4037" />
            </linearGradient>
          </defs>

          <!-- Земля (свечение) -->
          <ellipse cx="100" cy="190" rx="70" ry="15" fill="rgba(74,214,200,0.1)" />
          <ellipse cx="100" cy="190" rx="50" ry="10" fill="#1a1a24" />
          
          <g class="tree-group">
            <!-- Ствол (изогнутый) -->
            <path d="M 100 190 Q 90 ${topY + 40} 100 ${topY}" 
                  stroke="url(#trunkGrad)" stroke-width="${6 + (total/MAX_LESSONS)*6}" 
                  fill="none" stroke-linecap="round" />
            <path d="M 100 150 Q 120 ${topY + 20} 110 ${topY - 10}" 
                  stroke="url(#trunkGrad)" stroke-width="4" 
                  fill="none" stroke-linecap="round" />

            <!-- Задний слой листвы -->
            ${leavesBack}
            <!-- Передний слой (светящиеся) -->
            ${leavesFront}
            <!-- Цветы -->
            ${flowers}
          </g>
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
