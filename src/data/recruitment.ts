// 招新时间线。生产环境由 PocketBase `recruitment` 集合提供，
// 这里的静态内容作为 CMS 不可用时的兜底（开发环境也直接用它）
export interface RecruitmentStage {
  id: string
  title: string
  time: string
  description: string
}

export const recruitmentStages: RecruitmentStage[] = [
  {
    id: 'register',
    title: '报名阶段',
    time: '9 月上旬',
    description: '报名时间截止到笔试前',
  },
  {
    id: 'learning',
    title: '入门学习',
    time: '9 月中 – 9 月下旬',
    description: '学会使用 Online Judge 实现问题求解',
  },
  {
    id: 'presentation',
    title: '招新宣讲',
    time: '9 月下旬',
    description: '三院科协招新宣讲会',
  },
  {
    id: 'exam',
    title: '笔试和面试',
    time: '10 月中旬',
    description: '期待脱颖而出的你！',
  },
  {
    id: 'competition',
    title: '绘蓝杯科技竞赛',
    time: '11 月 – 12 月',
    description: '绽放你们的光芒！',
  },
]
