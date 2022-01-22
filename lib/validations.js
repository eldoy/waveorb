module.exports = function validations($) {
  if (!$.db) return

  // Check if document field is unique in db collection
  async function unique({ want, got, field, add }) {
    const query = { [field]: got }
    const id = $.params.query?.id
    if (id) query.id = { $ne: id }
    const count = await $.db(want).count(query)
    if (count) {
      add(field, $.t('validation.unique'))
    }
  }

  // Check if document exists in db collection
  async function exist({ want, got, field, add }) {
    if (field == `${want}_id`) field = 'id'
    const query = { [field]: got }
    const count = await $.db(want).count(query)
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
