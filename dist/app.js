"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://ridevibes.vercel.app'],
    credentials: true,
}));
// Routes
app.use('/api/v1', routes_1.default);
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Bicycle Server Is Running',
    });
});
app.use(globalErrorhandler_1.default);
app.use(notFound_1.default);
exports.default = app;
