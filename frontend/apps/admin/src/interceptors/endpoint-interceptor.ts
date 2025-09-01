import { HttpInterceptorFn } from '@angular/common/http';

export const endpointInterceptor: HttpInterceptorFn = (req, next) => {
  const clone = req.clone({
    url:req.url.replace("api/","http://localhost:5000/")

  });
  return next(clone);
};
