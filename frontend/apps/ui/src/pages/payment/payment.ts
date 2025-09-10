import { ChangeDetectionStrategy, Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Common } from '../../services/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { BasketModel } from '@shared/models/basket.model';
import { TrCurrencyPipe } from 'tr-currency';
import { PaymentModel ,initialPayment} from '@shared/models/payment.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import { FlexiSelectModule } from 'flexi-select';
registerLocaleData(localeTr);

@Component({
  imports: [RouterLink,TrCurrencyPipe,FormsModule,DatePipe,FlexiSelectModule,CommonModule],
  templateUrl: './payment.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Payment {
  readonly common = inject(Common);
  readonly result = httpResource<BasketModel[]>(() => {
  const endpoint = `api/basket/listele/${this.common.user()?._id}`;
  return endpoint
});

  readonly basketData = computed(() => this.result.value() ?? []);

  readonly cityResult = httpResource<any[]>(()=>"il-ilce.json");
  readonly cities = computed(() => this.cityResult.value() ?? []);
  readonly districts = signal<any[]>([]);
 
  
  
  readonly data = signal<PaymentModel>(initialPayment);
  readonly http = inject(HttpClient);
  readonly showSuccess = signal<boolean>(false);

  pay(form: NgForm) { 
  if (!form.valid) return;

  // Sadece basket ID’lerini alıyoruz
  const basketIds = this.basketData().map(b => b._id);

  // Payment verisini hazırla
  const payload = {
    ...this.data(),
    userId: this.common.user()?._id,
    basketIds
  };


  this.http.post<{ message: string, payment: any }>(
    'http://localhost:5000/payment/ekle',
    payload
  ).subscribe({
    next: (res) => {
      console.log('Ödeme başarılı:', res);
      this.showSuccess.set(true);
      
      const payment: PaymentModel = {
        ...res.payment,
        olusturulmaTarihi: res.payment.createdAt ? new Date(res.payment.createdAt) : undefined
      };
      this.data.set(payment);

    },
    error: (err) => {
      console.error('Ödeme hatası:', err);
    }
  });
}
setDistricts()
{
  const city = this.cities().find(c => c.il_adi === this.data().city);
  this.districts.set(city.ilceler);
}


}
