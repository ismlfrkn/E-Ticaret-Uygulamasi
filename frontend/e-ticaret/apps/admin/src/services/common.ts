import { Injectable } from '@angular/core';
import { BreadcrumbModel } from '../pages/layouts/breadcrumb';

@Injectable({
  providedIn: 'root'
})
export class Common {
  data:BreadcrumbModel[] = [];  

  set(data:BreadcrumbModel[])
  {
    const val:BreadcrumbModel = {
      title:"Ana Sayfa",
      url:"/",
      icon:"home"
    }
    this.data = data;
    this.data.unshift(val); //Val'ı her zaman listenin başına ekler.
  }
}
