import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
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
      sessionStorage.setItem(
        user.id ? SessionStorageEnum.USER + user.id : SessionStorageEnum.USER,
        JSON.stringify(user)
      );
    });
    const usersExists = this.getUsersSessionStorage();
    if (usersExists) this.setUsers(usersExists);
  }

  private getUsersSessionStorage(): User[] | null {
    const usersSessionStorage = sessionStorage.getItem(
      SessionStorageEnum.USERS
    );
    const users =
      !!usersSessionStorage && (JSON.parse(usersSessionStorage) as User[]);
    return users || null;
  }

  private getUserSessionStorage(userId: number): User | null {
    const userSessionStorage = sessionStorage.getItem(
      SessionStorageEnum.USER + userId
    );
    const user =
      !!userSessionStorage && (JSON.parse(userSessionStorage) as User);
    return user || null;
  }

  public getUsers(): Observable<User[]> {
    const usersExists = this.getUsersSessionStorage();
    if (usersExists?.length) return of(usersExists);

    return this.httpClient.get<User[]>(this.baseUrl + '/users');
  }

  public getUser(id: number): Observable<User> {
    const userExists = this.getUserSessionStorage(id);
    if (userExists && Object.values(userExists).length) return of(userExists);

    return this.httpClient.get<User>(this.baseUrl + `/users/${id}`);
  }

  public setUser(user: User) {
    this._user.set(user);
  }

  public setUsers(users: User[]) {
    this._users.set(users);
  }
}
