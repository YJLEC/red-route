import type { Destination, DestinationId } from '../types/tourism'

function placeholderGallery(id: string, place: string, subjects: string[]) {
  return subjects.map((subject, index) => ({
    id: `${id}-${index + 1}`,
    label: `${place} · ${subject}`,
    caption: `${subject}图片待从可授权网络来源补充`,
    alt: `${place}${subject}图片占位`,
  }))
}

export const destinations: Destination[] = [
  {
    id: 'hebei-museum',
    name: '河北博物院红色展厅',
    shortName: '河北博物院',
    city: '石家庄市',
    category: '城市博物馆',
    theme: '从文物与影像理解河北敌后抗战',
    tagline: '交通最轻松的室内红色文化行程',
    overview:
      '以常设陈列《抗日烽火——英雄河北》为稳定参观锚点，通过文物、历史图片与分单元叙事，适合与石家庄市区行程组合。',
    coordinates: [114.52, 38.045],
    duration: '1.5-2 小时',
    intensity: '低',
    environment: '室内展陈',
    transitLabel: '地铁直达',
    transitScore: 5,
    bestFor: '亲子、长者、城市短途游客',
    mapStyle: 'floor',
    routeTitle: '北区二层展厅顺序',
    routeNote: '以下顺序依据常设陈列的四个单元整理，是理解展览叙事的参观建议，不替代现场导览。',
    guideMapSource: { label: '河北博物院官方基本陈列路线图', url: 'https://www.hebeimuseum.org.cn/statics/images/fuwu/dlxlt.jpg' },
    gallery: placeholderGallery('museum', '河北博物院', ['建筑外观', '北区入口', '红色展厅全景', '代表展品']),
    mapFeatures: [
      { id: 'north-entry', label: '北区入口', type: 'entrance', x: 11, y: 72 },
      { id: 'lift', label: '电梯 / 楼梯', type: 'service', x: 17, y: 18 },
      { id: 'restroom', label: '洗手间', type: 'service', x: 88, y: 18 },
      { id: 'exit', label: '展厅出口', type: 'entrance', x: 89, y: 79 },
    ],
    travelMap: {
      title: '石家庄市区公共交通图',
      scope: '石家庄站至河北博物院',
      sourceNote: '依据河北博物院官方交通指南重绘；道路与站点为真实关系，具体出口以地铁现场标识为准。',
      sourceLabel: '河北博物院官方交通指南',
      sourceUrl: 'https://www.hebeimuseum.org.cn/list-1-1.html',
      nodes: [
        { id: 'sjz-station', label: '石家庄站', detail: '城市交通枢纽', x: 12, y: 78 },
        { id: 'beiguo', label: '北国商城', detail: '地铁 1 号线沿线换乘区域', x: 46, y: 58 },
        { id: 'museum-station', label: '博物院站', detail: '地铁 1 号线', x: 70, y: 42 },
        { id: 'museum', label: '河北博物院', detail: '北区入口', x: 82, y: 24, primary: true },
      ],
      lines: [
        { id: 'metro-1', label: '地铁 1 号线方向', path: 'M12 78 C28 70 35 65 46 58 S62 48 70 42', mode: 'metro' },
        { id: 'walk-museum', label: '出站步行', path: 'M70 42 Q77 34 82 24', mode: 'walk' },
      ],
    },
    spots: [
      {
        id: 'museum-1', order: 1, name: '烽火狼烟',
        summary: '从抗战爆发与河北局势进入展览。',
        detail: '先建立时代背景和空间认识，再进入敌后抗战的具体展开。',
        transfer: '由北区二层展厅入口步行进入', duration: '约 20 分钟', x: 18, y: 32,
      },
      {
        id: 'museum-2', order: 2, name: '日军暴行',
        summary: '通过史料理解战争给河北人民带来的灾难。',
        detail: '内容较为沉重，带儿童参观时可根据接受程度控制停留。',
        transfer: '沿单向展线步行约 1 分钟', duration: '约 20 分钟', x: 42, y: 32,
      },
      {
        id: 'museum-3', order: 3, name: '河北敌后抗战',
        summary: '展览信息最集中的核心单元。',
        detail: '结合文物和历史图片认识河北军民的敌后抗战，是建议重点停留的部分。',
        transfer: '继续沿展线步行约 1 分钟', duration: '约 35 分钟', x: 67, y: 32,
      },
      {
        id: 'museum-4', order: 4, name: '伟大胜利',
        summary: '回望抗战胜利及其历史意义。',
        detail: '在终章整理整场展览的时间线和核心人物事件。',
        transfer: '沿展线进入末单元', duration: '约 15 分钟', x: 82, y: 68,
      },
    ],
    arrivals: [
      { mode: '公共交通', title: '地铁 1 号线', detail: '在“博物院”站下车，出站后步行前往。地铁是最稳定、最省心的抵达方式。', sourceLabel: '河北博物院参观指南', sourceUrl: 'https://www.hebeimuseum.org.cn/list-1-1.html', verifiedAt: '2026-08-27' },
      { mode: '自驾', title: '不建议将院内停车作为方案', detail: '河北博物院公开信息提示暂无对外停车场，建议提前查找周边合规停车点或改乘公共交通。', caution: '不要直接导航后才临时寻找院内车位。', sourceLabel: '河北博物院参观指南', sourceUrl: 'https://www.hebeimuseum.org.cn/list-1-1.html', verifiedAt: '2026-08-27' },
      { mode: '换乘提示', title: '适合串联石家庄市区', detail: '位于城市公共交通网络内，可与市区其他文化场馆安排在同一天。', sourceLabel: '河北博物院官方交通指南', sourceUrl: 'https://www.hebeimuseum.org.cn/statics/images/fuwu/jtzn.jpg', verifiedAt: '2026-08-27' },
    ],
    preparations: ['提前通过官方渠道实名预约', '携带预约所用有效证件', '周一通常闭馆，节假日安排须另行核验', '展厅内容较多，建议预留完整 1.5 小时'],
    advisory: '官网当前公布周二至周日 8:30-18:30、18:00 停止入馆，并开放提前 7 日（含当天）预约。开放安排可能临时调整，出发前请再次核验。',
    officialUrl: 'https://www.hebeimuseum.org.cn/list-1-1.html',
    navigationUrl: 'https://uri.amap.com/search?keyword=%E6%B2%B3%E5%8C%97%E5%8D%9A%E7%89%A9%E9%99%A2',
    sources: [
      { title: '参观指南', publisher: '河北博物院', url: 'https://www.hebeimuseum.org.cn/list-1-1.html', verifiedAt: '2026-08-27' },
      { title: '抗日烽火——英雄河北陈列介绍', publisher: '河北博物院', url: 'https://www.hebeimuseum.org.cn/list-56-1.html', verifiedAt: '2026-08-27' },
    ],
    verifiedAt: '2026-08-27',
  },
  {
    id: 'xibaipo',
    name: '西柏坡革命旧址',
    shortName: '西柏坡',
    city: '石家庄市平山县',
    category: '革命旧址群',
    theme: '在旧址空间中理解“进京赶考”前的历史节点',
    tagline: '内容完整、需要专程安排的半日旧址行程',
    overview:
      '纪念馆与中共中央旧址共同构成核心参观体验，历史信息密集、院落点位较多，适合希望深入理解重大历史节点的游客。',
    coordinates: [113.95, 38.34],
    duration: '3-4 小时',
    intensity: '中',
    environment: '室内展馆 + 户外旧址',
    transitLabel: '市区专线 / 自驾',
    transitScore: 3,
    bestFor: '历史爱好者、研学团队、半日游客',
    mapStyle: 'campus',
    routeTitle: '纪念馆与中共中央旧址串联',
    routeNote: '先在纪念馆建立时间线，再进入旧址群对应实地空间。点位顺序为基于官方景点名录整理的建议路线。',
    guideMapSource: { label: '西柏坡纪念馆官方景点导览', url: 'https://www.xbpjng.cn/columns/0d5d335c-4ba5-4a57-b1d7-efe51e95674f/index.html' },
    gallery: placeholderGallery('xibaipo', '西柏坡', ['景区入口', '纪念馆外观', '中共中央旧址院落', '七届二中全会会址']),
    mapFeatures: [
      { id: 'visitor', label: '游客服务区', type: 'service', x: 8, y: 76 },
      { id: 'parking', label: '停车区域', type: 'parking', x: 10, y: 58 },
      { id: 'lake', label: '岗南水库方向', type: 'water', x: 88, y: 12 },
      { id: 'old-site-entry', label: '旧址群入口', type: 'entrance', x: 36, y: 64 },
    ],
    travelMap: {
      title: '石家庄至西柏坡抵达交通图',
      scope: '石家庄市区至平山县西柏坡',
      sourceNote: '依据西柏坡纪念馆官方旅游公交资料与公开地理位置重绘；班次、票价和当日运营须另行核验。',
      sourceLabel: '西柏坡纪念馆官方参观指南',
      sourceUrl: 'https://www.xbpjng.cn/columns/1f104a4c-cfc5-440a-93f1-ad289760b891/202406/04/c9af72e5-e376-47ff-9274-c195b8910db9.html',
      nodes: [
        { id: 'sjz-east', label: '石家庄站东广场', detail: '红色旅游专 1 路历史始发点', x: 12, y: 80 },
        { id: 'museum-stop', label: '河北博物院', detail: '红色旅游专 3 路历史途经点', x: 26, y: 62 },
        { id: 'pingshan', label: '平山县方向', detail: '进入西部山区', x: 55, y: 46 },
        { id: 'xibaipo', label: '西柏坡纪念馆', detail: '官方导览核心区域', x: 84, y: 24, primary: true },
      ],
      lines: [
        { id: 'tour-bus', label: '红色旅游公交方向', path: 'M12 80 C32 67 39 57 55 46 S73 31 84 24', mode: 'bus', caution: '只表达官方历史线路方向，不代表实时班次。' },
      ],
    },
    spots: [
      { id: 'xibaipo-1', order: 1, name: '西柏坡纪念馆', summary: '先用系统展陈建立历史背景。', detail: '作为全程的知识起点，建议完整浏览主要展陈，再进入旧址群。', transfer: '由游客服务区域步行进入', duration: '约 60-90 分钟', x: 18, y: 28 },
      { id: 'xibaipo-2', order: 2, name: '军委作战室', summary: '理解当年军事指挥工作的具体空间。', detail: '旧址空间尺度直观，适合把纪念馆中的历史信息与真实场景对应起来。', transfer: '由纪念馆步行进入旧址区', duration: '约 15 分钟', x: 42, y: 52 },
      { id: 'xibaipo-3', order: 3, name: '毛泽东同志旧居', summary: '查看工作与生活空间。', detail: '旧居参观应保持安静，并以现场开放区域和导引为准。', transfer: '院落间步行约 3 分钟', duration: '约 15 分钟', x: 62, y: 30 },
      { id: 'xibaipo-4', order: 4, name: '七届二中全会会址', summary: '本段路线的重点历史空间。', detail: '建议结合此前展陈理解会议背景、内容与“两个务必”的历史语境。', transfer: '院落间步行约 3 分钟', duration: '约 20 分钟', x: 78, y: 55 },
      { id: 'xibaipo-5', order: 5, name: '防空洞', summary: '按体力和现场开放情况选走的支线。', detail: '属于补充体验点，空间条件可能对行动不便游客不够友好。', transfer: '由旧址区步行往返', duration: '约 15 分钟', x: 67, y: 78, branch: true },
    ],
    arrivals: [
      { mode: '公共交通', title: '红色旅游专 1 路', detail: '官网信息显示可从石家庄火车站东广场前往，历史公布行程约 100 分钟。', caution: '班次与票价变化较快，不能仅凭本站信息候车，出发前必须向运营方核验。', sourceLabel: '西柏坡纪念馆公交与自驾指南', sourceUrl: 'https://www.xbpjng.cn/columns/1f104a4c-cfc5-440a-93f1-ad289760b891/202406/04/c9af72e5-e376-47ff-9274-c195b8910db9.html', verifiedAt: '2026-08-27' },
      { mode: '公共交通', title: '红色旅游专 3 路', detail: '官网历史信息显示线路途经河北博物院，适合考虑两地串联，公布行程约 120 分钟。', caution: '是否当日运行及停靠站点须另行确认。', sourceLabel: '西柏坡纪念馆公交与自驾指南', sourceUrl: 'https://www.xbpjng.cn/columns/1f104a4c-cfc5-440a-93f1-ad289760b891/202406/04/c9af72e5-e376-47ff-9274-c195b8910db9.html', verifiedAt: '2026-08-27' },
      { mode: '自驾', title: '导航至西柏坡纪念馆', detail: '自驾时间更可控，山区及景区周边路况以当日导航和交通管理为准。', sourceLabel: '西柏坡纪念馆公交与自驾指南', sourceUrl: 'https://www.xbpjng.cn/columns/1f104a4c-cfc5-440a-93f1-ad289760b891/202406/04/c9af72e5-e376-47ff-9274-c195b8910db9.html', verifiedAt: '2026-08-27' },
    ],
    preparations: ['至少按半日行程预留时间', '穿适合长时间步行的鞋', '分别核验纪念馆与旧址开放安排', '公共交通游客提前确认返程班次'],
    advisory: '公共交通专线信息易变，本站只提供路线选择思路，不承诺班次、票价或当日运营。请在出发前通过官方渠道再次确认。',
    officialUrl: 'https://www.xbpjng.cn/',
    navigationUrl: 'https://uri.amap.com/search?keyword=%E8%A5%BF%E6%9F%8F%E5%9D%A1%E7%BA%AA%E5%BF%B5%E9%A6%86',
    sources: [
      { title: '景点介绍与参观信息', publisher: '西柏坡纪念馆', url: 'https://www.xbpjng.cn/columns/05e5e36a-cf36-4690-b40d-f49d993d047a/index.html', verifiedAt: '2026-08-27' },
      { title: '红色旅游公交线路信息', publisher: '西柏坡纪念馆', url: 'https://www.xbpjng.cn/columns/1f104a4c-cfc5-440a-93f1-ad289760b891/202406/04/c9af72e5-e376-47ff-9274-c195b8910db9.html', verifiedAt: '2026-08-27' },
    ],
    verifiedAt: '2026-08-27',
  },
  {
    id: 'langya-mountain',
    name: '狼牙山',
    shortName: '狼牙山',
    city: '保定市易县',
    category: '山地纪念景区',
    theme: '沿山势重走五勇士战斗记忆',
    tagline: '自然景观与纪念空间结合的高强度行程',
    overview:
      '从五勇士陈列馆到纪念塔，历史叙事沿山地路线展开。天气、体力与返程安排会直接影响体验，适合做好准备后的专程游览。',
    coordinates: [115.02, 39.13],
    duration: '4-6 小时',
    intensity: '高',
    environment: '山地户外 + 室内展馆',
    transitLabel: '自驾更稳妥',
    transitScore: 2,
    bestFor: '体力较好游客、户外爱好者、完整一日行程',
    mapStyle: 'mountain',
    routeTitle: '从陈列馆到纪念塔的山地路线',
    routeNote: '路线按主要纪念点的空间与叙事关系整理；景区交通、步道开放和实际耗时受天气、体力与现场管理影响。',
    guideMapSource: { label: '狼牙山景区官方景点与服务资料', url: 'http://www.lysjq.net/' },
    gallery: placeholderGallery('langya', '狼牙山', ['山体全景', '五勇士陈列馆', '登山步道', '五勇士纪念塔']),
    mapFeatures: [
      { id: 'visitor', label: '游客中心', type: 'service', x: 9, y: 90 },
      { id: 'parking', label: '停车区域', type: 'parking', x: 7, y: 73 },
      { id: 'trail-entry', label: '登山步道入口', type: 'entrance', x: 27, y: 75 },
      { id: 'summit', label: '棋盘陀峰顶区域', type: 'summit', x: 72, y: 10 },
    ],
    travelMap: {
      title: '易县至狼牙山抵达交通图',
      scope: '易县城区至狼牙山游客中心',
      sourceNote: '依据景区游客中心位置与公开地图关系重绘；可靠公交班次未获核验，自驾路线以当日导航为准。',
      sourceLabel: '高德地图狼牙山景区地点页',
      sourceUrl: 'https://www.amap.com/place/BV11304055',
      nodes: [
        { id: 'yixian', label: '易县城区', detail: '县域交通换乘区域', x: 13, y: 78 },
        { id: 'country-road', label: '山区道路', detail: '注意天气与临时交通管理', x: 48, y: 55 },
        { id: 'visitor-center', label: '狼牙山游客中心', detail: '0312-8861888', x: 78, y: 30, primary: true },
      ],
      lines: [
        { id: 'car-route', label: '自驾主要方向', path: 'M13 78 C30 71 37 64 48 55 S68 39 78 30', mode: 'car' },
      ],
    },
    spots: [
      { id: 'langya-1', order: 1, name: '五勇士陈列馆', summary: '登山前先了解事件全貌。', detail: '官网介绍陈列馆设两个展厅、六个展室，建议先建立清楚的历史背景。', transfer: '由景区入口区域步行前往', duration: '官方建议 15-20 分钟', x: 20, y: 82 },
      { id: 'langya-2', order: 2, name: '雕塑广场', summary: '从室内叙事转入山地纪念空间。', detail: '适合短暂停留并确认后续登山路线、天气和体力状态。', transfer: '由陈列馆步行前往', duration: '约 10 分钟', x: 36, y: 66 },
      { id: 'langya-3', order: 3, name: '阻击战遗址', summary: '在地形中理解战斗环境。', detail: '山路行进时以现场安全指引为先，不为拍照离开开放步道。', transfer: '沿开放步道上行', duration: '随体力与现场路线变化', x: 54, y: 49 },
      { id: 'langya-4', order: 4, name: '将军岩', summary: '按开放情况和体力选择的支线。', detail: '支线会增加行程时间和体力消耗，返程时间紧张时建议跳过。', transfer: '由主游线按现场指引往返', duration: '以现场标识为准', x: 78, y: 56, branch: true },
      { id: 'langya-5', order: 5, name: '五勇士纪念塔', summary: '山地纪念路线的核心终点。', detail: '抵达后仍需为下山和返程预留充足时间，避免只计算上山耗时。', transfer: '沿开放步道继续上行', duration: '全程耗时因路线选择而异', x: 68, y: 20 },
    ],
    arrivals: [
      { mode: '公共交通', title: '公共交通需二次核验', detail: '地图平台可见附近公交站点，但没有足够可靠的官方班次资料支持本站承诺可当日抵达。', caution: '不要把未经确认的公交作为唯一去程或返程方案。', sourceLabel: '高德地图狼牙山景区地点页', sourceUrl: 'https://www.amap.com/place/BV11304055', verifiedAt: '2026-08-27' },
      { mode: '自驾', title: '自驾通常更可控', detail: '导航至狼牙山景区游客中心，山路、停车与临时交通管制以当日信息为准。', sourceLabel: '高德地图狼牙山景区地点页', sourceUrl: 'https://www.amap.com/place/BV11304055', verifiedAt: '2026-08-27' },
      { mode: '换乘提示', title: '提前安排返程', detail: '景区距离城市交通枢纽较远，应在入园前确定返程车辆与最晚离开时间。', sourceLabel: '狼牙山景区参观须知', sourceUrl: 'http://www.lysjq.net/xuzhi.html', verifiedAt: '2026-08-27' },
    ],
    preparations: ['根据天气准备防晒、防雨和饮水', '穿防滑且适合登山的鞋', '为下山和返程预留充足时间', '行动不便者提前咨询可达范围', '出发前致电 0312-8861888 核验开放情况'],
    advisory: '官网不同页面的开放时间存在冲突，因此本站不展示单一时间作为承诺。天气或山地安全管理也可能造成临时调整，出发前请联系景区核验。',
    officialUrl: 'http://www.lysjq.net/',
    navigationUrl: 'https://uri.amap.com/search?keyword=%E7%8B%BC%E7%89%99%E5%B1%B1%E6%99%AF%E5%8C%BA',
    sources: [
      { title: '景区景点与参观信息', publisher: '狼牙山景区', url: 'http://www.lysjq.net/', verifiedAt: '2026-08-27' },
      { title: '参观须知与游客中心信息', publisher: '狼牙山景区', url: 'http://www.lysjq.net/xuzhi.html', verifiedAt: '2026-08-27' },
    ],
    verifiedAt: '2026-08-27',
  },
]

export function getDestination(id: string | undefined): Destination | undefined {
  return destinations.find((destination) => destination.id === id)
}

export function isDestinationId(id: string): id is DestinationId {
  return destinations.some((destination) => destination.id === id)
}
