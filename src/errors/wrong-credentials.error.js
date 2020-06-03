class WrongCredentialsError extends Error {
  constructor() {
    super('Credenciales erroneas');
    this.name = 'WrongCredentials';
    this.error = 'Credenciales erroneas';
    this.status = 200;
  }

  errorResponse(res) {
    return res.status(this.status).json({ error: `${this.error}` });
  }

  firedResponse(res) {
    let reason = 'Usted ha sido despedido';
    return res.status(this.status).json({ error: `${this.error}. ${reason}` });
  }

  alreadyExistsResponse(res, property) {
    let reason = 'ya existente.';
    return res
      .status(this.status)
      .json({ error: `${this.error}. ${property} ${reason}` });
  }

  wrongInvitation(res) {
    let reason =
      'El email de la invitación y el email sumistrado no corresponden.';
    return res.status(this.status).json({ error: `${this.error}. ${reason}` });
  }
}

module.exports = WrongCredentialsError;
