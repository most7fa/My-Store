import { Component, OnInit, inject } from '@angular/core';

import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product'; // السيرفيس الاحترافية للمنتجات
import { CartService } from '../services/cart.service'; // استيراد سيرفس السلة الجديدة
import { addIcons } from 'ionicons'; // 🌟 استيراد دالة تسجيل الأيقونات
import { bagHandleOutline, bagOutline, cartOutline } from 'ionicons/icons'; // 🌟 الاستيراد الصريح للأيقونات المستخدمة

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    imports: [
    IonicModule,
    FormsModule
]
})
export class HomePage implements OnInit {

  private navCtrl = inject(NavController);
  private productService = inject(ProductService);
  private cartService = inject(CartService); // حقن سيرفس السلة

  allProducts: any[] = [];      // 📦 الخزان الرئيسي الثابت لكل منتجات الفايربيز
  filteredProducts: any[] = []; // 🔍 القائمة المرنة اللي بتتعرض في الـ HTML بعد البحث والفلترة

  selectedCategory: string = 'ALL'; // القسم النشط حالياً
  searchTerm: string = '';          // كلمة البحث الحالية
  isLoading: boolean = true;        // ⏳ مؤشر التحميل عشان كروت الـ Skeleton الشيك تشتغل
  cartCount: number = 0;            // 🛒 عداد السلة اللي هيظهر فوق الأيقونة

  constructor() {
    // 🌟 تسجيل الأيقونات صراحةً هنا لضمان ظهورها في نظام الـ Standalone
    addIcons({ bagHandleOutline, bagOutline, cartOutline });
  }

  ngOnInit() {
    this.loadProductsLive();
    this.listenToCartCount(); // ابدأ مراقبة عداد السلة فوراً
  }

  /**
   * 🔥 جلب المنتجات لايف (Real-time) من الفايربيز عن طريق السيرفيس
   */
  loadProductsLive() {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        this.allProducts = data;
        this.applyFilters();    // شغل الفلاتر فوراً أول ما البيانات توصل
        this.isLoading = false; // اقفل كروت التحميل الرمادية واعرض الشغل الحقيقي
      },
      error: (err) => {
        console.error('خطأ في جلب منتجات ICON WEAR:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * 🌟 الاشتراك في عداد السلة لتحديث الأيقونة لايف وبدون ريفريش
   */
  listenToCartCount() {
    this.cartService.cartCount$.subscribe((count: number) => {
      this.cartCount = count;
    });
  }

  /**
   * 🧠 دالة الفلترة الذكية الموحدة (بتدمج فلاتر الأقسام مع شريط البحث)
   */
  applyFilters() {
    let tempProducts = [...this.allProducts];

    // 1️⃣ أولاً: الفلترة حسب القسم (MEN - WOMEN - KIDS)
    if (this.selectedCategory !== 'ALL') {
      tempProducts = tempProducts.filter(
        (p: any) => p.category && p.category.toUpperCase() === this.selectedCategory.toUpperCase()
      );
    }

    // 2️⃣ ثانياً: الفلترة الذكية بكلمة البحث (بتدور في الـ title أو الـ name المرفوعين من الداشبورد)
    if (this.searchTerm.trim() !== '') {
      const searchLower = this.searchTerm.toLowerCase().trim();
      tempProducts = tempProducts.filter((p: any) => {
        const titleMatch = p.title && p.title.toLowerCase().includes(searchLower);
        const nameMatch = p.name && p.name.toLowerCase().includes(searchLower);
        return titleMatch || nameMatch;
      });
    }

    // ضخ النتيجة النهائية في القائمة اللي بيقرا منها الـ HTML
    this.filteredProducts = tempProducts;
  }

  /**
   * ⚡ تشتغل فوراً لما العميل يضغط على الفئات (ALL - MEN - WOMEN - KIDS)
   */
  filterByCategory(event: any) {
    this.selectedCategory = event.detail.value;
    this.applyFilters(); // أعد تطبيق الفلترة والبحث معاً
  }

  /**
   * 🔍 تشتغل فوراً والعميل بيكتب حرف بحرف في شريط البحث
   */
  onSearch(event: any) {
    this.searchTerm = event.detail.value || '';
    this.applyFilters(); // أعد تطبيق الفلترة والبحث معاً
  }

  /**
   * ✈️ الانتقال لصفحة تفاصيل المنتج بـ الـ ID
   */
  goToDetails(product: any) {
    this.navCtrl.navigateForward(`/product-details/${product.id}`);
  }

  /**
   * 🛒 ✈️ الانتقال لصفحة سلة المشتريات
   */
  goToCart() {
    this.navCtrl.navigateForward('/cart');
  }

  /**
   * 🚀 تحسين أداء تكرار العناصر في الـ DOM
   */
  trackItems(index: number, item: any) {
    return item.id;
  }
}