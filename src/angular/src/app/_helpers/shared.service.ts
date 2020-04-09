import { Injectable, Output, EventEmitter } from '@angular/core';
import { Contact } from '../_models/contact.model';
import { BehaviorSubject, Subject, ReplaySubject, Observable, of } from 'rxjs';
import { Room } from '../_models/room.model';
import { User } from '../_models/user.model';
import { Message } from '../_models/message.model';
import { HttpclientService } from './httpclient.service';
import { distinct, map, last, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private user_store: Subject<User> = new Subject();
  readonly user: Observable<User> = this.user_store;

  private rooms_store: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>([]); // 避免誤用next新增資料
  readonly rooms: Observable<Room[]> = this.rooms_store; // readonly 不允許外部修改，但可提供訂閱

  private contacts_store: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);
  readonly contacts: Observable<Contact[]> = this.contacts_store;

  private messages_store: BehaviorSubject<Message[]>[] = [];
  readonly messages: Observable<Message[]>[] = this.messages_store;

  constructor() { }

  logined(user: User): void {
    this.user_store.next(user);
  }

  isRoomExists(room: string): boolean {
    this.rooms_store.getValue().map(x => {
      if (x.id === room)
        return true;
    });
    return false;
  }
  addRoom(room: Room): void {
    let rooms = this.rooms_store.getValue().filter(data => data.id !== room.id);
    this.rooms_store.next([...rooms, room]);
  }

  reloadRooms(rooms: Room[]): void {
    this.rooms_store.next(rooms);
  }

  addContact(contact: Contact): void {
    this.contacts_store.next([...this.contacts_store.getValue(), contact]);
  }

  reloadContacts(contacts: Contact[]): void {
    this.contacts_store.next(contacts);
  }

  addMessage(message: Message): void {
    if (!this.messages_store[message.room]) {
      this.messages_store[message.room] = new BehaviorSubject<Message[]>([]);
    }
    this.messages_store[message.room].next([...this.messages_store[message.room].getValue(), message]);
  }

  reloadMessages(room: string, messages: Message[]): void {
    if (!this.messages_store[room]) {
      this.messages_store[room] = new BehaviorSubject<Message[]>([]);
    }
    this.messages_store[room].next(messages);
  }

  
}
