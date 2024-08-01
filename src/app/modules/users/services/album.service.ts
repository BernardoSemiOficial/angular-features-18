import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Album } from '../models/album.model';

@Injectable()
export class AlbumService {
  private httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  private _albums = signal<Album[]>([] as Album[]);
  private _album = signal<Album>({} as Album);
  public readonly albums = computed(() => this._albums());
  public readonly album = computed(() => this._album());

  public getAlbumsByUser(userId: number): Observable<Album[]> {
    const params = new HttpParams().set('userId', userId ?? 0);
    return this.httpClient.get<Album[]>(this.baseUrl + '/albums', { params });
  }

  public setAlbum(album: Album) {
    this._album.set(album);
  }

  public setAlbums(albums: Album[]) {
    this._albums.set(albums);
  }
}
