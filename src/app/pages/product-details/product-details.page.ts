import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { Product, ProductService } from '../../services/product';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ProductDetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private navCtrl = inject(NavController);
  private toastCtrl = inject(ToastController);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  public wishlistService = inject(WishlistService);

  product: Product | null = null;
  selectedImage = '';
  selectedSize = 'M';
  selectedColor = 'Black';
  quantity = 1;
  isLoading = true;

  availableSizes: string[] = ['S', 'M', 'L', 'XL'];
  availableColors = [
    { name: 'Black', hex: '#18181b' },
    { name: 'Navy', hex: '#1e3a8a' },
    { name: 'Beige', hex: '#d4b996' }
  ];

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (!productId) {
      this.isLoading = false;
      return;
    }

    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = product?.imageUrl || product?.image || 'assets/suit.jpg';
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Error fetching product:', error);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  increaseQty(): void {
    this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  toggleWishlist(): void {
    if (this.product) {
      this.wishlistService.toggleWishlist(this.product);
    }
  }

  async addToCart(): Promise<void> {
    if (!this.product) {
      return;
    }

    this.cartService.addToCart({
      ...this.product,
      selectedSize: this.selectedSize,
      selectedColor: this.selectedColor,
      quantity: this.quantity
    });

    const toast = await this.toastCtrl.create({
      message: 'Added to cart successfully!',
      duration: 2000,
      color: 'dark',
      position: 'bottom'
    });

    await toast.present();
  }

  goBack(): void {
    this.navCtrl.back();
  }
}
