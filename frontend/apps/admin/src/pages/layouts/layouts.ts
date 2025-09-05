import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal, ViewEncapsulation } from '@angular/core';
import Breadcrumb from './breadcrumb';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { navigations } from '../../navigation';
import { NavPipe } from '../../pipes/nav-pipe';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Common } from '@shared/services/common';

@Component({
  imports: [
    Breadcrumb,
    RouterLink,
    RouterLinkActive,
    NavPipe,
    FormsModule,
    DatePipe,
    RouterOutlet],
  templateUrl: './layouts.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Layouts {
  readonly search = signal<string>(""); //Menü aramak için oluşturulmuş signal değişken(filtreleme yapılır)
  readonly navigations = computed(()=>navigations) //NavigationModellerimizin tutulduğu computed.
  readonly time = signal<Date | string>(""); //Footer'da güncel saat'in tutulduğu signal değişken
  readonly common = inject(Common);
  readonly user = computed(()=>this.common.user()!);
  readonly router = inject(Router);

  constructor()
  {
    setInterval(()=>
    {
      this.time.set(new Date());
    },1000);
  }

  cikisYap()
  {
    localStorage.removeItem("admin");
    this.router.navigateByUrl("/login");
    this.common.user.set(undefined);
  }

}
