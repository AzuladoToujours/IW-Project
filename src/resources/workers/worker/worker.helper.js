const hasAuthorization = (req, res, next) => {
  //Checks if the user is signed in and checks if he is the same as the url
  let isSameUser = req.auth && req.params.id == req.auth._id;
  //Checks if the user is signed in and checks if his role is admin
  let isAdmin = req.auth && req.auth.role === 'admin';

  const isAuthorized = isAdmin || isSameUser;

  if (!isAuthorized) {
    return res.status(200).json({
      error: 'El usuario no está autorizado para realizar esta acción.',
    });
  }

  if (isAdmin) {
    req.isAdmin = isAdmin;
  }

  next();
};

module.exports = { hasAuthorization };
