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
  
  kategoriEkle(category: any): Observable<any>{
    // Tek ürün gönderiyoruz, array’e çevirmeye gerek yok
    return this.http.post(this.ekleUrl, category);
  }

  kategoriSil(id:string)
  {
    return this.http.delete(`api/kategori/${id}`);
  }

  kategoriGuncelle(id: string, product: any) {
  return this.http.put(`api/kategori/${id}`, product);
  }

  kategoriById(id: string): Observable<CategoryModel> {
    return this.http.get<CategoryModel>(`api/kategori/${id}`);
  }


}
