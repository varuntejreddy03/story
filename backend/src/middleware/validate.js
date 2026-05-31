export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.errors = errors;
    next(error);
    return;
  }

  req.validated = result.data;
  next();
};
