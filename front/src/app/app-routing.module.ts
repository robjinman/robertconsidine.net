import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedComponent } from './feed/feed.component';

const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  { path: 'feed', component: FeedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
