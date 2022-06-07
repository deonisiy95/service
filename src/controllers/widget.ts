import Widget from 'models/widget';
import {
  TGetWidgetRequest,
  TGetWidgetsResponse,
  TCreateWidgetsRequest,
  TCreateWidgetResponse,
  TCheckResponse,
  TCheckRequest
} from "src/@types/widget";
import {TRequest, TResponse} from 'src/@types/global';
import {generateString} from 'src/utils/string';
import {TelegramApi} from 'src/helpers/telegramApi';
import {getSendersInfo} from 'src/utils/telegram';

const getAll = (req: TGetWidgetRequest, res: TGetWidgetsResponse) => {
  Widget.find({userId: req.userId})
    .exec()
    .then(widgets => res.json(widgets));
};

const create = async (req: TCreateWidgetsRequest, res: TCreateWidgetResponse) => {
  const {name, token, agents} = req.body;
  const {userId} = req;

  if (!name || !token || !userId) {
    res.status(400).json({message: 'Invalid params!'});
    return;
  }

  const widgetId = generateString(10);
  const widgetAgents = (agents || []).map(agent => ({
    id: agent.id,
    name: agent.name,
    username: agent.username
  }))

  Widget.create({
    name,
    token,
    userId,
    widgetId,
    agentIds: widgetAgents
  }).then(() => res.json({ok: true}));
};

const check = async (req: TCheckRequest, res: TCheckResponse) => {
  const {name, token} = req.body;
  const {userId} = req;

  if (!name || !token || !userId) {
    res.status(400).json({message: 'Invalid params!'});
    return;
  }

  const Api = new TelegramApi(token);
  let updates;

  try {
    updates = await Api.getUpdates();
  } catch (error) {
    console.log('Error request telegram api', error?.message);
  }

  if (!updates?.ok) {
    return res.status(400).json({message: 'Invalid params!'});
  }

  const agents = [];

  for (let update of updates?.result ?? []) {
    if (!update.message?.from) {
      continue;
    }

    agents.push(getSendersInfo(update.message.from));
  }

  res.json(agents);
};

const getAgents = async (req: any, res: any) => {
  try {
    const widget = await Widget.findOne({widgetId: req.params.id, userId: req.userId}).exec();

    if (!widget) {
      return res.json([]);
    }

    const Api = new TelegramApi(widget.token);
    const updates = await Api.getUpdates();
    const agents = [];

    for (let update of updates?.result ?? []) {
      if (!update.message?.from) {
        continue;
      }

      agents.push(getSendersInfo(update.message.from));
    }

    return res.json(agents);
  } catch (error) {
    console.log('Error getAgents', error?.message);
  }

  return res.json([]);
};

const put = (req: TRequest<{}>, res: TResponse<{}>) => {
  Widget.findOneAndUpdate({_id: req.params.id, userId: req.userId}, req.body)
    .exec()
    .then(() => res.json({ok: true}))
    .catch(() => res.status(400).json({message: 'Widget not exist!'}));
};

const remove = (req: TRequest<{}>, res: TResponse<{}>) => {
  Widget.deleteOne({_id: req.params.id, userId: req.userId})
    .exec()
    .then(() => res.json({ok: true}))
    .catch(() => res.status(400).json({message: 'Widget not exist!'}));
};

export default {
  getAll,
  create,
  put,
  remove,
  getAgents,
  check
};
