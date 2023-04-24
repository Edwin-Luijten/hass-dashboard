import {
    createConnection,
    Connection, createLongLivedTokenAuth,
} from 'home-assistant-js-websocket';
import { useEffect, useState } from 'react';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useRecoilState } from 'recoil';
import { browserModCommand } from '../state';
import { BrowserModCommand } from '../components/BrowserMod/types';

export interface HassProps {
    url: string;
    token: string;
    browserId: string;
    onConnect: (conn: Connection) => void;
}

export const HassConnection = ({url, token, browserId, onConnect}: HassProps) => {
    const [connection, setConnection] = useState<Connection | null>(null);
    const [, setBrowserModCommand] = useRecoilState(browserModCommand);
    const [onConnectCalled, setOnConnectCalled] = useState<boolean>(false);

    useEffectOnce(() => {
        if (connection) return;

        const auth = createLongLivedTokenAuth(
            url,
            token
        );

        createConnection({auth}).then(conn => {
            setConnection(conn);
            console.log('Connected to Home-assistant');
        });
    });

    useEffect(() => {
        if (connection && !onConnectCalled) {
            connection.sendMessage({
                type: 'browser_mod/register',
                browserID: browserId,
            });

            connection.subscribeMessage((msg: BrowserModCommand) => {
                setBrowserModCommand(msg);
            }, {
                type: 'browser_mod/connect',
                browserID: 'panel',
            });

            onConnect(connection);

            setOnConnectCalled(true);
        }
    }, [connection, browserId, onConnect, onConnectCalled, setOnConnectCalled, setBrowserModCommand]);

    return null;
}