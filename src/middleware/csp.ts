import cors from 'cors';
import {TRequest} from 'src/@types/global';

const allowDomains = ['http://app.askio.ru', 'https://app.askio.ru', 'http://localhost:8080'];
const noCorsRoutes = ['/config/', '/widgets/form/'];

const corsOptionsDelegate = (req: TRequest<unknown>, callback: Function) => {
  const corsOptions = {
    origin: false,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS']
  };
  const origin = req.header('Origin');

  if (origin && allowDomains.includes(origin)) {
    corsOptions.origin = true;
  } else {
    const isNoCorsRoute = noCorsRoutes.some(route => req?.originalUrl?.startsWith(route));

    isNoCorsRoute && (corsOptions.origin = true);
  }

  callback(null, corsOptions);
};

const csp = cors(corsOptionsDelegate);

export {csp};
