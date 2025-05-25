"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const order_route_1 = __importDefault(require("../modules/Order/order.route"));
const review_route_1 = require("../modules/Review/review.route");
const product_route_1 = require("../modules/Product/product.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/products',
        route: product_route_1.productRoute,
    },
    {
        path: '/users',
        route: user_route_1.userRoute,
    },
    {
        path: '/auth',
        route: auth_route_1.authRoute,
    },
    {
        path: '/orders',
        route: order_route_1.default,
    },
    {
        path: '/reviews',
        route: review_route_1.reviewRoute,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
