import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import Blank from '../../components/blank';
import { FlexiGridFilterDataModel, FlexiGridModule } from 'flexi-grid';

export interface ProductModel{
  id:string;
  name:string;
  imageUrl:string;
  price:number;
  stock:number;
  categoryId:string;
  categoryName:string;
}



@Component({
  imports: [Blank,
    FlexiGridModule
  ],
  templateUrl: './products.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Products {
  readonly data = signal<ProductModel[]>([
    {
      id:'',
      name:'Iphone 16',
      price:100000,
      stock:15,
      imageUrl:'https://ffo3gv1cf3ir.merlincdn.net//SiteAssets/pasaj/crop/cg/1698313241770/1698313246580/1698313246580_600x450.png?1749680495000',
      categoryId:'',
      categoryName:'Telefon'
    }
  ]);

  readonly categoryFilter = signal<FlexiGridFilterDataModel[]>([
    {
      name:'Telefon',
      value:'Telefon'
    }
  ]);
}
