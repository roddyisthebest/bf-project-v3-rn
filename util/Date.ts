import moment from 'moment';
const thisSunday = (id: number) => moment().day(id).format('YYYY-MM-DD');

export {thisSunday};
