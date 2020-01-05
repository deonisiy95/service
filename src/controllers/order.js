const mongoose = require('mongoose');
const Order = mongoose.model('Order');

const getAll = (req, res) => {
  Order.find()
    .exec()
    .then(orders => res.json(orders));
};

const create = (req, res) => {
  const {name, details, broadcasting} = req.body;
  if (!name || !broadcasting) {
    res.status(401).json({message: 'Invalid params!'});
    return;
  }
  Order.create({
    name,
    details,
    broadcasting
  }).then(order => res.json(order));
};

const put = (req, res) => {
  Order.findOneAndUpdate({_id: req.params.id}, req.body)
    .exec()
    .then(() => res.json({success: true}));
};

const remove = (req, res) => {
  Order.deleteOne({_id: req.params.id})
    .exec()
    .then(() => res.json({success: true}));
};

module.exports = {
  getAll,
  create,
  put,
  remove
};
