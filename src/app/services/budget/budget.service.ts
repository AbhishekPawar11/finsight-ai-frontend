import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
   
  apiUrl = `${environment.apiUrl}/budget`;
  
  constructor(private http:HttpClient) { }

  setBudget(category: string, limit: number): Observable<any> {
    return this.http.post(this.apiUrl, { category:category, limit:limit });
  }
}
