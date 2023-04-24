import Sunny from '../../static/images/weather/sunny.png';
import ClearNight from '../../static/images/weather/clear-night.png';
import PartlyCloudy from '../../static/images/weather/partly-cloudy.png';
import Rainy from '../../static/images/weather/rainy.png';
import Cloudy from '../../static/images/weather/cloudy.png';
import SnowyRainy from '../../static/images/weather/snowy-rainy.png';

export function getWeatherIcon(state: string, dayPart?: string): string {
    switch (state) {
        case 'sunny':
            return Sunny;
        case 'clear-night':
            return ClearNight;
        case 'partlycloudy':
            return PartlyCloudy;
        case 'rainy':
            return Rainy;
        case 'cloudy':
            return Cloudy;
        case 'snowy-rainy':
            return SnowyRainy;
        default:
            return Sunny;
    }
}

export function getWeatherStatusText(state: string, dayPart?: string): string {
    switch (state) {
        case 'sunny':
            return 'sunny';
        case 'clear-night':
            return 'clear';
        case 'partlycloudy':
            return 'partly cloudy'
        case 'rainy':
            return 'rainy';
        case 'cloudy':
            return 'cloudy';
        case 'snowy-rainy':
            return 'snow & rain'
        default:
            return 'sunny';
    }
}

export function getWeatherTemperature(temp: number): number {
    return Math.round(temp);
}