Integration:

- Skip astro format for now
- Transform HTML in js files between return /* HTML */ `<div>transform me</div>`

Issues:
  - Require isn't used for HTML in extas.read, it's reading the file
  - Astro format doesn't have syntax highlighting
  - Lazy load doesn't work with conficurse, it's using extras.env, which is using extras.read, which isn't always using require and doesn't support lazy.

Extras:
  - Lazy load
  - Move language translations to load before
  - Transform hook? Can do custom transforms, and then move those transforms to html6 lib.
  - Remove 'skjema'? Or use it in transform? Need to use <field> tag instead.
  - Add onsubmit="return false" to all forms?
  - Grid tag?
