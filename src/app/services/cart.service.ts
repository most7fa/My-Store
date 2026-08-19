import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$: Observable<number> = this.cartCountSubject.asObservable();

  private totalPriceSubject = new BehaviorSubject<number>(0);
  totalPrice$: Observable<number> = this.totalPriceSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  addToCart(product: any, size: string = 'M', color: string = 'Default', quantity: number = 1) {
    const productId = product.id || product.productId || 'p_unknown';
    const itemId = `${productId}_${size}_${color}`;

    const existingIndex = this.cartItems.findIndex(item => item.id === itemId);

    if (existingIndex > -1) {
      this.cartItems[existingIndex].quantity += quantity;
    } else {
      const price = product.price || 0;
      const discount = product.discountPercent || 0;
      const finalPrice = discount > 0 ? price - (price * (discount / 100)) : price;

      this.cartItems.push({
        id: itemId,
        productId: productId,
        title: product.title || product.name || 'Product',
        price: finalPrice,
        originalPrice: discount > 0 ? price : undefined,
        image: product.imageUrl || product.image || (product.images && product.images[0]) || 'assets/logo.png',
        category: product.category || 'PRODUCT',
        quantity: quantity,
        selectedSize: size,
        selectedColor: color
      });
    }

    this.saveCart();
  }

  increaseQuantity(itemId: string) {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item) {
      item.quantity += 1;
      this.saveCart();
    }
  }

  decreaseQuantity(itemId: string) {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        this.saveCart();
      }
    }
  }

  removeFromCart(itemId: string) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.saveCart();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
  }

  private saveCart() {
    localStorage.setItem('icon_wear_cart', JSON.stringify(this.cartItems));
    
    const count = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    const total = this.getTotalPrice();

    this.cartItemsSubject.next([...this.cartItems]);
    this.cartCountSubject.next(count);
    this.totalPriceSubject.next(total);
  }

  private loadCart() {
    const savedCart = localStorage.getItem('icon_wear_cart');
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
      } catch (e) {
        this.cartItems = [];
      }
    }
    this.saveCart();
  }
}