import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { UserAuthService } from '../user-auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  refresh = false;

  constructor(private userAuthService: UserAuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.userAuthService.accessToken}`,
      },
    });
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !this.refresh) {
          this.refresh = true;
          return this.userAuthService.getAcessToken().pipe(
            switchMap((res: any) => {
              this.userAuthService.accessToken = res.body.accessToken;
              return next.handle(
                request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${this.userAuthService.accessToken}`,
                  },
                })
              );
            })
          );
        } else {
          this.userAuthService.accessToken = '';
        }
        this.refresh = false;
        return throwError(() => err);
      })
    );
  }
}
