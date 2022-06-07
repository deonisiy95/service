import {IGetUpdatesMessage} from 'src/@types/telegram';
import {IWidget} from 'models/widget';
import {ArrayElement} from 'src/@types/global';

export function getSendersInfo(
  from: IGetUpdatesMessage['message']['from']
): ArrayElement<IWidget['agents']> {
  return {
    id: from.id,
    name: `${from.first_name ?? ''} ${from.last_name ?? ''}`.trim(),
    username: from.username
  };
}
