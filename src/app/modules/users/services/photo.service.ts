import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SessionStorageEnum } from '../enums/local-storage.enum';
import { Photo } from '../models/photo.model';

@Injectable({ providedIn: 'root' })
export class PhotoService {
  private httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  private _photos = signal<Photo[]>([] as Photo[]);
  public readonly photos = computed(() => this._photos());

  constructor() {
    effect(() => {
      const photos = this.photos();
      const albumId = photos[0]?.albumId;
      if (albumId)
        sessionStorage.setItem(
          SessionStorageEnum.PHOTOS + SessionStorageEnum.ALBUM + albumId,
          JSON.stringify(photos)
        );
    });
  }

  public getPhotosByAlbum(albumId: number): Observable<Photo[]> {
    const photosExists = this.getPhotosSessionStorage(albumId);
    if (photosExists?.length) return of(photosExists);

    const params = new HttpParams().append('albumId', albumId ?? 0);
    return this.httpClient.get<Photo[]>(this.baseUrl + '/photos', { params });
  }

  private getPhotosSessionStorage(albumId: number): Photo[] | null {
    const photosSessionStorage = sessionStorage.getItem(
      SessionStorageEnum.PHOTOS + SessionStorageEnum.ALBUM + albumId
    );
    const photos =
      !!photosSessionStorage && (JSON.parse(photosSessionStorage) as Photo[]);
    return photos || null;
  }

  public setPhotos(photos: Photo[]) {
    this._photos.set(photos);
  }
}
