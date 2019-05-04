import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticlesComponent } from './articles/articles.component';
import { CommentsComponent } from './comments/comments.component';
import { UsersComponent } from './users/users.component';
import { SecurityComponent } from './security/security.component';
import { PagesComponent } from './pages/pages.component';
import {
  ComposeArticleComponent
} from './compose-article/compose-article.component';
import { ComposePageComponent } from './compose-page/compose-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'comments', component: CommentsComponent },
  { path: 'pages', component: PagesComponent },
  { path: 'users', component: UsersComponent },
  { path: 'security', component: SecurityComponent },
  { path: 'compose-article', component: ComposeArticleComponent },
  { path: 'compose-page', component: ComposePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
