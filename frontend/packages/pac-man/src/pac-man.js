import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { createPacManScene } from './game/_scenes/pac-man-scene';
export function PacMan() {
    const container = useRef(null);
    const gameRef = useRef(null);
    useEffect(() => {
        if (gameRef.current || !container.current) {
            return;
        }
        gameRef.current = createPacManScene(container.current);
        return () => {
            gameRef.current?.destroy(true);
            gameRef.current = null;
        };
    }, []);
    return _jsx("div", { style: { width: '448px', height: '496px' }, ref: container });
}
