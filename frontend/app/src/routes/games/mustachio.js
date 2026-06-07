import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from '@tanstack/react-router';
import { startMustachio } from '@parkerstovall.com/mustachio';
import { useEffect } from 'react';
export const Route = createFileRoute('/games/mustachio')({
    component: MustachioGame,
});
let gameStarted = false;
function MustachioGame() {
    useEffect(() => {
        if (gameStarted)
            return;
        gameStarted = true;
        startMustachio('game-container');
    }, []);
    return (_jsxs("div", { children: [_jsx("h1", { children: "Mustachio" }), _jsx("p", { children: "Welcome to the Mustachio game!" }), _jsx("div", { style: { height: '36vw', width: '64vw', margin: 'auto' }, id: "game-container" })] }));
}
