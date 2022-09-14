import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { baseUrl } from './api';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userDetailUrl = baseUrl + 'user/me';

  httpOptions = {
    withCredentials: true,
  };

  constructor(private http: HttpClient) {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  getUserDetail() {
    return this.http
      .get<User>(this.userDetailUrl, this.httpOptions)
      .pipe(catchError(this.handleError<User>('getUserDetail')));
  }
}
