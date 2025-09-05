import { Injectable, signal } from '@angular/core';
import { BreadcrumbModel } from '../models/breadcrumb.model';
import { UserModel } from './user';

@Injectable({
  providedIn: 'root'
})
export class Common {
   readonly data = signal<BreadcrumbModel[]>([]);
   readonly user = signal<UserModel | undefined>(undefined);

   constructor() {
    const response:string|null = localStorage.getItem("admin");
    if (response) {
      this.user.set(JSON.parse(response));
    }

  }

  set(data:BreadcrumbModel[])
  {
    const val:BreadcrumbModel = {
      title:"Ana Sayfa",
      url:"/",
      icon:"home"
    }
    this.data.set(data);
    this.data.update(prev=>[val,...prev]); //Val'ı her zaman listenin başına ekler.
    
  }
}
