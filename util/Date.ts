import moment from 'moment';
const thisSunday = (id: number) => moment().day(id).format('YYYY-MM-DD');
const tweetTime = (date: Date) => moment(date).fromNow();
export {thisSunday, tweetTime};
