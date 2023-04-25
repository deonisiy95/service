import {TMessageRaw} from 'src/@types/message';

export const formatMessage = (message: TMessageRaw): string => {
  return message.reduce((acc, item) => {
    return acc + '\n' + `${item.key}: ${item.value}`;
  }, 'New message');
};
