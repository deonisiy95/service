import winston, {format} from 'winston';
import util from 'util';

const enumerateErrorFormat = winston.format(info => {
  if (info.message instanceof Error) {
    info.message = Object.assign(
      {
        message: info.message.message,
        stack: info.message.stack
      },
      info.message
    );
  }

  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack
      },
      info
    );
  }

  return info;
});

const logger = winston.createLogger({
  format: winston.format.combine(
    format.timestamp({format: 'DD-MM-YYYY HH:mm:ss'}),
    enumerateErrorFormat(),
    {
      transform: info => {
        try {
          const args = [info.message, ...(info[Symbol.for('splat')] || [])];
          info.message = args;

          const msg = args
            .map(arg => {
              if (typeof arg == 'object')
                return util.inspect(arg, {compact: true, depth: Infinity});
              return arg;
            })
            .join(' ');

          info[Symbol.for('message')] = `${info.timestamp} [${info[Symbol.for('level')]}]: ${msg}${
            info.stack ? ' ' + info.stack : ''
          }`;
        } catch (error) {
          console.log(error);
        }

        return info;
      }
    }
  ),
  transports: [new winston.transports.File({filename: '/var/log/api_logs.txt'})]
});

export {logger};
