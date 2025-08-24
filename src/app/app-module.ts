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
import { HomePrincipal } from './core/pages/home-principal/home-principal';
import { HomeAdmin } from './core/pages/home-admin/home-admin';
import { HomeBranch } from './core/pages/home-branch/home-branch';
import { ForgetPassword } from './security/pages/forget-password/forget-password';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCheckbox} from '@angular/material/checkbox';
import { ProfilePrincipal } from './core/pages/profile-principal/profile-principal';
import { ProfileAdmin } from './core/pages/profile-admin/profile-admin';
import { ProfileBranch } from './core/pages/profile-branch/profile-branch';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDivider} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';

@NgModule({
  declarations: [
    App,
    Login,
    PageNotFound,
    ErrorSnackBar,
    HomePrincipal,
    HomeAdmin,
    HomeBranch,
    ForgetPassword,
    ProfilePrincipal,
    ProfileAdmin,
    ProfileBranch
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbar,
    MatButton,
    MatFormFieldModule,
    MatInput,
    FormsModule,
    MatSnackBarModule,
    MatStepperModule,
    MatCheckbox,
    MatProgressSpinner,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatDivider,
    MatListModule
  ],
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
