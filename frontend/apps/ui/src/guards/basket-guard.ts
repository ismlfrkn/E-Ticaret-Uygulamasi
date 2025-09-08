import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const basketGuard: CanActivateFn = (route, state) => {
  if(!localStorage.getItem('kullanici')) {
    const router = inject(Router);
    router.navigateByUrl("");
    return false;
  } else {
    return true;
    }
};
