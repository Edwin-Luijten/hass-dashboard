import { HassEntity } from 'home-assistant-js-websocket';
import { LightbulbGroup, LightbulbGroupOff, LightbulbOff, LightbulbOn, Power } from 'mdi-material-ui';
import Grid from '@mui/material/Unstable_Grid2';
import {
    Box,
    Button,
    Chip,
    Slider, Stack,
    Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { HsvColor } from '@uiw/color-convert';
import { useDoubleTap } from 'use-double-tap';
import { useHomeAssistant } from '../../hooks/useHomeAssistant';
import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { entityState } from '../../state';
import { LightWidget } from './LightStyle';
import Wheel from '@uiw/react-color-wheel';
import colorConvert from 'color-convert';
import { Dialog } from '../Dialog/Dialog';

function getIcon(state: string, attributes: { [key: string]: any }): JSX.Element {
    let color = `#ccc`;
    if (attributes?.rgb_color) color = '#fff';

    if (isGroup(attributes)) {
        switch (state) {
            case 'on':
                return <LightbulbGroup sx={{fontSize: 120, color: color}}/>
            default:
                return <LightbulbGroupOff sx={{fontSize: 120}}/>
        }
    }

    switch (state) {
        case 'on':
            return <LightbulbOn sx={{fontSize: 120, color: '#fff'}}/>
        default:
            return <LightbulbOff sx={{fontSize: 120}}/>
    }
}

function getColor(rgb: Array<number>): string {
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, 1)`;
}

function isGroup(attributes: { [key: string]: any }): boolean {
    return attributes?.lights?.length;
}

function getBrightnessPercentage(current: number, num: true): number;
function getBrightnessPercentage(current: number, num = false): string | number {
    if (!current) return 0;

    const value = (current / 255) * 100;
    if (num) return value;

    return value.toFixed(1);
}

function formatScene(id: string, scene: string): string {
    return `scene.${id.toLowerCase().replace('light.', '').replace(/ /g, '_')}_${scene.toLowerCase().replace(/ /g, '_')}`;
}

export type LightProps = {
    light: string;
}

export function Light(props: LightProps) {
    const light = useRecoilValue<HassEntity | null>(entityState(props.light));
    const [openDialog, setDialogToOpen] = useState(false);
    const [hsva, setHsva] = useState({h: 0, s: 0, v: 100});
    const [loading, setLoading] = useState(false);
    const {callService} = useHomeAssistant();

    const handleClose = () => setDialogToOpen(false);

    const openLightDialog = useCallback(() => {
        setDialogToOpen(true);
    }, [setDialogToOpen]);

    const toggleLight = useCallback(() => {
        if (!loading) {
            setLoading(true);
            callService('homeassistant', 'toggle', {}, {
                entity_id: props.light,
            }).finally(() => setLoading(false));
        }
    }, [props.light, loading, callService, setLoading])

    const tap = useDoubleTap(openLightDialog, 300, {
        onSingleTap: toggleLight,
    });

    const setBrightness = useCallback((event: React.SyntheticEvent | Event, value: number | number[]): void => {
        if (!loading) {
            setLoading(true);
            callService('light', 'turn_on', {
                brightness_pct: value,
            }, {
                entity_id: props.light,
            }).finally(() => setLoading(false));
        }
    }, [loading, setLoading, callService, props.light]);

    const changeColor = useCallback((color: HsvColor) => {
        if (!loading) {
            setLoading(true);
            const xy = colorConvert.hsv.hsl([color.h, color.s, color.v]);
            callService('light', 'turn_on', {
                hs_color: [xy[0], xy[1]],
            }, {entity_id: props.light}).then(() => {
                setHsva(color);
            }).finally(() => setLoading(false));
        }
    }, [setHsva, props.light, loading, callService, setLoading]);

    const activateScene = useCallback((scene: string) => {
        if (!loading && light) {
            setLoading(true);

            callService('scene', 'turn_on', {}, {entity_id: formatScene(light.entity_id, scene)}).finally(() => setLoading(false));
        }
    }, [light, loading, callService, setLoading]);

    useEffect(() => {
        if (light?.attributes?.hs_color) {
            setHsva({
                h: light.attributes.hs_color[0],
                s: light.attributes.hs_color[1],
                v: light.attributes.hs_color[2]
            });
        }
    }, [light, setHsva]);

    return (
        <Box sx={{display: 'flex', alignItems: 'stretch', height: '100%', paddingBottom: 1}}>
            {light &&
                <>
                    <LightWidget sx={{
                        display: 'flex',
                        width: '100%',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: getColor(light.attributes.rgb_color ?? [0, 0, 0])
                    }} {...tap}>
                        {getIcon(light.state, light.attributes)}
                    </LightWidget>

                    <Dialog open={openDialog} onClose={handleClose} title={light.attributes.friendly_name}
                            actions={<Button size={'large'} onClick={toggleLight}><Power
                                sx={{fontSize: 40}}/></Button>}>
                        <Grid container>
                            <Grid xs={7}>
                                <Typography gutterBottom variant="h5" component="div">
                                    Scenes
                                </Typography>
                                <Typography variant="body2" component="div" color="text.secondary">
                                    {
                                        light.attributes?.hue_scenes.reduce((result: Array<Array<string>>, item: string, index: number) => {
                                            const chunkIndex = Math.floor(index / 8)

                                            if (!result[chunkIndex]) {
                                                result[chunkIndex] = [];
                                            }

                                            result[chunkIndex].push(item)

                                            return result
                                        }, []).map((scenes: Array<string>, i: number) => (
                                            <Stack direction="row" spacing={1} key={i} sx={{marginTop: 1}}>
                                                {scenes.map((scene: string) => (
                                                    <Chip clickable label={scene} key={`${i}-${scene}`}
                                                          onClick={() => activateScene(scene)}/>

                                                ))}
                                            </Stack>
                                        ))
                                    }
                                    <Typography gutterBottom variant="h5" component="div"
                                                sx={{mt: 10}}>
                                        Brightness
                                    </Typography>
                                    <Stack spacing={2} direction="row" sx={{mb: 1, px: 1}}
                                           alignItems="center">
                                        <div>0%</div>
                                        <Slider
                                            onChangeCommitted={setBrightness}
                                            valueLabelDisplay="auto"
                                            aria-label="Volume"
                                            step={1}
                                            value={getBrightnessPercentage(light.attributes.brightness, true)}
                                            sx={{
                                                marginBottom: 2,
                                                color: 'rgba(255,255,255,255.87)',
                                                '& .MuiSlider-track': {
                                                    border: 'none',
                                                },
                                                '& .MuiSlider-thumb': {
                                                    width: 24,
                                                    height: 24,
                                                    backgroundColor: '#fff',
                                                    '&:before': {
                                                        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                                                    },
                                                    '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                                        boxShadow: 'none',
                                                    },
                                                },
                                            }}
                                        />
                                        <div>100%</div>
                                    </Stack>
                                </Typography>
                            </Grid>
                            <Grid xs={5} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Wheel
                                    width={450}
                                    height={450}
                                    color={{...hsva, a: 1}}
                                    onChange={(newHue) => changeColor(newHue.hsv)}
                                />
                            </Grid>
                        </Grid>
                    </Dialog>
                </>
            }
        </Box>
    )
}