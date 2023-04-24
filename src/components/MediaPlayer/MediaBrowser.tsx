import { useCallback, useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { PlaylistMusic } from 'mdi-material-ui';
import {
    AlbumSharp,
    AppsSharp, ArrowBackSharp,
    AudioFileSharp, LibraryMusicSharp,
    PeopleSharp, PlaylistPlaySharp,
    PodcastsSharp
} from '@mui/icons-material';
import { Box, Button, Card, CardContent, ClickAwayListener, Modal, Slide, Stack, Typography } from '@mui/material';
import * as React from 'react';
import { useHomeAssistant } from '../../hooks/useHomeAssistant';

export type MediaBrowserProps = {
    entityId: string;
    openBrowser: boolean;
    closeBrowser: () => void;
}

export type Directory = {
    can_expand: boolean;
    can_play: boolean;
    children_media_class: string;
    media_class: string;
    media_content_id: string;
    media_content_type: string;
    thumbnail: string;
    title: string;
    children: Array<Directory>;
}

const dialogStyle = {
    position: 'absolute',
    bottom: '0',
    width: '100%',
    backgroundColor: 'rgba(18, 19, 36, .8)',
    backdropFilter: 'blur(6px)',
    boxShadow: 24,
    border: 'none',
    outline: 'none',
    height: 700,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    paddingLeft: 10,
    paddingRight: 10,
    overflow: 'hidden',
    paddingTop: 5,
};

const buttonStyle = {
    borderRadius: '50%',
    width: 64,
    height: 64,
}

function getIcon(directory: Directory): JSX.Element {
    if (directory.thumbnail) return (
        <div><img src={`${directory.thumbnail}`} style={{width: 190, height: 190}} alt={directory.title}/></div>);

    let icon;
    switch (directory.title.toLowerCase()) {
        case 'playlists':
        case 'featured playlists':
            icon = <PlaylistMusic sx={{fontSize: 100}}/>;
            break;
        case 'artists':
        case 'top artists':
            icon = <PeopleSharp sx={{fontSize: 100}}/>;
            break;
        case 'albums':
        case 'new releases':
            icon = <AlbumSharp sx={{fontSize: 100}}/>;
            break;
        case 'tracks':
        case 'recently played':
        case 'top tracks':
            icon = <AudioFileSharp sx={{fontSize: 100}}/>;
            break;
        case 'podcasts':
            icon = <PodcastsSharp sx={{fontSize: 100}}/>;
            break;
        case 'categories':
            icon = <AppsSharp sx={{fontSize: 100}}/>;
            break;
        default:
            icon = <></>
    }

    return <div style={{
        width: 190,
        height: 190,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>{icon}</div>;
}

export function MediaBrowser(props: MediaBrowserProps) {
    const {sendMessage, callService} = useHomeAssistant();
    const [directory, setDirectory] = useState<Directory | null>(null);
    const [parent, setParent] = useState<Directory | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [player, setPlayer] = useState<string>('');

    const getLibrary = useCallback((entityId: string) => {
        setLoading(true);
        sendMessage({
            id: 40,
            type: 'media_player/browse_media',
            entity_id: entityId,
            media_content_id: 'spotify://6ecc28959a6a6dc30d69495f03e1af3f',
            media_content_type: 'spotify://library'
        }).then((response: any) => {
            setDirectory(response);
        }).finally(() => setLoading(false));
    }, [setDirectory, sendMessage]);

    const play = useCallback((item: Directory) => {
        setLoading(true);
        callService('media_player', 'play_media', {
            media_content_id: item.media_content_id,
            media_content_type: item.media_content_type,
        }, {
            entity_id: props.entityId,
        }).finally(() => setLoading(false));
    }, [setLoading, callService, props.entityId]);

    const onClick = useCallback((item: Directory) => {
        if (item.can_expand) {
            setLoading(true);
            sendMessage({
                id: 34,
                type: 'media_player/browse_media',
                media_content_id: item.media_content_id,
                media_content_type: item.media_content_type,
                entity_id: player,
            }).then((response: any) => {
                setParent(directory);
                setDirectory(response);
            }).finally(() => setLoading(false));
        } else if (item.can_play) {
            play(item);
        }
    }, [directory, setDirectory, sendMessage, play, player]);

    const goBack = useCallback(() => {
        if (parent && parent.title !== directory?.title) {
            onClick(parent);
        }
    }, [directory, parent, onClick]);


    useEffect(() => {
        if (props.openBrowser && player !== props.entityId) {
            setPlayer(props.entityId);
            getLibrary(props.entityId);
        }
    }, [props.openBrowser, props.entityId, getLibrary, setPlayer, player]);

    return (
        <Modal
            open={props.openBrowser}
            onClose={props.closeBrowser}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            hideBackdrop={true}
        >
            <Slide direction="up" in={props.openBrowser}>
                <Box sx={dialogStyle}>
                    <ClickAwayListener onClickAway={props.closeBrowser}>
                        <Card sx={{backgroundColor: 'transparent', backgroundImage: 'none', boxShadow: 'none'}}>
                            <Grid container>
                                <Grid xs={2}>
                                    <Grid container spacing={0}>
                                        <Grid xs={12}>
                                            <Typography variant="h3">
                                                Browser
                                            </Typography>

                                            {directory &&
                                                <>
                                                    <Typography variant="h6">
                                                        {directory.title}
                                                    </Typography>

                                                    <Stack direction="row" alignItems="center" spacing={1}
                                                           sx={{paddingTop: 1}}>
                                                        <Button variant="outlined" disabled={loading}
                                                                sx={buttonStyle}
                                                                onClick={() => getLibrary(props.entityId)}><LibraryMusicSharp/></Button>
                                                        <Button variant="outlined" disabled={loading}
                                                                sx={buttonStyle}
                                                                onClick={goBack}><ArrowBackSharp/></Button>
                                                        {
                                                            directory.can_play && directory.media_class === 'playlist' ?
                                                                <Button variant="outlined" disabled={loading}
                                                                        sx={buttonStyle}
                                                                        onClick={() => play(directory)}><PlaylistPlaySharp/></Button> : <></>
                                                        }
                                                    </Stack>
                                                </>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid xs={10} sx={{padding: 4}}>
                                    <CardContent>
                                        <Grid container spacing={1}
                                              sx={{overflowY: 'auto', height: 550}}>
                                            {directory?.children.map((item, i) => (
                                                <Grid xs={2} key={i} sx={{textAlign: 'center', height: 220, width: 220}}
                                                      onClick={() => onClick(item)}>
                                                    {getIcon(item)}
                                                    {item.title}
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </Card>
                    </ClickAwayListener>
                </Box>
            </Slide>
        </Modal>
    );
}