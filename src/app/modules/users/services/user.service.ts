import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionStorageEnum } from '../enums/local-storage.enum';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private httpClient: HttpClient = inject(HttpClient);
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  private _users = signal<User[]>([] as User[]);
  private _user = signal<User>({} as User);
  public readonly users = computed(() => this._users());
  public readonly user = computed(() => this._user());

  constructor() {
    effect(() => {
      const users = this.users();
      sessionStorage.setItem(SessionStorageEnum.USERS, JSON.stringify(users));
    });
    effect(() => {
      const user = this.user();
      sessionStorage.setItem(SessionStorageEnum.USER, JSON.stringify(user));
    });
    this.getUsersSessionStorage();
  }

  private getUsersSessionStorage() {
    const usersSessionStorage = sessionStorage.getItem(
      SessionStorageEnum.USERS
    );
    const users =
      !!usersSessionStorage && (JSON.parse(usersSessionStorage) as User[]);
    if (!users)
      this.getUsers().subscribe((users) => {
        this.setUsers(users);
      });
    if (users) this.setUsers(users);
  }

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
