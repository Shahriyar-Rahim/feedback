const DANGEROUS_KEYS = ["__proto__", "constructor", "prototype"];

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  for (const key of Object.keys(obj)) {
    if (
      key.startsWith("$") ||
      key.includes(".") ||
      DANGEROUS_KEYS.includes(key)
    ) {
      delete obj[key];
      continue;
    }

    if (obj[key] && typeof obj[key] === "object") {
      sanitizeObject(obj[key]);
    }
  }

  return obj;
};

const sanitizeMiddleware = (req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);
  if (req.query) sanitizeObject(req.query);
  next();
};

export default sanitizeMiddleware;
