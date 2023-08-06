import Form from 'models/form';
import Widget from 'models/widget';
import {IForm, TUpdateFormRequest, TUpdateFormResponse} from 'src/@types/form';
import normalizer from 'src/normalizers/form';
import {TRequest, TResponse} from 'src/@types/global';
import {logger} from 'src/helpers/logger';

const getOne = (req: TRequest<{}>, res: TResponse<IForm>) => {
  Form.findOne({widgetId: req.params.id})
    .exec()
    .then(form => {
      return res.json(form ? normalizer(form) : {});
    });
};

const update = async (req: TUpdateFormRequest, res: TUpdateFormResponse) => {
  const {config} = req.body;

  if (!req.params.id || !config) {
    res.status(400).json({message: 'Invalid params'});
    return;
  }

  const widget = await Widget.findOne({widgetId: req.params.id, userId: req.userId}).exec();

  if (!widget) {
    res.status(400).json({message: 'Widget not exist'});
    return;
  }

  Form.findOneAndUpdate({widgetId: req.params.id}, {config}, {new: true, upsert: true})
    .then(() => res.json({ok: true}))
    .catch(error => {
      logger.error('Error update form', req.params.id, req.userId, error);
      res.status(500).json({message: 'Internal error'});
    });
};

export default {
  getOne,
  update
};
