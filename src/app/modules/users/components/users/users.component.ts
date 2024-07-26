import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterModule],
  providers: [UserService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private userService: UserService = inject(UserService);
  users = this.userService.users;

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.userService.setUsers(users);
    });
  }
}
