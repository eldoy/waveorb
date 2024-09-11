var lodash = require('lodash')
var { i18n, loader, dispatch, locales } = require('../index.js')
var db = require('configdb')

/** Testing validate functions */

describe('validate', () => {
  beforeEach(() => {
    db('user').clear()
  })

  // Test validate data
  it('should validate data', async () => {
    var app = await loader({ path: 'test/apps/app7', locales })
    var $ = {
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

    var result = await dispatch($)
    expect(result.error.message).toBe('validation error')
    expect(result.query.name).toEqual(['minimum length is 5'])
    expect(result.query.key).toEqual(['must be one of 7, 8'])

    $.params.query.name = 'hello'
    $.params.query.key = 7

    result = await dispatch($)
    expect(result.hello).toBe('bye')
  })

  // Test unique on create
  it('should validate unique user on create', async () => {
    var app = await loader({ path: 'test/apps/app27', locales })
    var $ = {
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

    var result = await dispatch($)
    expect(result.hello).toBe('bye')

    // Create
    db('user').create({ email: 'test@example.com' })

    result = await dispatch($)
    expect(result.error.message).toBe('validation error')
    expect(result.values.email).toEqual(['has been taken'])
  })

  // Test unique on update
  it('should validate unique user on update', async () => {
    var app = await loader({ path: 'test/apps/app28', locales })
    var user1 = db('user').create({ email: 'test1@example.com' })
    var user2 = db('user').create({ email: 'test2@example.com' })

    var $ = {
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

    var result = await dispatch($)
    expect(result.hello).toBe('bye')

    // Update
    result = null
    $.params.values.email = 'new@example.com'

    result = await dispatch($)
    expect(result.hello).toBe('bye')

    $.params.values.email = 'test2@example.com'

    result = await dispatch($)

    expect(result.error.message).toBe('validation error')
    expect(result.values.email).toEqual(['has been taken'])
  })

  // Test unique on create, narrowed with ids
  it('should validate unique user on create, narrowed', async () => {
    var app = await loader({ path: 'test/apps/app31', locales })
    var $ = {
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

    var result = await dispatch($)
    expect(result.hello).toBe('bye')

    // Create
    db('user').create({ email: 'test@example.com', site_id: '1234' })

    result = await dispatch($)
    expect(result.error.message).toBe('validation error')
    expect(result.values.email).toEqual(['has been taken'])

    $.params.values.site_id = '1234'

    result = await dispatch($)
    expect(result.error.message).toBe('validation error')
    expect(result.values.email).toEqual(['has been taken'])

    $.params.values.site_id = '4321'
    result = await dispatch($)

    expect(result.hello).toBe('bye')
  })

  // Test unique on update, narrowed with ids
  it('should validate unique user on update, narrowed', async () => {
    var app = await loader({ path: 'test/apps/app32', locales })
    var user1 = db('user').create({
      email: 'test1@example.com',
      site_id: '1234'
    })

    var $ = {
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

    var result = await dispatch($)
    expect(result.hello).toBe('bye')

    // Update
    result = null
    $.params.values.email = 'new@example.com'

    result = await dispatch($)
    expect(result.hello).toBe('bye')

    result = null
    $.params.values.email = 'test2@example.com'

    result = await dispatch($)
    expect(result.hello).toBe('bye')
  })

  // Test exist
  it('should fail if not exist', async () => {
    var app = await loader({ path: 'test/apps/app29', locales })
    var $ = {
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

    var result = await dispatch($)
    expect(result.error.message).toBe('validation error')
    expect(result.query.id).toEqual(['does not exist'])

    var project = db('project').create({})
    $.params.query.id = project.id

    result = await dispatch($)
    expect(result.hello).toBe('bye')
  })

  // Test multiple required
  it('should work with multiple required fields', async () => {
    var app = await loader({ path: 'test/apps/app30', locales })
    var $ = {
      app,
      req: {
        route: 'createProject'
      },
      db,
      params: {},
      t: i18n.t()
    }

    var result = await dispatch($)
    expect(result.error.message).toBe('validation error')
    expect(result.values.name).toEqual(['is required'])
    expect(result.values.email).toEqual(['is required'])
  })

  // Test custom validations
  it('should use custom validations', async () => {
    var customLocales = lodash.cloneDeep(locales)
    customLocales.en.validation.required = 'custom required'

    var app = await loader({
      path: 'test/apps/app30',
      locales: customLocales
    })
    var $ = {
      app,
      req: {
        route: 'createProject'
      },
      db,
      params: {},
      t: i18n.t()
    }

    var result = await dispatch($)
    expect(result.error.message).toBe('validation error')
    expect(result.values.name).toEqual(['custom required'])
    expect(result.values.email).toEqual(['custom required'])
  })

  // Test custom validations, other language
  it('should use custom validations', async () => {
    var customLocales = Object.assign({}, locales)
    customLocales.no = {
      validation: {
        required: 'er påkrevet'
      }
    }

    var app = await loader({
      path: 'test/apps/app30',
      locales: customLocales
    })
    var $ = {
      app,
      lang: 'no',
      req: {
        route: 'createProject'
      },
      db,
      params: {},
      t: i18n.t()
    }

    var result = await dispatch($)
    expect(result.error.message).toBe('validation error')
    expect(result.values.name).toEqual(['er påkrevet'])
    expect(result.values.email).toEqual(['er påkrevet'])
  })

  // Test string validations
  it('should support string validations', async () => {
    var app = await loader({ path: 'test/apps/app34', locales })
    var $ = {
      app,
      req: {
        route: 'createProject'
      },
      db,
      params: {},
      t: i18n.t()
    }

    var result = await dispatch($)
    expect(result.error.message).toBe('validation error')
    expect(result.values.name).toEqual(['is required'])
    expect(result.values.email).toEqual(['is required'])
  })

  // Test array validations
  it('should support array validations', async () => {
    var app = await loader({ path: 'test/apps/app35', locales })
    var $ = {
      app,
      req: {
        route: 'createProject'
      },
      db,
      params: {},
      t: i18n.t()
    }

    var result = await dispatch($)

    expect(result.error.message).toBe('validation error')
    expect(result.values.name).toEqual(['is required'])
    expect(result.values.email).toEqual(['is required'])
  })
})
