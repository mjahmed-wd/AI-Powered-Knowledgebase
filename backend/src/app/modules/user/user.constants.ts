export const userFilterableFields: string[] = [
  'searchTerm',
  'name',
  'email',
  'role'
];

export const userSearchableFields: string[] = [
  'name',
  'email',
  'id'
];

export const userRelationalFields: string[] = [
  'articles'
];

export const userRelationalFieldsMapper: { [key: string]: string } = {
  articlesId: 'articles'
};
