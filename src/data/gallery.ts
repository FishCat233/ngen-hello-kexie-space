export interface GalleryItem {
  id: string
  type: 'image' | 'link' | 'iframe'
  src: string
  title: string
  description: string
  category: GalleryCategory
  date: string
  url?: string
}

export type GalleryCategory = 'all' | 'image' | 'project' | 'blog' | 'other'

export interface CategoryInfo {
  id: GalleryCategory
  label: string
}

export const categories: CategoryInfo[] = [
  { id: 'all', label: '全部' },
  { id: 'image', label: '图片' },
  { id: 'project', label: '项目' },
  { id: 'blog', label: '博客' },
  { id: 'other', label: '其他' },
]

export const galleryItems: GalleryItem[] = [
  {
    id: '1',
    type: 'link',
    src: '/gallery/www-guethub-net.webp',
    title: 'GUET 校园圈',
    description: '学长倾力打造 · 告别APP切换，一站式校园服务 | GUET校园圈（GUETHUB）.',
    url: 'https://www.guethub.net/',
    category: 'project',
    date: '2026-05-05',
  },
  {
    id: '2',
    type: 'iframe',
    src: '/gallery/miku-kexie-space.webp',
    title: 'Mikutap',
    url: 'https://miku.kexie.space/',
    description: '一个有趣的音乐互动网站',
    category: 'project',
    date: '2026-05-05',
  },
  {
    id: '3',
    type: 'iframe',
    src: '/gallery/kill-kexie-space.webp',
    url: 'https://kill.kexie.space/',
    title: 'Kill',
    description: '科协游戏开发方向黄家超，廖卓喆，蒲一帆合作开发作品',
    category: 'project',
    date: '2026-05-05',
  },
  {
    id: '4',
    type: 'iframe',
    src: '/gallery/sword-kexie-space.webp',
    url: 'https://sword.kexie.space/',
    title: 'Sword',
    description: '科协游戏开发方向李一奔的作品 ',
    category: 'project',
    date: '2026-05-05',
  },
  {
    id: '5',
    type: 'iframe',
    src: '/gallery/steal-kun-kexie-space.webp',
    url: 'https://steal-kun.kexie.space/',
    title: 'Steal Kun',
    description: '科协游戏开发方向蒲一帆的作品',
    category: 'project',
    date: '2026-05-05',
  },
  {
    id: '6',
    type: 'link',
    src: '/gallery/ml-akasaki-space.webp',
    url: 'https://ml.akasaki.space/',
    title: '工具箱的深度學習記事簿',
    description:
      '工具箱在入门基于深度学习技术的计算机视觉的过程中，将阅读到的、总结的、写下的各种有助于学习的内容放入这个笔记本，希望这份笔记对你也有用。',
    category: 'blog',
    date: '2026-05-05',
  },
  {
    id: '7',
    type: 'link',
    src: '/gallery/cp-therainisme-com.webp',
    url: 'https://cp.therainisme.com/',
    title: 'CottonPaper',
    description: '一些可以用来垫桌角的纸.',
    category: 'blog',
    date: '2026-05-05',
  },
  {
    id: '8',
    type: 'link',
    src: '/gallery/www-aaafishcat-top.webp',
    url: 'https://www.aaafishcat.top/',
    title: "FishCat233's Blog",
    description:
      'FishCat233 个人博客。在这里将分享关于技术、生活、创作等各种领域的一些见解和经验。',
    category: 'blog',
    date: '2026-05-05',
  },
]

export function filterItemsByCategory(
  items: GalleryItem[],
  category: GalleryCategory,
): GalleryItem[] {
  if (category === 'all') {
    return items
  }
  return items.filter((item) => item.category === category)
}

export function getImageItems(items: GalleryItem[]): GalleryItem[] {
  return items.filter((item) => item.type === 'image')
}
