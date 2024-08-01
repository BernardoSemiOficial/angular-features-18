import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
  private httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  private _users = signal<User[]>([] as User[]);
  private _user = signal<User>({} as User);
  public readonly users = computed(() => this._users());
  public readonly user = computed(() => this._user());

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.baseUrl + '/users');
  }

  public getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(this.baseUrl + `/users/${id}`);
  }

  public setUser(user: User) {
    console.log(user);
    this._user.set(user);
  }

  public setUsers(users: User[]) {
    this._users.set(users);
  }
}
