/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const members = new Collection({
      type: 'base',
      name: 'members',
      listRule: '',
      viewRule: '',
      fields: [
        { name: 'legacyId', type: 'text', required: true, max: 100 },
        { name: 'avatar', type: 'url' },
        { name: 'avatarFile', type: 'file', maxSelect: 1, maxSize: 5242880 },
        { name: 'nickname', type: 'text', required: true, max: 100 },
        { name: 'grade', type: 'text', required: true, max: 30 },
        { name: 'direction', type: 'text', max: 100 },
        { name: 'role', type: 'text', max: 100 },
        { name: 'themeColor', type: 'text', max: 20 },
        { name: 'motto', type: 'text', max: 500 },
        { name: 'links', type: 'json' },
        { name: 'sortOrder', type: 'number' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_members_legacy_id ON members (legacyId)'],
    })
    app.save(members)

    const projects = new Collection({
      type: 'base',
      name: 'projects',
      listRule: '',
      viewRule: '',
      fields: [
        { name: 'legacyId', type: 'text', required: true, max: 100 },
        {
          name: 'kind',
          type: 'select',
          required: true,
          values: ['featured', 'competition', 'demo'],
          maxSelect: 1,
        },
        { name: 'author', type: 'text', max: 100 },
        { name: 'authorAvatar', type: 'url' },
        { name: 'authors', type: 'json' },
        { name: 'authorAvatars', type: 'json' },
        { name: 'teamName', type: 'text', max: 200 },
        { name: 'name', type: 'text', required: true, max: 200 },
        { name: 'description', type: 'text', max: 1000 },
        { name: 'language', type: 'text', max: 100 },
        { name: 'languageColor', type: 'text', max: 20 },
        { name: 'competition', type: 'text', max: 200 },
        { name: 'year', type: 'number' },
        { name: 'url', type: 'url' },
        { name: 'sortOrder', type: 'number' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_projects_legacy_id ON projects (legacyId)'],
    })
    app.save(projects)

    const gallery = new Collection({
      type: 'base',
      name: 'gallery',
      listRule: '',
      viewRule: '',
      fields: [
        { name: 'legacyId', type: 'text', required: true, max: 100 },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['image', 'link', 'iframe'],
          maxSelect: 1,
        },
        { name: 'src', type: 'text', required: true, max: 1000 },
        { name: 'imageFile', type: 'file', maxSelect: 1, maxSize: 10485760 },
        { name: 'title', type: 'text', required: true, max: 200 },
        { name: 'description', type: 'text', max: 1000 },
        {
          name: 'category',
          type: 'select',
          required: true,
          values: ['image', 'project', 'blog', 'other'],
          maxSelect: 1,
        },
        { name: 'date', type: 'text', max: 30 },
        { name: 'url', type: 'url' },
        { name: 'sortOrder', type: 'number' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_gallery_legacy_id ON gallery (legacyId)'],
    })
    app.save(gallery)
  },
  (app) => {
    for (const name of ['members', 'projects', 'gallery']) {
      try {
        app.delete(app.findCollectionByNameOrId(name))
      } catch {
        // Collection may not exist when rolling back a partial migration.
      }
    }
  },
)
