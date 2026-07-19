import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// تعريف شكل المنتج جوه السلة بالكمية والمقاس واللون المختارين
export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  
  //BehaviorSubject عشان نبعت تحديثات لايف لعدد المنتجات فوق في الـ Header في أي صفحة
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor() {
    this.loadCart(); // أول ما الأبلكيشن يفتح، يسحب السلة المحفوظة في الموبايل
  }

  // جلب كل عناصر السلة حالياً
  getCartItems() {
    return this.cartItems;
  }

  // إضافة منتج للسلة (مع ذكاء تجميع الكمية لو ضاف نفس المنتج بنفس المقاس واللون)
  addToCart(product: any, size: string = 'M', color: string = 'Default') {
    const itemId = `${product.id}_${size}_${color}`; // معرف فريد يدمج المنتج بمواصفاته
    
    const existingItem = this.cartItems.find(item => item.id === itemId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({
        id: itemId,
        title: product.title || product.name,
        price: product.price,
        image: product.imageUrl || product.image,
        category: product.category,
        quantity: 1,
        selectedSize: size,
        selectedColor: color
      });
    }

    this.saveCart();
  }

  // زيادة الكمية بمقدار 1
  increaseQuantity(itemId: string) {
    const item = this.cartItems.find(item => item.id === itemId);
    if (item) {
      item.quantity += 1;
      this.saveCart();
    }
  }

  // تقليل الكمية بمقدار 1 (ولو وصلت لـ 0 يتمسح تلقائياً)
  decreaseQuantity(itemId: string) {
    const item = this.cartItems.find(item => item.id === itemId);
    if (item) {
      item.quantity -= 1;
      if (item.quantity === 0) {
        this.removeFromCart(itemId);
      } else {
        this.saveCart();
      }
    }
  }

  // حذف منتج تماماً من السلة
  removeFromCart(itemId: string) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.saveCart();
  }

  // حساب إجمالي الحساب المالي للسلة بالكامل
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // تفريغ السلة بالكامل بعد تأكيد الأوردر
  clearCart() {
    this.cartItems = [];
    this.saveCart();
  }

  // دالة الحفظ في ذاكرة التخزين المحلية للموبايل
  private saveCart() {
    localStorage.setItem('icon_wear_cart', JSON.stringify(this.cartItems));
    // تحديث العداد لايف في الـ Header
    const count = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    this.cartCount.next(count);
  }

  // دالة القراءة من ذاكرة الموبايل
  private loadCart() {
    const savedCart = localStorage.getItem('icon_wear_cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      const count = this.cartItems.reduce((total, item) => total + item.quantity, 0);
      this.cartCount.next(count);
    }
  }
}