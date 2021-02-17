module.exports = {
  create: function(model) {
    return async function($) {
      if (typeof $.app.db !== 'function') return
      const { values = {} } = $.params
      return await $.app.db(model).create(values)
    }
  },

  update: function(model) {
    return async function($) {
      if (typeof $.app.db !== 'function') return
      const { query = {}, values = {} } = $.params
      return await $.app.db(model).update(query, values)
    }
  },

  get: function(model) {
    return async function($) {
      if (typeof $.app.db !== 'function') return
      const { query = {}, fields = {} } = $.params
      return await $.app.db(model).get(query)
    }
  },

  find: function(model) {
    return async function($) {
      if (typeof $.app.db !== 'function') return
      const { query = {}, fields = {}, sort = {}, skip = 0, limit = 0 } = $.params
      return await $.app.db(model).find(query, { fields, sort, skip, limit })
    }
  },

  count: function(model) {
    return async function($) {
      if (typeof $.app.db !== 'function') return
      const { query = {} } = $.params
      return { n: await $.app.db(model).count(query) }
    }
  },

  delete: function(model) {
    return async function($) {
      if (typeof $.app.db !== 'function') return
      const { query = {} } = $.params
      return await $.app.db(model).delete(query)
    }
  }
}
