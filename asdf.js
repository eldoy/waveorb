var routes = {
  '_article/post/_author': 1,
  '_nisse/_skjegg': 2,
  'bål': 3,
  '_kit/_kat/cat': 4,
  'anne': 5,
  '_harald': 6,
  '_nils/kåre': 7,
  '_hans/_petter/_nilsen': 8
}

var sorted = {}
// var t = Object.keys(routes).map(x => x.split('/').map(y => y[0] == '_' ? '_' : y).join('/')).sort().reverse()
function base(str) {
  return str.split('/').map(y => y[0] == '_' ? '_' : y).join('/')
}

Object.keys(routes).sort((a, b) => {
  a = base(a)
  b = base(b)
  if (a < b) return -1
  else if (a > b) return 1
  return 0
}).reverse().forEach(x => sorted[x] = routes[x])

console.log(sorted)



// var keys = Object.keys(routes).sort().reverse()

// console.log(keys)




// ['_/a/_', '_/_', 'b', '_/_/c', 'a', '_', '_/a', '_/_/_'].sort().reverse()