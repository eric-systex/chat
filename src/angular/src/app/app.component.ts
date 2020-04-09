import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WebsocketService } from './_helpers/websocket.service';
import { Event } from './_models/event.model';
import { HttpclientService } from './_helpers/httpclient.service';
import { ChatMessageHelper } from './_helpers/chat-message-helper';
import { SharedService } from './_helpers/shared.service';
import { Contact } from './_models/contact.model';
import { Action } from './_models/action.model';
import { User } from './_models/user.model';
import { AuthService } from './_auth/auth.service';
import { Message } from './_models/message.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  user: User;

  constructor(
    private wsService: WebsocketService, 
    private http: HttpclientService, 
    private chat: ChatMessageHelper, 
    private shared: SharedService, 
    private auth: AuthService) { }

  ngOnInit(): void {
    console.log('app component init');
    
    if (this.auth.isLoggedIn()) {
      this.user = this.auth.getUser();
      this.init();
    } else {
      this.shared.user.subscribe(data => {
        this.user = data;
        this.init();
      });
    }
  }

  private init(): void {

    this.wsService.connect();
    
    // Listen on CONNECT Event
    this.wsService.onEvent(Event.CONNECT).subscribe(() => {
      console.log('connected');
    });
  
    // Listen on DISCONNECT Event
    this.wsService.onEvent(Event.DISCONNECT).subscribe(() => {
      console.log('disconnected');
    });

    this.shared.contacts.subscribe(data => {
      data.forEach(item => {
        this.chat.sendNotification({room: item.room, from: this.user}, Action.JOINED);
        console.log(`send JOINED action, ${item.id} room: ${item.room}`);

        // Listen on Message (include: JOINED/LEFT/RENAME Actions)
        this.wsService.onMessage().subscribe((message: Message) => {
          // https://github.com/socketio/socket.io/issues/2713
          // If you want the client to respond to certain messages, but only from certain rooms, then you should include some room identifier in the message you broadcast
          // Then your client can just listens for all occurrences of that message, and once received, can look at the roomid in the packet and decide if it needs to respond to it
          if (message.action === undefined && message.room == item.room) {
            console.log(`receive message at room: ${item.room}`);
            console.log(message);
            this.shared.addMessage(message);
            if (message.from.id !== this.user.id) {
              // 接收到對方傳來的訊息
              // 要判斷聊天室是否存在，若不存在需要先新增
              let exists = this.shared.isRoomExists(message.room);
              if (!exists) {
                this.http.put('room/add', { id: message.from.id, name: message.from.name, last_message: message.content }).subscribe(room => {
                  room['last_message'] = message.content;
                  room['last_modified'] = message.last_modified;
                  this.shared.addRoom(room);
                });
              } else {
                this.http.get(`room/${message.room}`).subscribe(room => {
                  this.shared.addRoom(room);
                });
              }
            } else {
              // 接收到自己傳來的訊息
              this.http.get(`room/${message.room}`).subscribe(room => {
                this.shared.addRoom(room);
              });
            }
          }
        });
      });
    });

    this.http.get('contacts').subscribe(response => {
      this.shared.reloadContacts(response);
    });

    this.http.get('rooms').subscribe(response => {
      this.shared.reloadRooms(response);
    });

  }
}
