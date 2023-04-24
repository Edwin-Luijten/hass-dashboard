import { useState } from 'react';
import { callService, Connection, MessageBase, subscribeEntities } from 'home-assistant-js-websocket';
import { useRecoilState } from 'recoil';
import { entities } from '../state';
import { HassServiceTarget } from 'home-assistant-js-websocket/dist/types';
import { HassConnection } from '../lib/Hass';
import { MessageSubscription, SendMessage } from '../types';
import { HomeAssistantContext } from '../contexts/HomeAssistantContext';

export const HomeAssistantProvider = ({
                                          url,
                                          token,
                                          browserId,
                                          children
                                      }: { url: string, token: string, browserId: string, children: JSX.Element | JSX.Element[] | string }) => {
    const [connection, setConnection] = useState<Connection | null>(null);
    const [, setEntities] = useRecoilState(entities);

    const makeServiceCall = (domain: string, service: string, serviceData?: object, target?: HassServiceTarget): Promise<unknown> => {
        if (connection) {
            return callService(connection, domain, service, serviceData, target);
        }

        return new Promise((resolve) => resolve(null));
    }

    const makeSendMessage: SendMessage = (message: MessageBase) => {
        if (connection) {
            return connection.sendMessagePromise(message);
        }

        return new Promise<any>(() => {
        });
    }

    const makeSubscribeMessage: MessageSubscription = (callback, subscribeMessage) => {
        if (connection) {
            return connection.subscribeMessage(callback, subscribeMessage);
        }

        return new Promise(() => new Promise((resolve) => resolve(null)));
    }

    return (
        <>
            <HassConnection browserId={browserId} url={url} token={token} onConnect={(conn) => {
                setConnection(conn);

                subscribeEntities(conn, (state) => {
                    setEntities(state);
                });
            }}/>

            {
                connection &&
                <HomeAssistantContext.Provider
                    value={{
                        callService: makeServiceCall,
                        sendMessage: makeSendMessage,
                        subscribeMessage: makeSubscribeMessage,
                    }}>

                    {children}
                </HomeAssistantContext.Provider>
            }
        </>
    );
}