import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
private apiUrl = `${environment.apiUrl}/transaction`;

  constructor(private http:HttpClient) { }

  uploadStatement(file:File , password:string):Observable<any[]>{
     const formData = new FormData();
     formData.append('file',file);
     formData.append('password' , password);
     formData.append('userPrompt','');

     return this.http.post<any[]>(`${this.apiUrl}/uploadStatement` , formData);
  }

  confirmTransactions(transaction:any[]):Observable<any>{
     return this.http.post(`${this.apiUrl}/confirm` , transaction);
  }

  addTransaction(transaction:any):Observable<any>{
      return this.http.post(`${this.apiUrl}` , transaction);
  }

  getTransactions(page:number , size: number , keyword:string = ''):Observable<any>{
      const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('keyword' , keyword.toString());
  
  return this.http.get(`${this.apiUrl}` , {params});
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

 updateTransaction(id: number, transactionData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, transactionData);
  }
}
