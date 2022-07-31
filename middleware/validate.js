// Schema validator

module.exports = (schema) => async (req, res, next) => {
  try {
    await schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      { abortEarly: false }
    );
    return next();
  } catch (err) {
    let errors = {};

    let arr = err.inner.map((elm) => {
      let keyArr = elm.path.split('.');
      return keyArr[keyArr.length - 1];
    });

    arr.forEach((elm, i) => {
      errors[elm] = err.errors[i];
    });

    return res.status(422).json({ errors: errors });
  }
};
