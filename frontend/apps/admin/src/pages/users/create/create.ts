import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, resource, signal, ViewEncapsulation } from '@angular/core';
import { UserModel, UserService } from '../../../services/user';
import { FlexiToastService } from 'flexi-toast';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import Blank from '../../../components/blank';
import { BreadcrumbModel } from '../../layouts/breadcrumb';
import { lastValueFrom } from 'rxjs';

@Component({
  imports: [FormsModule,Blank],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Create {
  id = signal<string>("");
  readonly activate = inject(ActivatedRoute);
  readonly title = computed(()=>this.id() ? 'Kullanıcı Güncelle':'Kullanıcı Ekle');
  readonly btnName = computed(()=>this.id() ? 'Güncelle':'Kaydet');
  
   readonly result = resource({
  params: () => this.id(),
  loader: async () => {
    const res = await lastValueFrom(this.http.kullaniciById(this.id()));
    return res;
  }
});

  readonly data = linkedSignal(() => this.result.value());

  readonly breadcrumbs = signal<BreadcrumbModel[]>([
  {title: 'Kullanıcılar', url: '/users', icon:'emoji_people'},
  ])

  constructor()
  {
    this.activate.params.subscribe(res =>{
      if(res["id"]) {
        this.id.set(res["id"]);
        this.breadcrumbs.update(prev => [...prev,
          {title: "Kullanıcı Güncelle", url: `/users/edit/${this.id()}`, icon: 'edit'},]);
      }
      else{
        this.breadcrumbs.update(prev => [...prev,
          {title: 'Kullanıcı Ekle', url: '/users', icon:'person_add'}
         ])
      }
    })
  }

  
  readonly http = inject(UserService);
  readonly toast = inject(FlexiToastService);
   readonly router = inject(Router);

  ekle(form: NgForm) {
  if (!form.valid) return;

  const formData = form.value;

  if (this.id()) {
    // Güncelleme işlemi
    this.http.kullaniciGuncelle(this.id(), formData).subscribe({
      next: (res) => {
        this.toast.showToast("Başarılı", "Kullanıcı başarıyla güncellendi", 'success');
        this.router.navigateByUrl("users");
      },
      error: (err) => {
        console.error('Hata oluştu:', err);
        this.toast.showToast("Hata", "Kullanıcı güncellenemedi", 'error');
      }
    });
  } else {
    // Yeni ürün ekleme işlemi
    this.http.kullaniciEkle(formData).subscribe({
      next: (res) => {
        this.toast.showToast("Başarılı", "Kullanıcı başarıyla eklendi", 'success');
        this.router.navigateByUrl("users");
      },
      error: (err) => {
        console.error('Hata oluştu:', err);
        this.toast.showToast("Hata", "Kullanıcı eklenemedi", 'error');
      }
    });
  }
}
}
