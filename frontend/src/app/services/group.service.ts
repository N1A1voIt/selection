import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Score, Theme} from "../interfaces/theme";
import {data} from "autoprefixer";


@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getPrompt(): Observable<Theme> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }
    return this.http.get<any>(environment.apiUrl + '/generate-theme',httpOptions);
  }
  getModifPrompt(theme:string): Observable<Theme> {
    const httpOptions = {
      headers: new HttpHeaders(
        {'Content-Type': 'application/json'},
      )
    }
    const body = { theme };
    return this.http.post<any>(this.apiUrl + "generate-theme-modif", body,httpOptions);
  }
   validateImage(formData: FormData): Observable<Score> {
    console.log(formData);
    this.http.post<any>(environment.apiUrl + 'validate-image',formData).subscribe({
      next: (result) => {
        console.log(result);
      }
    });
    return this.http.post<any>(environment.apiUrl + 'validate-image',formData);
  }
}
