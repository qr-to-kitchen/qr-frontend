import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const CodeGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const branchId = route.params['branchId'];
  const tableNumber = route.params['tableNumber'];

  const matches = sessionStorage.getItem('branchId') === branchId && sessionStorage.getItem('tableNumber') === tableNumber;

  if (matches) {
    return true;
  } else {
    sessionStorage.clear();
    return router.navigate(['/page-not-found']);
  }
};
