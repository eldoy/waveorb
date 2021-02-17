{
  /** Functions being run on each HTTP request */
  middleware: {
    log: async function(req, res) {
      console.log(req.pathname)
    }
  },

  /** Functions being run when the app starts */
  plugins: {
    db: async function(app) {
      app.db = await connectMongoTopology()
    }
  },

  /** Functions that can be called from a route */
  filters: {
    user: async function($) {
      const { token } = $.session
      const session = await $.app.db('session/get')({ token })
      if (session && session.userId) {
        // Put data in the route object('$') and user it later
        $.user = await $.app.db('user/get')({ userId: session.userId })
      }
    },

    admin: async function($) {
      if (!$.user || !$.user.admin) {
        // Throw error to return error message
        throw Error('must be an admin')
      }
    }
  },

  /** Functions being run on each request */
  actions: {
    createProjectAsAdmin: {
      filters: ['user', 'admin'],
      validation: {
        data: {
          // Run validations on data values
          name: {
            required: true, // this means can not be undefined
            eq: 5,
            ne: 5,
            gt: 5,
            lt: 5,
            gte: 5,
            lte: 5,
            in: [1, 2, 3],
            nin: [1, 2, 3],
            length: 5,
            minlength: 5,
            maxlength: 5,
            match: /regex/,
            matcher: async function(val, $) {
              if (!val) {
                return $.t('some_error')
              }
            },
            is: '$boolean',
            is: '$string',
            is: '$number',
            is: '$integer',
            is: '$decimal',
            is: '$date',
            is: '$id',
            is: '$object',
            is: '$array',
            is: '$email',
            is: '$url'
          }
        }
      },

      // Before is being run before validation
      before: async function($) {
        console.log('Before validation')
      },

      // Main is being run after validation
      main: async function($) {
        // Send result by return or put in '$.result'
        $.result = await $.app.db('project/insert')($.params.values)
      },

      // Before is being run before validation
      after: async function($) {
        console.log('Request done')
      }
    }
  }
}