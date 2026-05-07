import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
   private apiUrl = `${environment.apiUrl}/analytics`;
  constructor(private http: HttpClient) { }

  getDashboardData(date:string):Observable<any>{
      const dateArray = date.split('-');
      const year = parseInt(dateArray[0],10);
      const month = parseInt(dateArray[1],10);


        return this.http.get<any>(`${this.apiUrl}/dashboard?year=${year}&month=${month}`);
  }


  getAiSummary(date:string):Observable<any>{
     const dateArray = date.split('-');
      const year = parseInt(dateArray[0],10);
      const month = parseInt(dateArray[1],10);


        return this.http.get<any>(`${this.apiUrl}/summary?year=${year}&month=${month}`);
  }
}
