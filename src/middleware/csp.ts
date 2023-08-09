import cors from 'cors';

type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];

const whitelist = ['http://app.askio.ru', 'https://app.askio.ru', 'http://localhost:8080'];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, origin?: StaticOrigin) => void
  ) => {
    let access = false;

    if (origin && whitelist.includes(origin)) {
      access = true;
    }

    callback(null, access);
  },
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS']
};

const csp = cors(corsOptions);

export {csp};
