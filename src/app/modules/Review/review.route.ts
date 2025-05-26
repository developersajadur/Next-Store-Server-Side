import { Router } from "express";
import auth from "../../middlewares/auth";
import { reviewController } from "./review.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewValidationSchema } from "./review.validation";
import { USER_ROLE } from "../User/user.constant";


const router = Router();


router.post('/create-review', validateRequest(ReviewValidationSchema.createReviewValidation) ,auth(USER_ROLE.customer), reviewController.createReviewIntoDb)

router.get('/get-all', auth(USER_ROLE.admin), reviewController.getAllReviewsFromDb)

router.patch('/update-review/:reviewId/product/:productId', validateRequest(ReviewValidationSchema.updateReviewValidation), auth(USER_ROLE.customer), reviewController.updateReviewIntoDb)

router.get('/product-reviews/:slug', reviewController.getReviewBySlugForEachProduct)

router.delete('/delete-review/:reviewId', auth(USER_ROLE.customer, USER_ROLE.admin), reviewController.deleteReviewFromDb)

router.get(
  '/get-review-by-id/:reviewId',
  reviewController.getSingleReviewById,
);



export const reviewRoute = router;