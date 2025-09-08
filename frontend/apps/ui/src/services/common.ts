import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BasketModel } from '@shared/models/basket.model';
import { UserModel } from '@shared/services/user';

@Injectable({
  providedIn: 'root'
})
export class Common {
  readonly user = signal<UserModel| undefined>(undefined);
  readonly basketCount = signal<number>(0);
  readonly http = inject(HttpClient);

  constructor() {
    const response:string|null = localStorage.getItem("kullanici");
    if (response) {
      this.user.set(JSON.parse(response));
    }
     this.getBasketCount();

  }

  getBasketCount() {
    if(this.user()) {
    const endpoint = `api/basket/listele/${this.user()!._id}`;
    this.http.get<BasketModel[]>(endpoint).subscribe(res => 
      this.basketCount.set(res.length));  
    }
  }

}
