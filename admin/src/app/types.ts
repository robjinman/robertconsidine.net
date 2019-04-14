export type Maybe<T> = T | null;

// ====================================================
// Types
// ====================================================

export interface Query {
  info: string;

  publishedArticles: Article[];

  allArticles: Article[];

  article?: Maybe<Article>;

  page?: Maybe<Page>;

  pages: Page[];
}

export interface Article {
  id: string;

  draft: boolean;

  createdAt: string;

  modifiedAt: string;

  publishedAt?: Maybe<string>;

  title: string;

  summary: string;

  content: string;

  tags: string[];

  comments: Comment[];
}

export interface Comment {
  id: string;

  createdAt: string;

  content: string;

  user: User;

  article: Article;
}

export interface User {
  id: string;

  name: string;

  email: string;

  comments: Comment[];

  admin: boolean;
}

export interface Page {
  id: string;

  name: string;

  content: string;
}

export interface Mutation {
  signup?: Maybe<AuthPayload>;

  login?: Maybe<AuthPayload>;

  postArticle: Article;

  updateArticle: Article;

  publishArticle: Article;

  deleteArticle: Article;

  postComment: Comment;

  deleteComment?: Maybe<Comment>;

  postPage: Page;

  updatePage: Page;

  deletePage?: Maybe<Page>;
}

export interface AuthPayload {
  token?: Maybe<string>;

  user?: Maybe<User>;
}

export interface Subscription {
  newArticle?: Maybe<Article>;

  newComment?: Maybe<Comment>;
}

// ====================================================
// Arguments
// ====================================================

export interface PublishedArticlesQueryArgs {
  tags?: Maybe<string[]>;

  skip?: Maybe<number>;

  first?: Maybe<number>;

  filter?: Maybe<string>;
}
export interface AllArticlesQueryArgs {
  skip?: Maybe<number>;

  first?: Maybe<number>;
}
export interface ArticleQueryArgs {
  id: string;
}
export interface PageQueryArgs {
  name: string;
}
export interface SignupMutationArgs {
  email: string;

  password: string;

  name: string;
}
export interface LoginMutationArgs {
  email: string;

  password: string;
}
export interface PostArticleMutationArgs {
  title: string;

  summary: string;

  content: string;

  tags: string[];
}
export interface UpdateArticleMutationArgs {
  id: string;

  title: string;

  summary: string;

  content: string;

  tags: string[];
}
export interface PublishArticleMutationArgs {
  id: string;

  publish: boolean;
}
export interface DeleteArticleMutationArgs {
  id: string;
}
export interface PostCommentMutationArgs {
  articleId: string;

  content: string;
}
export interface DeleteCommentMutationArgs {
  commentId: string;
}
export interface PostPageMutationArgs {
  name: string;

  content: string;
}
export interface UpdatePageMutationArgs {
  name: string;

  content: string;
}
export interface DeletePageMutationArgs {
  name: string;
}
