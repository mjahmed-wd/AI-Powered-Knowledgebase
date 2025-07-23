import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from '../user/user.controller';
import { UserValidation } from '../user/user.validations';
import { AuthController } from './auth.controller';
import { authValidation } from './auth.validations';

const router = express.Router();

router
  .route('/signup')
  .post(validateRequest(UserValidation.create), UserController.insertIntoDB);

router
  .route('/signin')
  .post(validateRequest(authValidation.loginZodSchema), AuthController.signIn);

router
  .route('/:id')
  .get(UserController.getByIdFromDB)
  .patch(validateRequest(UserValidation.update), UserController.updateIntoDB)
  .delete(UserController.deleteFromDB);

export const authRoutes = router;
