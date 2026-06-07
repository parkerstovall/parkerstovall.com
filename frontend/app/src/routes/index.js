import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Link } from '@tanstack/react-router';
import '../App.css';
export const Route = createFileRoute('/')({
    component: App,
});
function App() {
    return (_jsx("div", { className: "App", children: _jsxs("header", { className: "App-header", children: [_jsx("h1", { children: "Parker Stovall" }), _jsx("p", { children: "Welcome! Check out my games below." }), _jsxs("nav", { style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' }, children: [_jsx(Link, { className: "App-link", to: "/games/mustachio", children: "Mustachio" }), _jsx(Link, { className: "App-link", to: "/games/pac-man", children: "Pac-Man" })] })] }) }));
}
