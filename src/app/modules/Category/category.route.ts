import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { categoryController } from './category.controller';

const router = Router();

router.post('/create', auth(USER_ROLE.admin), categoryController.createCategoryIntoDb);

router.get('/get-all', categoryController.getAllCategories);

router.get('/id/:id', categoryController.getCategoryById);

router.get('/slug/:slug', categoryController.getCategoryBySlug);

router.patch('/update/:id', auth(USER_ROLE.admin), categoryController.updateCategoryById);

router.delete('/delete', auth(USER_ROLE.admin), categoryController.deleteSingleOrMultipleCategories);

export const categoryRouter = router;
