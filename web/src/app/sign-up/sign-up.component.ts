import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserAuthService } from '../user-auth.service';
import { UserSignUp } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  username = new FormControl('', [Validators.required]);

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

  getUsernameErrorMessage() {
    if (this.username.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }

  add(): void {
    if (
      this.username.getRawValue() == null ||
      this.email.getRawValue() == null ||
      this.password.getRawValue() == null
    ) {
      return;
    }

    const user: UserSignUp = {
      username: this.username.getRawValue()!,
      email: this.email.getRawValue()!,
      password: this.password.getRawValue()!,
    };

    this.userAuthService.signUp(user).subscribe(() => {
      this.router.navigate(['./sign-in']);
    });
  }

  constructor(
    private userAuthService: UserAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}
}
