export type Maybe<T> = T | null;

// ====================================================
// Types
// ====================================================

export interface Query {
  info: string;

  articles: Article[];
}

export interface Article {
  id: string;

  createdAt: string;

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

export interface Mutation {
  signup?: Maybe<AuthPayload>;

  login?: Maybe<AuthPayload>;

  postArticle: Article;

  postComment: Comment;

  deleteComment?: Maybe<Comment>;
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

export interface ArticlesQueryArgs {
  tags?: Maybe<string[]>;

  skip?: Maybe<number>;

  first?: Maybe<number>;
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
export interface PostCommentMutationArgs {
  articleId: string;

  content: string;
}
export interface DeleteCommentMutationArgs {
  commentId: string;
}
