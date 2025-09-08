import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { Common } from '../../services/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { BasketModel } from '@shared/models/basket.model';
import { TrCurrencyPipe } from 'tr-currency';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [TrCurrencyPipe],
  templateUrl: './baskets.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Baskets {
  readonly common = inject(Common);
  readonly toast = inject(FlexiToastService);
  readonly basketCount = computed(()=>this.common.basketCount());
  readonly result = httpResource<BasketModel[]>(() => {
  const endpoint = `api/basket/listele/${this.common.user()?._id}`;
  return endpoint
});

  readonly data = computed(() => this.result.value() ?? []);
  readonly total = computed(()=>{
    let val = 0;
    this.data().forEach(res=>{
      val += (res.price * res.quantity);
    })
    return val;
  })
  

  readonly kdv = computed(()=>
  {
    return (this.total()*0.14);
  })

  readonly http = inject(HttpClient);
  adetArttir(val:BasketModel)
  {
    val.quantity ++;
    this.http.put(`api/basket/guncelle/${val._id}`,val).subscribe(()=>
    {
      this.result.reload();
    });
  }

  adetAzalt(val: BasketModel) {
  if (!val._id) return; // _id yoksa işlem yapma

  const count = val.quantity - 1;

  if (count <= 0) {
    this.toast.showSwal("Sil?","Ürünü sepetten silmek istediğinize emin misiniz?","Sil",()=>{
      this.http.delete(`api/basket/sil/${val._id}`).subscribe(()=>{
        this.result.reload();
      });
    })
  } else {
    // quantity 1’den büyükse azalt ve güncelle
    val.quantity--;
    this.http.put(`api/basket/guncelle/${val._id}`, val).subscribe({
      next: () => this.result.reload(),
      error: (err) => console.error("Ürün güncellenemedi:", err)
    });
  }
}
}
