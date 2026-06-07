import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function MobileControls() {
    // The buttons just translate to keydowns
    const onTouchStart = (key) => {
        const event = new KeyboardEvent('keydown', { key });
        window.dispatchEvent(event);
    };
    const onTouchEnd = (key) => {
        const event = new KeyboardEvent('keyup', { key });
        window.dispatchEvent(event);
    };
    return (_jsxs("div", { className: "mobile-controls", children: [_jsx("button", { onTouchStart: () => onTouchStart('ArrowLeft'), onTouchEnd: () => onTouchEnd('ArrowLeft'), className: "left" }), _jsx("button", { onTouchStart: () => onTouchStart('ArrowRight'), onTouchEnd: () => onTouchEnd('ArrowRight'), className: "right" }), _jsx("button", { onTouchStart: () => onTouchStart('ArrowUp'), onTouchEnd: () => onTouchEnd('ArrowUp'), className: "jump" }), _jsx("button", { onTouchStart: () => {
                    onTouchStart(' ');
                    onTouchStart('ArrowDown');
                }, onTouchEnd: () => {
                    onTouchEnd(' ');
                    onTouchEnd('ArrowDown');
                }, className: "fire" })] }));
}
