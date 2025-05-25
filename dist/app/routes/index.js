"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const review_route_1 = require("../modules/Review/review.route");
const product_route_1 = require("../modules/Product/product.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const order_route_1 = require("../modules/Order/order.route");
const media_route_1 = require("../modules/Media/media.route");
const category_route_1 = require("../modules/Category/category.route");
const brand_route_1 = require("../modules/Brand/brand.route");
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
        route: order_route_1.orderRouter,
    },
    {
        path: '/reviews',
        route: review_route_1.reviewRoute,
    },
    {
        path: '/payments',
        route: payment_route_1.paymentRouter,
    },
    {
        path: '/medias',
        route: media_route_1.mediaRouter,
    },
    {
        path: '/categories',
        route: category_route_1.categoryRouter,
    },
    {
        path: '/brands',
        route: brand_route_1.brandRouter,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
