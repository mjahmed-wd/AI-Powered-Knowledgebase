import express from 'express';

import auth from '../../middlewares/auth';
import { TagController } from './tag.controller';
import { TagValidation } from './tag.validations';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router
  .route('/')
  .get(auth(ENUM_USER_ROLE.USER), TagController.getAllFromDB)
  .post(
    auth(ENUM_USER_ROLE.USER),
    validateRequest(TagValidation.create),
    TagController.insertIntoDB
  );

router
  .route('/:id')
  .get(auth(ENUM_USER_ROLE.USER), TagController.getByIdFromDB)
  .patch(
    auth(ENUM_USER_ROLE.USER),
    validateRequest(TagValidation.update),
    TagController.updateIntoDB
  )
  .delete(auth(ENUM_USER_ROLE.USER), TagController.deleteFromDB);

export const tagRoutes = router;
