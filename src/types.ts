import { MessageBase } from 'home-assistant-js-websocket';
import { HassServiceTarget } from 'home-assistant-js-websocket/dist/types';

export type MessageSubscription = <Result>(callback: (result: Result) => void, subscribeMessage: MessageBase, options?: {
    resubscribe?: boolean;
}) => Promise<() => Promise<void>>;

export type CallService = (domain: string, service: string, serviceData?: object, target?: HassServiceTarget) => Promise<unknown>;

export type SendMessage = <Result>(message: MessageBase) => Promise<Result>;

export interface HomeAssistant {
    callService: CallService;
    sendMessage: SendMessage;
    subscribeMessage: MessageSubscription;
}
