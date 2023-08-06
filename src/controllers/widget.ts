import Widget, {IWidget} from 'models/widget';
import {
  TGetWidgetRequest,
  TGetWidgetsResponse,
  TCreateWidgetsRequest,
  TCreateWidgetResponse,
  TCheckResponse,
  TCheckRequest
} from 'src/@types/widget';
import {TRequest, TResponse} from 'src/@types/global';
import {generateString} from 'src/utils/string';
import {TelegramApi} from 'src/helpers/telegramApi';
import {getSendersInfo} from 'src/utils/telegram';
import normalizer from 'src/normalizers/widget';
import {logger} from 'src/helpers/logger';

const getAll = (req: TGetWidgetRequest, res: TGetWidgetsResponse) => {
  Widget.find({userId: req.userId})
    .exec()
    .then(widgets => {
      return res.json((widgets || []).map(normalizer));
    });
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
  }));

  const widget = await Widget.findOne({token}).exec();

  if (widget) {
    res.status(400).json({message: 'Token already use'});
    return;
  }

  Widget.create({
    name,
    token,
    userId,
    widgetId,
    agents: widgetAgents
  }).then(widget => res.json(normalizer(widget)));
};

const check = async (req: TCheckRequest, res: TCheckResponse) => {
  const {name, token} = req.body;
  const {userId} = req;

  if (!name || !token || !userId) {
    res.status(400).json({message: 'Invalid params'});
    return;
  }

  const Api = new TelegramApi(token);
  let updates;

  try {
    updates = await Api.getUpdates();
  } catch (error) {
    logger.error('Error request telegram api', (error as Error)?.message);
  }

  if (!updates?.ok) {
    return res.status(400).json({message: 'Invalid token'});
  }

  const agents: IWidget['agents'] = [];

  for (let update of updates?.result ?? []) {
    if (!update.message?.from) {
      continue;
    }

    const agent = agents.find(item => item.id === update.message.from.id);

    if (!agent) {
      agents.push(getSendersInfo(update.message.from));
    }
  }

  res.json({agents});
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
    logger.error('Error getAgents', (error as Error)?.message);
  }

  return res.json([]);
};

const update = (req: TRequest<{name: string}>, res: TResponse<{}>) => {
  const {name} = req.body;

  if (!req.params.id || !name) {
    res.status(400).json({message: 'Invalid params'});
    return;
  }

  Widget.findOneAndUpdate(
    {widgetId: req.params.id, userId: req.userId},
    {
      name
    }
  )
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
  update,
  remove,
  getAgents,
  check
};
