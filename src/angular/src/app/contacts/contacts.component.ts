import { Component, OnInit } from '@angular/core';
import { Contact } from '../_models/contact.model';
import { HttpclientService } from '../_helpers/httpclient.service';
import { Router } from '@angular/router';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material';
import { SharedService } from '../_helpers/shared.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  friends: Contact[] = [];
  groups: Contact[] = [];
  
  constructor(private bottomSheet: MatBottomSheet, private http: HttpclientService, private router: Router, private shared: SharedService) { }

  ngOnInit() {

    this.shared.contacts.subscribe(data => {
      data.forEach(item => {
        if (item.type == 'group') {
          this.groups.push(item);
        }
        if (item.type == 'friend') {
          this.friends.push(item);
        }
      });
    });

  }

  openRoom(id, name): void {
    this.http.put('room/add', { id, name }).subscribe(response => {
      this.shared.addRoom(response);
      this.router.navigate(['/chat', response['id']]);
    });
  }

  openBottomSheet(): void {
    this.bottomSheet.open(ContactsBottomSheet);
  }
}

@Component({
  selector: 'contacts-bottom-sheet',
  templateUrl: 'contacts-bottom-sheet.html',
})
export class ContactsBottomSheet {
  constructor(private bottomSheetRef: MatBottomSheetRef<ContactsBottomSheet>) {}

  addGroup(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  addFriend(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}