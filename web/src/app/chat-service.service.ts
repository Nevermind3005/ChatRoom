import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatServiceService {
  public message: BehaviorSubject<string>;
  a: Observable<string> | undefined;
  constructor() {
    this.message = new BehaviorSubject('');
  }

  socket = io('http://localhost:3000');

  public sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  public getNewMessage = () => {
    if (this.a == undefined) {
      this.socket.on('message', (message) => {
        this.message.next(message);
      });
      this.a = this.message.asObservable();
    }
    return this.a;
  };

  public disconnect() {
    this.socket.disconnect();
  }

  public connect() {
    this.socket.connect();
  }
}
