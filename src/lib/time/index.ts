import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Amsterdam');

const DATE_TIME_FORMAT_YMDHIS= 'YYYY-MM-DD HH:mm:ss';

export function formatTimestamp(timestamp: number): string {
    return dayjs.unix(timestamp).format(DATE_TIME_FORMAT_YMDHIS);
}