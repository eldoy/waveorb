module.exports = function validations($) {
  return async function({ type, a, b, field, add }) {
    if (!$.db) return

    // Check if document field is unique in db collection
    if (type == 'unique') {
      if (typeof a == 'string') {
        a = { model: a }
      }

      let { model, fields = 'id' } = a
      if (!model) return
      if (typeof fields == 'string') {
        fields = [fields]
      }

      const query = { [field]: b }
      for (const f of fields) {
        const v = ($.params.query || {})[f]
        if (v) query[f] = { $ne: v }
      }

      const count = await $.db(model).count(query)
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
