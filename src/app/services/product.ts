import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// تظبيط شكل الـ Interface عشان يطابق البيانات اللي بنرفعها من الداشبورد
export interface Product {
  id?: string;
  title?: string;
  name?: string;
  price: number;
  category: string;
  image?: string;
  imageUrl?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // حقن خدمة الفايرستور مباشرة
  private firestore = inject(Firestore);

  constructor() { }

  /**
   * 🌟 جلب كل المنتجات لايف من الفايربيز
   * collectionData بترجع Observable بيمد التطبيق بالبيانات أول ما تتغير في الداشبورد فوراً
   */
  getProducts(): Observable<Product[]> {
    const productCollection = collection(this.firestore, 'products');
    return collectionData(productCollection, { idField: 'id' }) as Observable<Product[]>;
  }

  /**
   * 🌟 جلب المنتجات حسب القسم (MEN - WOMEN - KIDS)
   * عشان لما نضغط على الفلاتر فوق، يفلتر تلقائياً من الفايربيز
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    const productCollection = collection(this.firestore, 'products');
    const q = query(productCollection, where('category', '==', category.toUpperCase()));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }
}