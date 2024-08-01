import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterModule, CardModule, ButtonModule],
  providers: [UserService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  users = this.userService.users;

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.userService.setUsers(users);
    });
  }

  redirectDetails(userId: number) {
    const user = this.users().find((user) => user.id === userId);
    if (user) this.userService.setUser(user);
    this.router.navigate(['users', userId]);
  }
}
