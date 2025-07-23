import express from 'express';

import auth from '../../middlewares/auth';
import { UserController } from './user.controller';
import { UserValidation } from './user.validations';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { checkUserOwnership } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router
  .route('/')
  .get(auth(ENUM_USER_ROLE.USER), UserController.getAllFromDB)

router
  .route('/:id')
  .get(auth(ENUM_USER_ROLE.USER), UserController.getByIdFromDB)
  .patch(
    auth(ENUM_USER_ROLE.USER),
    checkUserOwnership,
    validateRequest(UserValidation.update),
    UserController.updateIntoDB
  )
  .delete(auth(ENUM_USER_ROLE.USER), checkUserOwnership, UserController.deleteFromDB);

export const userRoutes = router;
