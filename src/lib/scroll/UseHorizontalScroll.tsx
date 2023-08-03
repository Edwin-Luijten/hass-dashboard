import { useRef, UIEvent } from 'react';

const useHorizontalScroll = (callback: { (e: any): void; (e: UIEvent<HTMLElement, globalThis.UIEvent>): void; }) => {
    const positionRef = useRef(0);
    return (e: UIEvent<HTMLElement>) => {
        const x = e.currentTarget.scrollLeft;
        if (x !== positionRef.current) {
            positionRef.current = x;
            callback(e);
        }
    };
};


export {
    useHorizontalScroll
}