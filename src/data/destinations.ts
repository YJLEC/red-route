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
    opening: {
      status: 'conflicting',
      regularDays: '周二至周日',
      openWeekdays: [0, 2, 3, 4, 5, 6],
      periods: [
        { label: '2026-03-12 调整公告', openTime: '09:00', closeTime: '17:00', lastEntryTime: '16:30' },
        { label: '官网当前服务页', openTime: '08:30', closeTime: '18:30', lastEntryTime: '18:00' },
      ],
      closedDays: ['周一（法定节假日另行公告）'],
      reservation: '实名限额、分时段预约；通常提前 7 日开放',
      exceptions: '官网两处当前信息不一致。规划时按 09:00-17:00、16:30 停止入馆留出保守余量，但这不是对官方冲突的裁决；具体展厅也可能临时调整。',
      sources: [
        { label: '开放时间调整公告', url: 'https://www.hebeimuseum.org.cn/show-79-12311-1.html' },
        { label: '当前参观服务页', url: 'https://www.hebeimuseum.org.cn/list-1-1.html' },
      ],
      verifiedAt: '2026-08-29',
    },
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
    opening: {
      status: 'confirmed',
      regularDays: '周二至周日',
      openWeekdays: [0, 2, 3, 4, 5, 6],
      periods: [
        { label: '夏季（5 月 1 日至 10 月 31 日）', openTime: '09:00', closeTime: '17:00', lastEntryTime: '16:30' },
        { label: '冬季（11 月 1 日至次年 4 月 30 日）', openTime: '09:30', closeTime: '17:00', lastEntryTime: '16:30' },
      ],
      closedDays: ['周一（法定节假日除外）'],
      reservation: '通过“西柏坡纪念馆”微信公众号实名预约',
      exceptions: '暴雨、检修和法定节假日可能覆盖常规日历；本时段直接对应纪念馆，旧址群内单体空间仍以现场开放标识为准。',
      sources: [
        { label: '开放时间调整公告', url: 'https://www.xbpjng.cn/columns/0375790e-cdc7-4220-89d6-a849d6fc8a1f/202506/25/eaa43e42-aa67-4e57-9f82-457d0733c9fe.html' },
        { label: '西柏坡参观指南', url: 'https://www.xbpjng.cn/columns/1f104a4c-cfc5-440a-93f1-ad289760b891/202406/04/1bd56ab7-4784-4d35-bcc2-29eb6b5db8e3.html' },
      ],
      verifiedAt: '2026-08-29',
    },
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
    opening: {
      status: 'conflicting',
      regularDays: '景区官网列示周一至周日；天气和安全管理可能临时调整',
      openWeekdays: [0, 1, 2, 3, 4, 5, 6],
      periods: [
        { label: '景区夏季 · 官网首页', openTime: '07:20', closeTime: '17:30' },
        { label: '景区夏季 · 参观须知', openTime: '07:20', closeTime: '17:00', lastEntryTime: '17:00' },
        { label: '景区冬季 · 官网首页', openTime: '08:00', closeTime: '16:00' },
        { label: '景区冬季 · 参观须知', openTime: '07:50', closeTime: '16:30', lastEntryTime: '16:30' },
        { label: '五勇士陈列馆', openTime: '09:00', closeTime: '17:00', lastEntryTime: '16:30' },
      ],
      closedDays: ['官网未列固定闭馆日'],
      reservation: '陈列馆凭有效证件入馆；集体参观提前预约',
      exceptions: '官网没有说明夏冬季日期边界，且两个页面的景区时段冲突。登山、天气和步道管理还会改变实际可游范围，必须在出发前核验。',
      sources: [
        { label: '狼牙山景区官网首页', url: 'http://www.lysjq.net/' },
        { label: '五勇士陈列馆参观须知', url: 'http://www.lysjq.net/xuzhi.html' },
      ],
      verifiedAt: '2026-08-29',
    },
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
  {
    id: 'ranzhuang-tunnel',
    name: '冉庄地道战纪念馆',
    shortName: '冉庄',
    city: '保定市清苑区',
    category: '地道战遗址与纪念馆',
    theme: '从展厅进入真实地下空间，理解冀中平原地道战体系',
    tagline: '展陈、地道与村落遗址连成一体的空间体验',
    overview:
      '完整参观由新馆展厅、开放地道段和村落遗址保护区三部分组成。这里最鲜明的体验不是观看单一展柜，而是把地下通道、地面工事和村落环境联系起来理解。',
    coordinates: [115.36325, 38.66887],
    duration: '建议 2-3 小时',
    intensity: '中',
    environment: '室内展陈 + 狭窄地道 + 村落遗址',
    transitLabel: '自驾更稳妥 / 客运需核验',
    transitScore: 2,
    bestFor: '历史体验游客、研学团队、愿意进入地下空间的家庭游客',
    opening: {
      status: 'confirmed',
      regularDays: '周二至周日',
      openWeekdays: [0, 2, 3, 4, 5, 6],
      periods: [
        { label: '常规时段', openTime: '09:00', closeTime: '16:30', lastEntryTime: '16:30' },
      ],
      closedDays: ['周一闭馆整修（法定节假日另行公告）'],
      reservation: '官方公众号预约；身份证或预约二维码核验',
      exceptions: '16:30 同时被官方写作清场闭馆和停止进入时间，网站不虚构额外清场时段；节假日可能另行开放，地道等具体区域也可能临时关闭。',
      sources: [
        { label: '纪念馆常规开放公告', url: 'https://mp.weixin.qq.com/s?__biz=MzIxNjMzMzE2Nw%3D%3D&mid=2247498460&idx=1' },
        { label: '清苑文旅 2026 春节须知', url: 'https://mp.weixin.qq.com/s?__biz=Mzg4MTUxNTI3NQ%3D%3D&mid=2247501931&idx=1' },
      ],
      verifiedAt: '2026-08-29',
    },
    mapStyle: 'village',
    routeTitle: '从展厅进入地道，再到村落遗址',
    routeNote: '以下只表达官方文字确认的三部分连接关系，不代表当前开放地道的逐点导航；入口、出口和开放范围以现场指引为准。',
    guideMapSource: {
      label: '河北省文旅厅冉庄地道战专题资料',
      url: 'http://hbhsly.hebeitour.gov.cn/index.php?c=news&a=detail&id=160&cat_id=2',
    },
    gallery: placeholderGallery('ranzhuang', '冉庄地道战纪念馆', ['纪念馆入口', '主题展厅', '开放地道段', '村落遗址保护区']),
    mapFeatures: [
      { id: 'museum-entry', label: '纪念馆入口', type: 'entrance', x: 12, y: 24 },
      { id: 'check-in', label: '预约核验与安检', type: 'service', x: 13, y: 43 },
      { id: 'protected-area', label: '遗址保护区', type: 'landmark', x: 83, y: 72 },
      { id: 'cross-street', label: '十字街区域', type: 'landmark', x: 82, y: 37 },
    ],
    travelMap: {
      title: '保定市区至冉庄抵达关系图',
      scope: '保定市区经清苑方向至冉庄镇',
      sourceNote: '依据河北省文旅专题和公开参观攻略重绘区域关系；城乡客运没有当前运营方班次，不能据此直接候车。',
      sourceLabel: '河北省文旅厅专题与冉庄参观攻略',
      sourceUrl: 'http://hbhsly.hebeitour.gov.cn/index.php?c=news&a=detail&id=160&cat_id=2',
      nodes: [
        { id: 'baoding', label: '保定市区', detail: '城市交通与住宿落点', x: 13, y: 76 },
        { id: 'qingyuan', label: '清苑方向', detail: '京港澳高速清苑出口区域', x: 47, y: 55 },
        { id: 'ranzhuang-town', label: '冉庄镇', detail: '进入村落道路', x: 70, y: 39 },
        { id: 'ranzhuang', label: '冉庄地道战纪念馆', detail: '预约核验后入馆', x: 84, y: 23, primary: true },
      ],
      lines: [
        { id: 'ranzhuang-car', label: '自驾区域关系', path: 'M13 76 C28 69 37 62 47 55 S62 45 70 39 S79 29 84 23', mode: 'car', caution: '节假日停车与摆渡按当期公告执行。' },
      ],
    },
    spots: [
      { id: 'ranzhuang-1', order: 1, name: '展厅序厅', summary: '先建立冀中平原地道战的背景。', detail: '展厅以“抗战奇观，地下长城”为主题，建议先理解地道形成、发展和地上地下联防方式，再进入真实空间。', transfer: '由纪念馆入口完成预约核验与安检后进入', duration: '建议约 15 分钟', x: 20, y: 27 },
      { id: 'ranzhuang-2', order: 2, name: '冀中地道战主题展陈', summary: '用文物、照片和图表理解地道战体系。', detail: '展陈以冉庄地道战为重点；完整浏览后再进入地道，可减少只把地下空间当作新奇体验的偏差。', transfer: '由序厅步行进入主题展陈', duration: '建议约 30-45 分钟', x: 40, y: 27 },
      { id: 'ranzhuang-3', order: 3, name: '展厅内地道入口', summary: '从展厅直接进入村内地道网。', detail: '这是官方资料明确支持的关键空间连接。进入前应评估行动能力和对狭窄封闭空间的适应程度。', transfer: '按现场工作人员指引进入', duration: '约 5 分钟', x: 49, y: 48 },
      { id: 'ranzhuang-4', order: 4, name: '开放地道体验段', summary: '在真实尺度中理解地下通行与防御。', detail: '一般地道宽约 0.7-0.8 米、高约 1-1.5 米。当前开放长度、通行方向和出口必须以现场管理为准。', transfer: '沿当日开放地道段通行', duration: '随开放路线和客流变化', x: 65, y: 67 },
      { id: 'ranzhuang-5', order: 5, name: '遗址保护区与十字街', summary: '回到地面理解村落工事与地道联动。', detail: '保护区保留街道作战工事、抗日标语、伪装地道口主题和十字街古槐等遗址，不要离开开放区域寻找未开放入口。', transfer: '由地道出口按现场导引进入保护区', duration: '建议约 45-60 分钟', x: 82, y: 54 },
    ],
    arrivals: [
      { mode: '公共交通', title: '先到保定，再核验城乡客运', detail: '历史攻略提到保定至周边乡镇方向班车，但没有运营方当前站点、班次、票价和购票页面。', caution: '不要把未经确认的城乡客运作为唯一去程或返程方案。', sourceLabel: '冉庄地道战纪念馆参观攻略', sourceUrl: 'https://m.bd.bendibao.com/tour/33793.shtm', verifiedAt: '2026-08-29' },
      { mode: '自驾', title: '经清苑方向前往冉庄镇', detail: '河北省文旅资料显示遗址距京港澳高速清苑出口约 19 公里，适合用作区域方向判断，实际道路以当日导航为准。', sourceLabel: '河北省文旅厅冉庄地道战专题资料', sourceUrl: 'http://hbhsly.hebeitour.gov.cn/index.php?c=news&a=detail&id=160&cat_id=2', verifiedAt: '2026-08-29' },
      { mode: '换乘提示', title: '节假日停车与摆渡不是常态服务', detail: '2026 年春节和五一曾使用外围应急停车场与免费摆渡车，但地点和组织方式属于当期临时安排。', caution: '节假日出发前先查看最新交通公告，不要照搬往期停车方案。', sourceLabel: '2026 年五一参观攻略', sourceUrl: 'https://m.bd.bendibao.com/tour/36138.shtm', verifiedAt: '2026-08-29' },
    ],
    preparations: ['提前通过官方公众号确认预约规则并准备身份证或预约二维码', '穿便于步行和弯腰的鞋服', '老人和儿童进入地道段时由同行人员全程照看', '行动不便或对封闭空间敏感者可跳过地道段', '节假日自驾先核验临时停车与交通管制'],
    advisory: '2026 年春节、五一公告均采用预约制，开放时段为 9:00-16:30，并在 16:30 停止游客进入；常规周一闭馆仍主要依据 2025 年资料，节假日可能另行开放。出发前请通过“冉庄地道战纪念馆”公众号或服务电话 0312-8036558、0312-8036158 核验。',
    officialUrl: 'http://www.xn--z6qr1l12gz0dys0f.cn/',
    navigationUrl: 'https://uri.amap.com/search?keyword=%E5%86%89%E5%BA%84%E5%9C%B0%E9%81%93%E6%88%98%E7%BA%AA%E5%BF%B5%E9%A6%86',
    sources: [
      { title: '纪念馆官网与参观须知', publisher: '保定市清苑区冉庄地道战纪念馆', url: 'http://www.xn--z6qr1l12gz0dys0f.cn/', verifiedAt: '2026-08-29' },
      { title: '冉庄地道战专题资料', publisher: '河北省文化和旅游厅', url: 'http://hbhsly.hebeitour.gov.cn/index.php?c=news&a=detail&id=160&cat_id=2', verifiedAt: '2026-08-29' },
      { title: '2026 年春节假期参观须知', publisher: '冉庄地道战纪念馆（转载）', url: 'https://m.bd.bendibao.com/tour/35591.shtm', verifiedAt: '2026-08-29' },
      { title: '2026 年五一假期参观攻略', publisher: '冉庄地道战纪念馆（转载）', url: 'https://m.bd.bendibao.com/tour/36138.shtm', verifiedAt: '2026-08-29' },
    ],
    verifiedAt: '2026-08-29',
  },
]

const homeDestinationIds: DestinationId[] = ['hebei-museum', 'xibaipo', 'langya-mountain']

export const homeDestinations = homeDestinationIds.map((id) => {
  const destination = destinations.find((item) => item.id === id)
  if (!destination) throw new Error(`首页目的地数据缺失：${id}`)
  return destination
})

export function getDestination(id: string | undefined): Destination | undefined {
  return destinations.find((destination) => destination.id === id)
}

export function isDestinationId(id: string): id is DestinationId {
  return destinations.some((destination) => destination.id === id)
}
