/* ============================================================
   БЕЙДЖИ И ДОСТИЖЕНИЯ
   Авторы: Елена Осинцева, Тимур Хайретдинов
   ============================================================ */

(function(){
  const KEY = 'tochka_opory_v1';

  function loadData(){
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch(e){ return {}; }
  }

  const BADGES = [
    { id: 'first_lesson', group: 'Первые шаги', emoji: '🎓', name: 'Первый шаг', desc: 'Пройди первый урок', color: '#4ad6c8',
      check: (d) => (d.lessonsDone?.fin?.length || 0) + (d.lessonsDone?.psy?.length || 0) + (d.lessonsDone?.sup?.length || 0) >= 1 },
    { id: 'first_practice', group: 'Первые шаги', emoji: '✏️', name: 'Первая практика', desc: 'Выполни практику дня', color: '#4ad6c8',
      check: (d) => Object.keys(d.practicesDone || {}).length >= 1 },
    { id: 'first_notebook', group: 'Первые шаги', emoji: '📓', name: 'Дневник', desc: 'Сделай первую запись в тетрадь', color: '#4ad6c8',
      check: (d) => Object.keys(d.practiceAnswers || {}).length >= 1 || Object.keys(d.reflections || {}).length >= 1 },
    { id: 'fin_half', group: 'Финансы', emoji: '💰', name: 'Первые деньги', desc: 'Пройди 4 урока финансов', color: '#4ad6c8',
      check: (d) => (d.lessonsDone?.fin?.length || 0) >= 4 },
    { id: 'fin_all', group: 'Финансы', emoji: '🎯', name: 'Финансовый детектив', desc: 'Пройди все 8 уроков финансов', color: '#4ad6c8',
      check: (d) => (d.lessonsDone?.fin?.length || 0) >= 8 },
    { id: 'budget_saved', group: 'Финансы', emoji: '💾', name: 'Бюджет на бумаге', desc: 'Сохрани свой первый бюджет', color: '#4ad6c8',
      check: (d) => !!d.budgetSaved },
    { id: 'psy_half', group: 'Психология', emoji: '🧠', name: 'Заметил(а) себя', desc: 'Пройди 4 урока психологии', color: '#7c5cff',
      check: (d) => (d.lessonsDone?.psy?.length || 0) >= 4 },
    { id: 'psy_all', group: 'Психология', emoji: '🌿', name: 'Спокойный ум', desc: 'Пройди все 8 уроков психологии', color: '#7c5cff',
      check: (d) => (d.lessonsDone?.psy?.length || 0) >= 8 },
    { id: 'breath_5', group: 'Психология', emoji: '🌬', name: 'Дыши глубже', desc: 'Проведи 5 дыхательных сессий', color: '#7c5cff',
      check: (d) => (d.breathingSessions || []).length >= 5 },
    { id: 'sup_all', group: 'Поддержка', emoji: '🛟', name: 'Друг поддержки', desc: 'Пройди все 6 уроков поддержки', color: '#ff5c8a',
      check: (d) => (d.lessonsDone?.sup?.length || 0) >= 6 },
    { id: 'streak_3', group: 'Серия дней', emoji: '🔥', name: '3 дня подряд', desc: 'Заходи 3 дня подряд', color: '#ffb547',
      check: (d) => (d.streak || 0) >= 3 },
    { id: 'streak_7', group: 'Серия дней', emoji: '🔥', name: '7 дней подряд', desc: 'Целая неделя!', color: '#ffb547',
      check: (d) => (d.streak || 0) >= 7 },
    { id: 'streak_30', group: 'Серия дней', emoji: '🏆', name: 'Месяц подряд', desc: '30 дней подряд. Это привычка!', color: '#ffb547',
      check: (d) => (d.streak || 0) >= 30 },
    { id: 'xp_500', group: 'Мастерство', emoji: '⭐', name: '500 XP', desc: 'Набери 500 опыта', color: '#4ad6c8',
      check: (d) => (d.xp || 0) >= 500 },
    { id: 'all_done', group: 'Мастерство', emoji: '👑', name: 'Всё пройдено', desc: 'Пройди все 22 урока', color: '#b8a6ff',
      check: (d) => ((d.lessonsDone?.fin?.length || 0) + (d.lessonsDone?.psy?.length || 0) + (d.lessonsDone?.sup?.length || 0)) >= 22 }
  ];

  const styles = `
    .ach-card { padding:28px; border-radius:20px; background:linear-gradient(135deg,rgba(124,92,255,.14),rgba(74,214,200,.1)); border:1px solid rgba(255,255,255,.12); color:#f2f2f7; font-family:'Inter',sans-serif; }
    .ach-head { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:24px; flex-wrap:wrap; gap:16px; }
    .ach-title { font-size:20px; font-weight:800; margin-bottom:6px; }
    .ach-sub { font-size:13.5px; color:#a1a1b5; }
    .ach-counter { padding:8px 16px; border-radius:12px; background:rgba(0,0,0,.25); border:1px solid rgba(255,255,255,.12); font-size:14px; font-weight:700; }
    .ach-counter b { color:#4ad6c8; font-size:16px; }
    .ach-group { margin-bottom:22px; }
    .ach-group-title { font-size:12px; font-weight:700; color:#a1a1b5; text-transform:uppercase; letter-spacing:.6px; margin-bottom:12px; display:flex; align-items:center; gap:8px; }
    .ach-group-title::after { content:""; flex:1; height:1px; background:rgba(255,255,255,.08); }
    .ach-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:12px; }
    .ach-item { padding:16px 14px; border-radius:14px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); display:flex; flex-direction:column; gap:8px; position:relative; overflow:hidden; transition:.25s; }
    .ach-item.locked { opacity:.5; filter:grayscale(.7); }
    .ach-item.unlocked { background:linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.04)); border-color:var(--badge-color); box-shadow:0 4px 18px rgba(0,0,0,.2); }
    .ach-item.unlocked::before { content:""; position:absolute; inset:0; background:radial-gradient(200px 80px at 0% 0%, var(--badge-glow), transparent 70%); pointer-events:none; }
    .ach-item .emo { font-size:28px; position:relative; }
    .ach-item h4 { font-size:14px; font-weight:800; position:relative; }
    .ach-item p { font-size:12px; color:#a1a1b5; line-height:1.4; position:relative; }
    .ach-item.unlocked .check { position:absolute; top:10px; right:10px; width:20px; height:20px; border-radius:50%; background:var(--badge-color); color:#0b0b12; font-size:12px; font-weight:800; display:grid; place-items:center; }
  `;

  function render() {
    const container = document.getElementById('achievementsWidget');
    if (!container) return;

    const d = loadData();
    if (!Array.isArray(d.badgesUnlocked)) d.badgesUnlocked = [];
    const unlockedSet = new Set(d.badgesUnlocked);
    
    // Проверяем новые бейджи
    BADGES.forEach(b => {
      if (!unlockedSet.has(b.id) && b.check(d)) {
        unlockedSet.add(b.id);
        d.badgesUnlocked.push(b.id);
      }
    });
    localStorage.setItem(KEY, JSON.stringify(d));

    const groups = {};
    BADGES.forEach(b => {
      if (!groups[b.group]) groups[b.group] = [];
      groups[b.group].push(b);
    });

    const totalUnlocked = unlockedSet.size;

    const groupsHtml = Object.keys(groups).map(gname => {
      const items = groups[gname].map(b => {
        const isUnlocked = unlockedSet.has(b.id);
        return `
          <div class="ach-item ${isUnlocked ? 'unlocked' : 'locked'}" style="--badge-color:${b.color};--badge-glow:${b.color}33">
            ${isUnlocked ? '<div class="check">✓</div>' : ''}
            <div class="emo">${b.emoji}</div>
            <h4>${b.name}</h4>
            <p>${b.desc}</p>
          </div>
        `;
      }).join('');
      return `<div class="ach-group"><div class="ach-group-title">${gname}</div><div class="ach-grid">${items}</div></div>`;
    }).join('');

    container.innerHTML = `
      <style>${styles}</style>
      <div class="ach-card">
        <div class="ach-head">
          <div><div class="ach-title">🏅 Достижения</div><div class="ach-sub">Собери все ${BADGES.length} бейджей</div></div>
          <div class="ach-counter"><b>${totalUnlocked}</b> / ${BADGES.length}</div>
        </div>
        ${groupsHtml}
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', render);
})();
