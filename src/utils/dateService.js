import { parse, parseISO, format, isValid } from 'date-fns';

export const formatToMMDDYYYYhhmmA = (dateString) => {
  if (!dateString) return '';

  let parsedDate = parseISO(dateString);

  if (!isValid(parsedDate)) {
    parsedDate = parse(dateString, 'yyyy-MM-dd HH:mm:ss', new Date());
  }

  return isValid(parsedDate)
    ? format(parsedDate, 'MM/dd/yyyy h:mm a')
    : '';
};