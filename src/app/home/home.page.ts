import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // مهم جداً
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] // أضفنا FormsModule
})
export class HomePage implements OnInit {
  private navCtrl = inject(NavController);
  products: any[] = [];
  allProducts: any[] = []; // المخزن الأصلي
// في ملف الـ .ts عدل السطر ده
categories: any[] = [
  { id: 1, name: 'Clothes' },
  { id: 2, name: 'Electronics' },
  { id: 3, name: 'Furniture' },
  { id: 4, name: 'Shoes' }
];
  selectedCategory: string = 'الكل';

  constructor(private http: HttpClient) {} // تأكد من حقن الـ HttpClient

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get('https://api.escuelajs.co/api/v1/products?offset=0&limit=30')
      .subscribe((res: any) => {
        this.allProducts = res;
        this.products = res;
        console.log('Data loaded:', res.length);
      });
  }


goToDetails(product: any) {
  // بنبعت الـ ID بتاع المنتج لصفحة التفاصيل
  this.navCtrl.navigateForward(`/product-details/${product.id}`);
}

  // دالة لتحسين أداء القوائم عند الفلترة
trackItems(index: number, item: any) {
  return item.id;
}

  // الدالة التي تعمل عند تغيير القسم
  filterByCategory(event: any) {
    const categoryName = event.detail.value;
    this.selectedCategory = categoryName;

    if (categoryName === 'الكل') {
      this.products = this.allProducts;
    } else {
      // بنفلتر المنتجات اللي اسم القسم بتاعها بيساوي اللي اخترناه
      this.products = this.allProducts.filter(p => 
        p.category.name.toLowerCase() === categoryName.toLowerCase()
      );
    }
  }
}
