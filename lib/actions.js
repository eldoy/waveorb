const _ = require('lodash')
const { validate } = require('d8a')
const validations = require('waveorb-validations')

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
        error: { message: $.t('validation.field') }, ...issues
      })
    }
  }
}

module.exports = async function($, options = {}) {
  if (typeof options === 'string') {
    options = { name: options }
  }

  // Extract action from pathname, defaults to index
  // Removes /api/ from beginning of paths to accommodate production servers
  if (!options.name) {
    options.name = $.req.pathname.replace(/^\/api\//, '/')
  }

  const routeName = `post#${options.name}`
  const fileName = _.get($.app.routes, routeName) || ''
  const filePath = fileName.replace(/\//g, '.')
  const action = _.get($.app.actions, filePath)

  if (typeof action != 'function') return null

  $.filters = async function(filters) {
    for (const name of filters || []) {
      const filterPath = `filters.${name}`.replace(/\//g, '.')
      const filter = _.get($.app, filterPath)
      if (typeof filter == 'function') {
        const result = await filter($)
        if (typeof result != 'undefined') {
          halt('filter result', result)
        }
      }
    }
  }

  $.allow = gate($, false)
  $.deny = gate($, true)

  $.validate = async function(fields) {
    const issues = {}
    let ext = validations($)
    const opt = { $, ext, lax: true }

    for (const name in fields) {
      const spec = _.get(fields, name)
      const data = _.get($.params, name)
      const errors = await validate(spec, data, opt)
      if (errors) {
        issues[name] = errors
      }
    }

    if (!_.isEmpty(issues)) {
      halt('validation error', {
        error: { message: $.t('validation.error') }, ...issues
      })
    }
  }

  return action($)
}
