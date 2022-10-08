import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { baseUrl } from './api';
import { UserSignUp, UserSignIn } from './user';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  constructor(private http: HttpClient) {}
  private signUpUrl = baseUrl + 'auth/signup';
  private signInUrl = baseUrl + 'auth/login';
  private tokenUrl = baseUrl + 'auth/token';
  public accessToken = '';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  signUp(user: UserSignUp) {
    return this.http
      .post<UserSignUp>(this.signUpUrl, user, this.httpOptions)
      .pipe(
        tap((newUser: any) => console.log(newUser)),
        catchError(this.handleError<UserSignUp>('signUp'))
      );
  }

  isLoggedIn(): boolean {
    return this.accessToken !== '';
  }

  signIn(userSignIn: UserSignIn) {
    return this.http.post<UserSignIn>(this.signInUrl, userSignIn, {
      ...this.httpOptions,
      withCredentials: true,
      observe: 'response',
    });
  }

  getAcessToken() {
    return this.http
      .post(this.tokenUrl, '', {
        ...this.httpOptions,
        withCredentials: true,
        observe: 'response',
      })
      .pipe(catchError(this.handleError('getAcessToken')));
  }
}
