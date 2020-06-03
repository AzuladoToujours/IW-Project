class NotAuthorizedError extends Error {
  constructor() {
    super();
    this.name = 'NotAuthorizedError';
    this.error = 'No está autorizado.';
    this.status = 200;
  }

  errorResponse(res) {
    return res.status(this.status).json({ error: `${this.error}` });
  }

  errorDto() {
    return {
      status: this.status,
      message: this.message,
      error: this.error,
    };
  }
}

module.exports = NotAuthorizedError;
