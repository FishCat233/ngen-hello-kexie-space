/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const recruitment = new Collection({
      type: 'base',
      name: 'recruitment',
      listRule: '',
      viewRule: '',
      fields: [
        { name: 'legacyId', type: 'text', required: true, max: 100 },
        { name: 'title', type: 'text', required: true, max: 100 },
        { name: 'time', type: 'text', required: true, max: 100 },
        { name: 'description', type: 'text', max: 500 },
        { name: 'sortOrder', type: 'number' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_recruitment_legacy_id ON recruitment (legacyId)'],
    })
    app.save(recruitment)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('recruitment'))
    } catch {
      // Collection may not exist when rolling back a partial migration.
    }
  },
)
