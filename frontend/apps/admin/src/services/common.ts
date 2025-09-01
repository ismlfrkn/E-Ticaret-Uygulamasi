import { Injectable, signal } from '@angular/core';
import { BreadcrumbModel } from '../pages/layouts/breadcrumb';
import { FlexiGridFilterDataModel } from 'flexi-grid';

@Injectable({
  providedIn: 'root'
})
export class Common {
   readonly data = signal<BreadcrumbModel[]>([]);

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
