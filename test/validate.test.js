const { i18n, loader, actions, locales } = require('../index.js')
const db = require('configdb')

/** Testing validate functions */

describe('validate', () => {

  it('should validate data', async () => {
    const app = await loader({ path: 'test/apps/app7', locales })
    const $ = {
      app,
      params: {
        action: 'createProject',
        query: {
          name: 'hey',
          key: 5
        }
      },
      t: i18n.t({ locales })
    }

    let result
    try {
      result = await actions($)
    } catch (e) {
      expect(e.data.error.message).toBe('validation error')
      expect(e.data.query.name).toEqual([ 'minimum length is 5' ])
      expect(e.data.query.key).toEqual([ 'must be one of 7, 8' ])
    }
    expect(result).toBeUndefined()

    $.params.query.name = 'hello'
    $.params.query.key = 7

    result = await actions($)
    expect(result.hello).toBe('bye')
  })

  // Test unique on create
  it('should validate unique user on create', async () => {
    const app = await loader({ path: 'test/apps/app27', locales })
    const $ = {
      app,
      db,
      params: {
        action: 'createUser',
        values: {
          email: 'test@example.com'
        }
      },
      t: i18n.t({ locales })
    }

    let result = await actions($)
    expect(result.hello).toBe('bye')

    // Create
    db('user').create({ email: 'test@example.com' })

    result = null
    try {
      result = await actions($)
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
      db,
      params: {
        action: 'updateUser',
        query: {
          id: user1.id
        },
        values: {
          email: 'test1@example.com'
        }
      },
      t: i18n.t({ locales })
    }

    let result = await actions($)
    expect(result.hello).toBe('bye')

    // Update
    result = null
    $.params.values.email = 'new@example.com'

    result = await actions($)
    expect(result.hello).toBe('bye')

    result = null
    $.params.values.email = 'test2@example.com'

    try {
      result = await actions($)
    } catch (e) {
      expect(e.data.error.message).toBe('validation error')
      expect(e.data.values.email).toEqual([ 'must be unique' ])
    }
    expect(result).toBeNull()
  })

  // Test exist
  it('should fail if not exist', async () => {
    const app = await loader({ path: 'test/apps/app29', locales })
    const $ = {
      app,
      db,
      params: {
        action: 'getProject',
        query: {
          id: '12341234'
        }
      },
      t: i18n.t({ locales })
    }

    let result = null
    try {
      result = await actions($)
    } catch (e) {
      expect(e.data.error.message).toBe('validation error')
      expect(e.data.query.id).toEqual([ 'does not exist' ])
    }
    expect(result).toBeNull()

    const project = db('project').create({})
    $.params.query.id = project.id

    result = await actions($)
    expect(result.hello).toBe('bye')
  })
})
