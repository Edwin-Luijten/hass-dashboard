import { HassEntity } from 'home-assistant-js-websocket';
import { useRecoilValue } from 'recoil';
import { entityState } from '../../state';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import {
    TemperatureSlider,
    TemperatureBody,
    TemperatureWidget,
    TemperatureSliderControl,
    TemperatureValue,
    TemperatureSliderControlInner,
} from './TemperatureStyle';
import { useCallback, useEffect, useState } from 'react';
import { useHomeAssistant } from '../../hooks/useHomeAssistant';
import { Dialog } from '../Dialog/Dialog';
import { useDoubleTap } from 'use-double-tap';
import { BlurOnSharp, ThermostatSharp, WaterSharp } from '@mui/icons-material';
import { CircularButton } from '../Buttons/CirclularButton';
import Grid from '@mui/material/Unstable_Grid2';
import { Dial } from '../Dial/Dial';

export type ClimateProps = {
    climate: {
        thermostat: string;
        humidity: string;
        air_quality: string;
        pm2_5: string;
    };
}

const TABS = {
    thermostat: 'thermostat',
    humidity: 'humidity',
}

export function Temperature(props: ClimateProps) {
    const {callService} = useHomeAssistant();
    const thermostat = useRecoilValue<HassEntity | null>(entityState(props.climate.thermostat));
    const humidity = useRecoilValue<HassEntity | null>(entityState(props.climate.humidity));
    const airQuality = useRecoilValue<HassEntity | null>(entityState(props.climate.air_quality));
    const pm2_5 = useRecoilValue<HassEntity | null>(entityState(props.climate.pm2_5));
    const [activeKnob, setActiveKnob] = useState<string>(TABS.thermostat);

    const [temperatureValue, setTemperatureValue] = useState<number>(0);
    const [humidityValue, setHumidityValue] = useState<number>(0);

    const [isDialogOpen, setDialogToOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [backgroundColor, setBackgroundColor] = useState('hsl(209, 100%, 42%)');


    const handleClose = () => setDialogToOpen(false);

    const openDialog = useCallback(() => {
        setDialogToOpen(true);
    }, [setDialogToOpen]);

    const tap = useDoubleTap(() => {
    }, 300, {
        onSingleTap: openDialog,
    });

    const updateTemp = useCallback((temp: number) => {
        temp = Math.round(temp);
        const val = -230 + temp * 7.5;

        setBackgroundColor(`hsl(${val}, 100%, 57%)`);
        setTemperatureValue(temp);
    }, [setTemperatureValue, setBackgroundColor]);

    const setTemperature = useCallback(() => {
        if (loading) return;

        setLoading(true);

        callService('climate', 'set_temperature', {
            temperature: Math.round(temperatureValue),
        }, {
            entity_id: props.climate.thermostat,
        }).finally(() => setLoading(false))
    }, [loading, props.climate.thermostat, temperatureValue, callService, setLoading]);

    useEffect(() => {
        if (thermostat) {
            setTemperatureValue(thermostat.attributes.status.setpoint_status.target_heat_temperature);
        }

        if (humidity) {
            setHumidityValue(Number(humidity.state));
        }


    }, [thermostat, updateTemp, setTemperatureValue, setHumidityValue]);

    return (
        <Box sx={{display: 'flex', alignItems: 'stretch', height: '100%', paddingTop: 1}}>
            {thermostat &&
                <>
                    <TemperatureWidget {...tap}>
                        <TemperatureBody>
                            <TemperatureSlider>
                                <TemperatureSliderControl>

                                </TemperatureSliderControl>
                                <TemperatureValue>
                                    <Typography variant="h5"
                                                sx={{textTransform: 'uppercase'}}>{thermostat.state}</Typography>
                                    <Typography variant="h2">{temperatureValue}</Typography>
                                    <Typography variant="h6"
                                                sx={{fontSize: 12}}>{thermostat.attributes.current_temperature}</Typography>
                                </TemperatureValue>
                                <TemperatureSliderControlInner sx={{backgroundColor: backgroundColor}}>
                                </TemperatureSliderControlInner>
                            </TemperatureSlider>
                        </TemperatureBody>
                    </TemperatureWidget>

                    <Dialog open={isDialogOpen} onClose={handleClose} title="Configure Climate">
                        <Grid container>
                            <Grid xs={6}>
                                <Grid container>
                                    <Grid xs={6}>
                                        <List>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <CircularButton
                                                        className={activeKnob === TABS.thermostat ? 'active' : undefined}
                                                        sx={{minWidth: 50, width: 50, height: 50}}
                                                        onClick={() => setActiveKnob(TABS.thermostat)}
                                                    >
                                                        <ThermostatSharp/>
                                                    </CircularButton>
                                                </ListItemAvatar>
                                                <ListItemText primary="Set Temperature" secondary={``}/>
                                            </ListItem>
                                        </List>
                                    </Grid>
                                    <Grid xs={6}>
                                        <List>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <CircularButton
                                                        className={activeKnob === TABS.humidity ? 'active' : undefined}
                                                        sx={{minWidth: 50, width: 50, height: 50}}
                                                        onClick={() => setActiveKnob(TABS.humidity)}
                                                    >
                                                        <WaterSharp/>
                                                    </CircularButton>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`Humidity ${humidity?.state}${humidity?.attributes.unit_of_measurement}`}
                                                    secondary={``}/>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <CircularButton sx={{minWidth: 50, width: 50, height: 50}}>
                                                        <BlurOnSharp/>
                                                    </CircularButton>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={`Particles ${pm2_5?.state} ${pm2_5?.attributes.unit_of_measurement}`}
                                                    secondary={``}/>
                                            </ListItem>
                                        </List>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid xs={6}>
                                {activeKnob === TABS.thermostat ?
                                    <Dial
                                        steps={30}
                                        title={TABS.thermostat}
                                        value={Number(thermostat.attributes.status.setpoint_status.target_heat_temperature)}
                                        onChange={updateTemp}
                                    >
                                    </Dial>
                                    : activeKnob === TABS.humidity ?
                                        <Dial
                                            steps={70}
                                            title={TABS.thermostat}
                                            value={Number(humidity?.state)}
                                            onChange={setHumidityValue}
                                        >
                                        </Dial>
                                        : <></>
                                }
                            </Grid>
                        </Grid>
                    </Dialog>
                </>
            }
        </Box>
    )
}