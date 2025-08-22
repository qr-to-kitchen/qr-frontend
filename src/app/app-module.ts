import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {MatToolbar} from '@angular/material/toolbar';
import { Login } from './login/login';
import { PageNotFound } from './page-not-found/page-not-found';
import {MatButton} from '@angular/material/button';

@NgModule({
  declarations: [
    App,
    Login,
    PageNotFound
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbar,
    MatButton
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
