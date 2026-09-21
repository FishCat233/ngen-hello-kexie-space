// 24级主席团名单（来源：科协24级主席团公布海报）
export type PresidiumGroup =
  | 'board'
  | 'multimedia'
  | 'software'
  | 'hardware'
  | 'organize'
  | 'security'

export interface PresidiumMember {
  name: string
  title: string
  /** 分组：board = 主席团本部；其余为部门归属（头像配色用） */
  group: PresidiumGroup
  /** 头像照片 URL；暂缺时回退姓氏色块头像 */
  avatar?: string
}

// 头像配色：主席团本部用主题蓝，各部长按部门专属色（与首屏药丸同一套色板）
export const presidiumAvatarColors: Record<PresidiumGroup, { bg: string; text: string }> = {
  board: { bg: '#3b82f6', text: '#172554' },
  multimedia: { bg: '#22d3ee', text: '#164e63' },
  software: { bg: '#a78bfa', text: '#4c1d95' },
  hardware: { bg: '#fb923c', text: '#7c2d12' },
  organize: { bg: '#34d399', text: '#065f46' },
  security: { bg: '#f87171', text: '#7f1d1d' },
}

export const PRESIDIUM_CHAIR: PresidiumMember = {
  name: '孙培正',
  title: '主席',
  group: 'board',
}

export const PRESIDIUM_MEMBERS: PresidiumMember[] = [
  { name: '刘宁宇', title: '财务副主席', group: 'board' },
  { name: '邓远翔', title: '赛事副主席', group: 'board' },
  { name: '谭炜', title: '技术副主席', group: 'board' },
  { name: '王玉豪', title: '组织部部长', group: 'organize' },
  { name: '张宇', title: '软件部部长', group: 'software' },
  { name: '郑承睿', title: '软件部副部长', group: 'software' },
  { name: '杨志远', title: '硬件部部长', group: 'hardware' },
  { name: '刘星宇', title: '硬件部副部长', group: 'hardware' },
  { name: '蒙仲毅', title: '多媒体部部长', group: 'multimedia' },
  { name: '代栩潼', title: '多媒体部副部长', group: 'multimedia' },
  { name: '甘华龙', title: '安全部部长', group: 'security' },
  { name: '蓝弘毅', title: '安全部副部长', group: 'security' },
]
