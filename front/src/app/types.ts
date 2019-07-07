export type Maybe<T> = T | null;

// ====================================================
// Interfaces
// ====================================================

export interface Document {
  id: string;

  content: string;

  files: File[];
}

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

  files: File[];

  comments: Comment[];

  users: User[];

  user?: Maybe<User>;

  allTags: Tag[];

  usedTags: Tag[];

  tag?: Maybe<Tag>;
}

export interface Article extends Document {
  id: string;

  draft: boolean;

  createdAt: string;

  modifiedAt: string;

  publishedAt?: Maybe<string>;

  title: string;

  summary: string;

  content: string;

  files: File[];

  tags: Tag[];

  comments: Comment[];
}

export interface File {
  id: string;

  name: string;

  extension: string;

  document: Document;
}

export interface Tag {
  id: string;

  name: string;

  articles: Article[];
}

export interface Comment {
  id: string;

  createdAt: string;

  content: string;

  user?: Maybe<User>;

  article: Article;
}

export interface User {
  id: string;

  createdAt: string;

  name: string;

  email: string;

  comments: Comment[];

  admin: boolean;

  activated: boolean;
}

export interface Page extends Document {
  id: string;

  name: string;

  content: string;

  files: File[];
}

export interface Mutation {
  signup?: Maybe<AuthPayload>;

  activateAccount?: Maybe<boolean>;

  sendActivationEmail?: Maybe<boolean>;

  login?: Maybe<AuthPayload>;

  adminLogin?: Maybe<AuthPayload>;

  postArticle: Article;

  updateArticle: Article;

  publishArticle: Article;

  deleteArticle: Article;

  postComment: Comment;

  deleteComment?: Maybe<Comment>;

  postPage: Page;

  updatePage: Page;

  deletePage?: Maybe<Page>;

  uploadFile: File;

  deleteFile: File;

  updateUser: User;

  deleteUser: User;

  sendEmail?: Maybe<boolean>;

  postTag: Tag;
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
export interface FilesQueryArgs {
  documentId: string;
}
export interface CommentsQueryArgs {
  skip?: Maybe<number>;

  first?: Maybe<number>;
}
export interface UsersQueryArgs {
  skip?: Maybe<number>;

  first?: Maybe<number>;
}
export interface UserQueryArgs {
  name: string;
}
export interface TagQueryArgs {
  id: string;
}
export interface SignupMutationArgs {
  email: string;

  password: string;

  name: string;

  captcha: string;
}
export interface ActivateAccountMutationArgs {
  id: string;

  code: string;
}
export interface LoginMutationArgs {
  email: string;

  password: string;
}
export interface AdminLoginMutationArgs {
  email: string;

  password: string;

  captcha: string;
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

  captcha: string;
}
export interface DeleteCommentMutationArgs {
  id: string;
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
export interface UploadFileMutationArgs {
  documentId: string;

  data: string;

  name: string;

  extension: string;
}
export interface DeleteFileMutationArgs {
  id: string;
}
export interface UpdateUserMutationArgs {
  currentPw: string;

  id: string;

  name: string;

  email: string;

  newPw: string;
}
export interface DeleteUserMutationArgs {
  id: string;
}
export interface SendEmailMutationArgs {
  email: string;

  subject: string;

  message: string;

  captcha: string;
}
export interface PostTagMutationArgs {
  name: string;
}
