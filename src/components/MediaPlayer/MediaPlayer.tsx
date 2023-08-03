import {
    MediaPlayerImage,
    MediaPlayerImageWrapper, MediaPlayerInfo,
    MediaPlayerWidget,
} from './MediaPlayerStyle';
import {
    Box,
    IconButton,
    Slide,
    Slider,
    Stack,
    Typography
} from '@mui/material';
import {
    FastForward,
    FastRewind,
    Pause,
    PlayArrow,
    VolumeDown,
    VolumeUp
} from '@mui/icons-material';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { HassEntity } from 'home-assistant-js-websocket';
import { entityState } from '../../state';
import { useHomeAssistant } from '../../hooks/useHomeAssistant';
import { useDoubleTap } from 'use-double-tap';
import * as React from 'react';
import { MediaBrowser } from './MediaBrowser';

export type MediaPlayerProps = {
    player: string;
}

export const MediaPlayer = (props: MediaPlayerProps) => {
    const {callService} = useHomeAssistant();

    const mediaPlayer = useRecoilValue<HassEntity | null>(entityState(props.player));
    const [paused, setPaused] = useState(false);
    const [volume, setVolume] = useState<number>(0);
    const containerRef = useRef(null);
    const prevImage = useRef<string | null>(null);
    const [openBrowser, setBrowserToOpen] = useState(false);

    useEffect(() => {
        if (mediaPlayer?.state !== 'playing') setPaused(true);
        else setPaused(false);

        prevImage.current = mediaPlayer?.attributes?.entity_picture ?? '';

    }, [mediaPlayer, setPaused]);

    const switched = useCallback((): boolean => {
        return mediaPlayer?.attributes?.entity_picture === prevImage.current ?? false;
    }, [mediaPlayer?.attributes?.entity_picture, prevImage]);

    const onClickNext = useCallback(() => {
        callService('media_player', 'media_next_track', {}, {
            entity_id: mediaPlayer?.entity_id,
        }).then(() => setPaused(true));
    }, [mediaPlayer?.entity_id, callService, setPaused]);

    const onClickPrev = useCallback(() => {
        callService('media_player', 'media_previous_track', {}, {
            entity_id: mediaPlayer?.entity_id,
        }).then(() => setPaused(true));
    }, [mediaPlayer?.entity_id, callService, setPaused]);

    const onClickTogglePause = useCallback(() => {
        callService('media_player', paused ? 'media_play' : 'media_pause', {}, {
            entity_id: mediaPlayer?.entity_id,
        }).then(() => setPaused(!!paused));
    }, [mediaPlayer?.entity_id, paused, callService, setPaused]);

    const onSetVolume = useCallback((volume: number) => {
        callService('media_player', 'volume_set', {volume_level: volume}, {
            entity_id: mediaPlayer?.entity_id,
        }).then(() => setVolume(volume));
    }, [mediaPlayer?.entity_id, callService, setVolume]);

    const openMediaBrowser = useCallback(() => {
        setBrowserToOpen(true);
    }, [setBrowserToOpen]);

    const tap = useDoubleTap(openMediaBrowser, 300, {
        onSingleTap: onClickTogglePause,
    });

    return (
        <>
            <MediaPlayerWidget>
                {mediaPlayer &&
                    <>
                        <MediaPlayerImageWrapper ref={containerRef} sx={{overflow: 'hidden',}} {...tap}>
                            {mediaPlayer?.attributes?.entity_picture && switched() ?
                                <Slide direction="up" in={true} mountOnEnter unmountOnExit
                                       container={containerRef.current}
                                       timeout={{enter: 500, exit: 1000}}>
                                    <MediaPlayerImage
                                        src={`https://ironpichi.com${mediaPlayer?.attributes.entity_picture}`}/>
                                </Slide>
                                : null}
                        </MediaPlayerImageWrapper>
                        <MediaPlayerInfo>
                            <div style={{overflow: 'hidden', textOverflow: 'ellipsis', width: '20rem'}}>
                                <Typography variant="h6" noWrap>{mediaPlayer?.attributes.media_title}</Typography>
                            </div>
                            <Typography variant="h5">{mediaPlayer?.attributes.media_artist}</Typography>

                            <Stack spacing={2} direction="row" sx={{mb: 1, px: 1}} alignItems="center">
                                <VolumeDown/>
                                <Slider
                                    aria-label="Volume"
                                    defaultValue={mediaPlayer?.attributes.volume_level}
                                    onChange={(_, value) => onSetVolume(value as number)}
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    value={volume}
                                    sx={{
                                        color: '#fff',
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
                                <VolumeUp/>
                            </Stack>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mt: -1,
                                }}
                            >
                                <IconButton aria-label="previous song" onClick={onClickPrev}>
                                    <FastRewind fontSize="large"/>
                                </IconButton>
                                <IconButton aria-label={mediaPlayer.state ? 'playing' : 'pause'}
                                            onClick={onClickTogglePause}>
                                    {paused ? (
                                        <PlayArrow
                                            sx={{fontSize: '3rem'}}
                                        />
                                    ) : (
                                        <Pause sx={{fontSize: '3rem'}}/>
                                    )}
                                </IconButton>
                                <IconButton aria-label="next song" onClick={onClickNext}>
                                    <FastForward fontSize="large"/>
                                </IconButton>
                            </Box>
                        </MediaPlayerInfo>
                    </>
                }
            </MediaPlayerWidget>

            <MediaBrowser entityId={props.player} closeBrowser={() => setBrowserToOpen(false)}
                          openBrowser={openBrowser}/>
        </>
    )
}