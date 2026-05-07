import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/user`

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggenIn = this.loggedIn.asObservable();

  constructor(private http:HttpClient) { }
   
  register(userData:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/register`,userData);    
  }

  login(credential:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/authentication`,credential).pipe(
       tap((res:any)=>{
            if(res && res.token){
               localStorage.setItem('jwt_token' , res.token);
               this.loggedIn.next(true);
            }
       })
    )
  }

  logout(){
     localStorage.removeItem('jwt_token');
     this.loggedIn.next(false);
  }

  getToken(){
     return localStorage.getItem('jwt_token');
  } 

  private hasToken():boolean {
     return !!localStorage.getItem('jwt_token');
  }
}
