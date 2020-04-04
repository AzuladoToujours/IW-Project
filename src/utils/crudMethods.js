const getOne = (model) => async (req, res) => {
  try {
    modelName = model.collection.name;
    if (modelName == 'workers') {
      const doc = await model
        .findOne({ _id: req.params.id })
        .select(
          'role names last_names mobile email dni birthday gender salary created_by'
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
        .find()
        .select(
          'role names last_names mobile email dni birthday gender salary created_by'
        )
        .lean()
        .exec();

      res.status(200).json({ workers: docs });
    }
  } catch (e) {
    return res.status(500).end();
  }
};

const createOne = (model) => async (req, res) => {
  try {
    const docs = await model.create({ ...req.body });
    return res.status(201).json({ message: 'Worker created succesfuly' });
  } catch (e) {
    return res.status(400).end();
  }
};

const crudControllers = (model) => ({
  getOne: getOne(model),
  getMany: getMany(model),
});

module.exports = {
  crudControllers,
};
