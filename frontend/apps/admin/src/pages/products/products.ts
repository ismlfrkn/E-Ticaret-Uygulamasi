import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';
import { FlexiGridFilterDataModel, FlexiGridModule } from 'flexi-grid';
import { ProductService } from '../../services/product';
import { RouterLink } from '@angular/router';
import { Common } from '../../services/common';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [Blank, FlexiGridModule,RouterLink],
  templateUrl: './products.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Products {

  private productService = inject(ProductService);
  private commonService =inject(Common);
  readonly data = this.productService.tum_veri;
  readonly loading = this.productService.loading;
  readonly reload = ()=> this.productService.listele.reload();


   readonly categoryFilter = computed<FlexiGridFilterDataModel[]>(() => {
    const categories: { [key: string]: boolean } = {};
  
    this.data().forEach(item => {
      if (!categories[item.categoryName]) {
        categories[item.categoryName] = true;
      }
    });

    return Object.keys(categories).map(name => ({
      name,
      value: name // artık value string, categoryName ile birebir eşleşiyor
    }));
  });


  readonly toast = inject(FlexiToastService);

  sil(id: string) {
  this.toast.showSwal(
    "Ürünü Sil?",
    "Ürünü silmek istiyor musunuz?",
    "Sil",
    () => { // onay callback
      this.productService.urunSil(id).subscribe({
        next: () => {
          this.toast.showToast("Başarılı", "Ürün başarıyla silindi", "success");
          this.reload(); // listeyi yenile
        },
        error: (err) => {
          console.error(err);
          this.toast.showToast("Hata", "Ürün silinemedi", "error");
        }
      });
    }
  );
}




}
