const errorMsgs = [
  '',
  'The item doesn\'t exists',
  'The item already exists',
  'Invalid body format',
  'Invalid token',
  'Expired token',
  'Invalid server key',
  'The item hasn\'t a valid name'
];

export function errorMsg(code: number, extra: string = ''): string {
  if (code < errorMsgs.length) {
    let msg = errorMsgs[code];
    if (extra) msg += ` (${extra})`;
    return msg;
  }
  return 'Unknow error';
}