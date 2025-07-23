import express from 'express';

import auth from '../../middlewares/auth';
import { ArticleController } from './article.controller';
import { ArticleValidation } from './article.validations';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router
  .route('/')
  .post(
    auth(ENUM_USER_ROLE.USER),
    validateRequest(ArticleValidation.create),
    ArticleController.insertIntoDB
  );

router
  .route('/my-articles')
  .get(auth(ENUM_USER_ROLE.USER), ArticleController.getMyArticles);

router
  .route('/search')
  .post(
    auth(ENUM_USER_ROLE.USER),
    validateRequest(ArticleValidation.advancedSearch),
    ArticleController.getAllFromDB
  );

router
  .route('/:id/summarize')
  .get(auth(ENUM_USER_ROLE.USER), ArticleController.summarizeArticle);

router
  .route('/:id')
  .get(auth(ENUM_USER_ROLE.USER), ArticleController.getByIdFromDB)
  .patch(
    auth(ENUM_USER_ROLE.USER),
    validateRequest(ArticleValidation.update),
    ArticleController.updateIntoDB
  )
  .delete(auth(ENUM_USER_ROLE.USER), ArticleController.deleteFromDB);

export const articleRoutes = router;
