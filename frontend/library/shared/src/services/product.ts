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
  categoryId:string;
}


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  //GET ISTEĞI(TUM LISTE)
  readonly listele = httpResource<ProductModel[]>(()=>"api/urun/listele");
  readonly tum_veri = computed(() => this.listele.value() ?? []);
  readonly loading = computed(()=>this.listele.isLoading());

  readonly http = inject(HttpClient);
  readonly ekleUrl = 'api/urun/ekle';
  
  urunEkle(product: any): Observable<any>{
    // Tek ürün gönderiyoruz, array’e çevirmeye gerek yok
    return this.http.post(this.ekleUrl, product);
  }

  urunSil(id:string)
  {
    return this.http.delete(`api/urun/${id}`);
  }

  urunGuncelle(id: string, product: any) {
  return this.http.put(`api/urun/${id}`, product);
  }

    urunById(id: string): Observable<ProductModel> {
    return this.http.get<ProductModel>(`api/urun/${id}`);
  }

  

}
