module.exports = {
  toObject: function(s) {
    return eval(`[${s}]`)
  }
}
