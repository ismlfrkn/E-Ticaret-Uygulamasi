import { AfterViewInit, ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation } from '@angular/core';
import { BreadcrumbModel } from '@shared/models/breadcrumb.model';
import { Common } from '@shared/services/common';

@Component({
  selector:'app-blank',
  imports: [],
  template:`
  <title>{{pageTitle()}}</title>
  
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Blank implements AfterViewInit {
  readonly breadcrumbs = input.required<BreadcrumbModel[]>();
  readonly pageTitle = input.required<string>(); //Bu sayfalarda dışarıdan alınacak ve required ile değer almak zorunda kalacak.
  readonly #common = inject(Common);

  ngAfterViewInit(): void {
      this.#common.set(this.breadcrumbs());
  }
  

}
