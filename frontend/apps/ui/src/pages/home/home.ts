import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal, ViewEncapsulation } from '@angular/core';
import { ProductModel } from '@shared/models/product.model';
import { TrCurrencyPipe } from 'tr-currency';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Common } from '../../services/common';


@Component({
  imports: [TrCurrencyPipe,RouterLink],
  templateUrl: './home.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Home {
  readonly urunSayisi = 6;
  readonly aktifSayfa = signal(1);
  readonly categoryKey = signal<string | undefined>(undefined);
  readonly common = inject(Common);
  readonly user = computed(() => this.common.user());


  readonly result = httpResource<{ items: ProductModel[], totalCount: number }>(() => {
  const kategori = this.categoryKey();
  const page = this.aktifSayfa();
  const pageSize = this.urunSayisi;

  let url = `api/urun/listele?`;

  if (kategori) {
    url += `categoryKey=${kategori}&`;
  }

  url += `page=${page}&pageSize=${pageSize}`;
  return url;
});



  readonly data = computed(() => this.result.value()?.items ?? []);
  readonly dataSignal = signal<ProductModel[]>([]);
  
  
  readonly activated = inject(ActivatedRoute);
  constructor()
  {
    this.activated.params.subscribe(res => {
      if(res['categoryKey'])
      {
        this.categoryKey.set(res['categoryKey']);
      }
    })
  }


  readonly toplamSayfa = computed(() => {
    const toplamUrun = this.result.value()?.totalCount ?? 0;
    return Math.ceil(toplamUrun / this.urunSayisi);
  });

  sonrakiSayfa() {
    if (this.aktifSayfa() < this.toplamSayfa()) {
      this.aktifSayfa.update(p => p + 1);
    }
  }

  oncekiSayfa() {
    if (this.aktifSayfa() > 1) {
      this.aktifSayfa.update(p => p - 1);
    }
  }
}
