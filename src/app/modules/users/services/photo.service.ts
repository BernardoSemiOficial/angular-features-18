import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Photo } from '../models/photo.model';

@Injectable()
export class PhotoService {
  private httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  private _photos = signal<Photo[]>([] as Photo[]);
  public readonly photos = computed(() => this._photos());

  public getPhotosByAlbum(albumId: number): Observable<Photo[]> {
    const params = new HttpParams().append('albumId', albumId ?? 0);
    return this.httpClient.get<Photo[]>(this.baseUrl + '/photos', { params });
  }

  public setPhotos(photos: Photo[]) {
    this._photos.set(photos);
  }
}
