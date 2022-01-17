module.exports = function validations($) {
  return async function({ type, a, b, field, add }) {
    if (!$.db) return

    // Check if document field is unique in db collection
    if (type == 'unique') {
      const query = { [field]: b }
      const id = $.params.query?.id
      if (id) query.id = { $ne: id }
      const count = await $.db(a).count(query)
      if (count) {
        add(field, $.t('validation.unique'))
      }
    }

    // Check if document exists in db collection
    else if (type == 'exist') {
      const query = { [field]: b }
      const count = await $.db(a).count(query)
      if (!count) {
        add(field, $.t('validation.exist'))
      }
    }
  }
}
