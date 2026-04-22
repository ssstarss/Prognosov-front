export default function formatDate(date: Date | undefined) {
  if (date) {
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    if (month.length < 2) month = '0' + month;
    let day = date.getDate().toString();
    if (day.length < 2) day = '0' + day;
    let hour = date.getHours().toString();
    if (hour.length < 2) hour = '0' + hour;
    let minutes = date.getMinutes().toString();
    if (minutes.length < 2) minutes = '0' + minutes;
    const result = `${year}-${month}-${day}   ${hour}:${minutes}`;
    return result;
  } else return '00-00-00';
}

export function formatDateString(date: Date | undefined, withYear: boolean = false) {
  const monthes = [
    'янв',
    'фев',
    'мар',
    'апр',
    'мая',
    'июн',
    'июл',
    'авг',
    'сент',
    'окт',
    'ноя',
    'дек',
  ];
  if (date) {
    const year = date.getFullYear();
    let month = monthes[date.getMonth()];
    let day = date.getDate().toString();
    if (day.length < 2) day = '0' + day;
    const result = `${day} ${month} ${withYear ? year : ''}`;
    return result;
  } else return '00-00-00';
}

export function formatTimeString(date: Date | undefined) {
  if (date) {
    let hour = date.getHours().toString();
    let minute = date.getMinutes().toString();
    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;
    const result = `${hour}:${minute}`;
    return result;
  } else return '--:--';
}

export function dateNoHours(date: Date) {
  const myDate = new Date(date);
  return myDate.setHours(0, 0, 0, 0);
}
