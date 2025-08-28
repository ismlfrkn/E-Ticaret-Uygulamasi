import { ChangeDetectionStrategy, Component, computed, Signal, signal, ViewEncapsulation } from '@angular/core';
import Breadcrumb from './breadcrumb';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { navigations } from '../../navigation';
import { NavPipe } from '../../pipes/nav-pipe';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

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

  constructor()
  {
    setInterval(()=>
    {
      this.time.set(new Date());
    },1000);
  }

}
