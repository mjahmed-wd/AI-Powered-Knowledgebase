export interface IArticleFilterRequest {
  searchTerm?: string;
  title?: string;
  body?: string;
  authorId?: string;
  tagId?: string;
}

export interface IArticleCreateRequest {
  title: string;
  body: string;
  tagIds?: string[];
}

export interface IArticleUpdateRequest {
  title?: string;
  body?: string;
  tagIds?: string[];
}

export interface IAdvancedSearchRequest {
  searchTerm?: string;
  authorId?: string;
  tagIds?: string[];
}
