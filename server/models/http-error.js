class HttpError extends Error {
  constructor(message, errorCode, errors) {
    super(message);
    this.code = errorCode;
    this.errors = errors || null;
  }
}

module.exports = HttpError;
