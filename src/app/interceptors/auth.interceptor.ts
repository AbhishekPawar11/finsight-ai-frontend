import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
 const authService = inject(AuthService);
 const token = authService.getToken();
const router = inject(Router);

 if(token){
   const cloneReq = req.clone({
       headers:req.headers.set('Authorization' , `Bearer ${token}`)
   });
   return next(cloneReq).pipe(
      catchError(
           (err)=>{
              if(err.status == 401){ 
                   authService.logout();
                   router.navigate(['/login']);
              }
              return throwError(()=>err);
           }
      )
   )
 }
  return next(req);
};
