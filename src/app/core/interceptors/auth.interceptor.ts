import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Router } from '@angular/router';
import { ToasterService } from '../helpers/Toaster.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertToaster: ToasterService
  ) {}
  token: any;
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status == 401) {
      this.router.navigate(['/unauthorized']);
    }

    this.alertToaster.showToastError('', err.error.message);
    return throwError(err);
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.token) {
      request = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + this.token),
      });
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((x) => this.handleAuthError(x))
    );
  }
}
