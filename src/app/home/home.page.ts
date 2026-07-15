import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import {
  Firestore,
  collection,
  collectionData
} from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class HomePage implements OnInit {

  private navCtrl = inject(NavController);
  private firestore = inject(Firestore);

  products: any[] = [];
  allProducts: any[] = [];

  categories: any[] = [];

  selectedCategory: string = 'الكل';

  ngOnInit() {

    this.loadProducts();
    this.loadCategories();

  }

  loadProducts() {

    const productsRef = collection(
      this.firestore,
      'products'
    );

    collectionData(productsRef, {
      idField: 'id'
    }).subscribe((data: any) => {

      this.allProducts = data;
      this.products = data;

      console.log(this.products);

    });

  }

  loadCategories() {

    const categoriesRef = collection(
      this.firestore,
      'categories'
    );

    collectionData(categoriesRef, {
      idField: 'id'
    }).subscribe((data: any) => {

      this.categories = data;

    });

  }

  goToDetails(product: any) {

    this.navCtrl.navigateForward(
      `/product-details/${product.id}`
    );

  }

  trackItems(index: number, item: any) {

    return item.id;

  }

  filterByCategory(event: any) {

    const categoryName = event.detail.value;

    this.selectedCategory = categoryName;

    if (categoryName === 'الكل') {

      this.products = [...this.allProducts];

    } else {

      this.products = this.allProducts.filter(
        (p: any) => p.category === categoryName
      );

    }

  }

}
