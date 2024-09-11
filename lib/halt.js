module.exports = function halt(msg, data) {
  var e = new Error(msg)
  e.data = data
  throw e
}
