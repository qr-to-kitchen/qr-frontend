import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {MatToolbar} from '@angular/material/toolbar';
import { Login } from './security/pages/login/login';
import { PageNotFound } from './shared/pages/page-not-found/page-not-found';
import {MatButton} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {provideHttpClient} from '@angular/common/http';
import { ErrorSnackBar } from './shared/pages/error-snack-bar/error-snack-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    App,
    Login,
    PageNotFound,
    ErrorSnackBar
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbar,
    MatButton,
    MatFormFieldModule,
    MatInput,
    FormsModule,
    MatSnackBarModule
  ],
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
