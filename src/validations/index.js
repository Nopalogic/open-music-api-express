import { Exception } from "../exceptions/error-handler.js";

const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (result.error) {
    throw new Exception(400, result.error.message);
  } else {
    return result.value;
  }
};

export { validate };

