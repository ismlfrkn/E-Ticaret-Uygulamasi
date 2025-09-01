import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CategoryModel{
  _id:string,
  name:string,
}



@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  //GET ISTEĞI(TUM LISTE)
  readonly listele = httpResource<CategoryModel[]>(()=>"api/kategori/listele");
  readonly tum_veri = computed(() => this.listele.value() ?? []);
  readonly loading = computed(()=>this.listele.isLoading());


  readonly http = inject(HttpClient);
  readonly ekleUrl = 'api/kategori/ekle';
  
  urunEkle(category: any): Observable<any>{
    // Tek ürün gönderiyoruz, array’e çevirmeye gerek yok
    return this.http.post(this.ekleUrl, category);
  }

  urunSil(id:string)
  {
    return this.http.delete(`api/kategori/${id}`);
  }

  urunGuncelle(id: string, product: any) {
  return this.http.put(`api/kategori/${id}`, product);
  }


}
