import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // مهم جداً
import { ProductService } from '../services/product';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] // أضفنا FormsModule
})
export class HomePage implements OnInit {
  products: any[] = [];
  allProducts: any[] = [];
  categories: string[] = ['الكل', 'ملابس', 'أحذية', 'إلكترونيات'];
  selectedCategory: string = 'الكل';

  constructor(private productService: ProductService, private navCtrl: NavController) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  // ميثود موحدة لتحميل البيانات عشان متكررش الكود
  loadAllProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.allProducts = data;
      this.loadData(this.selectedCategory);
    });
  }

  ionViewDidEnter() {
    this.loadAllProducts();
  }

  loadData(cat: any = 'الكل') {
    this.selectedCategory = cat;
    if (cat === 'الكل') {
      this.products = [...this.allProducts]; // نسخة من كل المنتجات
    } else {
      // فلترة حسب القسم
      this.products = this.allProducts.filter(p => p.category === cat);
    }
  }

  goToDetails(product: any) {
    this.navCtrl.navigateForward('/product-details', {
      queryParams: { product: JSON.stringify(product) }
    });
  }

  trackItems(index: number, item: any) {
    return item.id;
  }
}