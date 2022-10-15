import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  Observable,
  Subject,
  switchAll,
  tap,
} from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatServiceService {
  public message: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() {}

  socket = io('http://localhost:3000');

  public sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  public getNewMessage = () => {
    this.socket.on('message', (message) => {
      this.message.next(message);
    });
    return this.message.asObservable();
  };
}
