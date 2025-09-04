import { FormsModule, NgForm } from '@angular/forms';
import Blank from '../../../components/blank';
import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, resource, signal, ViewEncapsulation } from '@angular/core'; 
import { ProductService } from '@shared/services/product';
import { FlexiToastService } from 'flexi-toast';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '@shared/services/category';
import { BreadcrumbModel } from '@shared/models/breadcrumb.model';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';





@Component({
  imports: [Blank, FormsModule,CommonModule],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductCreate {
  id = signal<string>("");
  readonly activate = inject(ActivatedRoute);
  readonly title = computed(()=>this.id() ? 'Ürün Güncelle':'Ürün Ekle');
  readonly btnName = computed(()=>this.id() ? 'Güncelle':'Kaydet');


 readonly result = resource({
  params: () => this.id(),
  loader: async () => {
    if (!this.id()) {
      return; // id yoksa undefined döner
    }
    const res = await lastValueFrom(this.http.urunById(this.id()));
    return res;
  }
});


  readonly data = linkedSignal(() => this.result.value());

  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {title: 'Ürünler', url: '/products', icon:'deployed_code'},
    ])
  constructor() {
  this.activate.params.subscribe(res => {
    if (res["id"]) {
      this.id.set(res["id"]);
      this.breadcrumbs.update(prev => [
        ...prev,
        { title: 'Ürün Güncelle', url: `/products/edit/${this.id()}`, icon: 'edit' }
      ]);
    } else {
      this.breadcrumbs.update(prev => [
        ...prev,
        { title: 'Ürün Ekle', url: '/products/create', icon: 'add' }
      ]);
    }
  });
}

  readonly http = inject(ProductService);
  readonly toast = inject(FlexiToastService);
  readonly router = inject(Router);


  readonly http2 = inject(CategoryService);
  readonly categories = this.http2.tum_veri;


  ekle(form: NgForm) {
  if (!form.valid) return;

  const formData = form.value;

  if (this.id()) {
    // Güncelleme işlemi
    this.http.urunGuncelle(this.id(), formData).subscribe({
      next: (res) => {
        this.toast.showToast("Başarılı", "Ürün başarıyla güncellendi", 'success');
        this.router.navigateByUrl("products");
      },
      error: (err) => {
        console.error('Hata oluştu:', err);
        this.toast.showToast("Hata", "Ürün güncellenemedi", 'error');
      }
    });
  } else {
    // Yeni ürün ekleme işlemi
    this.http.urunEkle(formData).subscribe({
      next: (res) => {
        this.toast.showToast("Başarılı", "Ürün başarıyla eklendi", 'success');
        this.router.navigateByUrl("products");
      },
      error: (err) => {
        console.error('Hata oluştu:', err);
        this.toast.showToast("Hata", "Ürün eklenemedi", 'error');
      }
    });
  }
}




}