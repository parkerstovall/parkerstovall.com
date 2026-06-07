import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute, Link } from '@tanstack/react-router';
export const Route = createFileRoute('/games/')({
    component: RouteComponent,
});
function RouteComponent() {
    return (_jsxs("div", { children: [_jsx(Link, { to: "/games/mustachio", children: "Mustachio" }), _jsx("br", {}), _jsx(Link, { to: "/games/pac-man", children: "Pac-Man" })] }));
}
