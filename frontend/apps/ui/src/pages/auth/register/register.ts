import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '@shared/services/user';
import { FlexiToastService } from 'flexi-toast';
import { CommonModule } from '@angular/common';
@Component({
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Register {

  readonly http = inject(UserService);
  readonly toast = inject(FlexiToastService);
  readonly router = inject(Router);


  signUp(form: NgForm) {
  if (!form.valid) return;

  const formData = form.value;

  this.http.kullaniciEkle(formData).subscribe({
    next: (res) => {
      this.toast.showToast("Kayıt Başarılı", "Hesabınız oluşturuldu. Giriş yapabilirsiniz.", 'success');
      this.router.navigateByUrl("auth/login");
    },
    error: (err) => {
      console.error('Hata oluştu:', err);
      this.toast.showToast("Kayıt Başarısız", "Hesap oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.", 'error');
    }
  });
}


}
