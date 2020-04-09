import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material';
import { Room } from '../_models/room.model';
import { AuthService } from '../_auth/auth.service';
import { User } from '../_models/user.model';
import { SharedService } from '../_helpers/shared.service';
import { Observable } from 'rxjs';
import { HttpclientService } from '../_helpers/httpclient.service';

export interface DialogData {
  name: string;
  message: string;
}

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  user: User;
  rooms: Observable<Room[]> = this.shared.rooms;

  constructor(private bottomSheet: MatBottomSheet, private shared: SharedService, private http: HttpclientService, private auth: AuthService) { }

  ngOnInit() {
    this.user = this.auth.getUser();
  }

  openBottomSheet(): void {
    this.bottomSheet.open(RoomsBottomSheet);
  }
}

@Component({
  selector: 'rooms-bottom-sheet',
  templateUrl: 'rooms-bottom-sheet.html',
})
export class RoomsBottomSheet {
  constructor(private bottomSheetRef: MatBottomSheetRef<RoomsBottomSheet>) {}

  addGroup(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  addRoom(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}

