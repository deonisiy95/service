import {TRequest, TResponse} from 'src/@types/global';

// export default (req: TRequest<unknown>, res: TResponse<unknown>, next: Function) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// };
export default (req: TRequest<unknown>, res: TResponse<unknown>, next: Function) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' askio.ru *.askio.ru; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self'"
  );
  res.setHeader('Access-Control-Allow-Origin', 'askio.ru *.askio.ru')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
};
