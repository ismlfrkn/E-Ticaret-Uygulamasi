import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

  export interface UserModel{
      _id:string,
      firstName:string, 
      lastName:string,
      userName:string,
      email:string, 
      password:string, 
      isAdmin:boolean,
  }


@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly listele = httpResource<UserModel[]>(()=>"api/kullanici/listele");
  readonly tum_veri = computed(()=>this.listele.value() ?? []);
  readonly loading = computed(()=>this.listele.isLoading());
  


  readonly http = inject(HttpClient);
  readonly ekleUrl = 'api/kullanici/ekle';
   kullaniciEkle(user: any): Observable<any>{
      // Tek ürün gönderiyoruz, array’e çevirmeye gerek yok
      return this.http.post(this.ekleUrl, user);
    }
  
    kullaniciSil(id:string)
    {
      return this.http.delete(`api/kullanici/${id}`);
    }
  
    kullaniciGuncelle(id: string, user: any) {
    return this.http.put(`api/kullanici/${id}`, user);
    }
  
    // sadece admin update için yardımcı metod
    adminGuncelle(id: string, isAdmin: boolean): Observable<any> {
    return this.http.put(`api/kullanici/${id}`, { isAdmin });
    }

    kullaniciById(id: string): Observable<UserModel> {
    return this.http.get<UserModel>(`api/kullanici/${id}`);
  }

}
