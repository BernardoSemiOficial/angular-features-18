import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule, AsyncPipe],
  providers: [UserService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  private userService: UserService = inject(UserService);
  @Input() userId: number = 0;
  user$!: Observable<User>;
  isLoadingUser: boolean = false;

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.isLoadingUser = true;
    this.user$ = this.userService.getUser(this.userId);

    this.user$.subscribe({
      next: (user) => {
        this.userService.setUser(user);
      },
    });
  }
}
