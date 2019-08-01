module.exports = {
  toObject: function(s) {
    return eval(`(function(){ return [${s}] }())`)
  }
}
