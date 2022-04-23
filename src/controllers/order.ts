import Order from 'models/order';

const getAll = (req: any, res: any) => {
  Order.find({userId: req.userId})
    .exec()
    .then(orders => res.json(orders));
};

const create = (req: any, res: any) => {
  const {name, details, broadcasting} = req.body;
  const {userId} = req;

  if (!name || !broadcasting || !userId) {
    res.status(400).json({message: 'Invalid params!'});
    return;
  }

  Order.create({
    name,
    details,
    broadcasting,
    userId
  }).then(order => res.json(order));
};

const put = (req: any, res: any) => {
  Order.findOneAndUpdate({_id: req.params.id, userId: req.userId}, req.body)
    .exec()
    .then(() => res.json({success: true}))
    .catch(e => res.status(400).json({message: 'Order not exist!'}));
};

const remove = (req: any, res: any) => {
  Order.deleteOne({_id: req.params.id, userId: req.userId})
    .exec()
    .then(() => res.json({success: true}))
    .catch(e => res.status(400).json({message: 'Order not exist!'}));
};

export default {
  getAll,
  create,
  put,
  remove
};
