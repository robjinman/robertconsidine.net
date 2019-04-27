import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { UserService } from '../user.service';
import { User } from '../types';

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

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.users$ = this.userService.getUsers();
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).pipe(take(1)).subscribe();
  }
}
