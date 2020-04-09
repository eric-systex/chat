import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, of } from 'rxjs'; // only need to import from rxjs
import { environment } from '../../environments/environment';
import { Message } from '../_models/message.model';
import { Event } from '../_models/event.model';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  
  // Our socket connection
  private socket: SocketIOClient.Socket;

  public connect(): void {
    this.socket = io(environment.ws_uri, {path: '/chat/socket.io'});
    console.log(`wsclient connect to ${environment.ws_uri} path: /chat/socket.io`);
  }

  public send(message: Message) {
    //console.log('send message:');
    //console.log(message);
    this.socket.emit('message', message);
  }

  // websocket on message event
  // data => {room: string, from: Contact, content?: any, action?: Action}
  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (message: Message) => {
        //console.log('receive message:');
        //console.log(message);
        observer.next(message);
      });
    });
  }

  // websocket on connect/disconnect event
  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
        this.socket.on(event, () => {
          console.log(`receive ${event.toUpperCase()} event message`);
          observer.next();
        });
    });
  }
    
}
