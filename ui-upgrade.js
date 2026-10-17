/* ============================================================
   UI UPGRADE — Глобальное улучшение дизайна
   Добавляет анимированный фон, стеклянные эффекты и кастомный скроллбар
   ============================================================ */

(function(){
  const style = document.createElement('style');
  style.textContent = `
    /* 1. Анимированный живой фон */
    body::before {
      content: "";
      position: fixed;
      top: -20%; left: -10%;
      width: 60vw; height: 60vw;
      background: radial-gradient(circle, rgba(124,92,255,0.15) 0%, transparent 60%);
      border-radius: 50%;
      z-index: -1;
      animation: floatOrb 20s infinite alternate ease-in-out;
      pointer-events: none;
    }
    body::after {
      content: "";
      position: fixed;
      bottom: -20%; right: -10%;
      width: 50vw; height: 50vw;
      background: radial-gradient(circle, rgba(74,214,200,0.12) 0%, transparent 60%);
      border-radius: 50%;
      z-index: -1;
      animation: floatOrb 25s infinite alternate-reverse ease-in-out;
      pointer-events: none;
    }
    @keyframes floatOrb {
      0% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(5vw, 5vh) scale(1.1); }
      100% { transform: translate(-5vw, -5vh) scale(0.9); }
    }

    /* 2. Стеклянный эффект для шапки */
    header {
      background: rgba(11, 11, 18, 0.6) !important;
      backdrop-filter: blur(20px) saturate(150%) !important;
      -webkit-backdrop-filter: blur(20px) saturate(150%) !important;
      border-bottom: 1px solid rgba(255,255,255,0.08) !important;
    }

    /* 3. Кастомный скроллбар */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #0b0b12; }
    ::-webkit-scrollbar-thumb {
      background: #2c2c33;
      border-radius: 4px;
      border: 2px solid #0b0b12;
    }
    ::-webkit-scrollbar-thumb:hover { background: #4ad6c8; }

    /* 4. Красивое выделение текста */
    ::selection {
      background: rgba(124, 92, 255, 0.3);
      color: #fff;
    }

    /* 5. Плавное появление страницы */
    body {
      animation: fadeInPage 0.6s ease-out;
    }
    @keyframes fadeInPage {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* 6. Улучшение карточек */
    .module, .lesson, .tcard, .practice-box, .quiz-q, .daily-card, .tree-card, .ach-card {
      box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease !important;
    }
    .module:hover, .lesson:hover {
      box-shadow: 0 12px 40px rgba(124,92,255,0.15) !important;
      border-color: rgba(255,255,255,0.2) !important;
    }

    /* 7. Свечение кнопок при наведении */
    .btn-primary {
      position: relative;
      overflow: hidden;
    }
    .btn-primary::after {
      content: "";
      position: absolute;
      top: -50%; left: -50%;
      width: 200%; height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
      transform: rotate(45deg);
      transition: 0.5s;
      opacity: 0;
    }
    .btn-primary:hover::after {
      opacity: 1;
      left: 100%;
    }
  `;
  document.head.appendChild(style);
})();
