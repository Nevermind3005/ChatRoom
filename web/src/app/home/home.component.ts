import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../user-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private userAuthService: UserAuthService) {}

  ngOnInit(): void {
    this.userAuthService.getAcessToken().subscribe((res: any) => {
      this.userAuthService.accessToken = res.body.accessToken;
    });
  }
}
