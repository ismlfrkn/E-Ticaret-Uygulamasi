import { Injectable, signal } from '@angular/core';
import { UserModel } from '@shared/services/user';

@Injectable({
  providedIn: 'root'
})
export class Common {
  readonly user = signal<UserModel| undefined>(undefined);

  constructor() {
    const response:string|null = localStorage.getItem("kullanici");
    if (response) {
      this.user.set(JSON.parse(response));
    }

  }

}
