import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { brandController } from './brand.controller';

const router = Router();

router.post('/create', auth(USER_ROLE.admin), brandController.createBrand);
router.patch('/update/:id', auth(USER_ROLE.admin), brandController.updateBrand);
router.get('/get-all', brandController.getAllBrands);
router.get('/id/:id', brandController.getSingleBrandById);
router.get('/slug/:slug', brandController.getSingleBrandBySlug);
router.delete('/delete', auth(USER_ROLE.admin), brandController.deleteBrand);

export const brandRouter = router;
