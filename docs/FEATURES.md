We create a Waveorb object. It contains all of extras and all of lodash + markdown + db + xecutor (as $)

global.Waveorb = global._ = {}

We want to be able to do this:

node -r waveorb hello.js

or this:

require('waveorb')

and then just start writing:

_.read
_.write

var { text } = $(`hello -la`)
