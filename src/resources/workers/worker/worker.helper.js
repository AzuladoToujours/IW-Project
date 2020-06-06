const PDFDocument = require('pdfkit');
const fs = require('fs');
const tablePDF = require('../../../utils/TablePDFkit');
const moment = require('moment');
moment.locale('es-us');

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
  let date = moment().format('LL');
  doc.fontSize(15).text(`Medellín, ${date}.`, {
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

const createPaymentDocument = (worker) => {
  let doc = new tablePDF();
  doc.font('Times-Roman').fontSize(25).text('Human Resources Project', {
    width: 410,
    align: 'center',
  });
  doc.font('Times-Roman').fontSize(15).text('Colilla de pago', {
    width: 410,
    align: 'center',
  });
  doc.moveDown();
  let now = moment().format('MM/YY');
  let oneMothAgo = moment(`${now}`, 'MM/YY')
    .subtract(1, 'months')
    .format('MM/YY');
  let daysInMonth = moment(`${oneMothAgo}`, 'MM/YY').daysInMonth();
  let body = `
  NOMBRE DEL TRABAJADOR:
  ${worker.names} ${worker.last_names}
  CÉDULA DE CIUDADANÍA:
  ${worker.dni}
  PAGO CORRESPONDIENTE:
  del 1/${oneMothAgo} al ${daysInMonth}/${oneMothAgo}`;
  doc.fontSize(15).text(`${body}`, {
    width: 410,
    align: 'left',
  });

  doc.moveDown();
  // draw content, by passing data to the addBody method
  let health = parseFloat(worker.salary) * 0.04;
  let retirement = parseFloat(worker.salary) * 0.04;
  let help = parseFloat('102854');
  let rawTotal = parseFloat(worker.salary) + help;
  let reductions = parseFloat(health + retirement);
  let total = rawTotal - reductions;

  const table = {
    headers: ['Concepto', 'Días', 'Valor'],
    rows: [
      ['SALARIO BÁSICO', `${daysInMonth}`, `${worker.salary}+`],
      ['AUXILIO TRANSPORTE', '', `${help}+`],
      ['SALUD', '', `${health}-`],
      ['PENSIÓN', '', `${retirement}-`],
      ['Total devengado', '', `${rawTotal}+`],
      ['Deducciones', '', `${reductions}-`],
      ['Total neto', '', `${total}`],
    ],
  };
  doc.table(table, {
    prepareHeader: () => doc.font('Helvetica-Bold'),
    prepareRow: (row, i) => doc.font('Helvetica').fontSize(12),
  });
  let date = moment().format('LLLL');
  doc.font('Times-Roman').fontSize(10).text(`Fecha de generación: ${date}`, {
    width: 410,
    align: 'right',
  });
  doc.end();

  return doc;
};

module.exports = { hasAuthorization, createDocument, createPaymentDocument };
