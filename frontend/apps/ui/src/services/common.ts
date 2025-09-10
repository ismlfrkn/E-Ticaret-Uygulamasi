import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { BasketModel } from '@shared/models/basket.model';
import { UserModel } from '@shared/services/user';
import { FlexiToastService } from 'flexi-toast';

@Injectable({
  providedIn: 'root'
})
export class Common {
  readonly user = signal<UserModel | undefined>(undefined);
  readonly basketCount = signal<number>(0);
  readonly http = inject(HttpClient);
  readonly toast = inject(FlexiToastService);

  // Promo kodu
  KOD = signal<string>("");
  indirimOrani = signal(0);
  indirimTutari = signal(0);      // Hesaplanan TL


  // Sepet verisi sinyali
  readonly basketData = signal<BasketModel[]>([]);

  constructor() {
    const response: string | null = localStorage.getItem("kullanici");
    if (response) {
      this.user.set(JSON.parse(response));
    }
    this.loadBasket();
  }

  // Sepeti yükle
  loadBasket() {
    if (this.user()) {
      const endpoint = `api/basket/listele/${this.user()!._id}`;
      this.http.get<BasketModel[]>(endpoint).subscribe(res => {
        this.basketData.set(res);

        // Toplam adet
        const totalQuantity = res.reduce((sum, item) => sum + item.quantity, 0);
        this.basketCount.set(totalQuantity);
      });
    }
  }

  // Toplam fiyat (KDV ve indirim uygulanmadan)
  readonly total = computed(() => {
    return this.basketData().reduce((sum, item) => sum + item.price * item.quantity, 0);
  });

  // KDV
  readonly kdv = computed(() => this.total() * 0.14);

  // Toplam + KDV + indirim
  readonly totalWithDiscount = computed(() => {
    return this.total() + this.kdv() - this.indirimTutari();
  });

  // Promo kodunu uygula
  applyPromoCode() {
    if (this.KOD().toUpperCase() === 'MORIVA10') {
      this.indirimOrani.set(10); // %10 indirim
      this.toast.showToast('Başarılı', 'MORIVA10 kodu uygulandı, %10 indirim!');
      const discountValue = this.total() * 0.10; // TL cinsinden indirim
      this.indirimTutari.set(discountValue);     // indirim tutarını burada güncelle
    } else {
      this.indirimOrani.set(0);
      this.indirimTutari.set(0);
      this.toast.showToast('Hata', 'Geçersiz promosyon kodu!',"error");
    }
  }
}
