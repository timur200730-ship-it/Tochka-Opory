/* ============================================================
   ДЕРЕВО РОСТА (Реалистичный SVG с генерацией листьев)
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
    
    // Процент прогресса от 0 до 1
    const progress = total / MAX_LESSONS;

    // Параметры дерева
    const baseY = 180; // Где растет
    const maxHeight = 100; // Максимальная высота ствола
    const trunkHeight = 20 + (progress * maxHeight);
    const topY = baseY - trunkHeight;
    
    // Генерируем ветки
    let branches = '';
    // Главный ствол
    branches += `<path d="M 100 ${baseY} Q 95 ${baseY - trunkHeight/2} 100 ${topY}" stroke="#5d4037" stroke-width="${4 + progress*6}" fill="none" stroke-linecap="round" />`;
    
    // Боковые ветки (появляются с прогрессом)
    if (progress > 0.1) {
      branches += `<path d="M 98 ${topY + trunkHeight*0.4} Q 75 ${topY + trunkHeight*0.3} 70 ${topY + 10}" stroke="#5d4037" stroke-width="3" fill="none" stroke-linecap="round" />`;
    }
    if (progress > 0.3) {
      branches += `<path d="M 102 ${topY + trunkHeight*0.5} Q 125 ${topY + trunkHeight*0.4} 130 ${topY + 15}" stroke="#5d4037" stroke-width="3" fill="none" stroke-linecap="round" />`;
    }

    // Генерируем листья (крону)
    let leaves = '';
    const leafCount = 5 + Math.floor(progress * 60); // От 5 до 65 листьев
    const canopyRadius = 10 + (progress * 30); // Радиус кроны растет

    for (let i = 0; i < leafCount; i++) {
      // Распределяем листья вокруг вершины
      const angle = Math.random() * Math.PI * 2;
      // Чем ближе к центру, тем плотнее листья
      const dist = Math.random() * canopyRadius; 
      const cx = 100 + Math.cos(angle) * dist;
      const cy = topY + Math.sin(angle) * dist * 0.8; // Чуть сплюснуто по вертикали
      
      const r = 6 + Math.random() * 6; // Размер листика
      
      // Цвета: темно-зеленый, аквамарин, фиолетовый оттенок
      const colors = ['#2e8b57', '#4ad6c8', '#3cb371'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      leaves += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.85" />`;
      
      // Розовые цветочки, если прогресс больше 50%
      if (progress > 0.5 && i % 5 === 0) {
        leaves += `<circle cx="${cx+3}" cy="${cy-3}" r="3" fill="#ff5c8a" filter="url(#glow-pink)" />`;
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
      .tree-card p.sub { font-size: 14px; color: #a1a1b5; margin-bottom: 10px; }
      
      /* Квадратный SVG, чтобы не было пустоты */
      .tree-svg { width: 100%; max-width: 220px; aspect-ratio: 1/1; overflow: visible; margin: 0 auto; }
      
      @keyframes sway {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(3deg); }
        100% { transform: rotate(0deg); }
      }
      .tree-group { transform-origin: 100px 180px; animation: sway 7s ease-in-out infinite; }
      
      .tree-msg { font-size: 15px; color: #4ad6c8; margin-top: 5px; font-weight: 700; letter-spacing: 0.3px; }
      
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
            <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Земля -->
          <ellipse cx="100" cy="${baseY}" rx="50" ry="12" fill="rgba(74,214,200,0.1)" />
          <ellipse cx="100" cy="${baseY}" rx="35" ry="8" fill="#1a1a24" />
          
          <g class="tree-group">
            ${branches}
            ${leaves}
          </g>
        </svg>
        
        <div class="tree-msg">${message}</div>
        <div class="tree-progress-bar">
          <div class="tree-progress-fill" style="width: ${progress * 100}%"></div>
        </div>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', render);
})();
