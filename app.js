'use strict';
/* =========================================================
   תקלות ומשימות – אפליקציה מקומית בלבד.
   אין שום קריאת רשת. כל הנתונים נשמרים במכשיר (localStorage).
   ========================================================= */

/* ---------- הגדרות שקל לשנות ---------- */
const DEPTS = ['פלור', 'מטבח', 'בר', 'הכנות', 'קצביה', 'משרד', 'לילינבלום'];

const TYPES = [
  { id: 'equip', name: 'מכשור' },
  { id: 'plumb', name: 'אינסטלציה וביוב' },
  { id: 'elec',  name: 'חשמל' },
  { id: 'build', name: 'מבנה ותחזוקה' },
  { id: 'it',    name: 'מחשוב ותקשורת' },
  { id: 'task',  name: 'משימה' },
];

const PRIOS = [
  { v: 1, name: 'דחוף' },
  { v: 2, name: 'גבוה' },
  { v: 3, name: 'רגיל' },
  { v: 4, name: 'נמוך' },
];

const DEPT_KW = {
  'פלור': ['פלור', 'אולם', 'שולחן', 'שולחנות', 'כיסא', 'כיסאות', 'כסא', 'ספה', 'מארחת', 'כניסה', 'טרסה', 'מרפסת', 'רמקול', 'מוזיקה', 'מלצר', 'מלצרים', 'שירותים'],
  'מטבח': ['מטבח', 'כיריים', 'תנור', 'טאבון', 'גריל', 'פלנצה', 'סלמנדר', 'פריטוז', 'ציפסר', 'מנדף', 'מדיח', 'ליין', 'טבח', 'טבחים', 'שף'],
  'בר': ['בר', 'ברמן', 'ברמנים', 'בירה', 'חבית', 'חביות', 'קרח', 'כוסות', 'קוקטייל', 'קוקטיילים', 'אלכוהול', 'יין', 'אספרסו', 'קפה', 'סודה', 'מזיגה', 'ברז בירה'],
  'הכנות': ['הכנות', 'ואקום', 'מיקסר', 'רובוטקופ', 'בלנדר', 'מקצפה', 'סוביד', 'סו ויד', 'בלאסט', 'קירור מהיר'],
  'קצביה': ['קצביה', 'קצב', 'בשר', 'מטחנה', 'מסור', 'יישון', 'נקניק', 'נקניקים', 'פירוק'],
  'משרד': ['משרד', 'מחשב', 'מדפסת', 'אינטרנט', 'ראוטר', 'וויפי', 'wifi', 'חשבונית', 'חשבוניות', 'שכר', 'משמרות', 'סידור עבודה', 'הנהלת חשבונות'],
  'לילינבלום': ['לילינבלום'],
};

const TYPE_KW = {
  equip: ['מקרר', 'מקררים', 'מקפיא', 'מקפיאים', 'קירור', 'תנור', 'כיריים', 'מדיח', 'מכונה', 'מכונת', 'מזגן', 'מזגנים', 'פריטוז', 'גריל', 'מנדף', 'מיקסר', 'ואקום', 'מטחנה', 'משאבה', 'מדחס', 'קומפרסור', 'טאבון', 'סלמנדר', 'מקצפה', 'בלנדר', 'מסור', 'חימום', 'פלנצה', 'קרח', 'אספרסו', 'מכונת קפה', 'ברז בירה', 'בלאסט'],
  plumb: ['נזילה', 'נוזל', 'דולף', 'דליפה', 'סתימה', 'סתום', 'סתומה', 'ביוב', 'ניקוז', 'ברז', 'כיור', 'אסלה', 'מים', 'מפריד שומן', 'צנרת', 'הצפה', 'צינור'],
  elec:  ['חשמל', 'שקע', 'תקע', 'נורה', 'נורות', 'תאורה', 'מנורה', 'פחת', 'קצר', 'לוח חשמל', 'כבל', 'מפסק', 'קפץ'],
  build: ['דלת', 'ידית', 'ציר', 'מנעול', 'צבע', 'קיר', 'אריח', 'אריחים', 'רצפה', 'תקרה', 'מדף', 'מדפים', 'חלון', 'זכוכית', 'ריהוט', 'שולחן', 'כיסא', 'כיסאות'],
  it:    ['מחשב', 'מדפסת', 'אינטרנט', 'ראוטר', 'וויפי', 'wifi', 'קופה', 'מסופון', 'טאבלט', 'רשת', 'תוכנה', 'אשראי'],
  task:  ['להזמין', 'להתקשר', 'לבדוק', 'לסדר', 'לשלוח', 'לתאם', 'להכין', 'לקנות', 'הזמנה', 'פגישה', 'תזכורת', 'לדבר', 'לעדכן', 'לגייס', 'ראיון'],
};

const FAULT_WORDS = ['תקלה', 'תקול', 'תקולה', 'לא עובד', 'לא עובדת', 'שבור', 'שבורה', 'נשבר', 'נשברה', 'מקולקל', 'מקולקלת', 'דולף', 'רועש', 'לא מקרר', 'לא מחמם', 'לא נדלק', 'קפץ', 'נתקע', 'תקוע'];
const URGENT_WORDS = ['דחוף', 'מיידי', 'מייד', 'מיד', 'עכשיו', 'חירום', 'בטיחות', 'גז', 'הצפה', 'אין מים', 'אין חשמל', 'אש', 'עשן'];
const STOP = new Set(['של', 'את', 'על', 'עם', 'יש', 'אין', 'לא', 'זה', 'זו', 'גם', 'עוד', 'כל', 'או', 'אם', 'כי', 'רק', 'מה', 'הוא', 'היא', 'הם', 'אני', 'צריך', 'צריכה', 'צריכים', 'עובד', 'עובדת', 'תקלה', 'תקול', 'תקולה', 'שוב', 'קצת', 'מאוד', 'ממש', 'היום', 'מחר', 'דחוף', 'אחרי', 'לפני', 'בתוך', 'ליד']);

const STORE_KEY = 'tk.v1';
const DAY = 86400000;

/* ---------- עיבוד טקסט עברי ---------- */
const FINALS = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
function norm(s) {
  return (s || '').toLowerCase()
    .replace(/[֑-ׇ]/g, '')          // ניקוד וטעמים
    .replace(/["'׳״`]/g, '')
    .replace(/[ךםןףץ]/g, c => FINALS[c]);
}
function words(s) {
  return norm(s).split(/[^א-תa-z0-9]+/).filter(Boolean);
}
// גרסאות של מילה בלי אותיות שימוש (ו,ה,ב,ל,מ,ש,כ) ובלי סיומת רבים
function variants(w) {
  const out = new Set([w]);
  let x = w;
  for (let i = 0; i < 2; i++) {
    if (x.length > 3 && 'והבלמשכ'.includes(x[0])) { x = x.slice(1); out.add(x); } else break;
  }
  for (const v of [...out]) {
    if (v.length > 4 && (v.endsWith('ימ') || v.endsWith('ות'))) out.add(v.slice(0, -2));
  }
  return out;
}
function stem(w) { // הגרסה הקצרה ביותר – לשימוש בהשוואת דמיון
  let best = w;
  for (const v of variants(w)) if (v.length < best.length) best = v;
  return best;
}
const DEPT_NORM = new Set(DEPTS.map(d => stem(norm(d))));

// בדיקה אם ביטוי (מילה אחת או יותר) מופיע בטקסט, כולל אותיות שימוש
function hasPhrase(text, wordSets, phrase) {
  const p = norm(phrase);
  if (p.includes(' ')) return (' ' + words(text).join(' ') + ' ').includes(' ' + p + ' ') || norm(text).includes(p);
  return wordSets.some(vs => vs.has(p));
}
function analyzeWords(text) { return words(text).map(variants); }

/* ---------- נתונים ---------- */
let db = load();
function blank() { return { tasks: [], routine: [], learn: { dept: {}, type: {} }, v: 1 }; }
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(STORE_KEY));
    if (d && Array.isArray(d.tasks)) {
      d.routine = d.routine || []; d.learn = d.learn || { dept: {}, type: {} };
      d.learn.dept = d.learn.dept || {}; d.learn.type = d.learn.type || {};
      return d;
    }
  } catch (e) { /* ignore */ }
  return blank();
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); }
  catch (e) { toast('שגיאה בשמירה – כדאי לייצא גיבוי'); }
}
function uid() {
  const a = new Uint8Array(8); crypto.getRandomValues(a);
  return Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
}
// בקשה מהמערכת לא למחוק את הנתונים המקומיים
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

/* ---------- זיהוי אוטומטי ---------- */
function learnFrom(text, dept, type) {
  for (const w of words(text)) {
    const s = stem(w);
    if (s.length < 2 || STOP.has(w)) continue;
    (db.learn.dept[s] = db.learn.dept[s] || {})[dept] = (db.learn.dept[s][dept] || 0) + 1;
    (db.learn.type[s] = db.learn.type[s] || {})[type] = (db.learn.type[s][type] || 0) + 1;
  }
}
function guess(text) {
  const ws = analyzeWords(text);
  const stems = words(text).map(stem);
  const res = { dept: null, type: null, prio: 3, isFault: false };
  if (!ws.length) return res;

  // מחלקה
  const ds = {};
  for (const d of DEPTS) {
    let sc = 0;
    for (const k of DEPT_KW[d]) if (hasPhrase(text, ws, k)) sc += (norm(k) === norm(d) ? 10 : 3);
    for (const s of stems) { const l = db.learn.dept[s]; if (l && l[d]) sc += Math.min(l[d], 5) * 0.8; }
    if (sc) ds[d] = sc;
  }
  res.dept = topKey(ds);

  // סוג
  const isFault = FAULT_WORDS.some(k => hasPhrase(text, ws, k));
  const ts = {};
  for (const t of TYPES) {
    let sc = 0;
    for (const k of TYPE_KW[t.id] || []) if (hasPhrase(text, ws, k)) sc += (t.id === 'task' ? 5 : 3);
    for (const s of stems) { const l = db.learn.type[s]; if (l && l[t.id]) sc += Math.min(l[t.id], 5) * 0.8; }
    if (t.id === 'task' && isFault) sc -= 6;
    if (sc > 0) ts[t.id] = sc;
  }
  res.type = topKey(ts) || (isFault ? 'equip' : null);
  res.isFault = isFault || (res.type && res.type !== 'task');

  // עדיפות
  if (URGENT_WORDS.some(k => hasPhrase(text, ws, k))) res.prio = 1;
  return res;
}
function topKey(o) {
  let k = null, m = 0;
  for (const [a, b] of Object.entries(o)) if (b > m) { m = b; k = a; }
  return k;
}

/* ---------- זיהוי תקלה חוזרת ---------- */
function sigTokens(text) {
  const s = new Set();
  for (const w of words(text)) {
    if (STOP.has(w)) continue;
    const st = stem(w);
    if (st.length < 2 || DEPT_NORM.has(st)) continue;
    s.add(st);
  }
  return s;
}
function similarity(a, b) {
  if (!a.size || !b.size) return { inter: 0, score: 0 };
  let inter = 0; for (const x of a) if (b.has(x)) inter++;
  return { inter, score: inter / Math.min(a.size, b.size) };
}
function findSimilar(text, dept, excludeId) {
  const me = sigTokens(text);
  if (!me.size) return [];
  const out = [];
  for (const t of db.tasks) {
    if (t.id === excludeId || t.type === 'task') continue;
    const { inter, score } = similarity(me, sigTokens(t.title));
    const sameDept = !dept || !t.dept || t.dept === dept;
    if (inter >= 1 && ((sameDept && score >= 0.5) || (inter >= 2 && score >= 0.8))) out.push({ t, score: score + (sameDept ? 0.2 : 0) });
  }
  out.sort((x, y) => (y.t.createdAt - x.t.createdAt));
  return out.map(x => x.t);
}
function lastTreated(list) { return list.find(t => t.status === 'closed' && t.treatment); }

/* ---------- עזרי תצוגה ---------- */
const $ = s => document.querySelector(s);
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
const fmtD = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'numeric', year: '2-digit' });
const fmtDT = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });
function ago(ts) {
  const d = Math.floor((startOfDay(Date.now()) - startOfDay(ts)) / DAY);
  if (d <= 0) return 'היום'; if (d === 1) return 'אתמול'; if (d < 30) return `לפני ${d} ימים`;
  return fmtD.format(ts);
}
function startOfDay(ts) { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
function typeName(id) { const t = TYPES.find(x => x.id === id); return t ? t.name : ''; }
function prioName(v) { const p = PRIOS.find(x => x.v === v); return p ? p.name : ''; }
let toastT;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.remove('hidden');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.add('hidden'), 2200);
}

/* ---------- מצב ממשק ---------- */
const ui = { tab: 'open', dept: 'all', q: '' };
const TITLES = { open: 'משימות פתוחות', progress: 'משימות בטיפול', closed: 'משימות סגורות', routine: 'טיפול שוטף' };

function taskSort(a, b) {
  if (a.prio !== b.prio) return a.prio - b.prio;
  const ad = a.due || Infinity, bd = b.due || Infinity;
  if (ad !== bd) return ad - bd;
  return a.createdAt - b.createdAt;
}
function routineDue(r) { return (r.last || r.createdAt) + r.every * DAY; }
function routineState(r) {
  const days = Math.round((startOfDay(routineDue(r)) - startOfDay(Date.now())) / DAY);
  if (!r.last) return { cls: 'r-over', txt: 'עוד לא בוצע', days: -1 };
  if (days < 0) return { cls: 'r-over', txt: `באיחור של ${-days} ${-days === 1 ? 'יום' : 'ימים'}`, days };
  if (days === 0) return { cls: 'r-today', txt: 'להיום', days };
  return { cls: 'r-ok', txt: days === 1 ? 'מחר' : `בעוד ${days} ימים`, days };
}
function urgencyScore(t) {
  const age = (Date.now() - t.createdAt) / DAY;
  let s = (5 - t.prio) * 10 + Math.min(age, 14) * 0.7;
  if (t.repeats) s += 4;
  if (t.due && t.due < Date.now() + DAY) s += 12;
  if (t.status === 'progress') s += 2;
  return s;
}

/* ---------- רינדור ---------- */
function render() {
  $('#title').textContent = TITLES[ui.tab];
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === ui.tab));
  $('#search-wrap').classList.toggle('hidden', ui.tab !== 'closed');

  const items = currentItems(false);
  // מחלקות
  const counts = {}; for (const it of items) counts[it.dept || '—'] = (counts[it.dept || '—'] || 0) + 1;
  let chips = `<button class="chip ${ui.dept === 'all' ? 'on' : ''}" data-dept="all">הכול <span class="n">${items.length}</span></button>`;
  for (const d of DEPTS) chips += `<button class="chip ${ui.dept === d ? 'on' : ''}" data-dept="${esc(d)}">${esc(d)}${counts[d] ? ` <span class="n">${counts[d]}</span>` : ''}</button>`;
  $('#depts').innerHTML = chips;

  // תגים בלשוניות
  $('#b-open').textContent = db.tasks.filter(t => t.status === 'open').length || '';
  $('#b-progress').textContent = db.tasks.filter(t => t.status === 'progress').length || '';
  $('#b-routine').textContent = db.routine.filter(r => routineState(r).days <= 0).length || '';

  const list = currentItems(true);
  let html = '';
  if (ui.tab === 'open' && ui.dept === 'all') html += focusBox();
  if (!list.length) html += emptyMsg();
  else if (ui.dept === 'all' && ui.tab !== 'closed') {
    const groups = {};
    for (const it of list) (groups[it.dept || '—'] = groups[it.dept || '—'] || []).push(it);
    for (const d of [...DEPTS, '—']) {
      if (!groups[d]) continue;
      html += `<div class="group-h"><span>${d === '—' ? 'ללא מחלקה' : esc(d)}</span><span>${groups[d].length}</span></div>`;
      html += groups[d].map(cardHtml).join('');
    }
  } else html += list.map(cardHtml).join('');
  $('#main').innerHTML = html;
}
function currentItems(applyFilter) {
  let list;
  if (ui.tab === 'routine') {
    list = db.routine.slice().sort((a, b) => routineDue(a) - routineDue(b));
  } else {
    list = db.tasks.filter(t => t.status === ui.tab);
    if (ui.tab === 'closed') {
      list.sort((a, b) => (b.closedAt || 0) - (a.closedAt || 0));
      if (ui.q) {
        const q = norm(ui.q);
        list = list.filter(t => norm(t.title + ' ' + (t.treatment || '') + ' ' + (t.notes || '')).includes(q));
      }
    } else list.sort(taskSort);
  }
  if (applyFilter && ui.dept !== 'all') list = list.filter(x => x.dept === ui.dept);
  return list;
}
function focusBox() {
  const tasks = db.tasks.filter(t => t.status !== 'closed').map(t => ({ s: urgencyScore(t), txt: t.title, sub: `${t.dept || ''} · ${prioName(t.prio)}${t.status === 'progress' ? ' · בטיפול' : ''}` }));
  const rts = db.routine.filter(r => routineState(r).days <= 0).map(r => ({ s: 22 - routineState(r).days, txt: r.title, sub: `שוטף · ${r.dept || ''} · ${routineState(r).txt}` }));
  const top = tasks.concat(rts).sort((a, b) => b.s - a.s).slice(0, 3);
  if (!top.length) return '';
  return `<div class="focus"><h3>⚡ מה עכשיו – 3 הדברים הכי חשובים</h3><ol>${top.map(x => `<li>${esc(x.txt)} <span>${esc(x.sub)}</span></li>`).join('')}</ol></div>`;
}
function emptyMsg() {
  const m = {
    open: 'אין משימות פתוחות 🎉<br>לחץ על + כדי להוסיף תקלה או משימה',
    progress: 'אין כרגע משימות בטיפול',
    closed: ui.q ? 'לא נמצאו תוצאות' : 'עוד אין משימות סגורות',
    routine: 'עוד אין טיפולים שוטפים<br>לחץ על + כדי להוסיף, למשל: ניקוי מפריד שומן כל 30 יום',
  };
  return `<div class="empty">${m[ui.tab]}</div>`;
}
function cardHtml(it) {
  if (ui.tab === 'routine') {
    const st = routineState(it);
    return `<div class="card" data-open-r="${it.id}">
      <div class="body"><div class="t">${esc(it.title)}</div>
      <div class="meta"><span class="r-due ${st.cls}">${st.txt}</span><span class="tag">כל ${it.every} ימים</span>${it.dept ? `<span class="tag">${esc(it.dept)}</span>` : ''}${it.last ? `<span>בוצע ${ago(it.last)}</span>` : ''}</div></div>
      <button class="act" data-done-r="${it.id}">בוצע ✓</button></div>`;
  }
  const t = it;
  let act = '';
  if (t.status === 'open') act = `<button class="act" data-start="${t.id}">לטיפול</button>`;
  else if (t.status === 'progress') act = `<button class="act" data-close="${t.id}">סגור</button>`;
  const when = t.status === 'closed' ? `נסגר ${ago(t.closedAt)}` : ago(t.createdAt);
  return `<div class="card" data-open="${t.id}">
    <div class="bar pr${t.prio}"></div>
    <div class="body"><div class="t">${esc(t.title)}</div>
      <div class="meta">${ui.dept === 'all' && ui.tab === 'closed' && t.dept ? `<span class="tag">${esc(t.dept)}</span>` : ''}
        <span class="tag">${esc(typeName(t.type))}</span>
        ${t.repeats ? `<span class="tag rep">↻ חוזרת ×${t.repeats + 1}</span>` : ''}
        ${t.due ? `<span class="tag">עד ${fmtD.format(t.due)}</span>` : ''}
        <span>${when}</span></div>
      ${t.status === 'closed' && t.treatment ? `<div class="meta">טיפול: ${esc(t.treatment)}</div>` : ''}
    </div>${act}</div>`;
}

/* ---------- גיליונות (חלונות קופצים) ---------- */
function openSheet(html) {
  $('#sheet').innerHTML = '<div class="grab"></div><button class="x-close" data-x="cancel" aria-label="סגירה">✕</button>' + html;
  $('#sheet').classList.remove('hidden'); $('#sheet-bg').classList.remove('hidden');
  $('#sheet').scrollTop = 0;
}
function closeSheet() {
  $('#sheet').classList.add('hidden'); $('#sheet-bg').classList.add('hidden'); $('#sheet').innerHTML = '';
  sheetState = null;
}
let sheetState = null;

function pickChips(name, options, selected, autoVal) {
  return `<div class="chips pick" data-pick="${name}">` + options.map(o => {
    const v = typeof o === 'object' ? o.v ?? o.id : o;
    const label = typeof o === 'object' ? o.name : o;
    const cls = name === 'prio' ? ` prio-${v}` : '';
    return `<button class="chip${cls} ${String(v) === String(selected) ? 'on' : ''}" data-val="${esc(v)}">${esc(label)}${autoVal != null && String(v) === String(autoVal) && String(v) === String(selected) ? '<span class="auto">אוטו׳</span>' : ''}</button>`;
  }).join('') + '</div>';
}

/* --- הוספה מהירה --- */
function quickAdd() {
  if (ui.tab === 'routine') return routineEdit(null);
  sheetState = { kind: 'quick', manual: {}, dept: ui.dept !== 'all' ? ui.dept : null, type: null, prio: 3, auto: {} };
  if (sheetState.dept) sheetState.manual.dept = true;
  openSheet(`<h2>תקלה / משימה חדשה</h2>
    <input id="q-title" class="field" placeholder="למשל: מקרר בר לא מקרר" autocomplete="off" enterkeyhint="done">
    <div id="q-rep"></div>
    <label>מחלקה</label><div id="q-dept"></div>
    <label>סוג</label><div id="q-type"></div>
    <label>עדיפות</label><div id="q-prio"></div>
    <div class="row"><button class="btn" data-x="cancel">ביטול</button><button class="btn primary" data-x="q-save">שמור</button></div>`);
  quickRefresh();
  const inp = $('#q-title'); inp.focus();
}
function quickRefresh() {
  const s = sheetState, text = $('#q-title') ? $('#q-title').value : '';
  const g = guess(text);
  s.auto = g;
  if (!s.manual.dept && g.dept) s.dept = g.dept;
  if (!s.manual.type) s.type = g.type || (text.trim() ? 'task' : null);
  if (!s.manual.prio) s.prio = g.prio;
  const sim = text.trim().length > 2 && s.type !== 'task' ? findSimilar(text, s.dept) : [];
  if (sim.length && !s.manual.prio && s.prio > 2) s.prio = 2;
  s.sim = sim;
  $('#q-dept').innerHTML = pickChips('dept', DEPTS, s.dept, s.manual.dept ? null : g.dept);
  $('#q-type').innerHTML = pickChips('type', TYPES, s.type, s.manual.type ? null : g.type);
  $('#q-prio').innerHTML = pickChips('prio', PRIOS, s.prio, !s.manual.prio && (g.prio === 1 || sim.length) ? s.prio : null);
  $('#q-rep').innerHTML = repeatBox(sim);
}
function repeatBox(sim) {
  if (!sim.length) return '';
  const last = lastTreated(sim);
  const n90 = sim.filter(t => t.createdAt > Date.now() - 90 * DAY).length;
  return `<div class="repeat"><b>↻ נראה כמו תקלה חוזרת</b>
    הופיעה ${sim.length} ${sim.length === 1 ? 'פעם' : 'פעמים'} בעבר${n90 ? ` (${n90} ב־90 הימים האחרונים)` : ''}. פעם אחרונה: ${ago(sim[0].createdAt)} – "${esc(sim[0].title)}"
    ${last ? `<div class="prev"><b>הטיפול בפעם הקודמת (${fmtD.format(last.closedAt)}):</b>${esc(last.treatment)}</div>`
           : '<div class="prev">עדיין לא נרשם טיפול לתקלה הזו.</div>'}
  </div>`;
}
function quickSave() {
  const s = sheetState, title = $('#q-title').value.trim();
  if (!title) { $('#q-title').focus(); return; }
  const t = {
    id: uid(), title, notes: '', dept: s.dept, type: s.type || 'task', prio: s.prio,
    status: 'open', createdAt: Date.now(), log: [],
  };
  const sim = t.type !== 'task' ? findSimilar(title, t.dept) : [];
  if (sim.length) { t.related = sim.map(x => x.id); t.repeats = sim.length; }
  db.tasks.push(t);
  if (t.dept) learnFrom(title, t.dept, t.type);
  save(); closeSheet();
  if (ui.tab !== 'open') ui.tab = 'open';
  render(); toast(sim.length ? 'נשמר · סומן כתקלה חוזרת' : 'נשמר');
}

/* --- פרטי משימה --- */
function taskDetail(id) {
  const t = db.tasks.find(x => x.id === id); if (!t) return;
  sheetState = { kind: 'detail', id, dept: t.dept, type: t.type, prio: t.prio };
  const rel = findSimilar(t.title, t.dept, t.id);
  let actions = '';
  if (t.status === 'open') actions = `<button class="btn primary" data-x="start">התחל טיפול</button><button class="btn ok" data-x="close">סגור</button>`;
  else if (t.status === 'progress') actions = `<button class="btn" data-x="reopen">החזר לפתוחות</button><button class="btn ok" data-x="close">סגור משימה</button>`;
  else actions = `<button class="btn" data-x="reopen">פתח מחדש</button>`;

  openSheet(`<h2>פרטי ${t.type === 'task' ? 'משימה' : 'תקלה'}</h2>
    <input id="d-title" class="field" value="${esc(t.title)}">
    ${t.status !== 'closed' ? repeatBox(rel) : ''}
    <label>מחלקה</label>${pickChips('dept', DEPTS, t.dept)}
    <label>סוג</label>${pickChips('type', TYPES, t.type)}
    <label>עדיפות</label>${pickChips('prio', PRIOS, t.prio)}
    <label>תאריך יעד (לא חובה)</label>
    <input id="d-due" type="date" class="field" value="${t.due ? new Date(t.due - new Date(t.due).getTimezoneOffset() * 60000).toISOString().slice(0, 10) : ''}">
    <label>הערות</label><textarea id="d-notes" placeholder="ספק, טלפון של טכנאי, מספר דגם...">${esc(t.notes || '')}</textarea>
    ${t.status === 'closed' ? `<label>איך טופל</label><textarea id="d-treat">${esc(t.treatment || '')}</textarea>` : ''}
    <div class="row">${actions}</div>
    <label>עדכון מהלך הטיפול</label>
    <div class="row mt0"><input id="d-log" class="field" placeholder="למשל: הוזמן טכנאי לשעה 10"><button class="btn small primary" data-x="log">הוסף</button></div>
    <div class="hist">${(t.log || []).slice().reverse().map(l => `<div class="h"><small>${fmtDT.format(l.t)}</small>${esc(l.text)}</div>`).join('')}
      <div class="h"><small>${fmtDT.format(t.createdAt)}</small>נפתח</div></div>
    ${rel.length ? `<label>היסטוריה של תקלות דומות</label><div class="hist">${rel.map(r => `<div class="h"><small>${fmtD.format(r.createdAt)} · ${r.status === 'closed' ? 'נסגר' : r.status === 'progress' ? 'בטיפול' : 'פתוח'}</small>${esc(r.title)}${r.treatment ? `<br><b>טיפול:</b> ${esc(r.treatment)}` : ''}</div>`).join('')}</div>` : ''}
    <div class="row"><button class="btn danger" data-x="del">מחק</button><button class="btn primary" data-x="d-save">שמור שינויים</button></div>`);
}
function detailCollect(t) {
  const title = $('#d-title').value.trim(); if (title) t.title = title;
  t.notes = $('#d-notes').value.trim();
  const due = $('#d-due').value; t.due = due ? new Date(due + 'T18:00').getTime() : null;
  const changedClass = t.dept !== sheetState.dept || t.type !== sheetState.type;
  t.dept = sheetState.dept; t.type = sheetState.type; t.prio = sheetState.prio;
  if ($('#d-treat')) t.treatment = $('#d-treat').value.trim();
  if (changedClass && t.dept) learnFrom(t.title, t.dept, t.type);
}
function setStatus(t, st) {
  t.status = st;
  if (st === 'progress') { t.startedAt = Date.now(); addLog(t, 'הועבר לטיפול'); }
  if (st === 'open') { addLog(t, 'הוחזר לפתוחות'); t.closedAt = null; }
}
function addLog(t, text) { (t.log = t.log || []).push({ t: Date.now(), text }); }

/* --- סגירת משימה עם תיעוד הטיפול --- */
function closeFlow(id) {
  const t = db.tasks.find(x => x.id === id); if (!t) return;
  const prev = lastTreated(findSimilar(t.title, t.dept, t.id));
  sheetState = { kind: 'close', id };
  openSheet(`<h2>סגירה: ${esc(t.title)}</h2>
    <label>מה עשית / איך טופל? (יוצג בפעם הבאה שהתקלה תחזור)</label>
    <textarea id="c-treat" placeholder="למשל: הוחלף מאוורר במדחס, טכנאי משה 050-...">${esc(t.treatment || '')}</textarea>
    ${prev ? `<button class="btn small mt8" data-x="c-prev">כמו בפעם הקודמת: ${esc(prev.treatment.slice(0, 40))}${prev.treatment.length > 40 ? '…' : ''}</button>` : ''}
    <div class="row"><button class="btn" data-x="cancel">ביטול</button><button class="btn ok" data-x="c-save">סגור משימה</button></div>`);
  sheetState.prev = prev ? prev.treatment : '';
  $('#c-treat').focus();
}

/* --- טיפול שוטף --- */
function routineEdit(id) {
  const r = id ? db.routine.find(x => x.id === id) : null;
  sheetState = { kind: 'routine', id, dept: r ? r.dept : (ui.dept !== 'all' ? ui.dept : null), every: r ? r.every : 7 };
  const presets = [{ v: 1, name: 'כל יום' }, { v: 7, name: 'שבועי' }, { v: 14, name: 'דו־שבועי' }, { v: 30, name: 'חודשי' }, { v: 90, name: 'רבעוני' }, { v: 180, name: 'חצי שנתי' }];
  openSheet(`<h2>${r ? 'טיפול שוטף' : 'טיפול שוטף חדש'}</h2>
    <input id="r-title" class="field" placeholder="למשל: ניקוי מסנני מנדף" value="${r ? esc(r.title) : ''}" autocomplete="off">
    <label>מחלקה</label>${pickChips('dept', DEPTS, sheetState.dept)}
    <label>תדירות</label>${pickChips('every', presets, sheetState.every)}
    <div class="row mt8 center"><span class="note">או כל</span><input id="r-every" type="number" inputmode="numeric" min="1" class="field num" value="${sheetState.every}"><span class="note">ימים</span></div>
    ${r ? `<div class="kv">${r.last ? `בוצע לאחרונה: ${fmtD.format(r.last)} · הבא: ${fmtD.format(routineDue(r))}` : 'עוד לא בוצע'}</div>
      <label>היסטוריה</label><div class="hist">${(r.history || []).slice().reverse().slice(0, 30).map(h => `<div class="h"><small>${fmtDT.format(h.t)}</small>${esc(h.note || 'בוצע')}</div>`).join('') || '<div class="note">אין עדיין</div>'}</div>` : ''}
    <div class="row">${r ? '<button class="btn danger" data-x="r-del">מחק</button>' : '<button class="btn" data-x="cancel">ביטול</button>'}<button class="btn primary" data-x="r-save">שמור</button></div>`);
  if (!r) $('#r-title').focus();
}
function routineDone(id) {
  const r = db.routine.find(x => x.id === id); if (!r) return;
  sheetState = { kind: 'rdone', id };
  openSheet(`<h2>בוצע: ${esc(r.title)}</h2>
    <label>הערה (לא חובה)</label><input id="rd-note" class="field" placeholder="למשל: הוחלף פילטר" enterkeyhint="done">
    <div class="row"><button class="btn" data-x="cancel">ביטול</button><button class="btn ok" data-x="rd-save">סמן כבוצע</button></div>`);
}

/* --- הגדרות וגיבוי --- */
function settings() {
  sheetState = { kind: 'settings' };
  const n = db.tasks.length, c = db.tasks.filter(t => t.status === 'closed').length;
  openSheet(`<h2>הגדרות וגיבוי</h2>
    <div class="kv">סה״כ ${n} משימות (${c} סגורות) · ${db.routine.length} טיפולים שוטפים</div>
    <div class="set-sec"><label>גיבוי</label>
      <p class="note">הנתונים שמורים רק בטלפון הזה. כדאי לייצא גיבוי פעם בשבוע ולשמור אותו ב"קבצים" (אפשר לבחור "On My iPhone").</p>
      <div class="row"><button class="btn primary" data-x="export">ייצוא גיבוי</button><button class="btn" data-x="import">שחזור מגיבוי</button></div>
      <input id="imp-file" type="file" accept="application/json,.json" class="hidden">
    </div>
    <div class="set-sec"><label>פרטיות ואבטחה</label>
      <p class="note">🔒 האפליקציה חסומה לגישה לאינטרנט (Content-Security-Policy: connect-src 'none'), אין בה התחברות, אין חשבון, ואין שדות לפרטים אישיים או תשלום. שום נתון לא נשלח לשום מקום.</p>
    </div>
    <div class="set-sec"><label>אזור מסוכן</label>
      <div class="row"><button class="btn danger" data-x="wipe">מחק את כל הנתונים</button></div>
    </div>
    <div class="row"><button class="btn" data-x="cancel">סגור</button></div>`);
}
async function doExport() {
  const json = JSON.stringify({ app: 'tk', exportedAt: new Date().toISOString(), ...db }, null, 1);
  const name = `גיבוי-תקלות-${new Date().toISOString().slice(0, 10)}.json`;
  try {
    const file = new File([json], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file] }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
}
function doImport(file) {
  const fr = new FileReader();
  fr.onload = () => {
    try {
      const d = JSON.parse(fr.result);
      if (!d || !Array.isArray(d.tasks)) throw new Error('bad');
      if (!confirm(`לשחזר ${d.tasks.length} משימות ו־${(d.routine || []).length} טיפולים שוטפים? הנתונים הנוכחיים יוחלפו.`)) return;
      db = { tasks: d.tasks, routine: d.routine || [], learn: d.learn || { dept: {}, type: {} }, v: 1 };
      save(); closeSheet(); render(); toast('השחזור הושלם');
    } catch (e) { toast('הקובץ לא תקין'); }
  };
  fr.readAsText(file);
}

/* ---------- אירועים ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('button, .card, #sheet-bg'); if (!el) return;

  if (el.id === 'sheet-bg') return closeSheet();
  if (el.id === 'fab') return quickAdd();
  if (el.id === 'btnSettings') return settings();
  if (el.dataset.tab) { ui.tab = el.dataset.tab; ui.dept = ui.dept; window.scrollTo(0, 0); return render(); }
  if (el.dataset.dept) { ui.dept = el.dataset.dept; return render(); }

  // פעולות מהירות על כרטיס
  if (el.dataset.start) { e.stopPropagation(); const t = db.tasks.find(x => x.id === el.dataset.start); setStatus(t, 'progress'); save(); render(); return toast('הועבר לטיפול'); }
  if (el.dataset.close) { e.stopPropagation(); return closeFlow(el.dataset.close); }
  if (el.dataset.doneR) { e.stopPropagation(); return routineDone(el.dataset.doneR); }
  if (el.dataset.open) return taskDetail(el.dataset.open);
  if (el.dataset.openR) return routineEdit(el.dataset.openR);

  // בחירת צ׳יפ בתוך חלון
  const pick = el.closest('[data-pick]');
  if (pick && sheetState) {
    const name = pick.dataset.pick; let v = el.dataset.val;
    if (name === 'prio' || name === 'every') v = Number(v);
    sheetState[name] = v;
    if (sheetState.kind === 'quick') { sheetState.manual[name] = true; return quickRefresh(); }
    pick.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.val === String(v)));
    if (name === 'every' && $('#r-every')) $('#r-every').value = v;
    return;
  }

  const x = el.dataset.x; if (!x) return;
  const s = sheetState;
  const t = s && s.id ? db.tasks.find(y => y.id === s.id) : null;
  switch (x) {
    case 'cancel': return closeSheet();
    case 'q-save': return quickSave();
    case 'd-save': detailCollect(t); save(); closeSheet(); render(); return toast('נשמר');
    case 'start': detailCollect(t); setStatus(t, 'progress'); save(); closeSheet(); render(); return toast('הועבר לטיפול');
    case 'reopen': detailCollect(t); setStatus(t, 'open'); save(); closeSheet(); render(); return toast('הוחזר לפתוחות');
    case 'close': detailCollect(t); save(); return closeFlow(t.id);
    case 'log': {
      const v = $('#d-log').value.trim(); if (!v) return;
      detailCollect(t); addLog(t, v); save(); taskDetail(t.id); return;
    }
    case 'del':
      if (confirm('למחוק את המשימה?')) { db.tasks = db.tasks.filter(y => y.id !== t.id); save(); closeSheet(); render(); }
      return;
    case 'c-prev': $('#c-treat').value = s.prev; return;
    case 'c-save': {
      const tr = $('#c-treat').value.trim();
      t.treatment = tr; t.status = 'closed'; t.closedAt = Date.now(); addLog(t, 'נסגר' + (tr ? ': ' + tr : ''));
      save(); closeSheet(); render(); return toast('נסגר ✓');
    }
    case 'r-save': {
      const title = $('#r-title').value.trim(); if (!title) return $('#r-title').focus();
      const every = Math.max(1, Number($('#r-every').value) || s.every || 7);
      if (s.id) Object.assign(db.routine.find(y => y.id === s.id), { title, dept: s.dept, every });
      else db.routine.push({ id: uid(), title, dept: s.dept, every, last: null, createdAt: Date.now(), history: [] });
      save(); closeSheet(); render(); return toast('נשמר');
    }
    case 'r-del':
      if (confirm('למחוק את הטיפול השוטף?')) { db.routine = db.routine.filter(y => y.id !== s.id); save(); closeSheet(); render(); }
      return;
    case 'rd-save': {
      const r = db.routine.find(y => y.id === s.id);
      r.last = Date.now(); (r.history = r.history || []).push({ t: r.last, note: $('#rd-note').value.trim() });
      save(); closeSheet(); render(); return toast('סומן כבוצע ✓');
    }
    case 'export': return doExport();
    case 'import': return $('#imp-file').click();
    case 'wipe':
      if (confirm('למחוק את כל הנתונים לצמיתות? מומלץ לייצא גיבוי לפני.') && confirm('בטוח? אין דרך לשחזר בלי גיבוי.')) {
        db = blank(); save(); closeSheet(); render(); toast('הכול נמחק');
      }
      return;
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'q-title') quickRefresh();
  if (e.target.id === 'search') { ui.q = e.target.value; render(); }
  if (e.target.id === 'r-every' && sheetState) {
    sheetState.every = Number(e.target.value) || 7;
    document.querySelectorAll('[data-pick="every"] .chip').forEach(c => c.classList.toggle('on', c.dataset.val === String(sheetState.every)));
  }
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (e.target.id === 'q-title') { e.preventDefault(); quickSave(); }
  if (e.target.id === 'rd-note') { e.preventDefault(); document.querySelector('[data-x="rd-save"]').click(); }
  if (e.target.id === 'd-log') { e.preventDefault(); document.querySelector('[data-x="log"]').click(); }
});
document.addEventListener('change', e => {
  if (e.target.id === 'imp-file' && e.target.files[0]) doImport(e.target.files[0]);
});
// רענון תצוגה כשחוזרים לאפליקציה (למשל ביום חדש)
document.addEventListener('visibilitychange', () => { if (!document.hidden && !sheetState) render(); });

/* ---------- עבודה ללא אינטרנט ---------- */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

render();
