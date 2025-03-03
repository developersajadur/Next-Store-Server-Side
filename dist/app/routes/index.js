"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bicycle_route_1 = require("../modules/Bicycle/bicycle.route");
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const order_router_1 = __importDefault(require("../modules/order/order.router"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/bicycles',
        route: bicycle_route_1.biCycleRoute,
    },
    {
        path: '/users',
        route: user_route_1.userRoute,
    },
    {
        path: '/',
        route: auth_route_1.authRoute,
    },
    {
        path: '/order',
        route: order_router_1.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
