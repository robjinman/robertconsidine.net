import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedComponent } from './feed/feed.component';
import { ArticleComponent } from './article/article.component';
import { PageComponent } from './page/page.component';
import { ContactComponent } from './contact/contact.component';
import { AccountActivationComponent } from './account-activation/account-activation.component';

const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'feed', component: FeedComponent },
  { path: 'article/:id', component: ArticleComponent },
  { path: 'portfolio',
    component: PageComponent,
    data: { pageName: "portfolio" } },
  { path: 'about',
    component: PageComponent,
    data: { pageName: "about" } },
  { path: 'contact', component: ContactComponent },
  { path: 'activate', component: AccountActivationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
