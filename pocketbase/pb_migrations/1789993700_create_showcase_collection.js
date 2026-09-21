/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const showcase = new Collection({
      type: 'base',
      name: 'showcase',
      listRule: '',
      viewRule: '',
      fields: [
        { name: 'legacyId', type: 'text', required: true, max: 100 },
        { name: 'label', type: 'text', required: true, max: 100 },
        { name: 'src', type: 'text', max: 1000 },
        { name: 'imageFile', type: 'file', maxSelect: 1, maxSize: 10485760 },
        { name: 'sortOrder', type: 'number' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_showcase_legacy_id ON showcase (legacyId)'],
    })
    app.save(showcase)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('showcase'))
    } catch {
      // Collection may not exist when rolling back a partial migration.
    }
  },
)
