import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpclientService {

  constructor(private http: HttpClient) { }

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  get(path: string): Observable<any> {
    console.log(`GET ${environment.api_url + path}`);
    return this.http.get<any>(environment.api_url + path, httpOptions);
  }

  post(path: string, body): Observable<any> {
    console.log(`POST ${environment.api_url + path} ${body}`);
    return this.http.post<any>(environment.api_url + path, body, httpOptions);
  }

  put(path: string, body): Observable<any> {
    console.log(`PUT ${environment.api_url + path} ${body}`);
    return this.http.put<any>(environment.api_url + path, body, httpOptions);
  }
}
