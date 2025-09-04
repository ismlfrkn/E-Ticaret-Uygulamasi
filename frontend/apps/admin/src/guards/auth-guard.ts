import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Common } from '@shared/services/common';
import { UserModel } from '@shared/services/user';

export const authGuard: CanActivateFn = (route, state) => {
  const res = localStorage.getItem("kullanici");
  const router = inject(Router);
  const common = inject(Common);
  if(!res) {
    router.navigateByUrl("/login");
   
    return false;
  }
  const user:UserModel = JSON.parse(res);
  common.user.set(user); 
  return true;
};
