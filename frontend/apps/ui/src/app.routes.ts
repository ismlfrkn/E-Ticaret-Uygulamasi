import { Route } from '@angular/router';
import { basketGuard } from './guards/basket-guard';

export const appRoutes: Route[] = [
    {    
        path:"",
        loadComponent:()=>import("./pages/layouts/layouts"),
        children:[
             {
                path:"basket",
                loadComponent:()=>import("./pages/baskets/baskets"),
                canActivate:[basketGuard]
            },
            {
                path:"",
                loadComponent:()=>import("./pages/home/home")
            },
            {
                path:":categoryKey",
                loadComponent:()=>import("./pages/home/home")
            },
            {
                path:'auth',
                loadChildren:()=>import("./pages/auth/routes")
            },
        ]
    }
];
