import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useHorizontalScroll } from '../../lib/scroll/UseHorizontalScroll';
import { Draggable } from 'gsap/Draggable';
import TweenTarget = gsap.TweenTarget;
import { WidgetsWrapper } from './WidgetsStyle';

gsap.registerPlugin(Draggable);

type WidgetsProps = {
    children?: JSX.Element | JSX.Element[] | string;
}

export function Widgets({children}: WidgetsProps) {
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const timeline = useRef<gsap.core.Timeline | null>(null);

    const horizontalScroll = useHorizontalScroll((e) => {
        const x = e.currentTarget.scrollLeft;
        const progress = Math.max(x / (e.currentTarget.offsetWidth), 0);

        if (timeline.current && progress > 0 && progress <= 1) {
            timeline.current.progress(progress)
        }
    });

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const widgets = gsap.utils.toArray('.widget');
            timeline.current = gsap.timeline({
                paused: true,
            });

            widgets.forEach((widget, i) => {
                timeline?.current?.fromTo(widget as TweenTarget, {
                    scale: 1,
                    opacity: 1,
                    filter: 'blur(0px)',
                }, {
                    scale: 0.75,
                    opacity: 1,
                    duration: 1,
                    left: 10 * i,
                    filter: 'blur(3px)',
                })
            });
        }, sliderRef);

        return () => ctx.revert();
    }, [timeline]);

    return (
        <WidgetsWrapper alignItems="center" ref={sliderRef} onScroll={horizontalScroll}
                        className={`widgets`}>
            {children}
        </WidgetsWrapper>
    )
}