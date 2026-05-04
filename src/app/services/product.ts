import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // ده السباك اللي بيوصل المية (البيانات)
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // بنقول له مكان الملف فين
  private url = 'https://api.escuelajs.co/api/v1/products?offset=0&limit=10';

  constructor(private http: HttpClient) { }

  // ميثود لجلب البيانات
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
}
