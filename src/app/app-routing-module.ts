import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Login} from './security/pages/login/login';
import {PageNotFound} from './shared/pages/page-not-found/page-not-found';
import {HomePrincipal} from './core/pages/home-principal/home-principal';
import {ForgetPassword} from './security/pages/forget-password/forget-password';
import {ProfilePrincipal} from './core/pages/profile-principal/profile-principal';
import {ManageBranches} from './admin/pages/manage-branches/manage-branches';
import {ManageDishes} from './admin/pages/manage-dishes/manage-dishes';
import {ManageDishesBranch} from './branch/pages/manage-dishes-branch/manage-dishes-branch';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'forget-password', component: ForgetPassword },
  { path: 'home/:role', component: HomePrincipal },
  { path: 'profile/:role', component: ProfilePrincipal },
  { path: 'manage-branches', component: ManageBranches },
  { path: 'manage-dishes', component: ManageDishes },
  { path: 'manage-dishes-branch', component: ManageDishesBranch },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
