const ProductQuerySchema = require('./schema')

const ProductValidator = {
  validateQuery: (query) => {
    const validationResult = ProductQuerySchema.validate(query);

    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }

    return validationResult;
  }
}