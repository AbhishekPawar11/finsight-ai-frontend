import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router)
  const token = authService.getToken();

  if(token && isTokenValid(token)){
       return true;
  }else{
     router.navigate(['/login']);
     return false;
  }

  
};

function isTokenValid(token:string):boolean{
     const payload = JSON.parse(atob(token.split('.')[1]));
     const expiry = payload.exp*1000;
     return Date.now() < expiry;
  }
