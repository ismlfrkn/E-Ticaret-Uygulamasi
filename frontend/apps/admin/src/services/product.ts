import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProductModel {
  _id: string;       // MongoDB id
  name: string;
  imageUrl?: string;
  price: number;
  stock: number;
  categoryName: string;
}


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  //GET ISTEĞI(TUM LISTE)
  readonly listele = httpResource<ProductModel[]>(()=>"http://localhost:5000/urun/listele");
  readonly tum_veri = computed(() => this.listele.value() ?? []);
  readonly loading = computed(()=>this.listele.isLoading());


  readonly http = inject(HttpClient);
  readonly ekleUrl = 'http://localhost:5000/urun/ekle';
  
  urunEkle(product: any): Observable<any>{
    // Tek ürün gönderiyoruz, array’e çevirmeye gerek yok
    return this.http.post(this.ekleUrl, product);
  }


  

}
