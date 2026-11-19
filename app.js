'use strict';
/* =========================================================
   תקלות ומשימות – אפליקציה מקומית בלבד.
   אין שום קריאת רשת. כל הנתונים נשמרים במכשיר (localStorage).
   ========================================================= */

/* ---------- הגדרות שקל לשנות ---------- */
// שתי המסעדות והמחלקות של כל אחת
const RESTS = [
  { id: 'ramah', name: 'רמה״ח', depts: ['פלור', 'מטבח', 'בר', 'הכנות', 'קצביה', 'משרד', 'כללי'] },
  { id: 'lili', name: 'לילי', depts: ['פלור', 'מטבח', 'משרד', 'כללי'] },
];
const DEPTS = RESTS[0].depts.slice(); // כל המחלקות (לאנשי קשר)
const REST_KW = { lili: ['לילי', 'לילינבלום'], ramah: ['רמהח', 'רמה״ח', 'רמה"ח'] };
function deptsOf(rest) { return (RESTS.find(r => r.id === rest) || RESTS[0]).depts; }
function restName(id) { return (RESTS.find(r => r.id === id) || RESTS[0]).name; }
const DEFAULT_DEPT = 'כללי'; // לאן הולך כל מה שלא זוהתה לו מחלקה

const TYPES = [
  { id: 'equip', name: 'מכשור' },
  { id: 'plumb', name: 'אינסטלציה וביוב' },
  { id: 'elec',  name: 'חשמל' },
  { id: 'build', name: 'מבנה ותחזוקה' },
  { id: 'it',    name: 'מחשוב ותקשורת' },
  { id: 'task',  name: 'משימה' },
];

const PRIOS = [
  { v: 1, name: 'דחופה' },
  { v: 2, name: 'גבוהה' },
  { v: 3, name: 'רגילה' },
  { v: 4, name: 'נמוכה' },
];

const DEPT_KW = {
  'פלור': ['פלור', 'אולם', 'שולחן', 'שולחנות', 'כיסא', 'כיסאות', 'כסא', 'ספה', 'מארחת', 'כניסה', 'טרסה', 'מרפסת', 'רמקול', 'מוזיקה', 'מלצר', 'מלצרים', 'שירותים'],
  'מטבח': ['מטבח', 'כיריים', 'תנור', 'טאבון', 'גריל', 'פלנצה', 'סלמנדר', 'פריטוז', 'ציפסר', 'מנדף', 'מדיח', 'ליין', 'טבח', 'טבחים', 'שף'],
  'בר': ['בר', 'ברמן', 'ברמנים', 'בירה', 'חבית', 'חביות', 'קרח', 'כוסות', 'קוקטייל', 'קוקטיילים', 'אלכוהול', 'יין', 'אספרסו', 'קפה', 'סודה', 'מזיגה', 'ברז בירה'],
  'הכנות': ['הכנות', 'ואקום', 'מיקסר', 'רובוטקופ', 'בלנדר', 'מקצפה', 'סוביד', 'סו ויד', 'בלאסט', 'קירור מהיר'],
  'קצביה': ['קצביה', 'קצב', 'בשר', 'מטחנה', 'מסור', 'יישון', 'נקניק', 'נקניקים', 'פירוק'],
  'משרד': ['משרד', 'מחשב', 'מדפסת', 'אינטרנט', 'ראוטר', 'וויפי', 'wifi', 'חשבונית', 'חשבוניות', 'שכר', 'משמרות', 'סידור עבודה', 'הנהלת חשבונות'],
  'כללי': ['כללי'],
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
const URGENT_WORDS = ['דחוף', 'דחופה', 'מיידי', 'מייד', 'מיד', 'עכשיו', 'חירום', 'בטיחות', 'גז', 'הצפה', 'אין מים', 'אין חשמל', 'אש', 'עשן'];
const STOP = new Set(['של', 'את', 'על', 'עם', 'יש', 'אין', 'לא', 'זה', 'זו', 'גם', 'עוד', 'כל', 'או', 'אם', 'כי', 'רק', 'מה', 'הוא', 'היא', 'הם', 'אני', 'צריך', 'צריכה', 'צריכים', 'עובד', 'עובדת', 'תקלה', 'תקול', 'תקולה', 'שוב', 'קצת', 'מאוד', 'ממש', 'היום', 'מחר', 'דחוף', 'דחופה', 'אחרי', 'לפני', 'בתוך', 'ליד']);

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
const DEPT_NORM = new Set(DEPTS.concat(REST_KW.lili, REST_KW.ramah).map(d => stem(norm(d))));

// בדיקה אם ביטוי (מילה אחת או יותר) מופיע בטקסט, כולל אותיות שימוש
function hasPhrase(text, wordSets, phrase) {
  const p = norm(phrase);
  if (p.includes(' ')) return (' ' + words(text).join(' ') + ' ').includes(' ' + p + ' ') || norm(text).includes(p);
  return wordSets.some(vs => vs.has(p));
}
function analyzeWords(text) { return words(text).map(variants); }

/* ---------- נתונים ---------- */
let db = load();
function blank() { return { tasks: [], routine: [], contacts: [], fridges: [], temps: [], learn: { dept: {}, type: {} }, v: 1 }; }
function fixShape(d) {
  d.routine = d.routine || []; d.contacts = d.contacts || []; d.fridges = d.fridges || []; d.temps = d.temps || [];
  d.learn = d.learn || { dept: {}, type: {} }; d.learn.dept = d.learn.dept || {}; d.learn.type = d.learn.type || {};
  for (const x of d.tasks.concat(d.routine)) {
    if (!x.rest) {
      if (x.dept === 'לילינבלום') { x.rest = 'lili'; x.dept = DEFAULT_DEPT; } else x.rest = 'ramah';
    }
    if (!x.dept || !deptsOf(x.rest).includes(x.dept)) x.dept = DEFAULT_DEPT;
  }
  for (const c of d.contacts) if (c.dept && !DEPTS.includes(c.dept)) c.dept = null;
  for (const f of d.fridges) if (f.dept && !DEPTS.includes(f.dept)) f.dept = DEFAULT_DEPT;
  return d;
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(STORE_KEY));
    if (d && Array.isArray(d.tasks)) return fixShape(d);
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
function guessRest(text) {
  const ws = analyzeWords(text);
  for (const [id, kws] of Object.entries(REST_KW)) if (kws.some(k => hasPhrase(text, ws, k))) return id;
  return null;
}
function guess(text, rest) {
  const ws = analyzeWords(text);
  const stems = words(text).map(stem);
  const res = { dept: null, type: null, prio: 3, isFault: false };
  if (!ws.length) return res;

  // מחלקה
  const ds = {};
  for (const d of deptsOf(rest)) {
    let sc = 0;
    for (const k of DEPT_KW[d] || []) if (hasPhrase(text, ws, k)) sc += (norm(k) === norm(d) ? 10 : 3);
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
function findSimilar(text, dept, excludeId, rest) {
  const me = sigTokens(text);
  if (!me.size) return [];
  const out = [];
  for (const t of db.tasks) {
    if (t.id === excludeId || t.type === 'task') continue;
    if (rest && (t.rest || 'ramah') !== rest) continue;
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
const p2 = n => String(n).padStart(2, '0');
function toInputDate(ts) { if (!ts) return ''; const d = new Date(ts); return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`; }
function toInputDT(ts) { if (!ts) return ''; const d = new Date(ts); return `${toInputDate(ts)}T${p2(d.getHours())}:${p2(d.getMinutes())}`; }
function parseDate(v) { if (!v) return null; const t = new Date(v + 'T18:00').getTime(); return isNaN(t) ? null : t; }
function parseDT(v) { if (!v) return null; const t = new Date(v).getTime(); return isNaN(t) ? null : Math.floor(t / 60000) * 60000; }
const sameMinute = (a, b) => Math.floor((a || 0) / 60000) === Math.floor((b || 0) / 60000);
const fmtTime = new Intl.DateTimeFormat('he-IL', { hour: '2-digit', minute: '2-digit' });
function whenTxt(ts) { // "היום 09:00" / "מחר 09:00" / "20.11 09:00"
  const d = Math.round((startOfDay(ts) - startOfDay(Date.now())) / DAY);
  const day = d === 0 ? 'היום' : d === 1 ? 'מחר' : d === -1 ? 'אתמול' : new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'numeric' }).format(ts);
  return `${day} ${fmtTime.format(ts)}`;
}
function dueState(t) {
  if (!t.due) return null;
  const d = Math.round((startOfDay(t.due) - startOfDay(Date.now())) / DAY);
  if (t.status === 'closed') return { cls: '', txt: `יעד ${fmtD.format(t.due)}` };
  if (d < 0) return { cls: 'over', txt: `⚠ יעד עבר: ${fmtD.format(t.due)}` };
  if (d === 0) return { cls: 'today', txt: 'יעד: היום' };
  if (d === 1) return { cls: '', txt: 'יעד: מחר' };
  return { cls: '', txt: `יעד: ${fmtD.format(t.due)}` };
}
function startOfDay(ts) { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
function typeName(id) { const t = TYPES.find(x => x.id === id); return t ? t.name : ''; }
// צבע לפי כמות: ירוק 1–2, כתום 3–5, אדום 6+
const LOAD_MID = 3, LOAD_HIGH = 6;
function loadCls(n) { return n >= LOAD_HIGH ? 'ld-high' : n >= LOAD_MID ? 'ld-mid' : 'ld-low'; }
function prioTag(t) { return t.status !== 'closed' && t.prio <= 2 ? `<span class="tag ptag p${t.prio}">${t.prio === 1 ? '🔥 דחופה' : 'גבוהה'}</span>` : ''; }
function prioName(v) { const p = PRIOS.find(x => x.v === v); return p ? p.name : ''; }
let toastT;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.classList.remove('hidden');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.add('hidden'), 2200);
}

/* ---------- מצב ממשק ---------- */
const ui = { tab: 'open', dept: 'all', q: '', calMonth: null, calDay: null, rest: 'ramah' };
try { const r = localStorage.getItem('tk.rest'); if (RESTS.some(x => x.id === r)) ui.rest = r; } catch (e) { /* */ }
function setRest(id) {
  ui.rest = id; try { localStorage.setItem('tk.rest', id); } catch (e) { /* */ }
  if (ui.dept !== 'all' && !deptsOf(id).includes(ui.dept)) ui.dept = 'all';
}
if (ui.tab === 'contacts') ui.tab = 'open';
const inRest = x => (x.rest || 'ramah') === ui.rest;
const TITLES = { open: 'משימות פתוחות', progress: 'משימות בטיפול', closed: 'משימות סגורות', routine: 'טיפול שוטף', cal: 'יומן', contacts: 'טכנאים וספקים' };

function taskSort(a, b) {
  if (a.prio !== b.prio) return a.prio - b.prio;
  if (a.status !== b.status) return a.status === 'open' ? -1 : 1; // באותה עדיפות: פתוחות לפני בטיפול
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
  $('#search-wrap').classList.toggle('hidden', ui.tab !== 'closed' && ui.tab !== 'contacts');
  $('#search').placeholder = ui.tab === 'contacts' ? 'חיפוש לפי שם, תפקיד או טלפון...' : 'חיפוש...';

  const showRest = ui.tab !== 'cal' && ui.tab !== 'contacts';
  $('#rest-sw').classList.toggle('hidden', !showRest);
  $('#rest-sw').querySelectorAll('[data-rest]').forEach(b => b.classList.toggle('on', b.dataset.rest === ui.rest));
  $('#depts').classList.toggle('hidden', ui.tab === 'cal');

  if (ui.tab !== 'contacts' && ui.dept !== 'all' && !deptsOf(ui.rest).includes(ui.dept)) ui.dept = 'all';
  const items = currentItems(false);
  const deptList = ui.tab === 'contacts' ? DEPTS : deptsOf(ui.rest);
  // מחלקות
  const counts = {}, hot = {};
  for (const it of items) { const k = it.dept || '—'; counts[k] = (counts[k] || 0) + 1; if (it.prio === 1 && it.status && it.status !== 'closed') hot[k] = true; }
  const colored = ui.tab === 'open' || ui.tab === 'progress';
  const num = (n, k) => colored ? `<span class="n ld ${loadCls(n)}">${n}</span>${hot[k] ? '<span class="fire">🔥</span>' : ''}` : `<span class="n">${n}</span>`;
  let chips = `<button class="chip ${ui.dept === 'all' ? 'on' : ''}" data-dept="all">הכול <span class="n">${items.length}</span></button>`;
  for (const d of deptList) chips += `<button class="chip ${ui.dept === d ? 'on' : ''}" data-dept="${esc(d)}">${esc(d)}${counts[d] ? ` ${num(counts[d], d)}` : ''}</button>`;
  $('#depts').innerHTML = chips;

  // תגים בלשוניות
  $('#b-open').textContent = db.tasks.filter(t => inRest(t) && t.status !== 'closed').length || '';
  $('#b-progress').textContent = db.tasks.filter(t => inRest(t) && t.status === 'progress').length || '';
  { const ib = $('#btnInv'); if (ib) ib.classList.toggle('dot-on', invoicesPending() > 0); }
  $('#b-routine').textContent = db.routine.filter(r => inRest(r) && routineState(r).days <= 0).length || '';

  if (ui.tab === 'cal') { $('#main').innerHTML = calendarHtml(); return; }
  if (ui.tab === 'contacts') { $('#main').innerHTML = contactsView(); return; }
  const list = currentItems(true);
  let html = '';
  if (!list.length) html += emptyMsg();
  else if (ui.dept === 'all' && ui.tab !== 'closed') {
    const groups = {};
    for (const it of list) (groups[it.dept || '—'] = groups[it.dept || '—'] || []).push(it);
    for (const d of [...deptList, '—']) {
      if (!groups[d]) continue;
      const gHot = colored && groups[d].some(t => t.prio === 1);
      html += `<div class="group-h"><span>${d === '—' ? 'ללא מחלקה' : esc(d)}${gHot ? ' 🔥' : ''}</span>${colored ? `<span class="ld ${loadCls(groups[d].length)}">${groups[d].length}</span>` : `<span>${groups[d].length}</span>`}</div>`;
      html += groups[d].map(cardHtml).join('');
    }
  } else html += list.map(cardHtml).join('');
  $('#main').innerHTML = html;
}
function currentItems(applyFilter) {
  let list;
  if (ui.tab === 'routine') {
    list = db.routine.filter(inRest).sort((a, b) => routineDue(a) - routineDue(b));
  } else if (ui.tab === 'contacts') {
    list = contactsFiltered();
  } else if (ui.tab === 'cal') {
    list = db.tasks.filter(t => t.status !== 'closed' && t.due).concat(db.routine);
  } else {
    list = db.tasks.filter(t => inRest(t) && (t.status === ui.tab || (ui.tab === 'open' && t.status === 'progress')));
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
  const tasks = db.tasks.filter(t => inRest(t) && t.status !== 'closed').map(t => ({ s: urgencyScore(t), txt: t.title, sub: `${t.dept || ''} · ${prioName(t.prio)}${t.status === 'progress' ? ' · בטיפול' : ''}` }));
  const rts = db.routine.filter(r => inRest(r) && routineState(r).days <= 0).map(r => ({ s: 22 - routineState(r).days, txt: r.title, sub: `שוטף · ${r.dept || ''} · ${routineState(r).txt}` }));
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
  const progInOpen = ui.tab === 'open' && t.status === 'progress';
  return `<div class="card ${progInOpen ? 'is-prog' : ''}" data-open="${t.id}">
    <div class="bar pr${t.prio}"></div>
    <div class="body"><div class="t">${esc(t.title)}</div>
      <div class="meta">${ui.dept === 'all' && ui.tab === 'closed' && t.dept ? `<span class="tag">${esc(t.dept)}</span>` : ''}
        ${progInOpen ? '<span class="tag st-prog">◐ בטיפול</span>' : ''}${prioTag(t)}<span class="tag">${esc(typeName(t.type))}</span>
        ${t.repeats ? `<span class="tag rep">↻ חוזרת ×${t.repeats + 1}</span>` : ''}
        ${(t.photos || []).length + (t.closePhotos || []).length ? `<span class="tag">📷 ${(t.photos || []).length + (t.closePhotos || []).length}</span>` : ''}
        ${t.contactId && contactName(t.contactId) ? `<span class="tag">👷 ${esc(contactName(t.contactId))}</span>` : ''}
        ${(() => { const ds = dueState(t); return ds ? `<span class="tag ${ds.cls}">${ds.txt}</span>` : ''; })()}
        ${t.inv && t.inv.st !== 'paid' ? invTag(t) : ''}
        <span>${when}</span></div>
      ${t.notes ? `<div class="desc">${esc(t.notes)}</div>` : ''}
      ${t.status === 'closed' && t.treatment ? `<div class="meta">טיפול: ${esc(t.treatment)}</div>` : ''}
    </div>${act}</div>`;
}

/* ---------- גיליונות (חלונות קופצים) ---------- */
function openSheet(html, tall) {
  $('#sheet').classList.toggle('tall', !!tall);
  $('#sheet').innerHTML = '<div class="grab"></div><button class="x-close" data-x="cancel" aria-label="סגירה">✕</button>' + html;
  $('#sheet').classList.remove('hidden'); $('#sheet-bg').classList.remove('hidden');
  $('#sheet').scrollTop = 0;
}
function closeSheet() {
  const back = returnTo; returnTo = null;
  if (back) setTimeout(back, 0);
  if (sheetState && (sheetState.kind === 'quick' || sheetState.kind === 'close') && !sheetState.saved && sheetState.photos) sheetState.photos.forEach(id => photoDel(id));
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

/* --- יומן --- */
const HEB_DAYS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
const fmtMonth = new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' });
const fmtDayLong = new Intl.DateTimeFormat('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
let fmtHebDate = null;
try { fmtHebDate = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', { day: 'numeric', month: 'long' }); } catch (e) { /* לא נתמך */ }
function addDays(ts, n) { const d = new Date(ts); d.setDate(d.getDate() + n); return d.getTime(); }

// כל האירועים בטווח תאריכים, לפי יום: { [startOfDay]: [ {kind, item, ts} ] }
function calEvents(from, to) {
  const map = {}, today = startOfDay(Date.now());
  const put = (ts, ev) => { const k = startOfDay(ts); if (k < from || k > to) return; (map[k] = map[k] || []).push(ev); };
  const okDept = () => true; // היומן מציג את שתי המסעדות
  for (const t of db.tasks) {
    if (t.status === 'closed' || !okDept(t)) continue;
    if (t.due) put(t.due, { kind: 'due', item: t, ts: t.due, over: startOfDay(t.due) < today });
  }
  for (const r of db.routine) {
    if (!okDept(r)) continue;
    const step = Math.max(1, r.every);
    let d = startOfDay(routineDue(r));
    if (!r.last || d < today) { put(today, { kind: 'routine', item: r, ts: today, over: true }); d = addDays(today, step); }
    if (d < from) { const k = Math.ceil((from - d) / (step * DAY)); d = addDays(d, k * step); }
    for (let i = 0; d <= to && i < 400; i++, d = addDays(d, step)) put(d, { kind: 'routine', item: r, ts: d });
  }
  for (const k in map) map[k].sort((a, b) => ({ due: 0, rem: 1, routine: 2 })[a.kind] - ({ due: 0, rem: 1, routine: 2 })[b.kind] || a.ts - b.ts);
  return map;
}
function calendarHtml() {
  const today = startOfDay(Date.now());
  if (!ui.calMonth) { const d = new Date(); ui.calMonth = new Date(d.getFullYear(), d.getMonth(), 1).getTime(); }
  if (!ui.calDay) ui.calDay = today;
  const m = new Date(ui.calMonth);
  const first = ui.calMonth, last = new Date(m.getFullYear(), m.getMonth() + 1, 0).getTime();
  const gridStart = addDays(first, -new Date(first).getDay());
  const gridEnd = addDays(last, 6 - new Date(last).getDay());
  const ev = calEvents(gridStart, gridEnd);

  let cells = '';
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) {
    const list = ev[d] || [];
    const kinds = new Set(list.map(e => e.kind === 'due' && e.over ? 'over' : e.kind === 'routine' && e.over ? 'over' : e.kind));
    const dots = ['over', 'due', 'routine'].filter(k => kinds.has(k)).map(k => `<i class="dot d-${k}"></i>`).join('');
    const cls = ['cal-d', new Date(d).getMonth() !== m.getMonth() ? 'out' : '', d === today ? 'today' : '', d === ui.calDay ? 'sel' : ''].join(' ');
    cells += `<button class="${cls}" data-day="${d}"><span>${new Date(d).getDate()}</span><span class="dots">${dots}</span></button>`;
  }

  const dayList = ev[ui.calDay] || [];
  const heb = fmtHebDate ? ' · ' + fmtHebDate.format(ui.calDay) : '';
  const rows = dayList.map(e => {
    const it = e.item;
    const label = e.kind === 'due' ? (e.over ? '<span class="tag over">⚠ יעד עבר</span>' : '<span class="tag">📅 יעד</span>')

      : `<span class="tag ${e.over ? 'over' : ''}">↻ שוטף${e.over ? ' – לביצוע' : ''}</span>`;
    const open = e.kind === 'routine' ? `data-open-r="${it.id}"` : `data-open="${it.id}"`;
    return `<div class="card" ${open}>${e.kind !== 'routine' ? `<div class="bar pr${it.prio}"></div>` : ''}<div class="body"><div class="t">${esc(it.title)}</div>
      <div class="meta">${label}<span class="tag rest-tag">${esc(restName(it.rest))}</span><span class="tag">${esc(it.dept || '')}</span>${e.kind !== 'routine' && it.status === 'progress' ? '<span>בטיפול</span>' : ''}</div></div></div>`;
  }).join('');

  return `<div class="cal">
    <div class="cal-nav"><button class="r-btn" data-cal-nav="-1" aria-label="חודש קודם">›</button>
      <b>${fmtMonth.format(first)}</b>
      <button class="r-btn" data-cal-nav="1" aria-label="חודש הבא">‹</button></div>
    ${ui.calMonth !== new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() || ui.calDay !== today ? '<button class="link-btn cal-today" data-cal-nav="0">חזרה להיום</button>' : ''}
    <div class="cal-grid">${HEB_DAYS.map(x => `<div class="cal-h">${x}</div>`).join('')}${cells}</div>
    <div class="cal-legend"><span><i class="dot d-over"></i>באיחור</span><span><i class="dot d-due"></i>יעד</span><span><i class="dot d-routine"></i>שוטף</span></div>
  </div>
  <div class="group-h"><span>${fmtDayLong.format(ui.calDay)}${heb}</span><span>${dayList.length || ''}</span></div>
  ${rows || '<div class="empty small">אין כלום ביום הזה</div>'}
  <button class="btn gcal mt8" data-x="cal-add">+ משימה ליום הזה</button>`;
}

/* --- הוספה מהירה --- */
function quickAdd(prefillDue) {
  if (ui.tab === 'routine') return routineEdit(null);
  if (ui.tab === 'contacts') return contactEdit(null);
  if (ui.tab === 'cal' && prefillDue === undefined) prefillDue = ui.calDay;
  sheetState = { kind: 'quick', manual: {}, rest: ui.tab === 'cal' ? ui.rest : ui.rest, dept: ui.dept !== 'all' && ui.tab !== 'cal' ? ui.dept : null, type: null, prio: 3, auto: {}, photos: [] };
  if (sheetState.dept) sheetState.manual.dept = true;
  openSheet(`<h2>תקלה / משימה חדשה</h2>
    <input id="q-title" class="field" placeholder="למשל: מקרר בר לא מקרר" autocomplete="off" enterkeyhint="done">
    <textarea id="q-desc" class="desc-in" rows="2" placeholder="📝 תיאור התקלה (לא חובה)"></textarea>
    <div id="q-rep"></div>
    <label>מסעדה</label><div id="q-rest"></div>
    <label>מחלקה</label><div id="q-dept"></div>
    <label>סוג</label><div id="q-type"></div>
    <label>עדיפות</label><div id="q-prio"></div>
    <button class="link-btn" data-x="q-more">📅 תאריך יעד <span class="note">(לא חובה)</span></button>
    <div id="q-more" class="hidden">
      <label>תאריך יעד</label><input id="q-due" type="date" class="field">
    </div>
    <button class="link-btn" data-x="q-cshow" id="q-cshow">👷 טכנאי / ספק <span class="note">(לא חובה)</span></button>
    <div id="q-cwrap" class="hidden"><label>👷 טכנאי / ספק <span id="q-csug" class="auto"></span></label>
      <div class="row mt0 center"><div id="q-csel" class="grow"></div><span id="q-call"></span></div></div>
    ${photoStrip([])}
    <div class="row"><button class="btn" data-x="cancel">ביטול</button><button class="btn primary" data-x="q-save">שמור</button></div>`);
  quickRefresh();
  if (prefillDue) { $('#q-more').classList.remove('hidden'); document.querySelector('[data-x="q-more"]').classList.add('hidden'); $('#q-due').value = toInputDate(prefillDue); }
  const inp = $('#q-title'); inp.focus();
}
function quickRefresh() {
  const s = sheetState, text = $('#q-title') ? $('#q-title').value : '';
  const gr = guessRest(text);
  if (!s.manual.rest && gr) s.rest = gr;
  if (s.manual.dept && !deptsOf(s.rest).includes(s.dept)) s.manual.dept = false;
  const g = guess(text, s.rest);
  s.auto = g;
  if (!s.manual.dept) s.dept = g.dept || DEFAULT_DEPT;
  if (!s.manual.type) s.type = g.type || (text.trim() ? 'task' : null);
  if (!s.manual.prio) s.prio = g.prio;
  const sim = text.trim().length > 2 && s.type !== 'task' ? findSimilar(text, s.dept, null, s.rest) : [];
  if (sim.length && !s.manual.prio && s.prio > 2) s.prio = 2;
  s.sim = sim;
  $('#q-rest').innerHTML = pickChips('rest', RESTS.map(r => ({ v: r.id, name: r.name })), s.rest, !s.manual.rest && gr ? gr : null);
  $('#q-dept').innerHTML = pickChips('dept', deptsOf(s.rest), s.dept, s.manual.dept ? null : g.dept);
  $('#q-type').innerHTML = pickChips('type', TYPES, s.type, s.manual.type ? null : g.type);
  $('#q-prio').innerHTML = pickChips('prio', PRIOS, s.prio, !s.manual.prio && (g.prio === 1 || sim.length) ? s.prio : null);
  $('#q-rep').innerHTML = repeatBox(sim);
  fillPhotos($('#q-rep'));
  if (!s.manual.contact) {
    const sug = suggestContact(text, s.type, s.dept, sim);
    s.contactId = sug ? sug.c.id : null;
    renderQuickContact(sug ? sug.why : '');
    if (sug) showQuickContact();
  }
}
const ROLE_HINTS = {
  plumb: ['אינסטל', 'שרברב'], elec: ['חשמל'], it: ['מחשב', 'קופ', 'תקשורת', 'it'],
  build: ['שיפוצ', 'אחזק', 'הנדימן', 'נגר', 'מסגר'],
};
function rolesFor(text, type) {
  if (type === 'equip') {
    const n = norm(text);
    if (/מקרר|מקפיא|קירור|קרח|בלאסט|מדחס/.test(n)) return ['קירור'];
    if (/מזג/.test(n)) return ['מזגנ'];
    if (/מדיח/.test(n)) return ['מדיח'];
    if (/קפה|אספרסו/.test(n)) return ['קפה'];
    return ['ציוד מטבח', 'ציוד'];
  }
  return ROLE_HINTS[type] || [];
}
function suggestContact(text, type, dept, sim) {
  if (!db.contacts.length || !text.trim() || type === 'task') return null;
  const prev = (sim || []).find(t => t.contactId && db.contacts.some(c => c.id === t.contactId));
  if (prev) return { c: db.contacts.find(c => c.id === prev.contactId), why: 'טיפל בפעם הקודמת' };
  const hints = rolesFor(text, type).map(norm);
  if (!hints.length) return null;
  const jobs = id => db.tasks.filter(t => t.contactId === id).length;
  const cands = db.contacts.filter(c => { const r = norm(c.role || ''); return r && hints.some(h => r.includes(h)); })
    .sort((a, b) => ((b.dept === dept) - (a.dept === dept)) || jobs(b.id) - jobs(a.id));
  return cands.length ? { c: cands[0], why: 'לפי סוג התקלה' } : null;
}
function renderQuickContact(why) {
  const s = sheetState; if (!$('#q-csel')) return;
  $('#q-csel').innerHTML = contactSelect('q-contact', s.contactId);
  $('#q-csug').textContent = why ? 'הצעה: ' + why : '';
  $('#q-call').innerHTML = callBtn(db.contacts.find(c => c.id === s.contactId), true);
}
function showQuickContact() { $('#q-cwrap').classList.remove('hidden'); $('#q-cshow').classList.add('hidden'); }
function repeatBox(sim) {
  if (!sim.length) return '';
  const last = lastTreated(sim);
  const n90 = sim.filter(t => t.createdAt > Date.now() - 90 * DAY).length;
  return `<div class="repeat"><b>↻ נראה כמו תקלה חוזרת</b>
    הופיעה ${sim.length} ${sim.length === 1 ? 'פעם' : 'פעמים'} בעבר${n90 ? ` (${n90} ב־90 הימים האחרונים)` : ''}. פעם אחרונה: ${ago(sim[0].createdAt)} – "${esc(sim[0].title)}"
    ${last ? `<div class="prev"><b>הטיפול בפעם הקודמת (${fmtD.format(last.closedAt)}):</b>${esc(last.treatment)}${last.contactId ? contactLine(last.contactId, '👷 טיפל:') : ''}${last.closePhotos && last.closePhotos.length ? thumbs(last.closePhotos, true) : ''}</div>`
           : '<div class="prev">עדיין לא נרשם טיפול לתקלה הזו.</div>'}
  </div>`;
}
function quickSave() {
  const s = sheetState, title = $('#q-title').value.trim();
  if (!title) { $('#q-title').focus(); return; }
  const t = {
    id: uid(), title, notes: ($('#q-desc') ? $('#q-desc').value.trim() : ''), dept: s.dept || DEFAULT_DEPT, type: s.type || 'task', prio: s.prio,
    status: 'open', createdAt: Date.now(), log: [],
    due: parseDate($('#q-due').value), photos: s.photos.slice(),
    contactId: ($('#q-contact') && $('#q-contact').value) || null,
  };
  s.saved = true;

  t.rest = s.rest;
  const sim = t.type !== 'task' ? findSimilar(title, t.dept, null, t.rest) : [];
  if (sim.length) { t.related = sim.map(x => x.id); t.repeats = sim.length; }
  db.tasks.push(t);
  if (t.dept) learnFrom(title, t.dept, t.type);
  if (t.rest !== ui.rest && ui.tab !== 'cal') setRest(t.rest);
  save(); closeSheet();
  if (ui.tab !== 'open' && ui.tab !== 'cal') ui.tab = 'open';
  render(); toast(sim.length ? 'נשמר · סומן כתקלה חוזרת' : 'נשמר');
}

/* --- פרטי משימה --- */
function taskDetail(id) {
  const t = db.tasks.find(x => x.id === id); if (!t) return;
  sheetState = { kind: 'detail', id, rest: t.rest || 'ramah', dept: t.dept, type: t.type, prio: t.prio };
  const rel = findSimilar(t.title, t.dept, t.id, t.rest);
  let actions = '';
  if (t.status === 'open') actions = `<button class="btn primary" data-x="start">בטיפול</button><button class="btn ok" data-x="close">סגור</button>`;
  else if (t.status === 'progress') actions = `<button class="btn ok" data-x="close">סגור</button>`;
  else actions = `<button class="btn" data-x="reopen">פתח מחדש</button>`;

  openSheet(`<h2>פרטי ${t.type === 'task' ? 'משימה' : 'תקלה'}</h2>
    <input id="d-title" class="field" value="${esc(t.title)}">
    ${t.status !== 'closed' ? repeatBox(rel) : ''}
    <div class="row">${actions}</div>
    <label>מסעדה</label>${pickChips('rest', RESTS.map(r => ({ v: r.id, name: r.name })), sheetState.rest)}
    <label>מחלקה</label><div id="pick-dept">${pickChips('dept', deptsOf(sheetState.rest), t.dept)}</div>
    <label>סוג</label>${pickChips('type', TYPES, t.type)}
    <label>עדיפות</label>${pickChips('prio', PRIOS, t.prio)}
    <label>📅 תאריך יעד (לא חובה)</label>
    <div class="row mt0"><input id="d-due" type="date" class="field" value="${toInputDate(t.due)}"><button class="btn small" data-x="d-clear-due">ניקוי</button></div>
    <label>👷 טכנאי / ספק</label>
    <div class="row mt0 center">${contactSelect('d-contact', t.contactId)}${(() => { const c = db.contacts.find(x => x.id === t.contactId); return callBtn(c, true); })()}</div>
    <label>🧾 חשבונית</label>${t.inv ? `<div class="inv-box" data-invedit="${t.id}">${invTag(t)}${t.inv.amount ? ` <b>${fmtMoney(t.inv.amount)}</b>` : ''}<span class="note">עריכה ›</span></div>` : `<button class="link-btn mt0" data-invadd="${t.id}">+ מעקב חשבונית</button>`}
    <label>📷 תמונות</label>${photoStrip(t.photos)}
    ${t.closePhotos && t.closePhotos.length ? `<label>📷 תמונות מהטיפול</label>${thumbs(t.closePhotos)}` : ''}
    <label>📝 תיאור / הערות</label><textarea id="d-notes" placeholder="תיאור התקלה, מספר דגם, מספר קריאה...">${esc(t.notes || '')}</textarea>
    ${t.status === 'closed' ? `<label>איך טופל</label><textarea id="d-treat">${esc(t.treatment || '')}</textarea>` : ''}
    <label>עדכון מהלך הטיפול</label>
    <div class="row mt0"><input id="d-log" class="field" placeholder="למשל: הוזמן טכנאי לשעה 10"><button class="btn small primary" data-x="log">הוסף</button></div>
    <div class="hist">${(t.log || []).slice().reverse().map(l => `<div class="h"><small>${fmtDT.format(l.t)}</small>${esc(l.text)}</div>`).join('')}
      <div class="h"><small>${fmtDT.format(t.createdAt)}</small>נפתח</div></div>
    ${rel.length ? `<label>היסטוריה של תקלות דומות</label><div class="hist">${rel.map(r => `<div class="h"><small>${fmtD.format(r.createdAt)} · ${r.status === 'closed' ? 'נסגר' : r.status === 'progress' ? 'בטיפול' : 'פתוח'}</small>${esc(r.title)}${r.treatment ? `<br><b>טיפול:</b> ${esc(r.treatment)}` : ''}</div>`).join('')}</div>` : ''}
    <div class="row"><button class="btn danger" data-x="del">מחק</button><button class="btn primary" data-x="d-save">שמור שינויים</button></div>`);
  fillPhotos($('#sheet'));
}
function detailCollect(t) {
  const title = $('#d-title').value.trim(); if (title) t.title = title;
  t.notes = $('#d-notes').value.trim();
  t.due = parseDate($('#d-due').value);
  if ($('#d-contact')) t.contactId = $('#d-contact').value || null;
  const changedClass = t.dept !== sheetState.dept || t.type !== sheetState.type;
  t.rest = sheetState.rest; t.dept = sheetState.dept; t.type = sheetState.type; t.prio = sheetState.prio;
  if ($('#d-treat')) t.treatment = $('#d-treat').value.trim();
  if (changedClass && t.dept) learnFrom(t.title, t.dept, t.type);
}
function setStatus(t, st) {
  t.status = st;
  if (st === 'progress') { t.startedAt = Date.now(); addLog(t, 'הועבר לטיפול'); }
  if (st === 'open') addLog(t, 'הוחזר לפתוחות');
  if (st !== 'closed') t.closedAt = null;
}
function addLog(t, text) { (t.log = t.log || []).push({ t: Date.now(), text }); }

/* --- סגירת משימה עם תיעוד הטיפול --- */
function setInvNeed(v, manual) {
  if (!sheetState || sheetState.kind !== 'close') return;
  sheetState.invneed = v; if (manual) sheetState.invManual = true;
  document.querySelectorAll('#c-inv [data-invneed]').forEach(b => b.classList.toggle('on', b.dataset.invneed === v));
}
function closeFlow(id) {
  const t = db.tasks.find(x => x.id === id); if (!t) return;
  const prev = lastTreated(findSimilar(t.title, t.dept, t.id, t.rest));
  sheetState = { kind: 'close', id, photos: [] };
  openSheet(`<h2>סגירה: ${esc(t.title)}</h2>
    <label>מה עשית / איך טופל? (יוצג בפעם הבאה שהתקלה תחזור)</label>
    <textarea id="c-treat" placeholder="למשל: הוחלף מאוורר במדחס, טכנאי משה 050-...">${esc(t.treatment || '')}</textarea>
    <label>👷 מי טיפל? (לא חובה)</label>${contactSelect('c-contact', t.contactId || (prev && prev.contactId) || null)}
    ${t.inv ? '' : '<div class="note mt8">🧾 אם נבחר איש מקצוע, החשבונית תיכנס לבד למעקב החשבוניות.</div>'}
    ${prev ? `<button class="btn small mt8" data-x="c-prev">כמו בפעם הקודמת: ${esc(prev.treatment.slice(0, 40))}${prev.treatment.length > 40 ? '…' : ''}</button>` : ''}
    <label>📷 תמונה של הטיפול (לא חובה)</label>${photoStrip([])}
    <div class="row"><button class="btn" data-x="cancel">ביטול</button><button class="btn ok" data-x="c-save">סגור משימה</button></div>`);
  sheetState.prev = prev ? prev.treatment : '';
  $('#c-treat').focus();
}

/* --- טיפול שוטף --- */
function routineEdit(id) {
  const r = id ? db.routine.find(x => x.id === id) : null;
  sheetState = { kind: 'routine', id, rest: r ? (r.rest || 'ramah') : ui.rest, dept: r ? r.dept : (ui.dept !== 'all' ? ui.dept : DEFAULT_DEPT), every: r ? r.every : 7 };
  const presets = [{ v: 1, name: 'כל יום' }, { v: 7, name: 'שבועי' }, { v: 14, name: 'דו־שבועי' }, { v: 30, name: 'חודשי' }, { v: 90, name: 'רבעוני' }, { v: 180, name: 'חצי שנתי' }];
  openSheet(`<h2>${r ? 'טיפול שוטף' : 'טיפול שוטף חדש'}</h2>
    <input id="r-title" class="field" placeholder="למשל: ניקוי מסנני מנדף" value="${r ? esc(r.title) : ''}" autocomplete="off">
    <label>מסעדה</label>${pickChips('rest', RESTS.map(r => ({ v: r.id, name: r.name })), sheetState.rest)}
    <label>מחלקה</label><div id="pick-dept">${pickChips('dept', deptsOf(sheetState.rest), sheetState.dept)}</div>
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
function fetchDataUrl(u) { // המרת data: URL לקובץ בלי רשת
  const [h, b64] = u.split(','); const mime = (h.match(/data:([^;]+)/) || [])[1] || 'image/jpeg';
  const bin = atob(b64); const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return Promise.resolve(new Blob([arr], { type: mime }));
}
function settings() {
  sheetState = { kind: 'settings' };
  const n = db.tasks.length, c = db.tasks.filter(t => t.status === 'closed').length;
  openSheet(`<h2>הגדרות וגיבוי</h2>
    <div class="kv">סה״כ ${n} משימות (${c} סגורות) · ${db.routine.length} טיפולים שוטפים · ${db.contacts.length} אנשי קשר</div>
    <div class="set-sec"><label>גיבוי</label>
      <p class="note">הנתונים שמורים רק בטלפון הזה. כדאי לייצא גיבוי פעם בשבוע ולשמור אותו ב"קבצים" (אפשר לבחור "On My iPhone"). הגיבוי כולל גם את התמונות.</p>
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
  toast('מכין גיבוי...');
  const photos = {};
  const ids = new Set(db.tasks.flatMap(t => (t.photos || []).concat(t.closePhotos || [], (t.inv && t.inv.photos) || [])));
  for (const id of ids) {
    const b = await photoGet(id).catch(() => null); if (!b) continue;
    photos[id] = await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(b); });
  }
  const json = JSON.stringify({ app: 'tk', exportedAt: new Date().toISOString(), ...db, photos });
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
      const photos = d.photos || {};
      db = fixShape({ tasks: d.tasks, routine: d.routine, contacts: d.contacts, fridges: d.fridges, temps: d.temps, learn: d.learn, v: 1 });
      save(); closeSheet(); render();
      Promise.all(Object.entries(photos).map(([id, url]) => fetchDataUrl(url).then(b => photoPut(id, b)).catch(() => {})))
        .then(() => toast('השחזור הושלם'));
    } catch (e) { toast('הקובץ לא תקין'); }
  };
  fr.readAsText(file);
}

/* =========================================================
   תוספות: אנשי קשר, תמונות, טמפרטורות, סיכום חודשי
   ========================================================= */

/* ---------- תמונות (נשמרות במכשיר ב־IndexedDB) ---------- */
let photoDb = null;
function idb() {
  if (photoDb) return Promise.resolve(photoDb);
  return new Promise((res, rej) => {
    const r = indexedDB.open('tk-photos', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('p');
    r.onsuccess = () => { photoDb = r.result; res(photoDb); };
    r.onerror = () => rej(r.error);
  });
}
function idbReq(mode, fn) {
  return idb().then(d => new Promise((res, rej) => {
    const tx = d.transaction('p', mode); const st = tx.objectStore('p');
    const r = fn(st); let out;
    if (r) r.onsuccess = () => { out = r.result; };
    tx.oncomplete = () => res(out); tx.onerror = () => rej(tx.error);
  }));
}
const photoPut = (id, blob) => idbReq('readwrite', st => st.put(blob, id));
const photoGet = id => idbReq('readonly', st => st.get(id));
const photoDel = id => { if (purl[id]) { URL.revokeObjectURL(purl[id]); delete purl[id]; } return idbReq('readwrite', st => st.delete(id)).catch(() => {}); };
const purl = {};
async function photoURL(id) {
  if (purl[id]) return purl[id];
  const b = await photoGet(id).catch(() => null);
  if (!b) return null;
  return (purl[id] = URL.createObjectURL(b));
}
async function compressImage(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    const max = 1280, w = img.naturalWidth, h = img.naturalHeight;
    const sc = Math.min(1, max / Math.max(w, h));
    const c = document.createElement('canvas');
    c.width = Math.round(w * sc); c.height = Math.round(h * sc);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return await new Promise(res => c.toBlob(res, 'image/jpeg', 0.72));
  } finally { URL.revokeObjectURL(url); }
}
function thumbs(ids, small) {
  return `<div class="photos ${small ? 'small' : ''}">${ids.map(id => `<div class="ph"><img data-ph="${id}" alt="תמונה"></div>`).join('')}</div>`;
}
function photoStrip(ids) {
  return `<div class="photos" id="ph-strip">${(ids || []).map(id => `<div class="ph"><img data-ph="${id}" alt="תמונה"><button class="ph-del" data-phdel="${id}" aria-label="מחיקת תמונה">✕</button></div>`).join('')}
    <button class="ph-add" data-x="ph-add">📷<span>הוספת תמונה</span></button></div>
    <input id="ph-input" type="file" accept="image/*" class="hidden">`;
}
async function fillPhotos(root) {
  for (const img of (root || document).querySelectorAll('img[data-ph]')) {
    const u = await photoURL(img.dataset.ph);
    if (u) img.src = u; else img.closest('.ph').classList.add('missing');
  }
}
function currentPhotoList() {
  if (!sheetState) return null;
  if (sheetState.kind === 'quick' || sheetState.kind === 'close') return sheetState.photos;
  if (sheetState.kind === 'detail') { const t = db.tasks.find(x => x.id === sheetState.id); return t ? (t.photos = t.photos || []) : null; }
  if (sheetState.kind === 'inv') { const t = db.tasks.find(x => x.id === sheetState.id); return t && t.inv ? (t.inv.photos = t.inv.photos || []) : null; }
  return null;
}
function refreshStrip() {
  const list = currentPhotoList(); const el = $('#ph-strip'); if (!list || !el) return;
  const wrap = document.createElement('div'); wrap.innerHTML = photoStrip(list);
  el.replaceWith(wrap.firstElementChild); fillPhotos($('#ph-strip'));
}
async function addPhotoFile(file) {
  const list = currentPhotoList(); if (!list) return;
  try {
    toast('מעבד תמונה...');
    const blob = await compressImage(file);
    const id = uid(); await photoPut(id, blob);
    list.push(id);
    if (sheetState.kind === 'detail' || sheetState.kind === 'inv') save();
    refreshStrip(); toast('התמונה נוספה');
  } catch (e) { toast('לא הצלחתי לטעון את התמונה'); }
}
function showPhoto(id) {
  const v = document.createElement('div'); v.className = 'viewer';
  v.innerHTML = '<img alt="תמונה"><span class="viewer-x">✕</span>';
  photoURL(id).then(u => { if (u) v.querySelector('img').src = u; });
  v.addEventListener('click', () => v.remove());
  document.body.appendChild(v);
}

/* ---------- אנשי קשר: טכנאים וספקים ---------- */
const ROLES = ['טכנאי קירור', 'טכנאי מזגנים', 'טכנאי מדיחים', 'טכנאי ציוד מטבח', 'אינסטלטור', 'חשמלאי', 'מחשבים וקופות', 'ספק', 'אחר'];
function telHref(p) { return 'tel:' + String(p || '').replace(/[^\d+]/g, ''); }
function contactName(id) { const c = db.contacts.find(x => x.id === id); return c ? c.name : ''; }
function callBtn(c, small) {
  return c && c.phone ? `<a class="call ${small ? 'small' : ''}" href="${esc(telHref(c.phone))}" aria-label="חיוג ל${esc(c.name)}">📞${small ? '' : ' חיוג'}</a>` : '';
}
function contactLine(id, prefix) {
  const c = db.contacts.find(x => x.id === id); if (!c) return '';
  return `<div class="c-line">${prefix || '👷'} ${esc(c.name)}${c.role ? ` · ${esc(c.role)}` : ''} ${callBtn(c, true)}</div>`;
}
function contactSelect(id, selected) {
  if (!db.contacts.length) return `<div class="note">אין עדיין אנשי קשר. מוסיפים דרך הכפתור 📇 למעלה.</div>`;
  const opts = db.contacts.slice().sort((a, b) => a.name.localeCompare(b.name, 'he'))
    .map(c => `<option value="${c.id}" ${c.id === selected ? 'selected' : ''}>${esc(c.name)}${c.role ? ' – ' + esc(c.role) : ''}</option>`).join('');
  return `<select id="${id}" class="field"><option value="">— ללא —</option>${opts}</select>`;
}
/* ---------- חשבוניות ---------- */
const INV_ST = [
  { v: 'wait', n: 'ממתינה', long: 'ממתינה לחשבונית', tag: 'ממתינה לחשבונית', icon: '⏳' },
  { v: 'got', n: 'התקבלה', long: 'התקבלה – להעביר להנה״ח', tag: 'להעביר להנה״ח', icon: '📥' },
  { v: 'sent', n: 'הועברה', long: 'הועברה להנהלת חשבונות', tag: 'הועברה – ממתינה לתשלום', icon: '📤' },
  { v: 'paid', n: 'שולמה', long: 'שולמה – סגורה', tag: 'שולמה', icon: '✓' },
];
const INV_NEXT = { wait: 'got', got: 'sent', sent: 'paid' };
function invTag(t) {
  if (!t.inv) return '';
  const st = INV_ST.find(x => x.v === t.inv.st) || INV_ST[0];
  return `<span class="tag inv-${st.v}">🧾 ${st.tag}</span>`;
}
function fmtMoney(n) { return n || n === 0 ? '₪' + Number(n).toLocaleString('he-IL', { maximumFractionDigits: 2 }) : ''; }
function invAdvance(t, st) {
  const now = Date.now(), order = INV_ST.map(x => x.v), lvl = order.indexOf(st), i = t.inv;
  i.st = st;
  // חותמות זמן לכל שלב שהושלם; שלבים שאחרי הסטטוס החדש מתאפסים
  if (lvl >= 1) i.gotAt = i.gotAt || now; else i.gotAt = null;
  if (lvl >= 2) i.sentAt = i.sentAt || now; else i.sentAt = null;
  if (lvl >= 3) i.paidAt = i.paidAt || now; else i.paidAt = null;
  addLog(t, '🧾 ' + INV_ST[lvl].long);
}
function invoicesSheet() {
  sheetState = { kind: 'invoices' };
  const all = db.tasks.filter(t => t.inv);
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
  const by = st => all.filter(t => t.inv.st === st);
  const wait = by('wait').sort((a, b) => (a.inv.since || 0) - (b.inv.since || 0));
  const got = by('got').sort((a, b) => (a.inv.gotAt || 0) - (b.inv.gotAt || 0));
  const sent = by('sent').sort((a, b) => (a.inv.sentAt || 0) - (b.inv.sentAt || 0));
  const paid = by('paid').filter(t => t.inv.paidAt > Date.now() - 45 * DAY).sort((a, b) => b.inv.paidAt - a.inv.paidAt);
  const paidMonth = by('paid').filter(t => t.inv.paidAt >= monthStart);
  const sum = paidMonth.reduce((a, t) => a + (Number(t.inv.amount) || 0), 0);
  const NEXT_LBL = { wait: 'התקבלה ✓', got: 'הועברה ✓', sent: 'שולמה ✓' };
  const row = t => {
    const c = db.contacts.find(x => x.id === t.contactId);
    const since = { wait: t.inv.since, got: t.inv.gotAt, sent: t.inv.sentAt }[t.inv.st] || t.inv.since || Date.now();
    const days = Math.floor((Date.now() - since) / DAY);
    const next = INV_NEXT[t.inv.st] ? `<button class="act ${t.inv.st === 'sent' ? 'ok' : ''}" data-invnext="${t.id}">${NEXT_LBL[t.inv.st]}</button>` : '';
    return `<div class="card" data-invopen="${t.id}"><div class="body"><div class="t">${esc(t.title)}</div>
      <div class="meta"><span class="tag rest-tag">${esc(restName(t.rest))}</span>${c ? `<span class="tag">👷 ${esc(c.name)}</span>` : ''}
      ${t.inv.amount ? `<span class="tag">${fmtMoney(t.inv.amount)}</span>` : ''}${t.inv.num ? `<span class="tag">#${esc(t.inv.num)}</span>` : ''}
      ${t.inv.st === 'paid' ? `<span>שולמה ${ago(t.inv.paidAt)}</span>` : `<span class="${days >= 7 ? 'r-over' : ''}">${days <= 0 ? 'מהיום' : `${days} ימים בשלב הזה`}</span>`}</div>
      ${t.inv.st === 'wait' && c && c.phone ? `<div class="c-line">${callBtn(c, true)} <span class="note">לבקש חשבונית</span></div>` : ''}</div>${next}</div>`;
  };
  const sec = (title, list, empty) => `<div class="group-h ov-h"><span>${title}</span><span>${list.length}</span></div>${list.map(row).join('') || `<div class="note">${empty}</div>`}`;
  openSheet(`<h2>🧾 חשבוניות</h2>
    <div class="tiles">
      <div class="tile"><b class="${wait.length ? 'r-over' : ''}">${wait.length}</b><span>ממתינות לחשבונית</span></div>
      <div class="tile"><b>${got.length}</b><span>להעביר להנה״ח</span></div>
      <div class="tile"><b>${sent.length}</b><span>ממתינות לתשלום</span></div>
      <div class="tile"><b>${paidMonth.length}</b><span>שולמו החודש</span>${sum ? `<small>${fmtMoney(sum)}</small>` : ''}</div>
    </div>
    ${sec('⏳ ממתינות לחשבונית', wait, 'אין חשבוניות שמחכים להן 👍')}
    ${sec('📥 התקבלו – להעביר להנהלת חשבונות', got, 'אין מה להעביר')}
    ${sec('📤 הועברו – ממתינות לתשלום', sent, 'אין חשבוניות שממתינות לתשלום')}
    ${paid.length ? sec('✓ שולמו לאחרונה', paid, '') : ''}
    <p class="note">חשבונית נכנסת למעקב לבד כשסוגרים תקלה שהגיע אליה איש מקצוע ("👷 מי טיפל"). אפשר גם להוסיף ידנית מתוך כל תקלה.</p>
    <div class="row"><button class="btn" data-x="cancel">סגור</button></div>`, true);
}
function invEdit(id) {
  const t = db.tasks.find(x => x.id === id); if (!t || !t.inv) return;
  t.inv.photos = t.inv.photos || [];
  sheetState = { kind: 'inv', id, st: t.inv.st };
  const c = db.contacts.find(x => x.id === t.contactId);
  openSheet(`<h2>🧾 חשבונית</h2>
    <div class="kv"><b>${esc(t.title)}</b><br>${esc(restName(t.rest))} · ${esc(t.dept || '')}${c ? ` · 👷 ${esc(c.name)}` : ''} ${callBtn(c, true)}</div>
    <label>סטטוס</label>
    <div class="seg">${INV_ST.map(x => `<button class="seg-b inv-seg-${x.v} ${x.v === t.inv.st ? 'on' : ''}" data-invst="${x.v}">${x.icon} ${x.n}</button>`).join('')}</div>
    <label>סכום (לא חובה)</label><input id="iv-amount" class="field" type="number" inputmode="decimal" step="0.01" placeholder="₪" value="${t.inv.amount ?? ''}">
    <label>מספר חשבונית (לא חובה)</label><input id="iv-num" class="field" value="${esc(t.inv.num || '')}" autocomplete="off">
    <label>📷 צילום החשבונית</label>${photoStrip(t.inv.photos)}
    <label>הערה</label><input id="iv-note" class="field" value="${esc(t.inv.note || '')}" placeholder="למשל: נשלחה במייל לרואה החשבון" autocomplete="off">
    <div class="hist">${t.inv.paidAt ? `<div class="h"><small>${fmtDT.format(t.inv.paidAt)}</small>שולמה</div>` : ''}${t.inv.sentAt ? `<div class="h"><small>${fmtDT.format(t.inv.sentAt)}</small>הועברה להנה״ח</div>` : ''}${t.inv.gotAt ? `<div class="h"><small>${fmtDT.format(t.inv.gotAt)}</small>התקבלה</div>` : ''}<div class="h"><small>${fmtDT.format(t.inv.since || t.createdAt)}</small>נפתח מעקב</div></div>
    <div class="row"><button class="btn danger" data-x="iv-del">הסר מעקב</button><button class="btn primary" data-x="iv-save">שמור</button></div>`);
  fillPhotos($('#sheet'));
}
function invoicesPending() { return db.tasks.filter(t => t.inv && (t.inv.st === 'wait' || t.inv.st === 'got')).length; }

/* ---------- כל המשימות הפתוחות של שתי המסעדות ---------- */
let returnTo = null; // לאן לחזור אחרי שסוגרים משימה שנפתחה מהסקירה
function overviewSheet() {
  sheetState = { kind: 'overview' };
  const live = db.tasks.filter(t => t.status !== 'closed');
  const tiles = RESTS.map(r => {
    const mine = live.filter(t => (t.rest || 'ramah') === r.id);
    const urgent = mine.filter(t => t.prio === 1).length;
    return `<div class="tile"><b>${mine.length}</b><span>${esc(r.name)}</span><small>${mine.filter(t => t.status === 'progress').length} בטיפול${urgent ? ` · <span class="r-over">${urgent === 1 ? 'דחופה אחת' : urgent + ' דחופות'}</span>` : ''}</small></div>`;
  }).join('');
  const sections = RESTS.map(r => {
    const mine = live.filter(t => (t.rest || 'ramah') === r.id).sort(taskSort);
    if (!mine.length) return `<div class="group-h"><span>${esc(r.name)}</span><span>0</span></div><div class="note">אין משימות פתוחות 🎉</div>`;
    return `<div class="group-h ov-h"><span>${esc(r.name)}</span><span>${mine.length}</span></div>` + mine.map(t => {
      const ds = dueState(t);
      return `<div class="card" data-ovopen="${t.id}"><div class="bar pr${t.prio}"></div><div class="body"><div class="t">${esc(t.title)}</div>
        <div class="meta">${prioTag(t)}<span class="tag">${esc(t.dept || '')}</span>${t.status === 'progress' ? '<span class="tag st-prog">בטיפול</span>' : '<span class="tag st-open">פתוחה</span>'}
        ${t.repeats ? `<span class="tag rep">↻ ×${t.repeats + 1}</span>` : ''}${ds ? `<span class="tag ${ds.cls}">${ds.txt}</span>` : ''}<span>${ago(t.createdAt)}</span></div></div></div>`;
    }).join('');
  }).join('');
  openSheet(`<h2>📋 כל המשימות הפתוחות</h2><div class="tiles">${tiles}</div>${sections}
    <div class="row"><button class="btn" data-x="cancel">סגור</button></div>`, true);
}
function contactsFiltered() {
  const nq = norm(ui.q || '');
  return db.contacts.filter(c => !nq || norm(`${c.name} ${c.role} ${c.dept} ${c.notes} ${c.phone}`).includes(nq));
}
function contactsView() {
  let list = contactsFiltered();
  if (ui.dept !== 'all') list = list.filter(c => c.dept === ui.dept);
  if (!list.length) return `<div class="empty">${db.contacts.length ? 'לא נמצאו אנשי קשר' : 'עוד אין טכנאים וספקים<br>לחצו על + כדי להוסיף, ותוכלו לחייג אליהם בלחיצה'}</div>`;
  const groups = {};
  for (const c of list) (groups[c.role || 'ללא תפקיד'] = groups[c.role || 'ללא תפקיד'] || []).push(c);
  return Object.keys(groups).sort((a, b) => a === 'ללא תפקיד' ? 1 : b === 'ללא תפקיד' ? -1 : a.localeCompare(b, 'he')).map(role => {
    const rows = groups[role].sort((a, b) => a.name.localeCompare(b.name, 'he')).map(c => {
      const jobs = db.tasks.filter(t => t.contactId === c.id).length;
      return `<div class="card c-card" data-cedit="${c.id}"><div class="body"><div class="t">${esc(c.name)}</div>
        <div class="meta">${c.phone ? `<span dir="ltr">${esc(c.phone)}</span>` : ''}${c.dept ? `<span class="tag">${esc(c.dept)}</span>` : ''}${jobs ? `<span>${jobs} טיפולים</span>` : ''}</div></div>${callBtn(c)}</div>`;
    }).join('');
    return `<div class="group-h"><span>${esc(role)}</span><span>${groups[role].length}</span></div>${rows}`;
  }).join('');
}
function contactsSheet() {
  sheetState = { kind: 'contacts' };
  openSheet(`<h2>📇 טכנאים וספקים</h2>
    <button class="btn primary full" data-x="c-new">+ איש קשר חדש</button>
    ${db.contacts.length ? '<input id="c-search" class="field mt8" type="search" placeholder="🔍 חיפוש לפי שם, תפקיד או טלפון" autocomplete="off">' : ''}
    <div id="c-list">${contactListHtml('')}</div>
    <div class="row"><button class="btn" data-x="cancel">סגור</button></div>`, true);
}
function contactListHtml(q) {
  const nq = norm(q || '');
  const list = db.contacts.filter(c => !nq || norm(`${c.name} ${c.role} ${c.dept} ${c.notes} ${c.phone}`).includes(nq));
  if (!list.length) return `<div class="empty small">${db.contacts.length ? 'לא נמצאו אנשי קשר' : 'עוד אין טכנאים וספקים.<br>הוסיפו אותם כדי לחייג בלחיצה ולקבל הצעות בתקלות.'}</div>`;
  const groups = {};
  for (const c of list) (groups[c.role || 'ללא תפקיד'] = groups[c.role || 'ללא תפקיד'] || []).push(c);
  return Object.keys(groups).sort((a, b) => a === 'ללא תפקיד' ? 1 : b === 'ללא תפקיד' ? -1 : a.localeCompare(b, 'he')).map(role =>
    `<div class="group-h"><span>${esc(role)}</span><span>${groups[role].length}</span></div>` +
    groups[role].sort((a, b) => a.name.localeCompare(b.name, 'he')).map(c => {
      const jobs = db.tasks.filter(t => t.contactId === c.id).length;
      return `<div class="card c-card" data-cedit="${c.id}"><div class="body"><div class="t">${esc(c.name)}</div>
        <div class="meta">${c.phone ? `<span dir="ltr">${esc(c.phone)}</span>` : ''}${c.dept ? `<span class="tag">${esc(c.dept)}</span>` : ''}${jobs ? `<span>${jobs} טיפולים</span>` : ''}</div></div>${callBtn(c)}</div>`;
    }).join('')).join('');
}
/* ייבוא אנשי קשר – הכול מקומי, בלי רשת */
function parseVcf(text) {
  const out = [];
  const lines = text.replace(/\r\n?/g, '\n').replace(/\n[ \t]/g, '').split('\n');
  let cur = null;
  const unesc = v => v.replace(/\\n/gi, ' ').replace(/\\([,;\\])/g, '$1').trim();
  for (const line of lines) {
    const i = line.indexOf(':'); if (i < 0) continue;
    const key = line.slice(0, i).toUpperCase(), val = line.slice(i + 1);
    const prop = key.split(';')[0].replace(/^ITEM\d+\./, '');
    if (prop === 'BEGIN') cur = { tels: [] };
    else if (prop === 'END' && cur) { out.push(cur); cur = null; }
    else if (!cur) continue;
    else if (prop === 'FN') cur.fn = unesc(val);
    else if (prop === 'N' && !cur.n) { const p = val.split(';').map(unesc); cur.n = [p[1], p[0]].filter(Boolean).join(' '); }
    else if (prop === 'TEL') cur.tels.push({ v: unesc(val), mobile: /CELL|IPHONE|MOBILE/.test(key) });
    else if (prop === 'ORG') cur.org = unesc(val.split(';')[0]);
    else if (prop === 'TITLE') cur.title = unesc(val);
    else if (prop === 'NOTE') cur.note = unesc(val);
  }
  return out.map(c => {
    const tel = (c.tels.find(t => t.mobile) || c.tels[0] || {}).v || '';
    return { name: c.fn || c.n || c.org || '', phone: tel, role: c.title || '', notes: [c.org && c.org !== c.fn ? c.org : '', c.note || ''].filter(Boolean).join(' · ') };
  }).filter(c => c.name || c.phone);
}
function importContacts(list) {
  const digits = p => String(p || '').replace(/\D/g, '').replace(/^972/, '0');
  const have = new Set(db.contacts.map(c => digits(c.phone)).filter(Boolean));
  let added = 0, lastId = null;
  for (const c of list) {
    if (c.phone && have.has(digits(c.phone))) continue;
    const id = uid(); lastId = id;
    db.contacts.push({ id, createdAt: Date.now(), name: c.name || c.phone, phone: c.phone || '', role: c.role || '', dept: null, notes: c.notes || '' });
    if (c.phone) have.add(digits(c.phone)); added++;
  }
  save();
  if (added === 1) { toast('נוסף – אפשר לבחור תפקיד ומחלקה'); return contactEdit(lastId); }
  closeSheet(); render(); toast(added ? `נוספו ${added} אנשי קשר` : 'אנשי הקשר כבר קיימים ברשימה');
}
function contactEdit(id) {
  const c = id ? db.contacts.find(x => x.id === id) : null;
  sheetState = { kind: 'contact', id, dept: c ? c.dept : null };
  const jobs = c ? db.tasks.filter(t => t.contactId === c.id).sort((a, b) => b.createdAt - a.createdAt) : [];
  openSheet(`<h2>${c ? 'איש קשר' : 'איש קשר חדש'}</h2>
    <form id="ce-form" autocomplete="on">
    <label>שם</label><input id="ce-name" name="name" class="field" value="${c ? esc(c.name) : ''}" placeholder="למשל: משה קירור" autocomplete="name">
    <label>טלפון</label><input id="ce-phone" name="tel" class="field" type="tel" inputmode="tel" value="${c ? esc(c.phone || '') : ''}" placeholder="050-0000000" autocomplete="tel">
    </form>
    <label>תפקיד</label><input id="ce-role" class="field" value="${c ? esc(c.role || '') : ''}" placeholder="למשל: טכנאי קירור" autocomplete="off">
    <div class="chips pick-roles">${ROLES.map(r => `<button class="chip" data-role="${esc(r)}">${esc(r)}</button>`).join('')}</div>
    <label>מחלקה (לא חובה)</label>${pickChips('dept', DEPTS, sheetState.dept)}
    <label>הערות</label><textarea id="ce-notes" placeholder="שעות פעילות, אחריות על מכשירים, מחירים...">${c ? esc(c.notes || '') : ''}</textarea>
    ${c && c.phone ? `<div class="row">${callBtn(c)}</div>` : ''}
    ${jobs.length ? `<label>טיפולים קודמים</label><div class="hist">${jobs.slice(0, 15).map(t => `<div class="h"><small>${fmtD.format(t.createdAt)} · ${esc(t.dept || '')}</small>${esc(t.title)}${t.treatment ? `<br><b>טיפול:</b> ${esc(t.treatment)}` : ''}</div>`).join('')}</div>` : ''}
    <div class="row">${c ? '<button class="btn danger" data-x="ce-del">מחק</button>' : '<button class="btn" data-x="c-back">ביטול</button>'}<button class="btn primary" data-x="ce-save">שמור</button></div>`);
  if (!c) $('#ce-name').focus();
}

/* ---------- טמפרטורות מקררים ---------- */
const FRIDGE_KINDS = [
  { v: 'fridge', name: 'מקרר', min: 0, max: 5 },
  { v: 'freezer', name: 'מקפיא', min: -30, max: -18 },
  { v: 'other', name: 'אחר', min: 0, max: 8 },
];
function lastTemp(fid) {
  let best = null;
  for (const r of db.temps) if (r.f === fid && (!best || r.t > best.t)) best = r;
  return best;
}
function tempOk(f, v) { return v >= f.min && v <= f.max; }
function fridgesToMeasure() {
  const today = startOfDay(Date.now());
  return db.fridges.filter(f => { const l = lastTemp(f.id); return !l || l.t < today; });
}
function tempsSheet() {
  sheetState = { kind: 'temps' };
  const today = startOfDay(Date.now());
  const missing = fridgesToMeasure().length;
  const rows = db.fridges.slice().sort((a, b) => DEPTS.indexOf(a.dept) - DEPTS.indexOf(b.dept) || a.name.localeCompare(b.name, 'he')).map(f => {
    const l = lastTemp(f.id);
    const bad = l && !tempOk(f, l.v);
    const status = !l ? '<span class="tag">עוד לא נמדד</span>'
      : `<span class="tag ${bad ? 'over' : 'okc'}">${bad ? '⚠ ' : '✓ '}${l.v}° · ${l.t >= today ? fmtTime.format(l.t) : ago(l.t)}</span>`;
    const openFault = bad && !l.taskId ? `<button class="r-btn warnb" data-tfault="${l.id}">פתח תקלה</button>` : '';
    return `<div class="f-row ${bad ? 'bad' : ''}">
      <div class="body" data-fhist="${f.id}"><b>${esc(f.name)}</b><small>${esc(f.dept || '')} · טווח ${f.min}° עד ${f.max}°</small><div class="meta">${status}${openFault}</div></div>
      <input class="field tin" type="number" step="0.1" data-tin="${f.id}" placeholder="°" aria-label="טמפרטורה ${esc(f.name)}">
    </div>`;
  }).join('');
  openSheet(`<h2>🌡️ טמפרטורות</h2>
    ${db.fridges.length ? `<div class="kv">${missing ? `נשארו ${missing} למדידה היום` : 'כל המקררים נמדדו היום ✓'} · מקפיא: אפשר להקליד בלי מינוס</div>` : ''}
    ${rows || '<div class="empty small">עוד לא הוגדרו מקררים.<br>הוסיפו מקררים ומקפיאים כדי לרשום טמפרטורות כל יום.</div>'}
    ${db.fridges.length ? '<button class="btn ok full mt8" data-x="t-save">שמור מדידות</button>' : ''}
    <div class="row"><button class="btn" data-x="f-new">+ מקרר / מקפיא</button>${db.temps.length ? '<button class="btn" data-x="t-export">ייצוא לביקורת</button>' : ''}</div>
    <div class="row"><button class="btn" data-x="cancel">סגור</button></div>`);
}
function fridgeEdit(id) {
  const f = id ? db.fridges.find(x => x.id === id) : null;
  sheetState = { kind: 'fridge', id, dept: f ? f.dept : (ui.dept !== 'all' ? ui.dept : 'מטבח'), fkind: f ? f.kind : 'fridge' };
  const k = FRIDGE_KINDS.find(x => x.v === sheetState.fkind);
  openSheet(`<h2>${f ? 'הגדרות מקרר' : 'מקרר / מקפיא חדש'}</h2>
    <label>שם</label><input id="fe-name" class="field" value="${f ? esc(f.name) : ''}" placeholder="למשל: מקרר בר 1" autocomplete="off">
    <label>סוג</label><div class="chips pick" data-fkind>${FRIDGE_KINDS.map(x => `<button class="chip ${x.v === sheetState.fkind ? 'on' : ''}" data-fk="${x.v}">${x.name}</button>`).join('')}</div>
    <label>טווח תקין (°C)</label>
    <div class="row mt0 center"><span class="note">מ־</span><input id="fe-min" type="number" step="0.5" class="field num" value="${f ? f.min : k.min}"><span class="note">עד</span><input id="fe-max" type="number" step="0.5" class="field num" value="${f ? f.max : k.max}"></div>
    <label>מחלקה</label>${pickChips('dept', DEPTS, sheetState.dept)}
    <div class="row">${f ? '<button class="btn danger" data-x="fe-del">מחק</button>' : '<button class="btn" data-x="t-back">ביטול</button>'}<button class="btn primary" data-x="fe-save">שמור</button></div>`);
  if (!f) $('#fe-name').focus();
}
function fridgeHistory(id) {
  const f = db.fridges.find(x => x.id === id); if (!f) return;
  sheetState = { kind: 'fhist', id };
  const list = db.temps.filter(r => r.f === id).sort((a, b) => b.t - a.t);
  const last30 = list.filter(r => r.t > Date.now() - 30 * DAY);
  const bad = last30.filter(r => !tempOk(f, r.v)).length;
  // גרף קטן של 14 המדידות האחרונות
  const pts = list.slice(0, 14).reverse();
  let spark = '';
  if (pts.length > 1) {
    const vals = pts.map(p => p.v).concat([f.min, f.max]);
    const lo = Math.min(...vals) - 1, hi = Math.max(...vals) + 1, W = 300, H = 70;
    const x = i => 8 + i * (W - 16) / (pts.length - 1), y = v => H - 6 - (v - lo) / (hi - lo) * (H - 12);
    spark = `<svg class="spark" viewBox="0 0 ${W} ${H}" aria-hidden="true">
      <rect x="0" y="${y(f.max)}" width="${W}" height="${Math.max(1, y(f.min) - y(f.max))}" class="sp-band"/>
      <polyline points="${pts.map((p, i) => `${x(i)},${y(p.v)}`).join(' ')}" class="sp-line"/>
      ${pts.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.v)}" r="3.5" class="${tempOk(f, p.v) ? 'sp-ok' : 'sp-bad'}"/>`).join('')}</svg>`;
  }
  openSheet(`<h2>${esc(f.name)}</h2>
    <div class="kv">${esc(f.dept || '')} · טווח ${f.min}° עד ${f.max}° · ב־30 יום: ${last30.length} מדידות${bad ? `, <b class="r-over">${bad} חריגות</b>` : ''}</div>
    ${spark}
    <div class="hist">${list.slice(0, 40).map(r => `<div class="h"><small>${fmtDT.format(r.t)}</small><span class="${tempOk(f, r.v) ? '' : 'r-over'}">${r.v}°${tempOk(f, r.v) ? '' : ' ⚠ חריגה'}</span>${r.taskId ? ' · נפתחה תקלה' : ''}</div>`).join('') || '<div class="note">אין מדידות עדיין</div>'}</div>
    <div class="row"><button class="btn" data-x="t-back">חזרה</button><button class="btn" data-fedit="${f.id}">הגדרות</button></div>`);
}
async function exportTemps() {
  const rows = [['תאריך', 'שעה', 'מקרר', 'מחלקה', 'טמפרטורה', 'טווח תקין', 'תקין']];
  const ds = new Intl.DateTimeFormat('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  for (const r of db.temps.slice().sort((a, b) => a.t - b.t)) {
    const f = db.fridges.find(x => x.id === r.f); if (!f) continue;
    rows.push([ds.format(r.t), fmtTime.format(r.t), f.name, f.dept || '', r.v, `${f.min} עד ${f.max}`, tempOk(f, r.v) ? 'כן' : 'לא']);
  }
  const csv = '﻿' + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  await shareFile(csv, `טמפרטורות-${toInputDate(Date.now())}.csv`, 'text/csv');
}
async function shareFile(content, name, type) {
  try {
    const file = new File([content], name, { type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file] }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
}

/* ---------- סיכום חודשי ---------- */
function similarPair(a, b) {
  const ta = sigTokens(a.title), tb = sigTokens(b.title);
  const { inter, score } = similarity(ta, tb);
  const sameDept = !a.dept || !b.dept || a.dept === b.dept;
  return inter >= 1 && ((sameDept && score >= 0.5) || (inter >= 2 && score >= 0.8));
}
function statsSheet(offset, rest) {
  offset = offset || 0; rest = rest || ui.rest;
  sheetState = { kind: 'stats', offset, rest };
  const mine = x => (x.rest || 'ramah') === rest;
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() + offset, 1).getTime();
  const to = new Date(now.getFullYear(), now.getMonth() + offset + 1, 1).getTime() - 1;
  const inM = ts => ts && ts >= from && ts <= to;
  const opened = db.tasks.filter(t => mine(t) && inM(t.createdAt));
  const closed = db.tasks.filter(t => mine(t) && t.status === 'closed' && inM(t.closedAt));
  const faults = opened.filter(t => t.type !== 'task');
  const durs = closed.map(t => t.closedAt - t.createdAt).filter(d => d >= 0);
  const avg = durs.length ? durs.reduce((a, b) => a + b, 0) / durs.length : 0;
  const avgTxt = !durs.length ? '—' : avg < DAY ? `${Math.max(1, Math.round(avg / 3600000))} ש׳` : `${(avg / DAY).toFixed(1)} ימים`;

  const bars = (counts, total) => Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, n]) =>
    `<div class="bar-row"><span class="bl">${esc(k)}</span><span class="bt"><i data-w="${Math.round(n / total * 100)}"></i></span><b>${n}</b></div>`).join('');
  const byDept = {}, byType = {};
  for (const t of opened) { byDept[t.dept || DEFAULT_DEPT] = (byDept[t.dept || DEFAULT_DEPT] || 0) + 1; byType[typeName(t.type)] = (byType[typeName(t.type)] || 0) + 1; }

  // מכשירים / תקלות שחוזרות – קיבוץ לפי דמיון
  const allFaults = db.tasks.filter(t => mine(t) && t.type !== 'task').sort((a, b) => a.createdAt - b.createdAt);
  const clusters = [];
  for (const t of allFaults) {
    const c = clusters.find(c => similarPair(c.rep, t));
    if (c) c.items.push(t); else clusters.push({ rep: t, items: [t] });
  }
  const hot = clusters.map(c => ({ c, m: c.items.filter(t => inM(t.createdAt)).length }))
    .filter(x => x.m > 0 && x.c.items.length > 1).sort((a, b) => b.m - a.m || b.c.items.length - a.c.items.length).slice(0, 6);

  const routineDoneN = db.routine.filter(mine).reduce((s, r) => s + (r.history || []).filter(h => inM(h.t)).length, 0);
  const tempsM = db.temps.filter(r => inM(r.t));
  const tempsBad = tempsM.filter(r => { const f = db.fridges.find(x => x.id === r.f); return f && !tempOk(f, r.v); }).length;
  const byContact = {};
  for (const t of db.tasks) if (mine(t) && t.contactId && (inM(t.closedAt) || inM(t.createdAt))) { const n = contactName(t.contactId); if (n) byContact[n] = (byContact[n] || 0) + 1; }

  const monthName = fmtMonth.format(from);
  openSheet(`<div class="cal-nav stats-nav"><button class="r-btn" data-stats="${offset - 1}" aria-label="חודש קודם">›</button><h2 class="m0">📊 ${monthName}</h2>
      <button class="r-btn" data-stats="${offset + 1}" ${offset >= 0 ? 'disabled' : ''} aria-label="חודש הבא">‹</button></div>
    <div class="seg mt8">${RESTS.map(r => `<button class="seg-b ${r.id === rest ? 'on' : ''}" data-srest="${r.id}">${esc(r.name)}</button>`).join('')}</div>
    <div class="tiles">
      <div class="tile"><b>${opened.length}</b><span>נפתחו</span><small>${faults.length} תקלות</small></div>
      <div class="tile"><b>${closed.length}</b><span>נסגרו</span></div>
      <div class="tile"><b>${avgTxt}</b><span>זמן טיפול ממוצע</span></div>
      <div class="tile"><b>${db.tasks.filter(t => mine(t) && t.status !== 'closed').length}</b><span>פתוחות עכשיו</span></div>
    </div>
    ${hot.length ? `<label>🔁 תקלות שחוזרות – הכי בעייתי</label><div class="hist">${hot.map(x => `<div class="h"><b>${esc(x.c.items[x.c.items.length - 1].title)}</b><small>${x.m} החודש · ${x.c.items.length} בסך הכול · ${esc(x.c.rep.dept || '')}</small></div>`).join('')}</div>` : ''}
    ${opened.length ? `<label>לפי מחלקה</label>${bars(byDept, opened.length)}<label>לפי סוג</label>${bars(byType, opened.length)}` : '<div class="empty small">לא נפתחו משימות בחודש הזה</div>'}
    ${Object.keys(byContact).length ? `<label>👷 טכנאים וספקים שטיפלו</label>${bars(byContact, Math.max(...Object.values(byContact)))}` : ''}
    <label>טיפול שוטף</label>
    <div class="kv">↻ ${routineDoneN} טיפולים שוטפים בוצעו${db.routine.some(mine) ? ` · ${db.routine.filter(r => mine(r) && routineState(r).days < 0).length} באיחור כרגע` : ''}</div>
    <div class="row"><button class="btn" data-x="cancel">סגור</button></div>`, true);
  document.querySelectorAll('#sheet [data-w]').forEach(i => { i.style.width = Math.max(3, Number(i.dataset.w)) + '%'; });
}

/* ---------- אירועים של התוספות ---------- */
document.addEventListener('click', e => {
  if (e.target.closest('a.call')) return; // חיוג – לא לפתוח עריכה
  const el = e.target.closest('button, [data-ph], [data-cedit], [data-fhist], [data-ovopen], [data-invopen], [data-invedit]'); if (!el) return;
  const d = el.dataset;
  if (el.id === 'btnContacts') return contactsSheet();
  if (el.id === 'btnAll') return overviewSheet();
  if (el.id === 'btnInv') return invoicesSheet();
  if (d.invneed) return setInvNeed(d.invneed, true);
  if (d.invnext) {
    e.stopPropagation();
    const t = db.tasks.find(x => x.id === d.invnext); if (!t || !t.inv) return;
    if (!INV_NEXT[t.inv.st]) return;
    invAdvance(t, INV_NEXT[t.inv.st]); save(); render(); invoicesSheet();
    return toast('🧾 ' + INV_ST.find(x => x.v === t.inv.st).long);
  }
  if (d.invopen) { invEdit(d.invopen); returnTo = invoicesSheet; return; }
  if (d.invadd || d.invedit) {
    const id = d.invadd || d.invedit; const t = db.tasks.find(x => x.id === id); if (!t) return;
    detailCollect(t);
    if (!t.inv) { t.inv = { st: 'wait', since: Date.now(), photos: [] }; addLog(t, '🧾 ממתינה לחשבונית'); }
    save(); render(); invEdit(id); returnTo = () => taskDetail(id); return;
  }
  if (d.invst && sheetState && sheetState.kind === 'inv') {
    sheetState.st = d.invst;
    document.querySelectorAll('#sheet [data-invst]').forEach(b => b.classList.toggle('on', b === el)); return;
  }
  if (d.ovopen) { taskDetail(d.ovopen); returnTo = overviewSheet; return; }
  if (el.id === 'btnTemps') return tempsSheet();
  if (el.id === 'btnStats') return statsSheet(0);
  if (d.ph) return showPhoto(d.ph);
  if (d.phdel) {
    const list = currentPhotoList(); if (!list) return;
    if (!confirm('למחוק את התמונה?')) return;
    const i = list.indexOf(d.phdel); if (i >= 0) list.splice(i, 1);
    photoDel(d.phdel); if (sheetState.kind === 'detail' || sheetState.kind === 'inv') save(); refreshStrip(); return;
  }
  if (d.cedit) return contactEdit(d.cedit);
  if (d.role) { $('#ce-role').value = d.role; return; }
  if (d.fhist) return fridgeHistory(d.fhist);
  if (d.fedit) return fridgeEdit(d.fedit);
  if (d.fk) {
    sheetState.fkind = d.fk; const k = FRIDGE_KINDS.find(x => x.v === d.fk);
    el.parentNode.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === el));
    $('#fe-min').value = k.min; $('#fe-max').value = k.max; return;
  }
  if (d.stats !== undefined) { if (!el.disabled) statsSheet(Number(d.stats), sheetState.rest); return; }
  if (d.srest) return statsSheet(sheetState.offset, d.srest);
  if (d.tfault) {
    const r = db.temps.find(x => x.id === d.tfault); const f = r && db.fridges.find(x => x.id === r.f); if (!f) return;
    const t = { id: uid(), title: `${f.name} – טמפרטורה ${r.v}° (מחוץ לטווח)`, notes: `טווח תקין: ${f.min}° עד ${f.max}°. נמדד ${fmtDT.format(r.t)}.`,
      dept: f.dept || DEFAULT_DEPT, type: 'equip', prio: 2, status: 'open', createdAt: Date.now(), log: [] };
    const sim = findSimilar(t.title, t.dept); if (sim.length) { t.related = sim.map(x => x.id); t.repeats = sim.length; }
    db.tasks.push(t); r.taskId = t.id; save(); render(); tempsSheet(); toast('נפתחה תקלה ברשימת הפתוחות'); return;
  }

  switch (d.x) {
    case 'ph-add': return $('#ph-input').click();
    case 'iv-save': {
      const t = db.tasks.find(x => x.id === sheetState.id); if (!t || !t.inv) return;
      if (sheetState.st !== t.inv.st) invAdvance(t, sheetState.st);
      const a = $('#iv-amount').value.trim(); t.inv.amount = a === '' ? null : Number(a);
      t.inv.num = $('#iv-num').value.trim(); t.inv.note = $('#iv-note').value.trim();
      save(); render(); closeSheet(); return toast('נשמר');
    }
    case 'iv-del': {
      const t = db.tasks.find(x => x.id === sheetState.id); if (!t || !t.inv) return;
      if (!confirm('להסיר את מעקב החשבונית?')) return;
      (t.inv.photos || []).forEach(id => photoDel(id)); delete t.inv; save(); render(); closeSheet(); return;
    }
    case 'c-new': return contactEdit(null);
    case 'c-vcf': return $('#vcf-input').click();
    case 'c-pick':
      navigator.contacts.select(['name', 'tel'], { multiple: true }).then(res => {
        if (!res || !res.length) return;
        importContacts(res.map(r => ({ name: (r.name || [])[0] || '', phone: (r.tel || [])[0] || '' })));
      }).catch(() => toast('לא הצלחתי לפתוח את אנשי הקשר'));
      return;
    case 'c-back': return contactsSheet();
    case 'ce-save': {
      const name = $('#ce-name').value.trim(); if (!name) return $('#ce-name').focus();
      const data = { name, phone: $('#ce-phone').value.trim(), role: $('#ce-role').value.trim(), dept: sheetState.dept || null, notes: $('#ce-notes').value.trim() };
      if (sheetState.id) Object.assign(db.contacts.find(x => x.id === sheetState.id), data);
      else db.contacts.push({ id: uid(), createdAt: Date.now(), ...data });
      save(); toast('נשמר'); return contactsSheet();
    }
    case 'ce-del':
      if (!confirm('למחוק את איש הקשר?')) return;
      db.contacts = db.contacts.filter(x => x.id !== sheetState.id);
      for (const t of db.tasks) if (t.contactId === sheetState.id) t.contactId = null;
      save(); return contactsSheet();
    case 'f-new': return fridgeEdit(null);
    case 't-back': return tempsSheet();
    case 'fe-save': {
      const name = $('#fe-name').value.trim(); if (!name) return $('#fe-name').focus();
      let min = Number($('#fe-min').value), max = Number($('#fe-max').value);
      if (isNaN(min) || isNaN(max)) return toast('טווח לא תקין');
      if (min > max) [min, max] = [max, min];
      const data = { name, kind: sheetState.fkind, min, max, dept: sheetState.dept || DEFAULT_DEPT };
      if (sheetState.id) Object.assign(db.fridges.find(x => x.id === sheetState.id), data);
      else db.fridges.push({ id: uid(), ...data });
      save(); render(); return tempsSheet();
    }
    case 'fe-del':
      if (!confirm('למחוק את המקרר ואת כל המדידות שלו?')) return;
      db.fridges = db.fridges.filter(x => x.id !== sheetState.id);
      db.temps = db.temps.filter(x => x.f !== sheetState.id);
      save(); render(); return tempsSheet();
    case 't-save': {
      let n = 0, bad = 0; const now = Date.now();
      for (const inp of document.querySelectorAll('[data-tin]')) {
        if (inp.value.trim() === '') continue;
        let v = Number(inp.value.replace(',', '.')); if (isNaN(v)) continue;
        const f = db.fridges.find(x => x.id === inp.dataset.tin); if (!f) continue;
        if (f.kind === 'freezer' && v > 0) v = -v;
        v = Math.round(v * 10) / 10;
        db.temps.push({ id: uid(), f: f.id, t: now, v }); n++;
        if (!tempOk(f, v)) bad++;
      }
      if (!n) return toast('לא הוקלדו מדידות');
      save(); render(); tempsSheet();
      return toast(bad ? `נשמרו ${n} מדידות · ⚠ ${bad} חריגות` : `נשמרו ${n} מדידות ✓`);
    }
    case 't-export': return exportTemps();
  }
});
document.addEventListener('change', e => {
  if (e.target.id === 'q-contact' && sheetState) {
    sheetState.manual.contact = true; sheetState.contactId = e.target.value || null;
    $('#q-csug').textContent = '';
    $('#q-call').innerHTML = callBtn(db.contacts.find(c => c.id === sheetState.contactId), true);
  }
  if (e.target.id === 'ph-input' && e.target.files[0]) { addPhotoFile(e.target.files[0]); e.target.value = ''; }
  if (e.target.id === 'vcf-input' && e.target.files.length) {
    Promise.all([...e.target.files].map(f => f.text())).then(texts => {
      const list = texts.flatMap(parseVcf);
      if (!list.length) return toast('לא נמצאו אנשי קשר בקובץ');
      if (list.length > 1 && !confirm(`לייבא ${list.length} אנשי קשר?`)) return;
      importContacts(list);
    }).catch(() => toast('לא הצלחתי לקרוא את הקובץ'));
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'c-search') $('#c-list').innerHTML = contactListHtml(e.target.value);
});

/* ---------- אירועים ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('button, .card, .r-item, #sheet-bg'); if (!el) return;

  if (el.id === 'sheet-bg') return closeSheet();
  if (el.id === 'fab') return quickAdd();
  if (el.id === 'btnSettings') return settings();
  if (el.dataset.day) { ui.calDay = Number(el.dataset.day); const d = new Date(ui.calDay); ui.calMonth = new Date(d.getFullYear(), d.getMonth(), 1).getTime(); return render(); }
  if (el.dataset.calNav !== undefined) {
    const n = Number(el.dataset.calNav), m = new Date(ui.calMonth);
    if (n === 0) { ui.calMonth = null; ui.calDay = null; }
    else { ui.calMonth = new Date(m.getFullYear(), m.getMonth() + n, 1).getTime(); ui.calDay = ui.calMonth; }
    return render();
  }
  if (el.dataset.tab) { if (ui.tab !== el.dataset.tab) { ui.q = ''; $('#search').value = ''; } ui.tab = el.dataset.tab; ui.dept = ui.dept; window.scrollTo(0, 0); return render(); }
  if (el.dataset.rest && el.closest('#rest-sw')) { setRest(el.dataset.rest); window.scrollTo(0, 0); return render(); }
  if (el.dataset.dept) { ui.dept = el.dataset.dept; return render(); }

  // פעולות מהירות על כרטיס
  if (el.dataset.start) { e.stopPropagation(); const t = db.tasks.find(x => x.id === el.dataset.start); setStatus(t, 'progress'); save(); render(); return toast('הועבר לטיפול'); }
  if (el.dataset.close) { e.stopPropagation(); return closeFlow(el.dataset.close); }
  if (el.dataset.doneR) { e.stopPropagation(); return routineDone(el.dataset.doneR); }
  if (el.dataset.st && sheetState && sheetState.kind === 'detail') {
    const t = db.tasks.find(x => x.id === sheetState.id); const st = el.dataset.st;
    if (!t || t.status === st) return;
    detailCollect(t);
    if (st === 'closed') { save(); return closeFlow(t.id); }
    const wasClosed = t.status === 'closed';
    setStatus(t, st);
    if (wasClosed && st === 'progress') addLog(t, 'נפתח מחדש – בטיפול');
    save(); render(); taskDetail(t.id);
    return toast(st === 'progress' ? 'עבר לטיפול' : 'הוחזר לפתוחות');
  }
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
    if (name === 'rest' && $('#pick-dept')) {
      if (!deptsOf(v).includes(sheetState.dept)) sheetState.dept = DEFAULT_DEPT;
      $('#pick-dept').innerHTML = pickChips('dept', deptsOf(v), sheetState.dept);
    }
    if (name === 'every' && $('#r-every')) $('#r-every').value = v;
    return;
  }

  const x = el.dataset.x; if (!x) return;
  const s = sheetState;
  const t = s && s.id ? db.tasks.find(y => y.id === s.id) : null;
  switch (x) {
    case 'cancel': return closeSheet();
    case 'cal-add': return quickAdd(ui.calDay);
    case 'q-cshow': showQuickContact(); renderQuickContact(''); return;
    case 'q-save': return quickSave();
    case 'q-more': {
      $('#q-more').classList.remove('hidden'); el.classList.add('hidden');
      const di = $('#q-due'); di.focus();
      try { if (di.showPicker) di.showPicker(); } catch (err) { /* הדפדפן יפתח בלחיצה */ }
      return;
    }
    case 'd-clear-due': $('#d-due').value = ''; return;
    case 'd-save': detailCollect(t); save(); closeSheet(); render(); return toast('נשמר');
    case 'start': detailCollect(t); setStatus(t, 'progress'); save(); closeSheet(); render(); return toast('הועבר לטיפול');
    case 'reopen': detailCollect(t); setStatus(t, 'open'); save(); closeSheet(); render(); return toast('הוחזר לפתוחות');
    case 'close': detailCollect(t); save(); return closeFlow(t.id);
    case 'log': {
      const v = $('#d-log').value.trim(); if (!v) return;
      detailCollect(t); addLog(t, v); save(); taskDetail(t.id); return;
    }
    case 'del':
      if (confirm('למחוק את המשימה?')) { (t.photos || []).concat(t.closePhotos || [], (t.inv && t.inv.photos) || []).forEach(id => photoDel(id)); db.tasks = db.tasks.filter(y => y.id !== t.id); save(); closeSheet(); render(); }
      return;
    case 'c-prev': $('#c-treat').value = s.prev; return;
    case 'c-save': {
      const tr = $('#c-treat').value.trim();
      if ($('#c-contact')) t.contactId = $('#c-contact').value || null;
      if (s.photos && s.photos.length) { t.closePhotos = (t.closePhotos || []).concat(s.photos); s.saved = true; }
      const newInv = !t.inv && !!t.contactId;
      if (newInv) { t.inv = { st: 'wait', since: Date.now(), photos: [] }; addLog(t, '🧾 ממתינה לחשבונית'); }
      t.treatment = tr; t.status = 'closed'; t.closedAt = Date.now(); addLog(t, 'נסגר' + (tr ? ': ' + tr : ''));
      save(); closeSheet(); render(); return toast(newInv ? 'נסגר ✓ · החשבונית נכנסה למעקב 🧾' : 'נסגר ✓');
    }
    case 'r-save': {
      const title = $('#r-title').value.trim(); if (!title) return $('#r-title').focus();
      const every = Math.max(1, Number($('#r-every').value) || s.every || 7);
      if (s.id) Object.assign(db.routine.find(y => y.id === s.id), { title, rest: s.rest, dept: s.dept, every });
      else db.routine.push({ id: uid(), title, rest: s.rest, dept: s.dept, every, last: null, createdAt: Date.now(), history: [] });
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
        db = blank(); save(); idbReq('readwrite', st => st.clear()).catch(() => {}); closeSheet(); render(); toast('הכול נמחק');
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
document.addEventListener('submit', e => e.preventDefault());
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
  const hadController = !!navigator.serviceWorker.controller;
  let reloading = false;
  // כשגרסה חדשה מותקנת – טוענים אותה מייד (הנתונים לא נפגעים)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloading) return;
    reloading = true; location.reload();
  });
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
    // באייפון האפליקציה חוזרת מהרקע בלי טעינה מחדש – לכן בודקים עדכון בכל חזרה
    document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
    reg.update().catch(() => {});
  }).catch(() => {});
}

// רענון התצוגה (תאריכי יעד, טיפול שוטף) כל 30 שניות כשהאפליקציה פתוחה
setInterval(() => { if (!sheetState && !document.hidden) render(); }, 30000);

render();
