import { Box, Button, Stack, Typography } from '@mui/material';
import KiaEv6Image from '../../static/images/car.png';
import { useRecoilValue } from 'recoil';
import { entityState } from '../../state';
import {
    CarImage,
    CarWidget,
    BatteryBar,
    CarImageZoomed,
    CardImageWrapper,
    RangeStatus,
    CarLocation
} from './CarStyle';
import { AcUnit, FilterCenterFocus, Lock, LockOpen } from '@mui/icons-material';
import { Fire } from 'mdi-material-ui';
import { HassEntity } from 'home-assistant-js-websocket';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog } from '../Dialog/Dialog';
import { useDoubleTap } from 'use-double-tap';
import Map, { MapRef, Marker } from 'react-map-gl';

const batteryLevelClass = function (state: string, level: number, isCharging: boolean): string | undefined {
    const currentLevel = Number(state);
    const prevLevel = level - 20;

    if (currentLevel < level && isCharging) return 'current';
    else if (currentLevel > prevLevel && currentLevel < level) return 'using'

    if (currentLevel >= level) return 'full';

    return undefined;
}

export type CarProps = {
    lock: string;
    range: string;
    maxRange: string;
    batteryLevel: string;
    charging: string;
    location: string;
    defrost: string;
    airco: string;
}

const buttonStyle = {
    borderRadius: '50%',
    width: 64,
    height: 64,
}

export function Car(props: CarProps) {
    const carLock = useRecoilValue<HassEntity | null>(entityState(props.lock));
    const currentRange = useRecoilValue<HassEntity | null>(entityState(props.range));
    const currentMaxRange = useRecoilValue<HassEntity | null>(entityState(props.maxRange));
    const batteryLevel = useRecoilValue<HassEntity | null>(entityState(props.batteryLevel));
    const batteryCharging = useRecoilValue<HassEntity | null>(entityState(props.charging));
    const currentCarLocation = useRecoilValue<HassEntity | null>(entityState(props.location));
    const deFrost = useRecoilValue<HassEntity | null>(entityState(props.defrost));
    const airco = useRecoilValue<HassEntity | null>(entityState(props.airco));
    const mapRef = useRef<MapRef | null>(null);

    const [isCharging, setCharging] = useState<boolean>(false);
    const [openDialog, setDialogToOpen] = useState(false);

    const handleClose = () => setDialogToOpen(false);

    const openCarDialog = useCallback(() => {
        setDialogToOpen(true);
    }, [setDialogToOpen]);

    const tap = useDoubleTap(openCarDialog, 300, {});

    useEffect(() => {
        if (batteryCharging && batteryCharging.state === 'on') setCharging(true);

        if (mapRef.current && currentCarLocation) {
            mapRef.current.flyTo({
                zoom: 17,
                center: {
                    lng: currentCarLocation.attributes.longitude,
                    lat: currentCarLocation.attributes.latitude,

                }
            });
        }
    }, [batteryCharging, currentCarLocation]);

    const onMapLoad = useCallback(() => {
        if (currentCarLocation) {
            mapRef.current?.flyTo({
                zoom: 17,
                center: {
                    lng: currentCarLocation.attributes.longitude,
                    lat: currentCarLocation.attributes.latitude,
                }
            });
        }
    }, [currentCarLocation]);
    return (
        <Box sx={{display: 'flex', alignItems: 'stretch', height: '100%'}}>
            <CarWidget {...tap}>
                <Typography variant="h1">Kia</Typography>
                <Typography variant="h2"><b>EV6</b></Typography>
                <Stack direction="row" spacing={2}>
                    <Button size="large" variant="outlined" sx={buttonStyle}>
                        {carLock?.state === 'locked' ?
                            <Lock sx={{fontSize: 40}}/>
                            : <LockOpen sx={{fontSize: 40, color: '#FF4433'}}/>
                        }
                    </Button>

                    {deFrost &&
                        <Button size="large" variant="outlined" sx={buttonStyle}>
                            <Fire sx={{fontSize: 40}}/>
                        </Button>
                    }

                    {airco &&
                        <Button size="large" variant="outlined" sx={buttonStyle}>
                            <AcUnit sx={{fontSize: 40}}/>
                        </Button>
                    }

                </Stack>
                <CardImageWrapper>
                    <CarImage src={KiaEv6Image}/>
                </CardImageWrapper>

                {batteryLevel &&
                    <BatteryBar>
                        <li className={batteryLevelClass(batteryLevel.state, 20, isCharging)}></li>
                        <li className={batteryLevelClass(batteryLevel.state, 40, isCharging)}></li>
                        <li className={batteryLevelClass(batteryLevel.state, 60, isCharging)}></li>
                        <li className={batteryLevelClass(batteryLevel.state, 80, isCharging)}></li>
                        <li className={batteryLevelClass(batteryLevel.state, 100, isCharging)}></li>
                    </BatteryBar>
                }

                <Stack direction="row" justifyContent="space-between">
                    {currentRange &&
                        <RangeStatus variant="h5">
                            <b>{currentRange.state}</b> {currentRange?.attributes.unit_of_measurement}
                        </RangeStatus>
                    }

                    {batteryLevel &&
                        <RangeStatus variant="h5">
                            <b>{batteryLevel.state}</b>{batteryLevel?.attributes.unit_of_measurement}
                        </RangeStatus>
                    }
                </Stack>

            </CarWidget>

            <Dialog open={openDialog} onClose={handleClose} title="Kia" subTitle="EV6">
                <Box>
                    {currentCarLocation &&
                        <Typography variant="h4"
                                    sx={{marginBottom: 5, marginTop: 5}}>{currentCarLocation.state}</Typography>
                    }

                    {currentRange && currentMaxRange ?
                        <>
                            <Typography
                                variant="h1"><b>{currentRange.state}</b>{currentRange.attributes.unit_of_measurement}
                            </Typography>
                            <Typography
                                variant="h6">{currentMaxRange.state}{currentMaxRange.attributes.unit_of_measurement}</Typography>
                        </>
                        : <></>}

                    {batteryLevel &&
                        <BatteryBar sx={{marginLeft: 0, marginTop: 5}}>
                            <li className={batteryLevelClass(batteryLevel.state, 20, isCharging)}></li>
                            <li className={batteryLevelClass(batteryLevel.state, 40, isCharging)}></li>
                            <li className={batteryLevelClass(batteryLevel.state, 60, isCharging)}></li>
                            <li className={batteryLevelClass(batteryLevel.state, 80, isCharging)}></li>
                            <li className={batteryLevelClass(batteryLevel.state, 100, isCharging)}></li>
                        </BatteryBar>
                    }
                    {currentCarLocation &&
                        <CarLocation>
                            <Map reuseMaps ref={mapRef} onLoad={onMapLoad}
                                 mapboxAccessToken="pk.eyJ1IjoiZWR3aW5sdWlqdGVuIiwiYSI6ImNsZXpzN3VmdjAyOGszcnIyMjJrM2V3b2QifQ.zqyX_e9dDYJA5vvhWD7J0A"
                                 initialViewState={{
                                     // zoom: 14,
                                 }}
                                 style={{width: 900, height: 900}}
                                 mapStyle="mapbox://styles/edwinluijten/cjztygmjy058k1cqfofn4h3rs"
                                 attributionControl={false}
                            >
                                <Marker
                                    anchor="bottom"
                                    longitude={currentCarLocation.attributes.longitude}
                                    latitude={currentCarLocation.attributes.latitude}>
                                    <FilterCenterFocus sx={{color: '#a832a0', fontSize: 40}}/>
                                </Marker>)
                            </Map>
                        </CarLocation>
                    }

                    <CarImageZoomed src={KiaEv6Image}/>
                </Box>
            </Dialog>
        </Box>
    )
}