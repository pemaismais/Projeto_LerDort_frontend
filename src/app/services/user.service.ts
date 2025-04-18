import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { UserPage } from '../models/user-page';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private api = `${environment.BACKEND_URL}/api/user`;

  findAll(page = 0, size = 10 ): Observable<UserPage>{
    return this.http.get<UserPage>(this.api , {params:{ page, size}});
  }
  patchUpdate(user: User): Observable<User>{
    return this.http.patch<User>(this.api, user, {responseType: 'json'});
  }

  getInfo(): Observable<User>{
    return this.http.get<User>(`${this.api}/info`, {responseType: 'json'} );
  }

  update(user: User): Observable<User>{
    return this.http.put<User>(`${this.api}/${user.id}`, user, {responseType: 'json'});
  }
  
  constructor() { }
}
