import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Login} from './security/pages/login/login';
import {PageNotFound} from './shared/pages/page-not-found/page-not-found';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
