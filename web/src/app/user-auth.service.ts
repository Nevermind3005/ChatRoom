import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from './api';
import { User, UserSignIn } from './user';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  constructor(private http: HttpClient) {}
  private signUpUrl = baseUrl + 'auth/signup';
  private signInUrl = baseUrl + 'auth/login';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  signUp(user: User) {
    return this.http.post<User>(this.signUpUrl, user, this.httpOptions).pipe(
      tap((newUser: any) => console.log(newUser)),
      catchError(this.handleError<User>('signUp'))
    );
  }

  signIn(userSignIn: UserSignIn) {
    return this.http
      .post<UserSignIn>(this.signInUrl, userSignIn, {
        ...this.httpOptions,
        withCredentials: true,
        observe: 'response',
      })
      .pipe(catchError(this.handleError<UserSignIn>('signIn')));
  }
}
