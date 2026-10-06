const { describe, it, beforeEach } = require('node:test')
const assert = require('node:assert/strict')
const lodash = require('lodash')
const { i18n, loader, dispatch, locales } = require('../index.js')
const db = require('configdb')

/** Testing validate functions */

describe('validate', () => {
  beforeEach(() => {
    db('user').clear()
  })

  // Test validate data
  it('should validate data', async () => {
    const app = await loader({ path: 'test/apps/app7', locales })
    const $ = {
      app,
      req: {
        route: 'createProject'
      },
      params: {
        query: {
          name: 'hey',
          key: 5
        }
      },
      t: i18n.t()
    }

    let result = await dispatch($)
    assert.strictEqual(result.error.message, 'validation error')
    assert.deepStrictEqual(result.query.name, ['minimum length is 5'])
    assert.deepStrictEqual(result.query.key, ['must be one of 7, 8'])

    $.params.query.name = 'hello'
    $.params.query.key = 7

    result = await dispatch($)
    assert.strictEqual(result.hello, 'bye')
  })

  // Test unique on create
  it('should validate unique user on create', async () => {
    const app = await loader({ path: 'test/apps/app27', locales })
    const $ = {
      app,
      req: {
        route: 'createUser'
      },
      db,
      params: {
        values: {
          email: 'test@example.com'
        }
      },
      t: i18n.t()
    }

    let result = await dispatch($)
    assert.strictEqual(result.hello, 'bye')

    // Create
    db('user').create({ email: 'test@example.com' })

    result = await dispatch($)
    assert.strictEqual(result.error.message, 'validation error')
    assert.deepStrictEqual(result.values.email, ['has been taken'])
  })

  // Test unique on update
  it('should validate unique user on update', async () => {
    const app = await loader({ path: 'test/apps/app28', locales })
    const user1 = db('user').create({ email: 'test1@example.com' })
    const user2 = db('user').create({ email: 'test2@example.com' })

    const $ = {
      app,
      req: {
        route: 'updateUser'
      },
      db,
      params: {
        query: {
          id: user1.id
        },
        values: {
          email: 'test1@example.com'
        }
      },
      t: i18n.t()
    }

    let result = await dispatch($)
    assert.strictEqual(result.hello, 'bye')

    // Update
    result = null
    $.params.values.email = 'new@example.com'

    result = await dispatch($)
    assert.strictEqual(result.hello, 'bye')

    $.params.values.email = 'test2@example.com'

    result = await dispatch($)

    assert.strictEqual(result.error.message, 'validation error')
    assert.deepStrictEqual(result.values.email, ['has been taken'])
  })

  // Test unique on create, narrowed with ids
  it('should validate unique user on create, narrowed', async () => {
    const app = await loader({ path: 'test/apps/app31', locales })
    const $ = {
      app,
      req: {
        route: 'createUser'
      },
      db,
      params: {
        values: {
          email: 'test@example.com'
        }
      },
      t: i18n.t()
    }

    let result = await dispatch($)
    assert.strictEqual(result.hello, 'bye')

    // Create
    db('user').create({ email: 'test@example.com', site_id: '1234' })

    result = await dispatch($)
    assert.strictEqual(result.error.message, 'validation error')
    assert.deepStrictEqual(result.values.email, ['has been taken'])

    $.params.values.site_id = '1234'

    result = await dispatch($)
    assert.strictEqual(result.error.message, 'validation error')
    assert.deepStrictEqual(result.values.email, ['has been taken'])

    $.params.values.site_id = '4321'
    result = await dispatch($)

    assert.strictEqual(result.hello, 'bye')
  })

  // Test unique on update, narrowed with ids
  it('should validate unique user on update, narrowed', async () => {
    const app = await loader({ path: 'test/apps/app32', locales })
    const user1 = db('user').create({
      email: 'test1@example.com',
      site_id: '1234'
    })

    const $ = {
      app,
      req: {
        route: 'updateUser'
      },
      db,
      params: {
        query: {
          id: user1.id
        },
        values: {
          email: 'test1@example.com'
        }
      },
      t: i18n.t()
    }

    let result = await dispatch($)
    assert.strictEqual(result.hello, 'bye')

    // Update
    result = null
    $.params.values.email = 'new@example.com'

    result = await dispatch($)
    assert.strictEqual(result.hello, 'bye')

    result = null
    $.params.values.email = 'test2@example.com'

    result = await dispatch($)
    assert.strictEqual(result.hello, 'bye')
  })

  // Test exist
  it('should fail if not exist', async () => {
    const app = await loader({ path: 'test/apps/app29', locales })
    const $ = {
      app,
      req: {
        route: 'getProject'
      },
      db,
      params: {
        query: {
          id: '12341234'
        }
      },
      t: i18n.t()
    }

    let result = await dispatch($)
    assert.strictEqual(result.error.message, 'validation error')
    assert.deepStrictEqual(result.query.id, ['does not exist'])

    const project = db('project').create({})
    $.params.query.id = project.id

    result = await dispatch($)
    assert.strictEqual(result.hello, 'bye')
  })

  // Test multiple required
  it('should work with multiple required fields', async () => {
    const app = await loader({ path: 'test/apps/app30', locales })
    const $ = {
      app,
      req: {
        route: 'createProject'
      },
      db,
      params: {},
      t: i18n.t()
    }

    let result = await dispatch($)
    assert.strictEqual(result.error.message, 'validation error')
    assert.deepStrictEqual(result.values.name, ['is required'])
    assert.deepStrictEqual(result.values.email, ['is required'])
  })

  // Test custom validations
  it('should use custom validations', async () => {
    const customLocales = lodash.cloneDeep(locales)
    customLocales.en.validation.required = 'custom required'

    const app = await loader({
      path: 'test/apps/app30',
      locales: customLocales
    })
    const $ = {
      app,
      req: {
        route: 'createProject'
      },
      db,
      params: {},
      t: i18n.t()
    }

    let result = await dispatch($)
    assert.strictEqual(result.error.message, 'validation error')
    assert.deepStrictEqual(result.values.name, ['custom required'])
    assert.deepStrictEqual(result.values.email, ['custom required'])
  })

  // Test custom validations, other language
  it('should use custom validations', async () => {
    const customLocales = Object.assign({}, locales)
    customLocales.no = {
      validation: {
        required: 'er påkrevet'
      }
    }

    const app = await loader({
      path: 'test/apps/app30',
      locales: customLocales
    })
    const $ = {
      app,
      lang: 'no',
      req: {
        route: 'createProject'
      },
      db,
      params: {},
      t: i18n.t()
    }

    let result = await dispatch($)
    assert.strictEqual(result.error.message, 'validation error')
    assert.deepStrictEqual(result.values.name, ['er påkrevet'])
    assert.deepStrictEqual(result.values.email, ['er påkrevet'])
  })

  // Test string validations
  it('should support string validations', async () => {
    const app = await loader({ path: 'test/apps/app34', locales })
    const $ = {
      app,
      req: {
        route: 'createProject'
      },
      db,
      params: {},
      t: i18n.t()
    }

    let result = await dispatch($)
    assert.strictEqual(result.error.message, 'validation error')
    assert.deepStrictEqual(result.values.name, ['is required'])
    assert.deepStrictEqual(result.values.email, ['is required'])
  })

  // Test array validations
  it('should support array validations', async () => {
    const app = await loader({ path: 'test/apps/app35', locales })
    const $ = {
      app,
      req: {
        route: 'createProject'
      },
      db,
      params: {},
      t: i18n.t()
    }

    let result = await dispatch($)

    assert.strictEqual(result.error.message, 'validation error')
    assert.deepStrictEqual(result.values.name, ['is required'])
    assert.deepStrictEqual(result.values.email, ['is required'])
  })

  // Test empty query params
  it('should validate empty params', async () => {
    const app = await loader({ path: 'test/apps/app36', locales })
    const $ = {
      app,
      req: {
        route: 'createProject'
      },
      db,
      params: {},
      t: i18n.t()
    }

    let result = await dispatch($)

    assert.strictEqual(result.error.message, 'validation error')
    assert.deepStrictEqual(result.query.id, ['is required'])
    assert.deepStrictEqual(result.values.name, ['is required'])
  })
})
