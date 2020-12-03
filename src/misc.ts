export const sanitize = (str: string) =>
  str
    .replace(/#.*/g, '')
    .replace(/ /g, '')
    .replace(/\r?\n|\r/g, '');
