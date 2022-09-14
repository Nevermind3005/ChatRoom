import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { baseUrl } from '../api';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css'],
})
export class MeComponent implements OnInit {
  user = new User();

  constructor(private userService: UserService) {}

  getUserDetails() {
    this.userService.getUserDetail().subscribe((user) => {
      this.user = user;
      this.user.userImage = baseUrl + this.user.userImage;
    });
  }

  ngOnInit(): void {
    this.getUserDetails();
  }
}
