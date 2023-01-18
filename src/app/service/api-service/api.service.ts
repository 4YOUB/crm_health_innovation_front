import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

import { environment } from "environments/environment";
import { catchError } from "rxjs/operators";
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _httpClient: HttpClient, private router: Router) {}

  private headers: HttpHeaders = new HttpHeaders({
    // "Content-Type": "application/json",
    Accept: "application/json"
  });

  /**
   * Format error & throw it back
   */
  private static formatError(error: any): Observable<String> {
    console.error(`An error has occured ${error.message}`);
    return throwError(error);
  }

  /**
   * Get method
   * @param path The endpoint URL
   * @param params The paraneters to be send in url
   * @return An `Observable` of any
   */
  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    let headers = this.headers.append("Content-Type", "application/json");
    const URL = environment.api_url + path;
    return this._httpClient
      .get(URL, { headers, params })
      .pipe(catchError(ApiService.formatError));
  }

  /**
   * Post method
   * @param path The endpoint URL
   * @param body The content to replace with
   * @return An `Observable` of any
   */
  post(path: string, body: Object ={} ): Observable<any> {
    let headers = this.headers.append("Content-Type", "application/json");
    const URL = environment.api_url + path;
    return this._httpClient
      .post(URL, JSON.stringify(body), { headers })
      .pipe(catchError(ApiService.formatError));
  }

  /**
   * Put method
   * @param path The endpoint URL
   * @param body The content to replace with
   * @return An `Observable` of any
   */
  put(path: string, body: Object = {}): Observable<any> {
    let headers = this.headers.append("Content-Type", "application/json");
    const URL = environment.api_url + path;
    return this._httpClient
      .put(URL, JSON.stringify(body), { headers })
      .pipe(catchError(ApiService.formatError));
  }

  /**
  * Post method for upload files
  * @param path The endpoint URL
  * @param fileData The `FormData` to replace with
  * @return An `Observable` of any
  */
   upload(path: string, fileData: FormData): Observable<any> {
    // console.log("test");
    const URL = environment.api_url +  path;
    const headers = new HttpHeaders({ 'ngsw-bypass': ''});
    return this._httpClient
      .post(URL, fileData, {
        reportProgress: true,
        observe: 'events', 
        headers: headers
      })
      .pipe(catchError(ApiService.formatError));
  }
  
    /**
   * Post method to handle export
   * @param path The endpoint URL
   * @param body The content to filtre with
   * @return An `Observable` of any
   */
  export(path: string, body: Object ={} ): Observable<any> {
    let headers = this.headers.append("Content-Type", "application/json");
    const URL = environment.api_url + path;
    return this._httpClient
      .post(URL, JSON.stringify(body), { headers, responseType: 'blob' })
      .pipe(catchError(ApiService.formatError));
  }

  delete(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    let headers = this.headers.append("Content-Type", "application/json");
    const URL = environment.api_url + path;
    return this._httpClient
      .delete(URL, { headers, params })
      .pipe(catchError(ApiService.formatError));
  }
}
