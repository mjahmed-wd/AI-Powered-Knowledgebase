import express, { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { tagRoutes } from '../modules/tag/tag.routes';
import { articleRoutes } from '../modules/article/article.routes';

const router = express.Router();

const moduleRoutes: {path: string, route: Router}[] = [
  {
    path: "/auth",
    route: authRoutes
  },
  {
    path: "/users",
    route: userRoutes
  },
  {
    path: "/tags",
    route: tagRoutes
  },
  {
    path: "/articles",
    route: articleRoutes
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
