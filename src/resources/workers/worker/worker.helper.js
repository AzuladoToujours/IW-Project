const PDFDocument = require('pdfkit');

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

const createDocument = (worker) => {
  // Create a document
  let doc = new PDFDocument();
  doc.font('Times-Roman').fontSize(25).text('Human Resources Project', {
    width: 410,
    align: 'center',
  });
  doc.moveDown();
  let date = new Date();
  doc.fontSize(15).text(`Medellín, ${date.toLocaleDateString()}`, {
    width: 410,
    align: 'left',
  });
  doc.moveDown();
  doc.moveDown();
  doc.moveDown();
  doc.fontSize(15).text('A QUIÉN INTERESE, ', {
    width: 410,
    align: 'center',
  });

  let created_at = new Date(worker.created_at);

  created_at = created_at.toLocaleDateString();

  let text =
    `Por medio de la presente, hago constar que ${worker.names} ${worker.last_names}, ` +
    `identificado con cédula número ${worker.dni}, actualmente es parte de la nómina de la empresa ` +
    `Human Resources Project, desde el ${created_at} hasta la fecha, desempeñando el puesto de ${worker.role}, ` +
    `percibiendo un ingreso mensual bruto de $${worker.salary} COP.`;
  doc.moveDown();
  doc.moveDown();
  doc.moveDown();
  doc.fontSize(15).text(`${text}`, {
    width: 410,
    align: 'justify',
  });
  doc.moveDown();
  doc.moveDown();
  doc.moveDown();
  let signature = `
  Atentamente,
  Proyecto Ingeniería Web
  Gerente de Recursos Humanos
  proyectoingenieriaweb@gmail.com`;
  doc.fontSize(15).text(`${signature}`, {
    width: 410,
    align: 'left',
  });

  doc.end();
  return doc;
};

module.exports = { hasAuthorization, createDocument };
