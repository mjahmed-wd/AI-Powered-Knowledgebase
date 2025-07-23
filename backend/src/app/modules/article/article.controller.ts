import httpStatus from 'http-status';
import { Request, Response } from 'express';

import pick from '../../../shared/pick';
import { ArticleService } from './article.service';
import catchAsync from '../../../shared/catchAsync';
import { articleFilterableFields, paginationFields } from './article.constants';
import sendResponse from '../../../shared/sendResponse';
import ApiError from '../../../errors/ApiError';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user?.userId;

  if (!authorId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User authentication required');
  }

  const result = await ArticleService.insertIntoDB(req.body, authorId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Article created successfully',
    data: result,
  });
});

const getMyArticles = catchAsync(async (req: Request, res: Response) => {
  const authorId = req.user?.userId;

  if (!authorId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User authentication required');
  }

  const filters = pick(req.query, articleFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await ArticleService.getMyArticles(authorId, filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My articles fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ArticleService.getByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Article fetched successfully',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const authorId = req.user?.userId;

  if (!authorId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User authentication required');
  }

  const payload = req.body;
  const result = await ArticleService.updateIntoDB(id, payload, authorId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Article updated successfully',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const authorId = req.user?.userId;

  if (!authorId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User authentication required');
  }

  const result = await ArticleService.deleteFromDB(id, authorId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Article deleted successfully',
    data: result,
  });
});

const summarizeArticle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ArticleService.summarizeArticle(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Article summarized successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const searchCriteria = req.body;
  const paginationOptions = pick(req.query, paginationFields);

  const result = await ArticleService.advancedSearch(
    searchCriteria,
    paginationOptions
  );

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Articles retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const ArticleController = {
  insertIntoDB,
  getMyArticles,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  summarizeArticle,
  getAllFromDB,
};
