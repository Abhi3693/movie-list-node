function errorController(err, req, res, next) {
  if (err.name == 'ValidationError') return handleValidationError(err, res);
  if (err.name == 'CastError')
    return res.status(400).json({ errors: 'Bad request' });
  if (err.name == 'TypeError')
    return res.status(400).json({ errors: 'Not found' });
  if (err.code && err.code == 11000)
    return (err = handleDuplicateKeyError(err, res));

  res.status(500).json({ errors: 'An unknown error occurred.' });
}

const handleValidationError = (err, res) => {
  let allErrors = {};

  let errorPath = Object.keys(err.errors).map((elm, i) => {
    return elm;
  });

  let errorValue = Object.values(err.errors).map((elm, i) => {
    return elm['properties']['message'] || 'Validation failed';
  });

  errorPath.forEach((elm, i) => {
    allErrors[elm] = errorValue[i] || 'Validation failed';
  });

  res.status(400).json({ errors: allErrors });
};

const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue);
  res.status(409).json({
    errors: `${Object.keys(err.keyValue)} with this ${Object.values(
      err.keyValue
    )} already exists.`,
  });
};

module.exports = errorController;
