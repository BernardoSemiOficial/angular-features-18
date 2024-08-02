import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { map } from 'rxjs';
import { AlbumService } from '../../services/album.service';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss',
})
export class AlbumComponent implements OnInit, OnChanges {
  private albumService: AlbumService = inject(AlbumService);
  private photoService: PhotoService = inject(PhotoService);
  @Input({ transform: (id: string) => Number(id) }) albumId: number = 0;
  albumSignal = this.albumService.album;
  albumsSignal = this.albumService.albums;
  photos = this.photoService.photos;

  ngOnInit() {
    this.getAlbum();
    this.getPhotos();
  }

  ngOnChanges(data: SimpleChanges) {
    if (data['albumId'].currentValue !== data['albumId'].previousValue) {
      this.getPhotos();
    }
  }

  getAlbum() {
    this.albumService.getAlbum(this.albumId).subscribe((album) => {
      this.albumService.setAlbum(album);
    });
  }

  getPhotos() {
    this.photoService
      .getPhotosByAlbum(this.albumId)
      .pipe(map((photos) => this.photoService.setPhotos(photos)))
      .subscribe();
  }
}
