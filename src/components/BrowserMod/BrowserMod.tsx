import { useRecoilState } from 'recoil';
import { BrowserModCommand } from './types';
import { useCallback, useEffect, useState } from 'react';
import { browserModCommand } from '../../state';
import { Dialog } from '../Dialog/Dialog';
import { AudioPlayer } from '../AudioPlayer/AudioPlayer';
import { AudioVisualizer } from './BrowserModStyle';

export function BrowserMod() {
    const [command, setCommand] = useRecoilState<BrowserModCommand | null>(browserModCommand);
    const [, setBrowserModCommand] = useRecoilState(browserModCommand);
    const [openDialog, setDialogToOpen] = useState(false);
    const [track, setTrack] = useState<{ title: string; src: string } | undefined>(undefined);

    const onClose = useCallback(() => {
        console.debug('onClose');
        setCommand(null);
        setDialogToOpen(false);
    }, [setCommand, setDialogToOpen]);

    useEffect(() => {
        console.log('browsermod', command);
        if (command?.command) {
            setDialogToOpen(true);

            if (command.media_type.startsWith('audio')) {
                setTrack({
                    title: '',
                    src: command?.media_content_id?.replace('http://homeassistant.local:8123', 'https://ironpichi.com') ?? '',
                });
            }
        }
    }, [command, setDialogToOpen, setTrack, setBrowserModCommand]);

    return (
        <Dialog open={openDialog} onClose={onClose} style={{height: 200}} subTitle="Announcement">
            <AudioVisualizer>
                <AudioPlayer track={track} onEnd={onClose}/>
            </AudioVisualizer>
        </Dialog>
    )
}