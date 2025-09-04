import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';
import { FlexiGridModule } from 'flexi-grid';
import { RouterLink } from '@angular/router';
import { FlexiToastService } from 'flexi-toast';
import { CategoryService } from '@shared/services/category';

@Component({
  imports: [Blank,FlexiGridModule,RouterLink],
  templateUrl: './categories.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Categories {
  private categoryService = inject(CategoryService);
  readonly data = this.categoryService.tum_veri;
  readonly loading = this.categoryService.loading;
  readonly reload = ()=> this.categoryService.listele.reload();
  readonly toast = inject(FlexiToastService);



    sil(id: string) {
    this.toast.showSwal(
      "Ürünü Sil?",
      "Ürünü silmek istiyor musunuz?",
      "Sil",
      () => { // onay callback
        this.categoryService.kategoriSil(id).subscribe({
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
