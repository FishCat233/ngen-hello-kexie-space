import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const baseUrl = (process.env.PB_URL || 'http://127.0.0.1:8090').replace(/\/$/, '')
const email = process.env.PB_EMAIL
const password = process.env.PB_PASSWORD

if (!email || !password) {
  throw new Error('PB_EMAIL and PB_PASSWORD are required')
}

const seedPath = resolve('scripts/content-seed.json')
const seed = JSON.parse(await readFile(seedPath, 'utf8'))

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(
      `${options.method || 'GET'} ${path} failed (${response.status}): ${JSON.stringify(body)}`,
    )
  }
  return body
}

const auth = await request('/api/collections/_superusers/auth-with-password', {
  method: 'POST',
  body: JSON.stringify({ identity: email, password }),
})

const collections = [
  ['members', seed.members],
  ['projects', seed.projects],
  ['gallery', seed.gallery],
]

for (const [collection, records] of collections) {
  for (const record of records) {
    const existing = await request(
      `/api/collections/${collection}/records?filter=${encodeURIComponent(`legacyId = "${record.legacyId}"`)}`,
      { headers: { Authorization: auth.token } },
    )
    const current = existing.items?.[0]
    const path = current
      ? `/api/collections/${collection}/records/${current.id}`
      : `/api/collections/${collection}/records`
    await request(path, {
      method: current ? 'PATCH' : 'POST',
      headers: { Authorization: auth.token },
      body: JSON.stringify(record),
    })
    console.log(`${current ? 'updated' : 'created'} ${collection}/${record.legacyId}`)
  }
}
