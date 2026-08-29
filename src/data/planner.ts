import type { PlanningConnection, PlanningDataset, PlanningPlace, TravelBase } from '../types/planner'

const verifiedAt = '2026-08-29'
const osrmDocs = 'https://project-osrm.org/docs/v5.24.0/api/#route-service'
const xibaipoTransit = 'https://www.xbpjng.cn/columns/1f104a4c-cfc5-440a-93f1-ad289760b891/202406/04/c9af72e5-e376-47ff-9274-c195b8910db9.html'
const ranzhuangOfficial = 'http://www.xn--z6qr1l12gz0dys0f.cn/'
const langyaOfficial = 'http://www.lysjq.net/xuzhi.html'
const museumOfficial = 'https://www.hebeimuseum.org.cn/list-1-1.html'

export const planningPlaces: PlanningPlace[] = [
  {
    id: 'hebei-museum', name: '河北博物院', intensity: 1,
    opening: { openWeekdays: [0, 2, 3, 4, 5, 6], openMinute: 9 * 60, closeMinute: 17 * 60, lastEntryMinute: 16 * 60 + 30 },
    visitMinutes: { relaxed: 150, standard: 120, compact: 90 },
    mealArea: '河北博物院周边石家庄市区', mealNote: '馆内不作为默认正餐点；自驾游客先确认周边合规停车，再选择步行可达的城市餐饮区域。',
    preferredStayBaseId: 'shijiazhuang',
    openingSource: { label: '河北博物院开放时间调整公告', url: 'https://www.hebeimuseum.org.cn/show-79-12311-1.html' },
    preparations: ['提前通过官方渠道实名预约', '携带预约所用有效证件', '自驾不要默认院内有停车位'],
    comparison: {
      visitWindow: '约 1.5-2.5 小时，室内低强度', transport: '地铁最便利；院内无对外停车场',
      booking: '实名分时预约，通常提前 7 日开放', fit: '亲子、长者、城市短途游客',
      limitation: '官网开放时间存在冲突，规划按较早闭馆边界保守计算',
    },
  },
  {
    id: 'xibaipo', name: '西柏坡', intensity: 2,
    opening: { openWeekdays: [0, 2, 3, 4, 5, 6], openMinute: 9 * 60, closeMinute: 17 * 60, lastEntryMinute: 16 * 60 + 30 },
    visitMinutes: { relaxed: 240, standard: 210, compact: 180 },
    mealArea: '西柏坡景区 / 红旅小镇周边', mealNote: '景区官方提供住宿餐饮咨询入口，但具体营业、候位和接待能力仍需当天核验。',
    preferredStayBaseId: 'shijiazhuang',
    openingSource: { label: '西柏坡开放时间调整公告', url: 'https://www.xbpjng.cn/columns/0375790e-cdc7-4220-89d6-a849d6fc8a1f/202506/25/eaa43e42-aa67-4e57-9f82-457d0733c9fe.html' },
    preparations: ['通过“西柏坡纪念馆”微信公众号实名预约', '穿适合长时间步行的鞋', '公共交通游客提前确认去返程班次'],
    comparison: {
      visitWindow: '约 3-4 小时，室内外中等强度', transport: '自驾较稳；石家庄有历史旅游专线关系',
      booking: '微信公众号实名预约', fit: '历史爱好者、研学团队、半日游客',
      limitation: '公交班次与返程容易变化，不能仅凭本站时间候车',
    },
  },
  {
    id: 'langya-mountain', name: '狼牙山', intensity: 3,
    opening: { openWeekdays: [0, 1, 2, 3, 4, 5, 6], openMinute: 8 * 60, closeMinute: 17 * 60, lastEntryMinute: 16 * 60 + 30 },
    visitMinutes: { relaxed: 330, standard: 270, compact: 210 },
    mealArea: '狼牙山山脚游客服务区或易县城区', mealNote: '山脚有官方确认的服务承接，但营业和接待量需核验；登山前优先准备饮水与简餐。',
    preferredStayBaseId: 'yixian',
    openingSource: { label: '狼牙山景区参观须知', url: langyaOfficial },
    preparations: ['核验天气、索道和步道开放状态', '携带饮水、防晒与防滑鞋', '为下山和山区末段交通预留余量'],
    comparison: {
      visitWindow: '约 3.5-5.5 小时，山地高强度', transport: '自驾适配度高；公共交通末段资料不足',
      booking: '景区与展馆规则分别核验', fit: '体力较好、重视户外体验的游客',
      limitation: '天气、步道、索道及景区与展馆时段都可能影响行程',
    },
  },
  {
    id: 'ranzhuang-tunnel', name: '冉庄地道战纪念馆', intensity: 2,
    opening: { openWeekdays: [0, 2, 3, 4, 5, 6], openMinute: 9 * 60, closeMinute: 16 * 60 + 30, lastEntryMinute: 16 * 60 },
    visitMinutes: { relaxed: 180, standard: 150, compact: 120 },
    mealArea: '清苑城区或保定市区', mealNote: '纪念馆周边不作为稳定正餐落点；建议自备饮水和简餐，把正餐前移或后移到城区。',
    preferredStayBaseId: 'baoding',
    openingSource: { label: '冉庄地道战纪念馆官网', url: ranzhuangOfficial },
    preparations: ['通过官方微信公众号完成预约核验', '评估对狭窄、低矮地下空间的适应程度', '按现场指引进入开放地道段'],
    comparison: {
      visitWindow: '约 2-3 小时，地下空间中等强度', transport: '自驾较稳；保定方向班车需人工核验',
      booking: '官方微信公众号预约', fit: '希望结合展陈与真实遗址空间的游客',
      limitation: '地道开放长度、通行方向及节假日规则以现场为准',
    },
  },
]

export const travelBases: TravelBase[] = [
  { id: 'shijiazhuang', label: '石家庄市区', stayReason: '衔接河北博物院与西柏坡，并便于预约、补给和乘坐城市交通。', mealStrategy: '优先选择次日出发节点附近的城市餐饮区域。', coordinates: [114.5149, 38.0428], sourceLabel: '河北博物院参观指南', sourceUrl: museumOfficial },
  { id: 'baoding', label: '保定市区', stayReason: '作为石家庄片区与冉庄、狼牙山之间的城市级中转，减少跨区往返。', mealStrategy: '在城市区域解决正餐，不把景区周边供应视为必然可用。', coordinates: [115.4646, 38.8739], sourceLabel: '冉庄纪念馆交通信息', sourceUrl: ranzhuangOfficial },
  { id: 'yixian', label: '易县城区', stayReason: '靠近狼牙山，可把山地景区的长距离通勤移到前一日。', mealStrategy: '进山前或离山后在县城补给，具体营业与停车当天核验。', coordinates: [115.4975, 39.349], sourceLabel: '易县人民政府“走进易县”', sourceUrl: 'https://www.bdyixian.gov.cn/col/1673576923402/index.html' },
]

function car(from: PlanningConnection['from'], to: PlanningConnection['to'], durationMinutes: [number, number], distanceKm: [number, number] | undefined, via: string[], sourceUrl = osrmDocs, constraints: string[] = []): PlanningConnection {
  return { from, to, mode: 'car', durationMinutes, distanceKm, via, constraints: ['实时路况、停车和临时管制以出发当日导航为准', ...constraints], sourceLabel: 'OSRM / OpenStreetMap 静态路线基线', sourceUrl, verifiedAt, bidirectional: true }
}

export const planningConnections: PlanningConnection[] = [
  car('hebei-museum', 'xibaipo', [65, 90], [85, 95], ['石家庄市区', '京昆高速 G5 / 西柏坡高速 S71']),
  car('hebei-museum', 'langya-mountain', [165, 200], [190, 210], ['京昆高速 G5', 'G336 / Y116'], osrmDocs, ['山区末段需额外关注天气']),
  car('hebei-museum', 'ranzhuang-tunnel', [95, 120], [120, 130], ['S9902 / 京港澳高速 G4', 'G107 / S335']),
  car('xibaipo', 'langya-mountain', [160, 195], [195, 210], ['G207', 'S75 / G1812 / G18', 'Y116'], osrmDocs, ['两端均含郊区或山区末段']),
  car('xibaipo', 'ranzhuang-tunnel', [140, 175], [180, 200], ['S71 / G5', 'G2002 / G4', 'S335']),
  car('langya-mountain', 'ranzhuang-tunnel', [110, 145], [100, 120], ['Y116 / G336', 'G5 / G107', 'S335'], osrmDocs, ['山区末段与保定片区道路需留缓冲']),

  car('shijiazhuang', 'hebei-museum', [15, 35], undefined, ['石家庄市区道路'], museumOfficial, ['河北博物院无对外停车场']),
  car('shijiazhuang', 'xibaipo', [80, 110], [80, 95], ['京昆高速 G5 / 西柏坡高速 S71'], xibaipoTransit),
  car('shijiazhuang', 'ranzhuang-tunnel', [95, 125], [120, 135], ['G4', 'S335'], ranzhuangOfficial),
  car('shijiazhuang', 'langya-mountain', [165, 205], [190, 215], ['G5', 'G336 / Y116'], langyaOfficial, ['不适合与完整登山行程压缩']),
  car('baoding', 'hebei-museum', [100, 130], [125, 140], ['G4 / S9902', '石家庄市区道路']),
  car('baoding', 'xibaipo', [135, 175], [160, 190], ['G4 / G2002', 'G5 / S71']),
  car('baoding', 'ranzhuang-tunnel', [45, 70], [35, 50], ['G107 / S335'], ranzhuangOfficial),
  car('baoding', 'langya-mountain', [80, 115], [65, 85], ['G336', 'Y116'], langyaOfficial, ['山区末段需额外关注天气']),
  car('yixian', 'langya-mountain', [35, 60], [35, 50], ['G336 / Y116'], langyaOfficial),
  car('yixian', 'ranzhuang-tunnel', [90, 125], [85, 110], ['G5 / G107', 'S335'], ranzhuangOfficial),
  car('yixian', 'hebei-museum', [175, 215], [190, 215], ['G5', '石家庄市区道路']),
  car('yixian', 'xibaipo', [150, 190], [175, 205], ['G5 / S75', 'G207']),

  { from: 'hebei-museum', to: 'xibaipo', mode: 'public-transit', durationMinutes: [120, 150], distanceKm: [85, 95], via: ['红色旅游专 3 路历史线路关系'], constraints: ['当日运营、发车时间、站位与返程余位必须电话核验', '本站不承诺班次或票价'], sourceLabel: '西柏坡纪念馆乘车及自驾游', sourceUrl: xibaipoTransit, verifiedAt },
  { from: 'shijiazhuang', to: 'hebei-museum', mode: 'public-transit', durationMinutes: [20, 45], via: ['石家庄城市公共交通', '博物院站'], constraints: ['具体发车地不同，时间仅作城市接驳范围'], sourceLabel: '河北博物院参观指南', sourceUrl: museumOfficial, verifiedAt, bidirectional: true },
  { from: 'shijiazhuang', to: 'xibaipo', mode: 'public-transit', durationMinutes: [100, 140], via: ['红色旅游专线历史线路关系'], constraints: ['去程与返程的当日运营、发车时间、站位和余位必须电话核验'], sourceLabel: '西柏坡纪念馆乘车及自驾游', sourceUrl: xibaipoTransit, verifiedAt, bidirectional: true },
]

export const planningDataset: PlanningDataset = { places: planningPlaces, bases: travelBases, connections: planningConnections }
