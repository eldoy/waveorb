const { i18n, loader, action, locales } = require('../index.js')
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
        pathname: '/createProject'
      },
      params: {
        query: {
          name: 'hey',
          key: 5
        }
      },
      t: i18n.t({ locales })
    }

    let result
    try {
      result = await action($)
    } catch (e) {
      expect(e.data.error.message).toBe('validation error')
      expect(e.data.query.name).toEqual([ 'minimum length is 5' ])
      expect(e.data.query.key).toEqual([ 'must be one of 7, 8' ])
    }
    expect(result).toBeUndefined()

    $.params.query.name = 'hello'
    $.params.query.key = 7

    result = await action($)
    expect(result.hello).toBe('bye')
  })

  // Test unique on create
  it('should validate unique user on create', async () => {
    const app = await loader({ path: 'test/apps/app27', locales })
    const $ = {
      app,
      req: {
        pathname: '/createUser'
      },
      db,
      params: {
        values: {
          email: 'test@example.com'
        }
      },
      t: i18n.t({ locales })
    }

    let result = await action($)
    expect(result.hello).toBe('bye')

    // Create
    db('user').create({ email: 'test@example.com' })

    result = null
    try {
      result = await action($)
    } catch (e) {
      expect(e.data.error.message).toBe('validation error')
      expect(e.data.values.email).toEqual([ 'must be unique' ])
    }
    expect(result).toBeNull()
  })

  // Test unique on update
  it('should validate unique user on update', async () => {
    const app = await loader({ path: 'test/apps/app28', locales })
    const user1 = db('user').create({ email: 'test1@example.com' })
    const user2 = db('user').create({ email: 'test2@example.com' })

    const $ = {
      app,
      req: {
        pathname: '/updateUser',
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
      t: i18n.t({ locales })
    }

    let result = await action($)
    expect(result.hello).toBe('bye')

    // Update
    result = null
    $.params.values.email = 'new@example.com'

    result = await action($)
    expect(result.hello).toBe('bye')

    result = null
    $.params.values.email = 'test2@example.com'

    try {
      result = await action($)
    } catch (e) {
      expect(e.data.error.message).toBe('validation error')
      expect(e.data.values.email).toEqual([ 'must be unique' ])
    }
    expect(result).toBeNull()
  })

  // Test unique on create, narrowed with ids
  it('should validate unique user on create, narrowed', async () => {
    const app = await loader({ path: 'test/apps/app31', locales })
    const $ = {
      app,
      req: {
        pathname: '/createUser'
      },
      db,
      params: {
        values: {
          email: 'test@example.com'
        }
      },
      t: i18n.t({ locales })
    }

    let result = await action($)
    expect(result.hello).toBe('bye')

    // Create
    db('user').create({ email: 'test@example.com', site_id: '1234' })

    result = null
    try {
      result = await action($)
    } catch (e) {
      expect(e.data.error.message).toBe('validation error')
      expect(e.data.values.email).toEqual([ 'must be unique' ])
    }
    expect(result).toBeNull()

    $.params.values.site_id = '1234'

    result = null
    try {
      result = await action($)
    } catch (e) {
      expect(e.data.error.message).toBe('validation error')
      expect(e.data.values.email).toEqual([ 'must be unique' ])
    }
    expect(result).toBeNull()

    $.params.values.site_id = '4321'
    result = await action($)

    expect(result.hello).toBe('bye')
  })

  // Test unique on update, narrowed with ids
  it('should validate unique user on update, narrowed', async () => {
    const app = await loader({ path: 'test/apps/app32', locales })
    const user1 = db('user').create({
      email: 'test1@example.com',
      site_id: '1234'
    })
    const user2 = db('user').create({
      email: 'test2@example.com',
      site_id: '4321'
    })

    const $ = {
      app,
      req: {
        pathname: '/updateUser'
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
      t: i18n.t({ locales })
    }

    let result = await action($)
    expect(result.hello).toBe('bye')

    // Update
    result = null
    $.params.values.email = 'new@example.com'

    result = await action($)
    expect(result.hello).toBe('bye')

    result = null
    $.params.values.email = 'test2@example.com'

    result = await action($)
    expect(result.hello).toBe('bye')
  })

  // Test exist
  it('should fail if not exist', async () => {
    const app = await loader({ path: 'test/apps/app29', locales })
    const $ = {
      app,
      req: {
        pathname: '/getProject'
      },
      db,
      params: {
        query: {
          id: '12341234'
        }
      },
      t: i18n.t({ locales })
    }

    let result = null
    try {
      result = await action($)
    } catch (e) {
      expect(e.data.error.message).toBe('validation error')
      expect(e.data.query.id).toEqual([ 'does not exist' ])
    }
    expect(result).toBeNull()

    const project = db('project').create({})
    $.params.query.id = project.id

    result = await action($)
    expect(result.hello).toBe('bye')
  })

  // Test multiple required
  it('should work with multiple required fields', async () => {
    const app = await loader({ path: 'test/apps/app30', locales })
    const $ = {
      app,
      req: {
        pathname: '/createProject'
      },
      db,
      params: {},
      t: i18n.t({ locales })
    }

    let result = null
    try {
      result = await action($)
    } catch (e) {
      expect(e.data.error.message).toBe('validation error')
      expect(e.data.values.name).toEqual([ 'is required' ])
      expect(e.data.values.email).toEqual([ 'is required' ])
    }
    expect(result).toBeNull()
  })
})
