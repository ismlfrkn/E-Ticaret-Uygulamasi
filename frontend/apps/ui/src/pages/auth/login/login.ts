import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserModel } from '@shared/services/user';
import { Common } from '../../../services/common';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [FormsModule,RouterLink],
  templateUrl: './login.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Login {
  readonly http = inject(HttpClient);
  readonly toast = inject(FlexiToastService)
  readonly router = inject(Router);
  readonly common = inject(Common);

  signIn(form: NgForm) {
  if (!form.valid) return;

  const endpoint = `http://localhost:5000/kullanici/listele?userName=${form.value['userName']}&password=${form.value['password']}`;

  this.http.get<UserModel>(endpoint).subscribe({
    next: (res) => {
      this.toast.showToast("Başarılı", `${res.userName} başarıyla giriş yaptı`, "success");

      // Kullanıcı bilgisini localStorage'a kaydet
      localStorage.setItem("kullanici", JSON.stringify(res));
      this.common.user.set(res);
      this.common.loadBasket();
      // Ana sayfaya yönlendirir.
      this.router.navigateByUrl('/');
    },
    error: (err) => {
      if (err.status === 401) {
        this.toast.showToast("Hata", "Kullanıcı adı ya da şifre hatalı", "error");
      } else {
        this.toast.showToast("Hata", "Sunucu hatası", "error");
      }
    }
  });
}
}
