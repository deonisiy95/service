import Widget from 'models/widget';
import Message from 'models/message';
import {
  TAddMessageRequest,
  TGetMessageListRequest,
  TGetMessageListResponse
} from 'src/@types/message';
import {TResponse} from 'src/@types/global';
import {TelegramApi} from 'src/helpers/telegramApi';
import {formatMessage} from 'src/helpers/text';

const add = async (req: TAddMessageRequest, res: TResponse<{}>) => {
  const {data} = req.body;

  if (!req.params.id || !data) {
    res.status(400).json({message: 'Invalid params'});
    return;
  }

  const widget = await Widget.findOne({widgetId: req.params.id}).exec();

  if (!widget) {
    res.status(400).json({message: 'Widget not exist'});
    return;
  }

  const preparedData = data
    ?.map(item => ({key: item?.key, value: item?.value}))
    .filter(item => 'key' in item && 'value' in item);

  if (!preparedData || preparedData.length === 0) {
    res.status(400).json({message: 'Invalid data'});
    return;
  }

  const telegramApi = new TelegramApi(widget.token);

  widget.agents.forEach(agent => {
    telegramApi
      .sendMessage(agent.id, formatMessage(preparedData))
      .catch(error => console.log('Error send order in Telegram', error));
  });

  Message.create({widgetId: req.params.id, data: preparedData, createdAt: Date.now()})
    .then(() => res.json({ok: true}))
    .catch(error => {
      console.log('Error create message', req.params.id, error);
      res.status(500).json({message: 'Internal error'});
    });
};

const getList = async (req: TGetMessageListRequest, res: TGetMessageListResponse) => {
  const offset = req.body.offset ?? 0;
  const limit = req.body.limit ?? 10;

  if (!req.userId) {
    res.status(400).json({message: 'Invalid params'});
    return;
  }

  try {
    const widgets = await Widget.find({userId: req.userId}, {widgetId: 1, _id: 0});

    if (widgets.length === 0) {
      res.json({ok: true, messages: []});
      return;
    }

    const widgetIds = widgets.map(item => item.widgetId);

    const messages = await Message.aggregate([
      {$match: {widgetId: {$in: widgetIds}}},
      {
        $project: {
          _id: 0,
          data: 1,
          createdAt: 1,
          widgetId: 1
        }
      },
      { $skip : offset },
      { $limit : limit }
    ]);

    const total = await Message.find({widgetId: {$in: widgetIds}}).count();

    res.json({
      ok: true,
      messages,
      total
    });
  } catch (error) {
    console.log('Error get messages', req.params.id, error);
    res.status(500).json({message: 'Internal error'});
  }
};

export default {
  add,
  getList
};
