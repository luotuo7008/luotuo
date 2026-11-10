import { records, display, productName, TASK_STATUSES, UNKNOWN } from './data.js';

const pages = {
  products:{ title:'产品目录', code:'01 / 产品资料', description:'集中整理产品资料、规格与负责人，快速找到需要补齐的信息。', section:'全部产品', caption:'按关键词、品类或状态查找产品。', category:'品类', icon:'box' },
  copy:{ title:'营销文案版本', code:'02 / 内容创作', description:'将同一主题的不同版本归档，按渠道查看正文和审核状态。', section:'文案版本', caption:'点击版本查看全文和同主题版本。', category:'渠道', icon:'file' },
  assets:{ title:'图片素材', code:'03 / 视觉资产', description:'预览产品图和科普插画，查看用途、关联产品和使用权。', section:'素材库', caption:'点击图片卡片查看大图和素材资料。', category:'素材类型', icon:'image' },
  science:{ title:'皮肤生理结构科普', nav:'皮肤科普', code:'04 / 科普知识', description:'从表皮到皮下组织，整理用于美容护肤内容的基础知识。', section:'皮肤结构条目', caption:'查看分层说明、关键词和参考来源。', category:'主题', icon:'layers' },
  tasks:{ title:'任务看板', code:'05 / 任务协作', description:'按进度查看内容任务，在卡片上更新状态。进度保存在当前浏览器。', section:'任务进度', caption:'可按分工筛选，或在卡片下方切换状态。', category:'任务类型', icon:'board' },
  search:{ title:'筛选视图', code:'06 / 全局检索', description:'跨产品、文案、素材、科普和任务查找资料。', section:'跨模块结果', caption:'组合使用关键词、模块、分类和状态筛选。', category:'分类', icon:'filter' },
};

const paths = {
  box:'<path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4m-9 4v10"/>',
  file:'<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 4h6"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1"/><path d="M4 18l6-6 3 3 3-4 5 6"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  board:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 8v8m6-8v5"/>',
  filter:'<path d="M4 6h16M7 12h10m-7 6h4"/><circle cx="8" cy="6" r="1.7"/><circle cx="14" cy="12" r="1.7"/>',
  search:'<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 5 5"/>',
  arrow:'<path d="M5 12h13m-5-5 5 5-5 5"/>',
  check:'<path d="m5 12 5 5 9-10"/>',
};
const icon = (name) => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
const $ = (id) => document.getElementById(id);
const esc = (val) => String(val).replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const show = (value) => esc(display(value));
const badge = (value) => `<span class="badge ${['已完成','可预览'].includes(value) ? 'success' : ['待核对','待审核','进行中'].includes(value) ? 'attention' : ''}">${show(value)}</span>`;
const taskKey = 'luotuo:task-status:v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(taskKey)) ?? {}; } catch { /* use demo state */ }
const taskStatuses = Object.fromEntries(records.tasks
  .filter(t => typeof saved[t.id] === 'string' && TASK_STATUSES.includes(saved[t.id]))
  .map(t => [t.id, saved[t.id]]));
const status = (r) => r.kind === 'tasks' ? taskStatuses[r.id] ?? r.status : r.status;
const all = Object.entries(records).flatMap(([kind, items]) => items.map(r => ({ ...r, kind })));
const initialFilters = () => ({ q:'', kind:'', category:'', status:'' });
const filters = {};
let route = 'products';
const rows = () => route === 'search' ? all : all.filter(r => r.kind === route);
const link = (kind, label) => `<a class="text-link" href="#${kind}">${label} ${icon('arrow')}</a>`;
const detailButton = (r, label = '查看详情') => `<button type="button" class="text-link" data-detail="${r.id}" aria-label="${esc(label + '：' + r.name)}">${label} ${icon('arrow')}</button>`;
const image = (r) => r.image
  ? `<img src="${esc(r.image)}" alt="${r.alt ? esc(r.alt) : esc(r.name + '示意图')}">`
  : `<span class="placeholder">${icon('image')}<span>未定</span></span>`;
const fields = (pairs) => `<dl class="fields">${pairs.map(([label,value]) => `<div><dt>${label}</dt><dd>${show(value)}</dd></div>`).join('')}</dl>`;
const version = (r) => Number.isInteger(r.version) ? 'v' + r.version : UNKNOWN;
const option = (value, label, selected) => `<option value="${esc(value)}"${value === selected ? ' selected' : ''}>${esc(label)}</option>`;
const tally = (items) => String(items.length).padStart(2,'0');

function renderOverview() {
  if (route === 'products') {
    const metrics = [
      ['products','产品条目','已建档产品',records.products], ['copy','文案版本','已收录版本',records.copy],
      ['assets','图片素材','含待补充素材',records.assets], ['tasks','待推进任务','含状态未定任务',all.filter(r => r.kind === 'tasks' && status(r) !== '已完成')],
    ];
    $('overview').innerHTML = `<div class="metrics">${metrics.map(([kind,label,description,items]) => `<a class="metric" href="#${kind}"><span class="metric-icon">${icon(pages[kind].icon)}</span><span class="metric-arrow">${icon('arrow')}</span><strong>${tally(items)}</strong><b>${label}</b><small>${description}</small></a>`).join('')}</div>`;
  } else if (route === 'science') {
    $('overview').innerHTML = `<figure class="science-figure">${image(records.assets[2])}<figcaption><strong>皮肤剖面示意</strong><span>从外至内 · 非按比例绘制</span><ol><li>表皮</li><li>真皮</li><li>皮下组织</li></ol><a href="${records.science[0].source}" target="_blank" rel="noopener noreferrer">阅读解剖学参考资料 ↗</a></figcaption></figure>`;
  } else $('overview').replaceChildren();
}

function renderFilters() {
  const f = filters[route];
  $('filters').innerHTML = `<form class="filters" role="search" aria-label="筛选资料">
    <label class="searchbox">${icon('search')}<span class="sr">关键词</span><input id="query" type="search" placeholder="搜索名称、编号或内容" value="${esc(f.q)}"></label>
    ${route === 'search' ? `<label class="selectbox"><span class="sr">模块</span><select id="filter-kind">${option('','全部模块',f.kind)}${Object.keys(records).map(k => option(k,pages[k].nav ?? pages[k].title,f.kind)).join('')}</select></label>` : ''}
    <label class="selectbox"><span class="sr">${pages[route].category}</span><select id="filter-category"></select></label>
    <label class="selectbox"><span class="sr">状态</span><select id="filter-status"></select></label>
    <button id="clear-filters" type="button" class="reset">清除筛选</button>
  </form>`;
  updateOptions();
}

function updateOptions() {
  const f = filters[route];
  const pool = rows().filter(r => !f.kind || f.kind === r.kind);
  for (const [key,label,get] of [
    ['category','全部' + pages[route].category,r => r.category],
    ['status','全部状态',status],
  ]) {
    const choices = route === 'tasks' && key === 'status' ? TASK_STATUSES :
      [...new Set(pool.map(r => display(get(r))))].sort((a,b) => a.localeCompare(b,'zh-CN'));
    if (f[key] && !choices.includes(f[key])) f[key] = '';
    $('filter-' + key).innerHTML = option('',label,f[key]) + choices.map(v => option(v,v,f[key])).join('');
  }
}

function matches(r, f) {
  if (f.kind && f.kind !== r.kind || f.category && f.category !== display(r.category) || f.status && f.status !== display(status(r))) return false;
  const { kind, ...values } = r;
  const haystack = [...Object.values({ ...values, status:status(r) }), pages[kind].title,
    ...('productId' in r ? [productName(r.productId)] : []), ...(kind === 'copy' ? [version(r)] : [])]
    .map(display).join(' ').toLocaleLowerCase('zh-CN');
  return f.q.trim().toLocaleLowerCase('zh-CN').split(/\s+/).every(word => haystack.includes(word));
}

function table(items) {
  const copy = route === 'copy';
  const search = route === 'search';
  const headers = copy ? ['主题','版本','渠道','关联产品','状态',''] : search ? ['条目','模块','分类','状态',''] : ['产品','品类','规格','负责人','状态',''];
  const tr = (r) => {
    const first = `<div class="record-name">${route === 'products' ? `<div class="thumb">${image(r)}</div>` : ''}<div><strong>${show(r.name)}</strong><small>${show(r.id)}${copy ? ' · ' + show(r.seriesId) : ''}</small></div></div>`;
    const cells = copy ? [first,`<span class="version">${version(r)}</span>`,show(r.category),show(productName(r.productId)),badge(status(r))]
      : search ? [first,show(pages[r.kind].nav ?? pages[r.kind].title),show(r.category),badge(status(r))]
      : [first,show(r.category),show(r.size),show(r.owner),badge(status(r))];
    return `<tr>${[...cells,detailButton(r)].map((cell,i) => `<td data-label="${headers[i]}">${cell}</td>`).join('')}</tr>`;
  };
  return `<table aria-label="${pages[route].section}"><thead><tr>${headers.map(x => `<th scope="col">${x || '<span class="sr">操作</span>'}</th>`).join('')}</tr></thead><tbody>${items.map(tr).join('')}</tbody></table>`;
}

function assets(items) {
  return `<div class="asset-grid">${items.map(r => `<article class="card"><div class="asset-image">${image(r)}</div><div class="card-body"><div class="card-meta">${show(r.category)} ${badge(status(r))}</div><h3>${show(r.name)}</h3><p>用途：${show(r.usage)}</p>${detailButton(r,'查看素材')}</div></article>`).join('')}</div>`;
}

function science(items) {
  return `<div class="lesson-list">${items.map(r => `<article class="lesson"><span class="lesson-number">${String(r.order).padStart(2,'0')}</span><div><h3>${show(r.name)}</h3><p>${show(r.summary)}</p><small>${show(r.terms)}</small></div><div>${badge(status(r))}${detailButton(r,'阅读详情')}</div></article>`).join('')}</div>`;
}

function board(items) {
  const lanes = filters.tasks.status ? [filters.tasks.status] : TASK_STATUSES;
  return `<div class="board" style="--lanes:${lanes.length}">${lanes.map(lane => {
    const tasks = items.filter(r => display(status(r)) === lane);
    return `<section class="lane"><h3><span>${lane}</span><span>${tasks.length}</span></h3>${tasks.length ? tasks.map(r => `<article class="task"><small>${show(r.id)} · ${show(r.category)}</small><h4>${show(r.name)}</h4><p>负责人：${show(r.owner)}<br>截止日期：${show(r.due)}</p>${detailButton(r)}<label><span class="sr">更新状态：${show(r.name)}</span><select data-task="${r.id}">${TASK_STATUSES.map(s => option(s,s,display(status(r)))).join('')}</select></label></article>`).join('') : '<p class="lane-empty">此列暂无任务</p>'}</section>`;
  }).join('')}</div>`;
}

function renderResults() {
  const items = rows().filter(r => matches(r,filters[route]));
  $('result-count').textContent = '共 ' + items.length + ' 条';
  $('clear-filters').disabled = !Object.values(filters[route]).some(Boolean);
  $('results').innerHTML = !items.length ? `<div class="empty">${icon('search')}<h3>未找到匹配条目</h3><p>试试其他关键词，或清除筛选条件。</p></div>`
    : ({ assets, science, tasks:board }[route] ?? table)(items);
}

function setRoute() {
  const key = location.hash.slice(1);
  route = Object.hasOwn(pages,key) ? key : 'products';
  filters[route] ??= initialFilters();
  const p = pages[route];
  document.title = p.title + ' · 护肤内容工作台';
  $('navigation').innerHTML = Object.entries(pages).map(([id,page]) => `<a href="#${id}"${id === route ? ' aria-current="page"' : ''}>${icon(page.icon)}<span>${page.nav ?? page.title}</span></a>`).join('');
  for (const [id,value] of Object.entries({breadcrumb:p.title, eyebrow:p.code, 'page-title':p.title, 'page-description':p.description, 'records-title':p.section, 'records-caption':p.caption})) $(id).textContent = value;
  renderOverview();
  renderFilters();
  renderResults();
}

function openDetail(r) {
  $('detail-title').textContent = display(r.name);
  const common = [['编号',r.id],['分类',r.category],['状态',status(r)]];
  const product = ['关联产品',productName(r.productId)];
  const pairs = {
    products:[['规格',r.size],['负责人',r.owner]],
    copy:[['主题编号',r.seriesId],['版本',version(r)],product,['负责人',r.owner]],
    assets:[product,['用途',r.usage],['使用权',r.rights]],
    science:[['关键词',r.terms],['复核人',r.reviewedBy]],
    tasks:[product,['负责人',r.owner],['截止日期',r.due]],
  };
  const source = r.kind === 'science' ? `<p><a href="${esc(r.source)}" target="_blank" rel="noopener noreferrer">阅读参考资料 ↗</a></p>` : '';
  const related = r.kind === 'copy' ? all.filter(v => v.kind === 'copy' && v.seriesId === r.seriesId && v.id !== r.id) : [];
  const extra = {
    products:`<h3>资料备注</h3><p>${show(r.note)}</p>${link('copy','浏览文案版本')}`,
    copy:`<h3>文案正文</h3><p class="copy-text">${show(r.text)}</p><h3>同主题其他版本</h3><p>${related.length ? related.map(v => detailButton(v,version(v))).join(' ') : '暂无其他版本'}</p>`,
    assets:`<div class="detail-image">${image(r)}</div>`,
    science:`<h3>分层说明</h3><p>${show(r.summary)}</p>${source}`,
    tasks:`<h3>任务说明</h3><p>${show(r.note)}</p>`,
  };
  $('detail-body').innerHTML = fields([...common,...pairs[r.kind]]) + extra[r.kind];
  if (!$('detail').open) $('detail').showModal();
  else $('detail').querySelector('.close').focus();
}

$('filters').addEventListener('submit', e => e.preventDefault());
$('filters').addEventListener('input', e => {
  if (e.target.id !== 'query') return;
  filters[route].q = e.target.value;
  renderResults();
});
$('filters').addEventListener('change', e => {
  if (!e.target.id.startsWith('filter-')) return;
  const key = e.target.id.slice(7);
  filters[route][key] = e.target.value;
  if (key === 'kind') updateOptions();
  renderResults();
});
$('filters').addEventListener('click', e => {
  if (e.target.id !== 'clear-filters') return;
  filters[route] = initialFilters();
  renderFilters();
  renderResults();
  $('query').focus();
});
$('results').addEventListener('change', e => {
  const id = e.target.dataset.task;
  if (!id || !TASK_STATUSES.includes(e.target.value)) return;
  taskStatuses[id] = e.target.value;
  let stored = true;
  try { localStorage.setItem(taskKey,JSON.stringify(taskStatuses)); } catch { stored = false; }
  updateOptions();
  renderResults();
  ($('results').querySelector(`[data-task="${id}"]`) ?? $('query')).focus();
  $('result-count').textContent += stored ? ' · 任务状态已保存' : ' · 状态仅在本次打开时保留';
});
document.addEventListener('click', e => {
  const button = e.target.closest('[data-detail]');
  const record = button && all.find(r => r.id === button.dataset.detail);
  if (record) openDetail(record);
  if (e.target.closest('#detail a[href^="#"]')) $('detail').close();
});
document.querySelector('.skip').addEventListener('click', e => {
  e.preventDefault();
  $('content').focus();
});
window.addEventListener('hashchange', () => {
  if ($('detail').open) $('detail').close();
  setRoute();
  window.scrollTo(0,0);
  $('content').focus({preventScroll:true});
});
setRoute();
