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
import {ManageExtras} from './admin/pages/manage-extras/manage-extras';
import {ManageExtraBranches} from './branch/pages/manage-extra-branches/manage-extra-branches';
import {Kitchen} from './branch/pages/kitchen/kitchen';
import {OrderHistory} from './branch/pages/order-history/order-history';
import {ManageCategories} from './admin/pages/manage-categories/manage-categories';
import {Menu} from './user/pages/menu/menu';
import {ShoppingCart} from './user/pages/shopping-cart/shopping-cart';
import {QrRedirect} from './user/pages/qr-redirect/qr-redirect';
import {CodeGuard} from './user/guards/code-guard';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'forget-password', component: ForgetPassword },
  { path: 'home/:role', component: HomePrincipal },
  { path: 'profile/:role', component: ProfilePrincipal },
  { path: 'manage-branches', component: ManageBranches },
  { path: 'manage-dishes', component: ManageDishes },
  { path: 'manage-categories', component: ManageCategories },
  { path: 'manage-dishes-branch', component: ManageDishesBranch },
  { path: 'manage-extras', component: ManageExtras },
  { path: 'manage-extras-branch', component: ManageExtraBranches },
  { path: 'kitchen', component: Kitchen },
  { path: 'order-history', component: OrderHistory },
  { path: 'menu/:branchId/:tableNumber', component: Menu, canActivate: [CodeGuard] },
  { path: 'shopping-cart', component: ShoppingCart },
  { path: 'r/:qrId', component: QrRedirect },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
