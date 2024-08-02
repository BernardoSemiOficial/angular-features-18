import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SessionStorageEnum } from '../enums/local-storage.enum';
import { Album } from '../models/album.model';

@Injectable({ providedIn: 'root' })
export class AlbumService {
  private httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  private _albums = signal<Album[]>([] as Album[]);
  private _album = signal<Album>({} as Album);
  public readonly albums = computed(() => this._albums());
  public readonly album = computed(() => this._album());

  constructor() {
    effect(() => {
      const albums = this.albums();
      const userId = albums[0]?.userId;
      if (userId)
        sessionStorage.setItem(
          SessionStorageEnum.ALBUMS + SessionStorageEnum.USER + userId,
          JSON.stringify(albums)
        );
    });
    effect(() => {
      const album = this.album();
      const userId = album.userId;
      if (userId)
        sessionStorage.setItem(
          SessionStorageEnum.ALBUM + SessionStorageEnum.USER + userId,
          JSON.stringify(album)
        );
    });
  }

  private getAlbumsSessionStorage(userId: number): Album[] | null {
    const albumsSessionStorage = sessionStorage.getItem(
      SessionStorageEnum.ALBUMS + SessionStorageEnum.USER + userId
    );
    const albums =
      !!albumsSessionStorage && (JSON.parse(albumsSessionStorage) as Album[]);
    return albums || null;
  }

  private getAlbumSessionStorage(userId: number): Album | null {
    const albumSessionStorage = sessionStorage.getItem(
      SessionStorageEnum.ALBUM + SessionStorageEnum.USER + userId
    );
    const album =
      !!albumSessionStorage && (JSON.parse(albumSessionStorage) as Album);
    return album || null;
  }

  public getAlbumsByUser(userId: number): Observable<Album[]> {
    const albumsExists = this.getAlbumsSessionStorage(userId);
    if (albumsExists) return of(albumsExists);

    const params = new HttpParams().set('userId', userId ?? 0);
    return this.httpClient.get<Album[]>(this.baseUrl + '/albums', { params });
  }

  public getAlbum(albumId: number): Observable<Album> {
    const albumExists = this.getAlbumSessionStorage(albumId);
    if (albumExists) return of(albumExists);

    return this.httpClient.get<Album>(this.baseUrl + '/albums/' + albumId);
  }

  public setAlbum(album: Album) {
    this._album.set(album);
  }

  public setAlbums(albums: Album[]) {
    this._albums.set(albums);
  }
}
