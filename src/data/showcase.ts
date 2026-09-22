// 部门风貌合照。照片由 PocketBase `showcase` 集合托管（管理员在 /_/ 后台上传），
// 仓库不存放图片；CMS 不可用时的兜底只有占位幻灯片，没有图片
export interface ShowcaseSlide {
  id: string
  label: string
  src?: string
  color?: string
}

export const showcaseSlides: ShowcaseSlide[] = Array.from({ length: 9 }, (_, i) => ({
  id: `showcase-${String(i + 1).padStart(2, '0')}`,
  label: `部门合照 ${i + 1}`,
}))
