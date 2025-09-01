import { FormsModule, NgForm } from '@angular/forms';
import Blank from '../../../components/blank';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core'; 
import { ProductService } from '../../../services/product';
import { FlexiToastService } from 'flexi-toast';
import { Router } from '@angular/router';





@Component({
  imports: [Blank, FormsModule],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductCreate {

  readonly http = inject(ProductService);
  readonly toast = inject(FlexiToastService);
  readonly router = inject(Router);
  priceValue= "";

  ekle(form: NgForm) {
  if (!form.valid) return;

  const formData = form.value;
  this.http.urunEkle(formData).subscribe({
    next: (res) => {
      this.toast.showToast("Başarılı","Ürün başarıyla eklendi",'success');
      this.router.navigateByUrl("products")                 // Önceki sayfaya dön
    },
    error: (err) => console.error('Hata oluştu:', err)
  });
  }
}