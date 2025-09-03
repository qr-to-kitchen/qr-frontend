import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../../core/services/user/user.service';
import {catchError, map, of} from 'rxjs';
import {ErrorMessage} from '../../shared/models/error-message';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorSnackBar} from '../../shared/pages/error-snack-bar/error-snack-bar';

export const NoTokenGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userService = inject(UserService);
  const snackBar = inject(MatSnackBar);

  if (localStorage.getItem('token')) {
    return userService.getObject().pipe(
      map((userApiResponse) => {
        return router.createUrlTree(['/home', userApiResponse.user.role]);
      }),
      catchError((error: ErrorMessage) => {
        localStorage.removeItem('token');
        snackBar.openFromComponent(ErrorSnackBar, {
          data: {
            messages: error.message
          },
          duration: 2000
        });
        return of(true);
      })
    )
  } else {
    return true;
  }
};
