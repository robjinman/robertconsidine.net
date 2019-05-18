import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { QuillModule } from 'ngx-quill';
import * as Quill from 'quill';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticlesComponent } from './articles/articles.component';
import { CommentsComponent } from './comments/comments.component';
import {
  ComposeArticleComponent
} from './compose-article/compose-article.component';
import { LoggingComponent } from './logging/logging.component';
import { MaterialUiModule } from './material-ui/material-ui.module';
import { LoginComponent } from './login/login.component';
import { AuthMiddleware, IdentityService } from './auth.service';
import { PagesComponent } from './pages/pages.component';
import { UsersComponent } from './users/users.component';
import { ComposePageComponent } from './compose-page/compose-page.component';
import { AttachmentsComponent } from './attachments/attachments.component';
import { environment } from 'src/environments/environment';
import { SecurityComponent } from './security/security.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { TagsSelectorComponent } from './tags-selector/tags-selector.component';
import {
  ConfirmationPromptComponent
} from './confirmation-prompt/confirmation-prompt.component';

const quillToolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],

  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean'],

  ['link', 'image', 'video']
];

var Block = Quill.import('blots/block');
Block.tagName = 'DIV';
Quill.register(Block, true);

export function imageHandler() {
  const range = this.quill.getSelection();
  const value = prompt('What is the image URL');
  this.quill.insertEmbed(range.index, 'image', value, 'user');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ArticlesComponent,
    CommentsComponent,
    ComposeArticleComponent,
    LoggingComponent,
    LoginComponent,
    PagesComponent,
    UsersComponent,
    ComposePageComponent,
    AttachmentsComponent,
    SecurityComponent,
    CaptchaComponent,
    TagsSelectorComponent,
    ConfirmationPromptComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSplitModule.forRoot(),
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    QuillModule.forRoot({
      modules: {
        toolbar: {
          container: quillToolbarOptions,
          handlers: {
            image: imageHandler
          }
        }
      },
      theme: 'snow'
    }),
    MaterialUiModule
  ],
  entryComponents: [
    ConfirmationPromptComponent
  ],
  providers: [
    {
      provide: AuthMiddleware,
      useFactory: (identityService: IdentityService) => {
        return new AuthMiddleware(identityService);
      },
      deps: [IdentityService]
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink, authMiddleware: AuthMiddleware) => {
        const http = httpLink.create({
          uri: environment.apiServerUri
        });

        return {
          cache: new InMemoryCache(),
          link: authMiddleware.concat(http)
        }
      },
      deps: [HttpLink, AuthMiddleware]
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {
        duration: 2000,
        panelClass: ['snackbar']
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
