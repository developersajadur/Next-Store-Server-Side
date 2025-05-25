"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const brand_controller_1 = require("./brand.controller");
const router = (0, express_1.Router)();
router.post('/create', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), brand_controller_1.brandController.createBrand);
router.patch('/update/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), brand_controller_1.brandController.updateBrand);
router.get('/get-all', brand_controller_1.brandController.getAllBrands);
router.get('/id/:id', brand_controller_1.brandController.getSingleBrandById);
router.get('/slug/:slug', brand_controller_1.brandController.getSingleBrandBySlug);
router.delete('/delete', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), brand_controller_1.brandController.deleteBrand);
exports.brandRouter = router;
