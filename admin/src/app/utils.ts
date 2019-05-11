import { Article } from './types';

export const ERROR_SNACKBAR_OPTIONS = {
  panelClass: ['snackbar', 'error-snackbar']
};

export const SUCCESS_SNACKBAR_OPTIONS = {
  panelClass: ['snackbar', 'success-snackbar']
};

export function articleHasTag(article: Article, tag: string) {
  return article.tags.some(t => t.id == tag);
}
