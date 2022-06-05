import Widget from 'models/widget';
import {
  TGetWidgetRequest,
  TGetWidgetsResponse,
  TCreateWidgetsRequest,
  TCreateWidgetResponse
} from 'src/@types/widget';
import {TRequest, TResponse} from 'src/@types/global';
import {generateString} from 'src/utils/string';
import {TelegramApi} from 'src/helpers/telegramApi';

const getAll = (req: TGetWidgetRequest, res: TGetWidgetsResponse) => {
  Widget.find({userId: req.userId})
    .exec()
    .then(widgets => res.json(widgets));
};

const create = async (req: TCreateWidgetsRequest, res: TCreateWidgetResponse) => {
  const {name, token} = req.body;
  const {userId} = req;

  if (!name || !token || !userId) {
    res.status(400).json({message: 'Invalid params!'});
    return;
  }

  const Api = new TelegramApi(token);
  let result;

  try {
    result = await Api.getUpdates();
  } catch (error) {
    console.log('Error request telegram api', error?.message);
  }

  console.log(result);

  if (!result?.data?.ok) {
    return res.status(400).json({message: 'Invalid params!'});
  }

  const widgetId = generateString(10);

  Widget.create({
    name,
    token,
    userId,
    widgetId
  }).then(widget =>
    res.json({
      name: widget.name,
      token: widget.token,
      widgetId: widget.widgetId
    })
  );
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
