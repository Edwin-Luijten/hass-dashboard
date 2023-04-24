import { useContext } from 'react';
import { HomeAssistantContext } from '../contexts/HomeAssistantContext';
import { HomeAssistant } from '../types';


const useHomeAssistant = (): HomeAssistant => {
    return useContext(HomeAssistantContext) as HomeAssistant;
}

export {
    HomeAssistantContext,
    useHomeAssistant,
}