// Zod Schema Validation Runner Middleware
export const validate = (schema) => async (req, res, next) => {
  try {
    const validatedData = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Replace request payloads with parsed and sanitized objects
    if (validatedData.body) req.body = validatedData.body;
    if (validatedData.query) req.query = validatedData.query;
    if (validatedData.params) req.params = validatedData.params;

    next();
  } catch (error) {
    if (error.errors) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.').replace(/^(body|query|params)\./, ''),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed on input parameters.',
        errors: formattedErrors,
      });
    }

    next(error);
  }
};

export default validate;
