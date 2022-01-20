module.exports = function validations($) {
  if (!$.db) return

  // Check if document field is unique in db collection
  async function unique({ a, b, field, add }) {
    const query = { [field]: b }
    const id = $.params.query?.id
    if (id) query.id = { $ne: id }
    const count = await $.db(a).count(query)
    if (count) {
      add(field, $.t('validation.unique'))
    }
  }

  // Check if document exists in db collection
  async function exist({ a, b, field, add }) {
    if (field == `${a}_id`) field = 'id'
    const query = { [field]: b }
    const count = await $.db(a).count(query)
    if (!count) {
      add(field, $.t('validation.exist'))
    }
  }

  return {
    unique: {
      type: 'string',
      fn: unique
    },
    exist: {
      type: 'string',
      fn: exist
    }
  }
}
