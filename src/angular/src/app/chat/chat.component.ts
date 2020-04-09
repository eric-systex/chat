import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message.model';
import { Action } from '../_models/action.model';
import { AuthService } from '../_auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpclientService } from '../_helpers/httpclient.service';
import { ChatMessageHelper } from '../_helpers/chat-message-helper';
import { User } from '../_models/user.model';
import { SharedService } from '../_helpers/shared.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  // https://medium.com/dailyjs/real-time-apps-with-typescript-integrating-web-sockets-node-angular-e2b57cbd1ec1
  action = Action;
  
  id: string;
  name: string;
  total_messages: number;

  user: User;
  messages: Observable<Message[]>;
  
  message: string;

  constructor(private http: HttpclientService, private shared: SharedService, 
      private auth: AuthService, private chat: ChatMessageHelper,
      private router: Router, private route: ActivatedRoute) {
    
    this.route.params.subscribe( param => {
      this.id = param['id'];
      console.log(`room is ${this.id}`);
    });
  }

  ngOnInit() {
    
    this.user = this.auth.getUser();
    
    this.http.get(`room/${this.id}`).subscribe(room => {
      this.id = room.id;
      this.name = room.name;
    });
    
    this.http.get(`room/${this.id}/messages`).subscribe(response => {
      this.shared.reloadMessages(this.id, response);
      this.messages = this.shared.messages[this.id];
    });
    
  }

  public sendMessage(message: string): void {
    this.chat.sendMessage(this.id, this.user, message);
    this.message = null;
  }

  public exitRoom(): void {
    // this.chat.sendNotification(this.id, Action.LEFT);
    // console.log(`send LEFT action, room: ${this.id}`);
    this.router.navigate(['/rooms']);
  }

  afterExpand(textarea: HTMLTextAreaElement) {
    textarea.rows = 5;
  }

  afterCollapse(textarea: HTMLTextAreaElement) {
    textarea.rows = 1;
  }
}
