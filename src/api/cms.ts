import type { Member } from '../data/members'
import type { CompetitionProject, Project } from '../data/projects'
import type { GalleryItem } from '../data/gallery'

type PocketBaseRecord = {
  id: string
  [key: string]: unknown
}

export type CmsResult<T> = {
  data: T
  source: 'cms' | 'fallback'
  error?: Error
}

const pocketBaseUrl = (import.meta.env.VITE_POCKETBASE_URL || '').replace(/\/$/, '')

async function fetchCollection(collection: string): Promise<PocketBaseRecord[]> {
  const params = new URLSearchParams({ perPage: '500', sort: 'sortOrder' })
  const response = await fetch(
    `${pocketBaseUrl}/api/collections/${collection}/records?${params.toString()}`,
  )
  if (!response.ok) {
    throw new Error(`CMS request failed: ${response.status}`)
  }
  const payload = (await response.json()) as { items?: PocketBaseRecord[] }
  return payload.items || []
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function numberValue(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

function fileUrl(collection: string, record: PocketBaseRecord, field: string): string | undefined {
  const filename = stringValue(record[field])
  return filename
    ? `${pocketBaseUrl}/api/files/${collection}/${encodeURIComponent(record.id)}/${encodeURIComponent(filename)}`
    : undefined
}

function mapMember(record: PocketBaseRecord): Member {
  const links = Array.isArray(record.links)
    ? record.links.filter(
        (link): link is { title: string; url: string } =>
          typeof link === 'object' &&
          link !== null &&
          typeof link.title === 'string' &&
          typeof link.url === 'string',
      )
    : undefined

  return {
    avatar: fileUrl('members', record, 'avatarFile') || stringValue(record.avatar) || '',
    nickname: stringValue(record.nickname) || '未命名成员',
    grade: stringValue(record.grade) || '未分组',
    direction: stringValue(record.direction),
    role: stringValue(record.role),
    themeColor: stringValue(record.themeColor),
    motto: stringValue(record.motto),
    links,
  }
}

function mapProject(record: PocketBaseRecord): Project | CompetitionProject | null {
  const kind = stringValue(record.kind)
  if (kind === 'competition') {
    return {
      authors: stringArray(record.authors),
      authorAvatars: stringArray(record.authorAvatars),
      teamName: stringValue(record.teamName),
      name: stringValue(record.name) || '未命名项目',
      description: stringValue(record.description) || '',
      competition: stringValue(record.competition) || '',
      year: numberValue(record.year),
      url: stringValue(record.url),
    }
  }
  if (kind === 'featured' || kind === 'demo') {
    return {
      author: stringValue(record.author) || '未知作者',
      authorAvatar: stringValue(record.authorAvatar) || '',
      name: stringValue(record.name) || '未命名项目',
      description: stringValue(record.description) || '',
      language: stringValue(record.language) || '其他',
      languageColor: stringValue(record.languageColor) || '#82d4f2',
      url: stringValue(record.url) || '',
    }
  }
  return null
}

export async function loadMembers(fallback: Member[]): Promise<CmsResult<Member[]>> {
  try {
    return { data: (await fetchCollection('members')).map(mapMember), source: 'cms' }
  } catch (error) {
    return { data: fallback, source: 'fallback', error: error as Error }
  }
}

export async function loadProjects(fallback: {
  featured: Project[]
  competition: CompetitionProject[]
  demo: Project[]
}): Promise<
  CmsResult<{ featured: Project[]; competition: CompetitionProject[]; demo: Project[] }>
> {
  try {
    const data: { featured: Project[]; competition: CompetitionProject[]; demo: Project[] } = {
      featured: [],
      competition: [],
      demo: [],
    }
    for (const record of await fetchCollection('projects')) {
      const project = mapProject(record)
      if (!project) continue
      if (record.kind === 'competition' && 'competition' in project) {
        data.competition.push(project)
      } else if (record.kind === 'demo' && 'author' in project) {
        data.demo.push(project)
      } else if (record.kind === 'featured' && 'author' in project) {
        data.featured.push(project)
      }
    }
    return {
      data,
      source: 'cms',
    }
  } catch (error) {
    return { data: fallback, source: 'fallback', error: error as Error }
  }
}

export async function loadGallery(fallback: GalleryItem[]): Promise<CmsResult<GalleryItem[]>> {
  try {
    const items = (await fetchCollection('gallery')).map(
      (record): GalleryItem => ({
        id: record.id,
        type: (stringValue(record.type) as GalleryItem['type']) || 'link',
        src: fileUrl('gallery', record, 'imageFile') || stringValue(record.src) || '',
        title: stringValue(record.title) || '未命名内容',
        description: stringValue(record.description) || '',
        category: (stringValue(record.category) as GalleryItem['category']) || 'other',
        date: stringValue(record.date) || '',
        url: stringValue(record.url),
      }),
    )
    return { data: items, source: 'cms' }
  } catch (error) {
    return { data: fallback, source: 'fallback', error: error as Error }
  }
}
