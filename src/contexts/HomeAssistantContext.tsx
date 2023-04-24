import { createContext } from 'react';
import { HomeAssistant } from '../types';

const HomeAssistantContext = createContext<HomeAssistant | null>(null);

export {
    HomeAssistantContext,
}