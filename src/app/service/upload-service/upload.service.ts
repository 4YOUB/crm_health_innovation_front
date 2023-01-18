import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

import { environment } from "environments/environment";
import { catchError } from "rxjs/operators";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

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
  * Post method for upload files
  * @param path The endpoint URL
  * @param fileData The `FormData` to replace with
  * @return An `Observable` of any
  */
   upload(path: string, fileData: FormData): Observable<any> {
    // console.log("test");
    const URL = environment.upload_url +  path;
    const headers = new HttpHeaders({ 'ngsw-bypass': ''});
    return this._httpClient
      .post(URL, fileData, {
        reportProgress: true,
        observe: 'events', 
        headers: headers
      })
      .pipe(catchError(UploadService.formatError));
  }
}
