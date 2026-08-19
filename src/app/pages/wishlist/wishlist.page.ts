import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/product';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class WishlistPage implements OnInit {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private navCtrl = inject(NavController);

  wishlistItems: Product[] = [];

  ngOnInit(): void {
    this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistItems = items;
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  removeFromWishlist(productId?: string): void {
    if (productId) {
      this.wishlistService.removeFromWishlist(productId);
    }
  }

  goToDetails(product: Product): void {
    if (product.id) {
      this.navCtrl.navigateForward(`/product-details/${product.id}`);
    }
  }

  goBack(): void {
    this.navCtrl.back();
  }

  goToShop(): void {
    this.navCtrl.navigateRoot('/home');
  }
}