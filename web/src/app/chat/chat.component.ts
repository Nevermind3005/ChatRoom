import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { catchError, map, tap } from 'rxjs';
import { ChatServiceService } from '../chat-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  message = new FormControl('', [Validators.required]);

  messageList: string[] = [];

  constructor(private chatService: ChatServiceService) {}

  ngOnInit(): void {
    this.chatService.getNewMessage().subscribe((message: string) => {
      if (message != '') {
        this.messageList.push(message);
      }
    });
  }

  sendMessage() {
    this.chatService.sendMessage(this.message.getRawValue()!);
    this.message.setValue('');
  }
}
