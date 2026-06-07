import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
export const Route = createRootRoute({
    component: () => (_jsxs(_Fragment, { children: [_jsx(Outlet, {}), _jsx(TanStackRouterDevtools, {})] })),
});
