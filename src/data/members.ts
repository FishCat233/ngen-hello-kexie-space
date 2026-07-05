export interface MemberLink {
  title: string
  url: string
}

export interface Member {
  avatar: string
  nickname: string
  grade: string
  direction?: string
  role?: string
  themeColor?: string
  motto?: string
  links?: MemberLink[]
}

export const members: Member[] = [
  {
    avatar: 'https://github.com/fishcat233.png',
    nickname: 'FishCat233',
    grade: '2024级',
    direction: '深度学习',
    role: '24级技术副主席',
    themeColor: '#6b9de2',
    motto: '兴趣使然的 Programmer.',
    links: [
      { title: 'Github', url: 'https://github.com/FishCat233' },
      { title: 'Blog', url: 'https://www.aaafishcat.top/' },
      { title: 'Digital Garden', url: 'https://lib.aaafishcat.top/' },
    ],
  },
  {
    avatar: 'https://github.com/Concorde0.png',
    nickname: 'Concorde0',
    grade: '2024级',
    direction: '游戏开发',
    role: '24级财务副主席',
    themeColor: '#757575',
    links: [{ title: 'Github', url: 'https://github.com/Concorde0' }],
  },
  {
    avatar: 'https://github.com/XFuture0.png',
    nickname: 'XFuture0',
    grade: '2024级',
    direction: '前端开发',
    role: '24级组织部部长',
    themeColor: '#b3cef3',
    motto: 'Zzz...Zzz....Zzz...',
    links: [{ title: 'Github', url: 'https://github.com/XFuture0' }],
  },
  {
    avatar: 'https://github.com/Crypto1Long.png',
    nickname: 'Crypto1Long',
    grade: '2024级',
    direction: '密码学',
    role: '24级安全部部长',
    themeColor: '#d6bdc0',
    links: [{ title: 'Github', url: 'https://github.com/Crypto1Long' }],
  },
  {
    avatar: 'https://github.com/Sayb1e.png',
    nickname: 'Sayb1e',
    grade: '2025级',
    direction: '逆向工程&移动安全',
    role: '24级安全部副部长',
    themeColor: '#929292',
    links: [
      { title: 'Github', url: 'https://github.com/Sayb1e' },
      { title: 'Blog', url: 'http://sayble.xyz' },
    ],
  },
  {
    avatar: 'https://github.com/Yiyue345.png',
    nickname: 'Yiyue345',
    grade: '2024级',
    direction: 'APP开发',
    role: '24级赛事副主席',
    motto: '又活一天……',
    themeColor: '#6e91c1',
    links: [{ title: 'Github', url: 'https://github.com/Yiyue345' }],
  },
  {
    avatar: 'https://github.com/mengzhongyi11.png',
    nickname: 'mengzhongyi11',
    grade: '2024级',
    direction: '前端开发',
    role: '24级多媒体部部长',
    themeColor: '#c9ad7e',
    links: [{ title: 'Github', url: 'https://github.com/mengzhongyi11' }],
  },
  {
    avatar: 'https://github.com/MyGO-Mujica.png',
    nickname: 'MyGO-Mujica',
    grade: '2024级',
    direction: '前端开发',
    role: '24级多媒体部成员',
    themeColor: '#ada08e',
    motto: '枚举占据大脑，暴力替代思考',
    links: [{ title: 'Github', url: 'https://github.com/MyGO-Mujica' }],
  },
  {
    avatar: 'https://github.com/shiroe120.png',
    nickname: 'shiroe',
    grade: '2024级',
    direction: 'APP开发',
    role: '24级软件部成员',
    themeColor: '#2e2b2a',
    links: [{ title: 'Github', url: 'https://github.com/shiroe120' }],
  },
  {
    avatar: 'https://github.com/roselle-luo.png',
    nickname: 'RoselleLuo',
    grade: '2023级',
    direction: 'APP开发',
    role: '23级技术副主席',
    themeColor: '#282a35',
    links: [{ title: 'Github', url: 'https://github.com/roselle-luo' }],
  },
  {
    avatar: 'https://github.com/wilinz.png',
    nickname: 'wilinz',
    grade: '2022级',
    direction: 'APP开发',
    role: '22级技术副主席',
    links: [{ title: 'Github', url: 'https://github.com/wilinz' }],
  },
]

/**
 * 按年级分组，新在前
 */
export function getMembersByGrade(): { grade: string; members: Member[] }[] {
  const groups = new Map<string, Member[]>()

  for (const m of members) {
    const list = groups.get(m.grade) || []
    list.push(m)
    groups.set(m.grade, list)
  }

  // 按年级降序排列
  return Array.from(groups.entries())
    .sort((a, b) => {
      const aYear = parseInt(a[0])
      const bYear = parseInt(b[0])
      return bYear - aYear
    })
    .map(([grade, members]) => ({ grade, members }))
}
