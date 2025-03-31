import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Theme} from "../interfaces/theme";


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
}
