/* ============================================================
   ДНИ ПОДРЯД — виджет серии посещений
   Автор: Точка опоры (Елена Осинцева, Тимур Хайретдинов)
   Хранит посещения в localStorage, работает офлайн.
   ============================================================ */

(function(){
  const KEY = 'tochka_opory_v1';
  const DAYS = 60;                // сколько дней показываем в сетке
  const MAX_HISTORY = 365;        // максимум дней хранить
  const WEEKDAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

  /* ---------- Даты ---------- */
  function dateKey(d){
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return y + '-' + m + '-' + day;
  }
  function todayKey(){ return dateKey(new Date()); }
  function startOfDay(d){ const x = new Date(d); x.setHours(0,0,0,0); return x; }

  /* ---------- Хранилище ---------- */
  function loadData(){
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch(e){ return {}; }
  }
  function saveData(data){
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch(e){}
  }

  /* ---------- Отметить сегодняшний день ---------- */
  function markToday(){
    const data = loadData();
    if (!Array.isArray(data.visitDays)) data.visitDays = [];

    const tk = todayKey();
    if (!data.visitDays.includes(tk)){
      data.visitDays.push(tk);
      // чистим слишком старые
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - MAX_HISTORY);
      const cutoffKey = dateKey(cutoff);
      data.visitDays = data.visitDays
        .filter(d => d >= cutoffKey)
        .sort();
      saveData(data);
    }
    return data.visitDays;
  }

  /* ---------- Расчёт серий ---------- */
  function calcStreaks(days){
    const set = new Set(days);
    const today = startOfDay(new Date());

    // Текущая серия
    let current = 0;
    let cursor = new Date(today);

    // Если сегодня ещё нет — начнём со вчера (серия не порвана, если вчера был заход)
    if (!set.has(dateKey(cursor))){
      cursor.setDate(cursor.getDate() - 1);
    }
    while (set.has(dateKey(cursor))){
      current++;
      cursor.setDate(cursor.getDate() - 1);
    }

    // Лучшая серия за всю историю
    const sorted = days.slice().sort();
    let best = 0, run = 0, prev = null;
    for (const day of sorted){
      const cur = startOfDay(new Date(day));
      if (prev){
        const diff = Math.round((cur - prev) / 86400000);
        run = (diff === 1) ? run + 1 : 1;
      } else {
        run = 1;
      }
      if (run > best) best = run;
      prev = cur;
    }

    return {
      current,
      best,
      total: days.length
    };
  }

  /* ---------- Склонения ---------- */
  function plural(n, forms){
    const n10 = n % 10, n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return forms[0];
    if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
    return forms[2];
  }
  function daysWord(n){ return plural(n, ['день','дня','дней']); }

  /* ---------- Стили ---------- */
  const styles = `
    .streak-card{
      padding:28px;
      border-radius:20px;
      background:linear-gradient(135deg,rgba(74,214,200,.14),rgba(124,92,255,.1));
      border:1px solid rgba(255,255,255,.12);
      position:relative;overflow:hidden;
      font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
      color:#f2f2f7;
    }
    .streak-card::before{
      content:"";position:absolute;inset:0;
      background:radial-gradient(500px 200px at 0% 0%,rgba(74,214,200,.2),transparent 70%);
      pointer-events:none;
    }
    .streak-head{
      display:flex;justify-content:space-between;align-items:flex-end;
      gap:16px;margin-bottom:22px;position:relative;flex-wrap:wrap;
    }
    .streak-title{
      font-size:20px;font-weight:800;display:flex;align-items:center;gap:10px;
      margin-bottom:6px;
    }
    .streak-sub{font-size:13.5px;color:#a1a1b5}
    .streak-current{text-align:right}
    .streak-current .num{
      font-size:42px;font-weight:800;line-height:1;letter-spacing:-.03em;
      background:linear-gradient(135deg,#4ad6c8,#7c5cff);
      -webkit-background-clip:text;background-clip:text;color:transparent;
    }
    .streak-current .lbl{
      font-size:12px;color:#a1a1b5;margin-top:4px;text-transform:uppercase;
      letter-spacing:.5px;font-weight:700;
    }

    .streak-weekdays{
      display:grid;
      grid-template-columns:repeat(7,1fr);
      gap:6px;
      max-width:420px;
      margin:0 auto 8px;
    }
    .streak-weekdays span{
      text-align:center;font-size:11px;color:#a1a1b5;
      font-weight:700;letter-spacing:.5px;
    }

    .streak-grid{
      display:grid;
      grid-template-columns:repeat(7,1fr);
      gap:6px;
      max-width:420px;
      margin:0 auto;
    }
    .streak-day{
      aspect-ratio:1;
      border-radius:6px;
      background:rgba(255,255,255,.05);
      border:1px solid rgba(255,255,255,.08);
      transition:.2s;
    }
    .streak-day.filled{
      background:linear-gradient(135deg,#4ad6c8,#2fbfae);
      border-color:rgba(74,214,200,.5);
      box-shadow:0 0 8px rgba(74,214,200,.3);
    }
    .streak-day.today{
      box-shadow:0 0 0 2px rgba(255,255,255,.7), 0 0 14px rgba(255,255,255,.4);
      transform:scale(1.1);
    }
    .streak-day.out{
      opacity:.15;
    }

    .streak-stats{
      display:flex;
      gap:12px;
      margin-top:22px;
      position:relative;
      flex-wrap:wrap;
    }
    .streak-stat{
      flex:1;min-width:120px;
      padding:12px 16px;
      border-radius:12px;
      background:rgba(0,0,0,.22);
      border:1px solid rgba(255,255,255,.1);
      font-size:13px;
      color:#a1a1b5;
    }
    .streak-stat b{
      display:block;font-size:18px;font-weight:800;color:#f2f2f7;margin-top:3px;
    }
    .streak-stat b.ok{color:#4ad6c8}
    .streak-stat b.fire{color:#ffb547}

    @media (max-width:520px){
      .streak-card{padding:22px 18px}
      .streak-current .num{font-size:34px}
      .streak-weekdays,.streak-grid{max-width:100%}
      .streak-day{border-radius:5px}
    }
  `;

  /* ---------- Рендер виджета ---------- */
  function renderWidget(container, days){
    const streaks = calcStreaks(days);
    const set = new Set(days);

    const today = startOfDay(new Date());
    const start = new Date(today);
    start.setDate(start.getDate() - (DAYS - 1));

    // Выравниваем по началу недели (Пн = 0)
    const firstDayOfWeek = (start.getDay() + 6) % 7;
    const gridStart = new Date(start);
    gridStart.setDate(gridStart.getDate() - firstDayOfWeek);

    // Заполняем сетку от gridStart до сегодня
    const cells = [];
    const cursor = new Date(gridStart);
    while (cursor <= today){
      const k = dateKey(cursor);
      const inRange = cursor >= start;
      cells.push({
        key: k,
        filled: inRange && set.has(k),
        isToday: k === dateKey(today),
        out: !inRange
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    const currentWord = daysWord(streaks.current);
    const bestWord = daysWord(streaks.best);
    const totalWord = daysWord(streaks.total);

    const gridHtml = cells.map(c => {
      const cls = ['streak-day'];
      if (c.filled) cls.push('filled');
      if (c.isToday) cls.push('today');
      if (c.out) cls.push('out');
      return `<div class="${cls.join(' ')}" title="${c.key}"></div>`;
    }).join('');

    const wdHtml = WEEKDAYS.map(w => `<span>${w}</span>`).join('');

    container.innerHTML = `
      <style>${styles}</style>
      <div class="streak-card">
        <div class="streak-head">
          <div>
            <div class="streak-title">🔥 Дни подряд</div>
            <div class="streak-sub">${streaks.current > 0
              ? 'Ты занимаешься ' + streaks.current + ' ' + currentWord + ' подряд'
              : 'Серия начнётся с первого захода сегодня'}
            </div>
          </div>
          <div class="streak-current">
            <div class="num">${streaks.current}</div>
            <div class="lbl">Текущий ритм</div>
          </div>
        </div>

        <div class="streak-weekdays">${wdHtml}</div>
        <div class="streak-grid">${gridHtml}</div>

        <div class="streak-stats">
          <div class="streak-stat">Текущий ритм<b class="ok">${streaks.current} ${currentWord}</b></div>
          <div class="streak-stat">Лучший результат<b class="fire">${streaks.best} ${bestWord}</b></div>
          <div class="streak-stat">Всего дней<b>${streaks.total} ${totalWord}</b></div>
        </div>
      </div>
    `;
  }

  /* ---------- Старт ---------- */
  // 1. Всегда отмечаем сегодняшний день
  const days = markToday();

  // 2. Если на странице есть контейнер — рисуем виджет
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('streakWidget');
    if (container){
      renderWidget(container, days);
    }
  });
})();