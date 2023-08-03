import { atom, selectorFamily } from 'recoil';
import { HassEntities, HassEntity } from 'home-assistant-js-websocket';
import { BrowserModCommand } from '../components/BrowserMod/types';

const initialInteraction = atom<boolean>({
   key: 'initial-interaction',
    default: false,
});

const browserModCommand = atom<BrowserModCommand | null>({
    key: 'browser-mod-command',
    default: null,
});

const entities = atom<HassEntities | null>({
    key: 'entities',
    default: null,
});

const entityState = selectorFamily({
    key: 'entity-state',
    get: (id: string) => ({get}) => get(entities)?.[id] ?? null,
});

const entityStateArray = selectorFamily({
    key: 'entity-state-array',
    get: (ids: Array<string>) => ({get}) => {
        const items: Array<HassEntity> = [];

        ids.forEach(id => {
            const entity = get(entities)?.[id] ?? null;
            if (entity) items.push(entity);
        });

        return items;
    }
});

export {
    initialInteraction,
    browserModCommand,
    entities,
    entityState,
    entityStateArray,
};