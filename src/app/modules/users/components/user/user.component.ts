import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { AlbumService } from '../../services/album.service';
import { PhotoService } from '../../services/photo.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule, AsyncPipe],
  providers: [UserService, AlbumService, PhotoService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  private userService: UserService = inject(UserService);
  private albumService: AlbumService = inject(AlbumService);
  @Input() userId: number = 0;
  user$!: Observable<User>;
  isLoadingUser: boolean = false;
  albums = this.albumService.albums;

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.isLoadingUser = true;
    this.user$ = this.userService.getUser(this.userId).pipe(
      map((user) => {
        this.isLoadingUser = false;
        this.userService.setUser(user);
        this.getAlbums();
        return user;
      })
    );
  }

  getAlbums() {
    this.albumService
      .getAlbumsByUser(this.userId)
      .pipe(map((albums) => this.albumService.setAlbums(albums)))
      .subscribe();
  }
}
