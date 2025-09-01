import { FormsModule, NgForm } from '@angular/forms';
import Blank from '../../../components/blank';
import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewEncapsulation } from '@angular/core'; 
import { ProductService } from '../../../services/product';
import { FlexiToastService } from 'flexi-toast';
import { ActivatedRoute, Router } from '@angular/router';





@Component({
  imports: [Blank, FormsModule],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductCreate {
  id = signal<string>("");
  readonly activate = inject(ActivatedRoute);
  readonly cardTitle = computed(()=>this.id() ? 'Ürün Güncelle':'Ürün Ekle');
  readonly btnName = computed(()=>this.id() ? 'Güncelle':'Kaydet');
  constructor()
  {
    this.activate.params.subscribe(res =>{
      if(res["id"])
        this.id.set(res["id"]);
    })
  }


  readonly http = inject(ProductService);
  readonly toast = inject(FlexiToastService);
  readonly router = inject(Router);;

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