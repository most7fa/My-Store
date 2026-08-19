import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type Query
} from 'firebase/firestore';
import { Observable } from 'rxjs';

import { firestore } from '../../firebase';

export interface Product {
  id?: string;
  title?: string;
  name?: string;
  price: number;
  discountPercent?: number;
  category: string;
  image?: string;
  imageUrl?: string;
  images?: string[];
  description?: string;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  isFeatured?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  getProducts(): Observable<Product[]> {
    return this.watchProducts(collection(firestore, 'products'));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const productCollection = collection(firestore, 'products');
    const productsQuery = query(
      productCollection,
      where('category', '==', category.toUpperCase())
    );

    return this.watchProducts(productsQuery);
  }

  getProductById(productId: string): Observable<Product | null> {
    const docRef = doc(firestore, 'products', productId);
    return new Observable((subscriber) => {
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          subscriber.next({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          subscriber.next(null);
        }
        subscriber.complete();
      }).catch(err => subscriber.error(err));
    });
  }

  private watchProducts(productsQuery: Query<DocumentData>): Observable<Product[]> {
    return new Observable<Product[]>((subscriber) => {
      const unsubscribe = onSnapshot(
        productsQuery,
        (snapshot) => {
          subscriber.next(
            snapshot.docs.map((document) => ({
              id: document.id,
              ...document.data()
            }) as Product)
          );
        },
        (error) => subscriber.error(error)
      );

      return unsubscribe;
    });
  }
}