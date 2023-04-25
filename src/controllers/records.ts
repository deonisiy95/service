import Widget from 'models/widget';
import {TAddRecordRequest} from 'src/@types/record';
import {TResponse} from 'src/@types/global';
import Record from 'models/record';

const add = async (req: TAddRecordRequest, res: TResponse<{}>) => {
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

  Record.create({widgetId: req.params.id, data: preparedData, createdAt: Date.now()})
    .then(() => res.json({ok: true}))
    .catch(error => {
      console.log('Error create record', req.params.id, error);
      res.status(500).json({message: 'Internal error'});
    });
};

export default {
  add
};
