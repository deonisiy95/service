import Widget from 'models/widget';
import {
  TGetWidgetRequest,
  TGetWidgetsResponse,
  TCreateWidgetsRequest,
  TCreateWidgetResponse
} from 'src/@types/widget';
import {TRequest, TResponse} from 'src/@types/global';

const getAll = (req: TGetWidgetRequest, res: TGetWidgetsResponse) => {
  Widget.find({userId: req.userId})
    .exec()
    .then(widgets => res.json(widgets));
};

const create = (req: TCreateWidgetsRequest, res: TCreateWidgetResponse) => {
  const {name, token} = req.body;
  const {userId} = req;

  if (!name || !userId) {
    res.status(400).json({message: 'Invalid params!'});
    return;
  }

  Widget.create({
    name,
    token,
    userId
  }).then(widget => res.json(widget));
};

const put = (req: TRequest<{}>, res: TResponse<{}>) => {
  Widget.findOneAndUpdate({_id: req.params.id, userId: req.userId}, req.body)
    .exec()
    .then(() => res.json({ok: true}))
    .catch(e => res.status(400).json({message: 'Widget not exist!'}));
};

const remove = (req: TRequest<{}>, res: TResponse<{}>) => {
  Widget.deleteOne({_id: req.params.id, userId: req.userId})
    .exec()
    .then(() => res.json({ok: true}))
    .catch(e => res.status(400).json({message: 'Widget not exist!'}));
};

export default {
  getAll,
  create,
  put,
  remove
};
