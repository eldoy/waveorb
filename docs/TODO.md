# TODO

https://github.com/eldoy/waveorb/issues

### Waveorb 1.0

REFACTOR

- [ ] Use var instead of var and let
- [ ] Remove use of arrow functions

BREAKING CHANGES

- [ ] Rename functions in extras that crash with lodash
  - release across chain
  - isDate can be hybrid? Or does it work with string in lodash?
  - rename transform to convert

- [ ] Remove all of the imports in index.js
  - neew to use var loader = require('waveorb/lib/loader.js')
  - include a global.Waveorb object that we return in exports
    - should include all functions from extras

- [ ] Clean up loader
  - refactor all the load functions
  - enable lazy conficurse load in production for faster startup
  - lazy load:
    - var tomarkup = require('tomarkup')
    - var brainmatter = require('brainmatter')
    - var skjema = require('skjema')
    - var lowcode = require('lavkode')

- [ ] Add tools to index
  - include extras
  - include lodash functions
  - move markdown from loader
  - move validator from loader
  - add tools to global._ and global.Waveorb
