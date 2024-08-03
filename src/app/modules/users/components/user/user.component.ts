import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { map } from 'rxjs';
import { AddressConcatPipe } from '../../pipes/address-concat.pipe';
import { AlbumService } from '../../services/album.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterModule,
    AsyncPipe,
    JsonPipe,
    CardModule,
    ButtonModule,
    AddressConcatPipe,
  ],
  providers: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  private userService: UserService = inject(UserService);
  private albumService: AlbumService = inject(AlbumService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  @Input() userId: number = 0;
  isLoadingUser: boolean = false;
  userSignal = this.userService.user;
  albumsSignal = this.albumService.albums;

  ngOnInit() {
    this.getUser();
    this.getAlbums();
  }

  getUser() {
    this.userService
      .getUser(this.userId)
      .subscribe((user) => this.userService.setUser(user));
  }

  getAlbums() {
    this.albumService
      .getAlbumsByUser(this.userId)
      .pipe(map((albums) => this.albumService.setAlbums(albums)))
      .subscribe();
  }

  redirectDetails(albumId: number) {
    const album = this.albumsSignal().find((album) => album.id === albumId);
    if (album) this.albumService.setAlbum(album);
    this.router.navigate(['albums', albumId], { relativeTo: this.route });
  }
}
