"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const category_controller_1 = require("./category.controller");
const router = (0, express_1.Router)();
router.post('/create', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), category_controller_1.categoryController.createCategoryIntoDb);
router.get('/get-all', category_controller_1.categoryController.getAllCategories);
router.get('/get-all-with-some-data', category_controller_1.categoryController.getAllCategoryWithSomeData);
router.get('/id/:id', category_controller_1.categoryController.getCategoryById);
router.get('/slug/:slug', category_controller_1.categoryController.getCategoryBySlug);
router.patch('/update/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), category_controller_1.categoryController.updateCategoryById);
router.delete('/delete', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), category_controller_1.categoryController.deleteSingleOrMultipleCategories);
exports.categoryRouter = router;
