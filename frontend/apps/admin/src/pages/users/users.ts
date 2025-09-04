import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';
import { FlexiGridModule } from 'flexi-grid';
import { UserModel, UserService } from '@shared/services/user';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [Blank,
    FlexiGridModule,
    FormsModule,
    RouterLink
    
  ],
  templateUrl: './users.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Users {
  readonly userService = inject(UserService);
  readonly data = this.userService.tum_veri;
  readonly loading = this.userService.loading;
  readonly reload = ()=> this.userService.listele.reload();



   readonly toast = inject(FlexiToastService);
  sil(id: string) {
  this.toast.showSwal(
    "Ürünü Sil?",
    "Ürünü silmek istiyor musunuz?",
    "Sil",
    () => { // onay callback
      this.userService.kullaniciSil(id).subscribe({
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

// Admin yetkisini güncelleme
  guncelleAdmin(item: UserModel, event: Event) {
  const isAdmin = (event.target as HTMLInputElement).checked;
  item.isAdmin = isAdmin;
  this.userService.adminGuncelle(item._id, isAdmin).subscribe({
    next: () => this.toast.showToast("Başarılı", `${item.userName} yetkisi güncellendi`, 'success'),
    error: () => this.toast.showToast("Hata", "Yetki güncellenemedi", 'error')
  });
}


}
