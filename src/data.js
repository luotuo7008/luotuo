/**
 * @typedef {{id:string, name:string, category:string, status:?string}} Base
 * @typedef {Base & {size:?string, owner:?string, image:?string, note:?string}} Product
 * @typedef {Base & {seriesId:string, productId:?string, version:number, text:?string, owner:?string}} CopyVersion
 * @typedef {Base & {productId:?string, image:?string, alt:?string, usage:?string, rights:?string}} Asset
 * @typedef {Base & {order:number, summary:string, terms:string, source:string, reviewedBy:?string}} Lesson
 * @typedef {Base & {productId:?string, owner:?string, due:?string, note:?string}} Task
 */

export const UNKNOWN = '未定';
export const display = (value) => value == null || (typeof value === 'string' && !value.trim()) ? UNKNOWN : String(value);
export const TASK_STATUSES = ['待办', '进行中', '已完成', UNKNOWN];
const anatomySource = 'https://www.ncbi.nlm.nih.gov/books/NBK441980/';

/** @type {Product[]} */
const products = [
  { id:'P-001', name:'清润爽肤水', category:'爽肤水', status:'待核对', size:null, owner:null, image:'./assets/toner.svg', note:'用于演示爽肤水的产品资料归档。' },
  { id:'P-002', name:'柔润面霜', category:'面霜', status:'整理中', size:'50 g', owner:'内容组（示例）', image:'./assets/cream.svg', note:'规格为演示值。' },
  { id:'P-003', name:'轻盈洁面乳', category:'洁面', status:null, size:null, owner:null, image:null, note:null },
];
/** @type {CopyVersion[]} */
const copy = [
  { id:'C-002', name:'清润爽肤水 · 图文开场', seriesId:'CV-001', productId:'P-001', version:2, category:'小红书', status:'待审核', text:'洗脸之后，给自己留一分钟。用轻盈水感开启今天的护理。', owner:null },
  { id:'C-001', name:'清润爽肤水 · 图文开场', seriesId:'CV-001', productId:'P-001', version:1, category:'小红书', status:'草稿', text:'清洁之后，从一瓶爽肤水开始日常护理。', owner:null },
  { id:'C-003', name:'柔润面霜 · 货架短句', seriesId:'CV-002', productId:'P-002', version:1, category:'门店物料', status:null, text:'给日常护理留一抹柔润。', owner:'内容组（示例）' },
];
/** @type {Asset[]} */
const assets = [
  { id:'A-001', name:'清润爽肤水 · 瓶身插画', category:'产品示意', status:'可预览', productId:'P-001', image:'./assets/toner.svg', alt:'浅绿色背景中的爽肤水瓶插画', usage:'产品目录', rights:'项目内原创示意图' },
  { id:'A-002', name:'柔润面霜 · 罐身插画', category:'产品示意', status:'可预览', productId:'P-002', image:'./assets/cream.svg', alt:'米色背景中的面霜罐插画', usage:'产品目录', rights:'项目内原创示意图' },
  { id:'A-003', name:'皮肤剖面 · 分层示意', category:'科普示意', status:'可预览', productId:null, image:'./assets/skin.svg', alt:'从上到下为表皮、真皮和皮下组织的示意图', usage:'皮肤科普', rights:'项目内原创示意图' },
  { id:'A-004', name:'洁面乳 · 产品图', category:'产品照片', status:null, productId:'P-003', image:null, alt:null, usage:null, rights:null },
];
/** @type {Lesson[]} */
const science = [
  { id:'S-001', name:'表皮', order:1, category:'皮肤分层', status:'科普草稿', summary:'表皮位于最外侧。其表面的角质层有助于减少水分流失，并参与阻隔外界刺激。', terms:'角质层、皮肤屏障', source:anatomySource, reviewedBy:null },
  { id:'S-002', name:'真皮', order:2, category:'皮肤分层', status:'科普草稿', summary:'真皮在表皮下方，主要由结缔组织构成，并含有血管、神经、毛囊及汗腺等结构。', terms:'结缔组织、毛囊、汗腺', source:anatomySource, reviewedBy:null },
  { id:'S-003', name:'皮下组织', order:3, category:'皮肤分层', status:'科普草稿', summary:'皮下组织位于真皮下方，由脂肪及结缔组织构成，具有缓冲和保温作用。', terms:'皮下脂肪、缓冲', source:anatomySource, reviewedBy:null },
];
/** @type {Task[]} */
const tasks = [
  { id:'T-001', name:'核对爽肤水规格', category:'产品资料', status:'待办', productId:'P-001', owner:null, due:null, note:'以正式产品标签为准。' },
  { id:'T-002', name:'复核两版图文开场', category:'文案', status:'进行中', productId:'P-001', owner:'内容组（示例）', due:null, note:'对照文案版本，确定下一版修改方向。' },
  { id:'T-003', name:'整理面霜示意图', category:'素材', status:'已完成', productId:'P-002', owner:'设计组（示例）', due:null, note:'示意图已加入图片素材页。' },
  { id:'T-004', name:'安排科普内容复核', category:'科普', status:null, productId:null, owner:null, due:null, note:null },
];
export const records = { products, copy, assets, science, tasks };
export const productName = (id) => display(products.find(p => p.id === id)?.name);
