var validator = require('./validator.js')

module.exports = function validate($, obj) {
  if (!obj && $ && $.req) {
    obj = $.req.method == 'GET' ? $.query : $.params
  }
  return function (fields, source) {
    return validator($, fields, source || obj)
  }
}
