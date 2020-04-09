import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Action } from '../_models/action.model';
import { Message } from '../_models/message.model';
import { User } from '../_models/user.model';

@Injectable({ providedIn: 'root' })
export class ChatMessageHelper {
    
    constructor(private wsService: WebsocketService) { }

    public sendMessage(room: string, from: User, message: string): void {
        if (!message) {
          return;
        }
        this.wsService.send({
          room: room,
          from: from,
          content: message
        });
      }
    
      public sendNotification(params: any, action: Action): void {
        let message: Message;
    
        if (action === Action.JOINED) {
          message = {
            room: params.room,
            from: params.from,
            action: action
          }
        } else if (action === Action.LEFT) {
          message = {
            room: params.room,
            from: params.from,
            action: action
          }
        } else if (action === Action.RENAME) {
          message = {
            room: params.room,
            from: params.from,
            action: action,
            content: {
              username: params.from.name,
              previousUsername: params.previousUsername
            }
          };
        }
    
        this.wsService.send(message);
      }
}