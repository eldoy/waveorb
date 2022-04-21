* Get rid of SKIP_MAIN? Other env variables can be scrapped?
* Use Furu instead of sirloin
* No more support for web sockets
  - Re-add it when we need it
* Redo (or remove) front end client
  - Use fetch, remove web sockets
  - Could add load and fetch to haka?
* Global variables
  - Need t, esc, link at least
  - h? (htmlview)
    - Add to haka?
    - Make isomorphic?
  - fetch (Upgrade to NodeJS 18.0 to get it), or use node-fetch as global
  - app (config, pages, views, components, layouts, actions, filters, mail)
  - Make Haka isomorphic to support this?
  - Still use $ as umbrella? $.t, $.esc, $.link
    - Less pollution
      - but maybe pollution is ok?
* Plugins
  - Throw?
    - Not needed if we set global variables in init
  - Or keep?
    - Could be
* Hooks
  - init
  - before request
  - after request
  - error
* Validations
  - validate
  - allow
  - deny? Could be removed, never used.
* Testing
  - Remove Jest and use Spekky with Spett?
* Filters
  - Should work for pages and actions
  - Or define Setups for pages?
* Middleware
  - throw, use before instead
* Pages
  - Support functions
  - Support markdown with front matter
  - Support mustache with front matter
* Layouts
  - Support functions
  - Support mustache
* Actions
  - Support functions
  - Support weblang