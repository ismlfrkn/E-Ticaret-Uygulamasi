import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, resource, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Blank from '../../../components/blank';
import { FlexiToastService } from 'flexi-toast';
import { CategoryService } from '@shared/services/category';
import { BreadcrumbModel } from '@shared/models/breadcrumb.model';
import { lastValueFrom } from 'rxjs';

@Component({
  imports: [Blank,FormsModule],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Create {
  id = signal<string>("");
  readonly activate = inject(ActivatedRoute);
  readonly title = computed(()=>this.id() ? 'Kategori Güncelle':'Kategori Ekle');
  readonly btnName = computed(()=>this.id() ? 'Güncelle':'Kaydet');
   
  
readonly result = resource({
  params: () => this.id(),
  loader: async () => {
    if (!this.id()) {
      return 
    }
    const res = await lastValueFrom(this.http.kategoriById(this.id()));
    return res;
  }
});

  readonly data = linkedSignal(() => this.result.value());

  



    readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {title: 'Kategoriler', url: '/categories', icon:'category'},
    ])
  constructor() {
  this.activate.params.subscribe(res => {
    if (res["id"]) {
      this.id.set(res["id"]);
      this.breadcrumbs.update(prev => [
        ...prev,
        { title: 'Kategori Güncelle', url: `/categories/edit/${this.id()}`, icon: 'edit' }
      ]);
    } else {
      this.breadcrumbs.update(prev => [
        ...prev,
        { title: 'Kategori Ekle', url: '/categories/create', icon: 'add' }
      ]);
    }
  });
}


  readonly http = inject(CategoryService);
  readonly toast = inject(FlexiToastService);
  readonly router = inject(Router);;

ekle(form: NgForm) {
  if (!form.valid) return;

  const formData = form.value;

  if (this.id()) {
    // Güncelleme işlemi
    this.http.kategoriGuncelle(this.id(), formData).subscribe({
      next: (res) => {
        this.toast.showToast("Başarılı", "Kategori başarıyla güncellendi", 'success');
        this.router.navigateByUrl("categories");
      },
      error: (err) => {
        console.error('Hata oluştu:', err);
        this.toast.showToast("Hata", "Kategori güncellenemedi", 'error');
      }
    });
  } else {
    // Yeni ürün ekleme işlemi
    this.http.kategoriEkle(formData).subscribe({
      next: (res) => {
        this.toast.showToast("Başarılı", "Kategori başarıyla eklendi", 'success');
        this.router.navigateByUrl("categories");
      },
      error: (err) => {
        console.error('Hata oluştu:', err);
        this.toast.showToast("Hata", "Kategori eklenemedi", 'error');
      }
    });
  }
}


}
