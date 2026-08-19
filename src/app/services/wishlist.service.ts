import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: Product[] = [];

  private wishlistSubject = new BehaviorSubject<Product[]>([]);
  wishlist$: Observable<Product[]> = this.wishlistSubject.asObservable();

  private wishlistCountSubject = new BehaviorSubject<number>(0);
  wishlistCount$: Observable<number> = this.wishlistCountSubject.asObservable();

  constructor() {
    this.loadWishlist();
  }

  getWishlistItems(): Product[] {
    return [...this.wishlistItems];
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItems.some(item => item.id === productId);
  }

  toggleWishlist(product: Product) {
    if (!product.id) return;

    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
  }

  addToWishlist(product: Product) {
    if (!product.id || this.isInWishlist(product.id)) return;
    this.wishlistItems.push(product);
    this.saveWishlist();
  }

  removeFromWishlist(productId: string) {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
    this.saveWishlist();
  }

  clearWishlist() {
    this.wishlistItems = [];
    this.saveWishlist();
  }

  private saveWishlist() {
    localStorage.setItem('icon_wear_wishlist', JSON.stringify(this.wishlistItems));
    this.wishlistSubject.next([...this.wishlistItems]);
    this.wishlistCountSubject.next(this.wishlistItems.length);
  }

  private loadWishlist() {
    const saved = localStorage.getItem('icon_wear_wishlist');
    if (saved) {
      try {
        this.wishlistItems = JSON.parse(saved);
      } catch (e) {
        this.wishlistItems = [];
      }
    }
    this.saveWishlist();
  }
}