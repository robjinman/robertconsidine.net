import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

import { UserService } from '../user.service';
import { User } from '../types';
import {
  ConfirmationPromptComponent
} from '../confirmation-prompt/confirmation-prompt.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.styl']
})
export class UsersComponent implements OnInit {
  users$: Observable<User[]>;
  displayedColumns = [
    'name',
    'createdAt',
    'email',
    'activated',
    'action'
  ];

  constructor(private userService: UserService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.users$ = this.userService.getUsers();
  }

  deleteUser(id: string) {
    const dialog = this.dialog.open(ConfirmationPromptComponent, {
      data: {
        message: "Are you sure you want to delete user?"
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(id).pipe(take(1)).subscribe();
      }
    });
  }
}
