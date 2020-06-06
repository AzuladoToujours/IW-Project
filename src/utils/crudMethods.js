const { uploadToS3 } = require('./aws.controller');
const _ = require('lodash');
const moment = require('moment-timezone');

const getOne = (model) => async (req, res) => {
  try {
    modelName = model.collection.name;
    if (modelName == 'workers') {
      const doc = await model
        .findOne({ _id: req.params.id })
        .select(
          'role names last_names mobile email dni birthday gender salary photo contract status created_by'
        )
        .lean()
        .exec();

      if (!doc) {
        return res
          .status(400)
          .json({ error: `There's no worker associated with that id` });
      }

      return res.status(200).json({ worker: doc });
    }
  } catch (e) {
    return res.status(500).end();
  }
};

const getMany = (model) => async (req, res) => {
  try {
    modelName = model.collection.name;
    if (modelName == 'workers') {
      const docs = await model
        .find({ status: 'HIRED' })
        .select(
          'role names last_names mobile email dni birthday gender salary photo status created_by updated_at'
        )
        .lean()
        .exec();

      res.status(200).json({ workers: docs });
    }
  } catch (e) {
    return res.status(500).end();
  }
};

const getManyFired = (model) => async (req, res) => {
  try {
    modelName = model.collection.name;
    if (modelName == 'workers') {
      const docs = await model
        .find({ status: 'FIRED' })
        .select(
          'role names last_names mobile email dni birthday gender salary photo status created_by updated_at'
        )
        .lean()
        .exec();

      res.status(200).json({ workers: docs });
    }
  } catch (e) {
    return res.status(500).end();
  }
};

const updateOne = (model) => async (req, res) => {
  let worker = await model.findOne({ _id: req.params.id });
  if (req.file) {
    let correctMimetype =
      req.file.mimetype == 'image/png' || req.file.mimetype == 'image/jpeg';
    if (correctMimetype) {
      const response = await uploadToS3(req, res, req.params.id, req.file);
      worker.photo = response.Location;
    } else {
      res.status(200).json({ error: 'Formato de imagen no permitido.' });
      return;
    }
  }

  worker = _.extend(worker, req.body);

  worker.updated_at = moment.tz('America/Bogota').format();

  await worker.save((err, result) => {
    if (err) {
      console.log(err);
      return res.status(200).json({ error: 'Error al actualizar trabajador' });
    }
    res.status(200).json({ message: 'Trabajador actualizado correctamente' });
  });
};

const removeOne = (model) => async (req, res) => {
  try {
    const fired = await model.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $set: { status: 'FIRED' } },
      { new: true }
    );

    if (!fired) {
      return res
        .status(200)
        .json({ error: 'Error al despedir trabajador, id incorrecta.' });
    }

    return res
      .status(200)
      .json({ message: 'Trabajador despedido exitosamente' });
  } catch (e) {
    console.error(e);
    res
      .status(200)
      .json({ error: 'Error al despedir trabajador, id incorrecta.' });
  }
};

const crudControllers = (model) => ({
  getOne: getOne(model),
  getMany: getMany(model),
  updateOne: updateOne(model),
  removeOne: removeOne(model),
  getManyFired: getManyFired(model),
});

module.exports = {
  crudControllers,
};
