import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Blank from '../../../components/blank';
import { FlexiToastService } from 'flexi-toast';
import { CategoryService } from '../../../services/category';

@Component({
  imports: [Blank,FormsModule],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Create {
  id = signal<string>("");
  readonly activate = inject(ActivatedRoute);
  readonly cardTitle = computed(()=>this.id() ? 'Kategori Güncelle':'Kategori Ekle');
  readonly btnName = computed(()=>this.id() ? 'Güncelle':'Kaydet');
  constructor()
  {
    this.activate.params.subscribe(res =>{
      if(res["id"])
        this.id.set(res["id"]);
    })
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
