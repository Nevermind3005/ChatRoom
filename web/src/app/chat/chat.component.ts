import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { ChatServiceService } from '../chat.service';
import { UserAuthService } from '../user-auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  message = new FormControl('', [Validators.required]);
  sub: Subscription | undefined;
  messageList: { message: string; username: string }[] = [];

  constructor(
    private chatService: ChatServiceService,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.chatService.connect();
    this.sub = this.chatService.getNewMessage().subscribe((message: any) => {
      if (message != '') {
        this.messageList.push(message);
      }
    });
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }

  sendMessage() {
    this.chatService.sendMessage({
      message: this.message.getRawValue()!,
      token: this.userAuthService.accessToken,
    });
    this.message.setValue('');
  }
}
