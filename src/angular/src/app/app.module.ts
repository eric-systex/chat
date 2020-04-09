import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import {
  MatToolbarModule, MatListModule, MatIconModule, MatButtonModule,
  MatFormFieldModule, MatInputModule, MatDialogModule, MatCardModule, MatBottomSheet, MatBottomSheetContainer, MatBottomSheetModule,
  MatExpansionModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { RoomsComponent, RoomsBottomSheet } from './rooms/rooms.component';
import { WebsocketService } from './_helpers/websocket.service';
import { ContactsComponent, ContactsBottomSheet } from './contacts/contacts.component';
import { AuthService } from './_auth/auth.service';
import { LoginComponent } from './login/login.component';
import { JwtInterceptor } from './_helpers/jwt-interceptor';
import { AuthGuard } from './_helpers/auth-guard';
import { ChatComponent } from './chat/chat.component';
import { ChatMessageHelper } from './_helpers/chat-message-helper';
import { SharedService } from './_helpers/shared.service';

const routes: Routes = [
  { path: '', redirectTo: 'rooms', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard]},
  { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard]},
  { path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuard]},
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContactsComponent, ContactsBottomSheet, 
    RoomsComponent, RoomsBottomSheet,
    ChatComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    MatToolbarModule, MatListModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatDialogModule, FormsModule,
    HttpClientModule, FlexLayoutModule, MatCardModule, MatBottomSheetModule,
    MatExpansionModule,
    RouterModule.forRoot(routes)
  ],
  entryComponents: [ContactsBottomSheet, RoomsBottomSheet],
  providers: [
    WebsocketService, AuthService, ChatMessageHelper, SharedService,
    MatBottomSheet,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
