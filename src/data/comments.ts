import type { Comment } from '../types/comment'

const GITHUB_API_URL =
  'https://api.github.com/repos/sanyuankexie/hello.kexie.space/issues/6/comments'

export interface CommentsResponse {
  comments: Comment[]
  error: string | null
}

export async function fetchComments(): Promise<CommentsResponse> {
  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const comments: Comment[] = await response.json()
    return { comments, error: null }
  } catch (err) {
    return {
      comments: [],
      error: err instanceof Error ? err.message : 'Failed to fetch comments',
    }
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) {
    return '刚刚'
  } else if (diffMins < 60) {
    return `${diffMins} 分钟前`
  } else if (diffHours < 24) {
    return `${diffHours} 小时前`
  } else if (diffDays < 30) {
    return `${diffDays} 天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
}
