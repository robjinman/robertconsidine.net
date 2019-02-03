import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticlesComponent } from './articles/articles.component';
import { CommentsComponent } from './comments/comments.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { ComposeComponent } from './compose/compose.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'comments', component: CommentsComponent },
  { path: 'subscribers', component: SubscribersComponent },
  { path: 'compose', component: ComposeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
