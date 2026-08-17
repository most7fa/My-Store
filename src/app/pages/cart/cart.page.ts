import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';

import { IonicModule, ToastController, AlertController, NavController } from '@ionic/angular'; // 🌟 ضفنا NavController للرجوع لو احتاجته
import { CartService, CartItem } from '../../services/cart.service';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { addIcons } from 'ionicons'; // 🌟 استيراد دالة تسجيل الأيقونات
import { trashOutline, addOutline, removeOutline, bagOutline, arrowBackOutline } from 'ionicons/icons'; // 🌟 استيراد الأيقونات المستخدمة في الـ HTML

@Component({
    selector: 'app-cart',
    templateUrl: './cart.page.html',
    styleUrls: ['./cart.page.scss'],
    imports: [IonicModule]
})
export class CartPage implements OnInit {

  private cartService = inject(CartService);
  private firestore = inject(Firestore);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private navCtrl = inject(NavController);
  private cdr = inject(ChangeDetectorRef);

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  isSubmitting: boolean = false;

  constructor() {
    // 🌟 تسجيل الأيقونات هنا عشان الـ HTML يتعرف عليها فوراً وما تضربش الشاشة بيضاء
    addIcons({ trashOutline, addOutline, removeOutline, bagOutline, arrowBackOutline });
  }

  ngOnInit() {
    this.updateCartData();
  }

  // تحديث البيانات وقراءة السلة من السيرفس لايف
  updateCartData() {
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
    this.cdr.detectChanges();
  }

  // زيادة الكمية قطعة
  plusItem(itemId: string) {
    this.cartService.increaseQuantity(itemId);
    this.updateCartData();
  }

  // تقليل الكمية قطعة
  minusItem(itemId: string) {
    this.cartService.decreaseQuantity(itemId);
    this.updateCartData();
  }

  // حذف المنتج نهائياً من السلة
  removeItem(itemId: string) {
    this.cartService.removeFromCart(itemId);
    this.updateCartData();
  }

  // دالة للرجوع للخلف عند الضغط على "تسوق الآن" أو الأزرار المخصصة
  goBack() {
    this.navCtrl.back();
  }

  /**
   * 🚀 دالة تأكيد الأوردر وإرساله لايف للفايرستور (Checkout)
   * بتطلب من الزبون الاسم ورقم التليفون والعنوان في Pop-up سريع ومودرن
   */
  async checkout() {
    if (this.cartItems.length === 0) return;

    const alert = await this.alertCtrl.create({
      header: 'تأكيد طلب الشراء 📦',
      subHeader: 'برجاء إدخال بيانات الشحن لتوصيل الطلب',
      inputs: [
        { name: 'customerName', type: 'text', placeholder: 'الاسم بالكامل' },
        { name: 'customerPhone', type: 'tel', placeholder: 'رقم التليفون' },
        { name: 'customerAddress', type: 'text', placeholder: 'عنوان التوصيل بالتفصيل' }
      ],
      buttons: [
        { text: 'إلغاء', role: 'cancel' },
        {
          text: 'تأكيد الطلب',
          handler: (data) => {
            if (!data.customerName || !data.customerPhone || !data.customerAddress) {
              this.showToast('⚠️ برجاء ملء جميع البيانات لإتمام الطلب!', 'danger');
              return false; // يمنع إغلاق الـ Alert
            }
            this.sendOrderToFirebase(data);
            return true;
          }
        }
      ],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }

  // إرسال الطلب لجدول الـ orders في الفايربيز للداشبورد
  async sendOrderToFirebase(customerData: any) {
    this.isSubmitting = true;
    this.cdr.detectChanges();

    const orderData = {
      customerName: customerData.customerName,
      customerPhone: customerData.customerPhone,
      customerAddress: customerData.customerAddress,
      items: this.cartItems.map(item => ({
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor
      })),
      totalPrice: this.totalPrice,
      status: 'PENDING', // حالة الطلب قيد الانتظار عشان الداشبورد تتحكم فيه
      createdAt: new Date().toISOString()
    };

    try {
      const ordersRef = collection(this.firestore, 'orders');
      await addDoc(ordersRef, orderData);

      // تنظيف السلة بعد نجاح العملية
      this.cartService.clearCart();
      this.updateCartData();

      this.showToast('🎉 تم إرسال طلبك بنجاح! سنتواصل معك قريباً.', 'success');
    } catch (error) {
      console.error('Error sending order:', error);
      this.showToast('❌ عذراً، حدث خطأ أثناء إرسال الطلب.', 'danger');
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}