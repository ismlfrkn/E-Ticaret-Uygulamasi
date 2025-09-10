import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { Common } from '../../services/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { BasketModel } from '@shared/models/basket.model';
import { TrCurrencyPipe } from 'tr-currency';
import { FlexiToastService } from 'flexi-toast';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';




@Component({
  imports: [TrCurrencyPipe, RouterLink,FormsModule],
  templateUrl: './baskets.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Baskets {
  readonly common = inject(Common);
  readonly toast = inject(FlexiToastService);
  readonly result = httpResource<BasketModel[]>(() => {
  const endpoint = `api/basket/listele/${this.common.user()?._id}`;
  return endpoint
});



  readonly data = computed(() => this.result.value() ?? []);

  readonly http = inject(HttpClient);
  // Ürün adedini artır
  adetArttir(item: BasketModel) {
    const newQuantity = item.quantity + 1;
    this.http.put(`api/basket/guncelle/${item._id}`, { ...item, quantity: newQuantity })
      .subscribe(() => {
        // common servisindeki basketData sinyalini güncelle
        const updated = this.common.basketData().map(b => 
          b._id === item._id ? { ...b, quantity: newQuantity } : b
        );
        this.common.basketData.set(updated);

        // toplam adet sinyalini güncelle
        this.common.basketCount.update(p => p + 1);
      });
  }

  // Ürün adedini azalt
  adetAzalt(item: BasketModel) {
    if (item.quantity <= 1) {
      this.toast.showSwal("Sil ?", "Ürünü sepetten silmek istediğinize emin misiniz?", "Sil", () => {
        this.http.delete(`api/basket/sil/${item._id}`).subscribe(() => {
          const updated = this.common.basketData().filter(b => b._id !== item._id);
          this.common.basketData.set(updated);

          this.common.basketCount.update(p => p - item.quantity);
        });
      });
    } else {
      const newQuantity = item.quantity - 1;
      this.http.put(`api/basket/guncelle/${item._id}`, { ...item, quantity: newQuantity })
        .subscribe(() => {
          const updated = this.common.basketData().map(b => 
            b._id === item._id ? { ...b, quantity: newQuantity } : b
          );
          this.common.basketData.set(updated);

          this.common.basketCount.update(p => p - 1);
        });
    }
  }




}
