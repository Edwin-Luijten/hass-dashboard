import { Typography } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { entityState } from '../../state';
import { HassEntity } from 'home-assistant-js-websocket';
import { WeatherWidget, WeatherWidgetImage, WeatherWidgetImageWrapper, WeatherWidgetState } from './WeatherStyle';
import { getWeatherIcon, getWeatherStatusText, getWeatherTemperature } from '../../lib/weather';

export type WeatherProps = {
    weather: string;
    sun: string;
}

export function Weather(props: WeatherProps) {
    const weather = useRecoilValue<HassEntity | null>(entityState(props.weather));
    const dayPart = useRecoilValue<HassEntity | null>(entityState(props.sun));

    return (
        <WeatherWidget>
            {weather &&
                <>
                    <WeatherWidgetImageWrapper>
                        <WeatherWidgetImage src={getWeatherIcon(weather.state, dayPart?.state)}/>
                    </WeatherWidgetImageWrapper>
                    <WeatherWidgetState>
                        <Typography variant="h1">
                            {getWeatherTemperature(weather.attributes.temperature)}°
                        </Typography>

                        <Typography variant="h3">
                            {getWeatherStatusText(weather.state)}
                        </Typography>
                    </WeatherWidgetState>
                </>
            }
        </WeatherWidget>
    );
}