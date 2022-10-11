import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserSignIn } from '../user';
import { UserAuthService } from '../user-auth.service';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { AuthInterceptor } from '../interceptors/auth.interceptor';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }

  signIn() {
    if (
      this.email.getRawValue() == null ||
      this.password.getRawValue() == null
    ) {
      return;
    }

    const userSignIn: UserSignIn = {
      email: this.email.getRawValue()!,
      password: this.password.getRawValue()!,
    };
    this.userAuthService.signIn(userSignIn).subscribe((res) => {
      if (res.status === 200) {
        this.userAuthService.getAcessToken().subscribe((res: any) => {
          this.userAuthService.accessToken = res.body.accessToken;
          console.log(res);
          this.router.navigate(['./']);
        });
      }
    });
  }

  constructor(
    private userAuthService: UserAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}
}
