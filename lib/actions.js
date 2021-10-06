const _ = require('lodash')
const validate = require('./validate.js')

function halt(msg, data) {
  const e = new Error(msg)
  if (data) e.data = data
  throw e
}

function gate($, want) {
  return async function(fields) {
    const issues = {}
    for (const name in fields) {
      const keys = Object.keys($.params[name] || [])
      let list = fields[name]
      if (typeof list == 'function') list = await list($)
      for (const key of keys) {
        if (list.includes(key) === want) {
          if (!issues[name]) issues[name] = []
          issues[name].push(key)
        }
      }
    }

    if (!_.isEmpty(issues)) {
      halt('field error', {
        error: { message: $.t('field.error') }, ...issues
      })
    }
  }
}

module.exports = async function($, options = {}) {
  if (typeof options === 'string') {
    options = { name: options }
  }
  // async function run(fn) {
  //   if (_.isFunction(fn)) {
  //     const result = await fn($)
  //     return result && ($.result = result)
  //   }
  // }

  // Extract action from path if not present, defaults to index
  // Removes /api/ from beginning of paths to accommodate production servers
  if (!$.params.action) {
    $.params.action = $.req.pathname.replace(/^\/api\//, '/').slice(1) || 'index'
  }

  const actionName = options.name || $.params.action
  const actionPath = `actions.${actionName}`.replace(/\//g, '.')
  const action = _.get($.app, actionPath)

  if (typeof action != 'function') return null

  $.filters = async function(filters) {
    for (const name of filters || []) {
      const filterPath = `filters.${name}`.replace(/\//g, '.')
      const filter = _.get($.app, filterPath)
      if (typeof filter == 'function') {
        const result = await filter($)
        if (typeof result != 'undefined') {
          return result
        }
      }
    }
  }


  $.allow = gate($, false)
  $.deny = gate($, true)

  // Validate
  $.validate = async function(fields) {
    const issues = {}
    for (const name in fields) {
      const spec = _.get(fields, name)
      const data = _.get($.params, name)
      const result = await validate(spec, data, $)
      if (result) {
        issues[name] = result
      }
    }

    if (!_.isEmpty(issues)) {
      halt('validation error', {
        error: { message: $.t('validation.error') }, ...issues
      })
    }
  }

  return action($)

  // async function clean(result) {

  //   async function operation(type, want) {
  //     let list = action[type]
  //     if (_.isFunction(list)) {
  //       list = await list($)
  //     }
  //     if (!list) return
  //     const items = _.isArray(result) ? result : [result]
  //     for (const obj of items) {
  //       if (_.isPlainObject(obj)) {
  //         for (const key in obj) {
  //           if (list.includes(key) === want) {
  //             delete obj[key]
  //           }
  //         }
  //       }
  //     }
  //     result = _.isArray(result) ? items : items[0]
  //   }

  //   // Run remove
  //   await operation('remove', true)

  //   // Run keep
  //   await operation('keep', false)

  //   return result
  // }

  // if (action) {

  //   // Run filters
  //   let filters = action.filters
  //   if (_.isFunction(filters)) {
  //     filters = await filters($)
  //   }
  //   for (const name of filters || []) {
  //     const filterPath = `filters.${name}`.replace(/\//g, '.')
  //     const filter = _.get($.app, filterPath)
  //     if (await run(filter)) {
  //       return await clean($.result)
  //     }
  //   }

  //   // Run before
  //   if (await run(action.before)) {
  //     return await clean($.result)
  //   }

  //   async function gate(type, want) {
  //     for (const key in action[type]) {
  //       const fields = $.params[key] || {}
  //       for (const name in fields) {
  //         let list = action[type][key]
  //         if (_.isFunction(list)) {
  //           list = await list($)
  //         }
  //         if ((list || []).includes(name) === want) {
  //           delete fields[name]
  //         }
  //       }
  //     }
  //   }

  //   // Run deny
  //   await gate('deny', true)

  //   // Run allow
  //   await gate('allow', false)

  //   // Validate
  //   const issues = {}
  //   for (const key in action.validate) {
  //     const spec = _.get(action.validate, key)
  //     const data = _.get($.params, key)
  //     const fields = await validate(spec, data, $)
  //     if (fields) {
  //       issues[key] = fields
  //     }
  //   }

  //   if (!_.isEmpty(issues)) {
  //     return { error: { message: $.t('validation.error') }, ...issues }
  //   }

  //   // Run main
  //   if (await run(action.main)) {
  //     return await clean($.result)
  //   }

  //   // Run after
  //   await run(action.after)
  // }

  // return $.result || null
}
