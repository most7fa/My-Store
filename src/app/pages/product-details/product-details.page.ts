import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';

import { IonicModule, ToastController, NavController } from '@ionic/angular'; // 🌟 ضفنا NavController عشان دالة الرجوع
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { CartService } from '../../services/cart.service'; 
import { addIcons } from 'ionicons'; // 🌟 استيراد دالة تسجيل الأيقونات
import { cartOutline, arrowBackOutline, checkmarkOutline } from 'ionicons/icons'; // 🌟 استيراد الأيقونات اللي هتحتاجها في الـ HTML

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.page.html',
    styleUrls: ['./product-details.page.scss'],
    imports: [IonicModule]
})
export class ProductDetailsPage implements OnInit {

  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);
  private cartService = inject(CartService); 
  private toastCtrl = inject(ToastController);
  private navCtrl = inject(NavController); // 🌟 حقن الـ NavController للرجوع للخلف
  private cdr = inject(ChangeDetectorRef);

  product: any = null;
  
  // 🌟 مصفوفات افتراضية للمقاسات والألوان عشان الأبلكيشن يبقى واقعي
  availableSizes: string[] = ['S', 'M', 'L', 'XL', 'XXL'];
  availableColors: string[] = ['#0f172a', '#dc2626', '#2563eb', '#16a34a', '#d97706']; // أكواد ألوان شيك (أسود، أحمر، أزرق، أخضر، برتقالي)

  // 🌟 المتغيرات اللي هتخزن اختيار الزبون (بشكل افتراضي واقفين على أول اختيار)
  selectedSize: string = 'M';
  selectedColor: string = '#0f172a';

  constructor() {
    // 🌟 تسجيل الأيقونات هنا عشان تظهر جوه الـ HTML وم تضربش
    addIcons({ cartOutline, arrowBackOutline, checkmarkOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProductDetails(id);
    }
  }

  async loadProductDetails(id: string) {
    try {
      const docRef = doc(this.firestore, `products/${id}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.product = { id: docSnap.id, ...docSnap.data() };
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error loading product details:', error);
    }
  }

  // 🌟 دالة اختيار المقاس
  selectSize(size: string) {
    this.selectedSize = size;
  }

  // 🌟 دالة اختيار اللون
  selectColor(color: string) {
    this.selectedColor = color;
  }

  // 🌟 دالة الرجوع للصفحة السابقة
  goBack() {
    this.navCtrl.back();
  }

  // 🌟 الدالة الاحترافية اللي بتشتغل لما يدوس "إضافة إلى السلة"
  async addToCart() {
    if (!this.product) return;

    // بنبعت المنتج مع المقاس واللون المختارين للسيرفس
    this.cartService.addToCart(this.product, this.selectedSize, this.selectedColor);

    // بنظهر رسالة توست سريعة وشيك للزبون تأكد الإضافة
    const toast = await this.toastCtrl.create({
      message: '🛒 تم إضافة المنتج إلى السلة بنجاح!',
      duration: 1500,
      position: 'bottom',
      color: 'dark',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}