import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import {MatToolbar} from '@angular/material/toolbar';
import { Login } from './security/pages/login/login';
import { PageNotFound } from './shared/pages/page-not-found/page-not-found';
import {MatButton, MatFabButton, MatIconButton, MatMiniFabButton} from '@angular/material/button';
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
import { ManageBranches } from './admin/pages/manage-branches/manage-branches';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatTooltip} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import { CreateUserBranchDialog } from './admin/dialogs/create-user-branch.dialog/create-user-branch.dialog';
import { ManageDishes } from './admin/pages/manage-dishes/manage-dishes';
import { CreateDishDialog } from './admin/dialogs/create-dish.dialog/create-dish.dialog';
import { ManageBranchDishDialog } from './admin/dialogs/manage-branch-dish.dialog/manage-branch-dish.dialog';
import {MatChipsModule} from '@angular/material/chips';
import { ManageDishesBranch } from './branch/pages/manage-dishes-branch/manage-dishes-branch';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import { ManageExtras } from './admin/pages/manage-extras/manage-extras';
import { CreateExtraDialog } from './admin/dialogs/create-extra.dialog/create-extra.dialog';
import { ManageExtraBranchDialog } from './admin/dialogs/manage-extra-branch.dialog/manage-extra-branch.dialog';
import { ManageExtraBranchDishesDialog } from './admin/dialogs/manage-extra-branch-dishes.dialog/manage-extra-branch-dishes.dialog';
import { ManageExtraBranches } from './branch/pages/manage-extra-branches/manage-extra-branches';
import { Kitchen } from './branch/pages/kitchen/kitchen';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { OrderDetailDialog } from './branch/dialogs/order-detail.dialog/order-detail.dialog';
import { OrderHistory } from './branch/pages/order-history/order-history';
import {MatPaginator} from '@angular/material/paginator';
import { ManageCategories } from './admin/pages/manage-categories/manage-categories';
import { CreateCategoryDialog } from './admin/dialogs/create-category.dialog/create-category.dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import { Menu } from './user/pages/menu/menu';
import { AddToCartDialog } from './user/dialogs/add-to-cart.dialog/add-to-cart.dialog';
import {MatBadge} from '@angular/material/badge';
import { ShoppingCart } from './user/pages/shopping-cart/shopping-cart';
import { QrRedirect } from './user/pages/qr-redirect/qr-redirect';
import { CreateQr } from './super-admin/pages/create-qr/create-qr';
import { HomeSuperAdmin } from './core/pages/home-super-admin/home-super-admin';
import { EditItemDialog } from './user/dialogs/edit-item.dialog/edit-item.dialog';
import { MyOrder } from './user/pages/my-order/my-order';
import {MatMenuModule} from "@angular/material/menu";
import { BranchDetail } from './admin/pages/branch-detail/branch-detail';
import { BranchDetailDishes } from './admin/pages/branch-detail-dishes/branch-detail-dishes';
import { BranchDetailExtras } from './admin/pages/branch-detail-extras/branch-detail-extras';
import { ManageBranchDishExtrasDialog } from './admin/dialogs/manage-branch-dish-extras.dialog/manage-branch-dish-extras.dialog';
import { CreateBranchDishesDialog } from './admin/dialogs/create-branch-dishes.dialog/create-branch-dishes.dialog';
import { CreateExtraBranchesDialog } from './admin/dialogs/create-extra-branches.dialog/create-extra-branches.dialog';
import { ManageRestaurants } from './super-admin/pages/manage-restaurants/manage-restaurants';
import { CreateUserRestaurantDialog } from './super-admin/dialogs/create-user-restaurant.dialog/create-user-restaurant.dialog';

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
    ProfileBranch,
    ManageBranches,
    CreateUserBranchDialog,
    ManageDishes,
    CreateDishDialog,
    ManageBranchDishDialog,
    ManageDishesBranch,
    ManageExtras,
    CreateExtraDialog,
    ManageExtraBranchDialog,
    ManageExtraBranchDishesDialog,
    ManageExtraBranches,
    Kitchen,
    OrderDetailDialog,
    OrderHistory,
    ManageCategories,
    CreateCategoryDialog,
    Menu,
    AddToCartDialog,
    ShoppingCart,
    QrRedirect,
    CreateQr,
    HomeSuperAdmin,
    EditItemDialog,
    MyOrder,
    BranchDetail,
    BranchDetailDishes,
    BranchDetailExtras,
    ManageBranchDishExtrasDialog,
    CreateBranchDishesDialog,
    CreateExtraBranchesDialog,
    ManageRestaurants,
    CreateUserRestaurantDialog
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
    MatListModule,
    MatIconButton,
    MatSidenavModule,
    MatTableModule,
    MatTooltip,
    MatDialogModule,
    MatChipsModule,
    MatSlideToggle,
    MatButtonToggleModule,
    MatPaginator,
    MatSelectModule,
    MatDatepickerModule,
    MatFabButton,
    MatBadge,
    MatMenuModule,
    MatMiniFabButton
  ],
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE'}
  ],
  bootstrap: [App]
})
export class AppModule { }
