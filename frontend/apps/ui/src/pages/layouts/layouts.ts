import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CategoryModel } from '@shared/models/category.model';
import { Common } from '../../services/common';

@Component({
  imports: [RouterOutlet,RouterLink],
  templateUrl: './layouts.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Layouts {

  readonly user = computed(() => this.common.user());

  readonly result = httpResource<CategoryModel[]>(()=>`api/kategori/listele`);
  readonly data = computed(() => this.result.value() ?? []);
  readonly router = inject(Router);
  readonly common = inject(Common);
  readonly basketCount = computed(()=>this.common.basketCount());

  logout()
  {
    localStorage.removeItem("kullanici");
    this.router.navigateByUrl("/auth/login");
    this.common.user.set(undefined);
    this.common.basketCount.set(0);
  }

}
