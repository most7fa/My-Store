import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject
} from '@angular/core';

import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, NavController } from '@ionic/angular';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';

import { ProductService, Product } from '../services/product';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,

    ButtonModule,
    InputTextModule,
    BadgeModule,
    SkeletonModule,
    SelectButtonModule
  ]
})
export class HomePage implements OnInit {

  private navCtrl = inject(NavController);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  public wishlistService = inject(WishlistService);
  private document = inject(DOCUMENT);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

  featuredProducts: Product[] = [];
  newProducts: Product[] = [];

  selectedCategory = 'ALL';
  searchTerm = '';

  isLoading = true;
  cartCount = 0;
  wishlistCount = 0;

  categories = [
    { label: 'All', value: 'ALL', icon: 'pi pi-th-large' },
    { label: 'Men', value: 'MEN', icon: 'pi pi-user' },
    { label: 'Women', value: 'WOMEN', icon: 'pi pi-heart' },
    { label: 'Kids', value: 'KIDS', icon: 'pi pi-star' }
  ];

  categoryButtons = [
    { name: 'Men', value: 'MEN', icon: 'pi pi-user', description: 'Modern styles' },
    { name: 'Women', value: 'WOMEN', icon: 'pi pi-heart', description: 'New collection' },
    { name: 'Kids', value: 'KIDS', icon: 'pi pi-star', description: 'Cute & comfy' },
    { name: 'All Products', value: 'ALL', icon: 'pi pi-th-large', description: 'Explore everything' }
  ];

  ngOnInit(): void {
    this.loadProducts();
    this.listenToCartCount();
    this.listenToWishlistCount();
  }

  scrollToSearch(): void {
    this.document.querySelector('.search-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  private loadProducts(): void {
    this.isLoading = true;

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products ?? [];
        this.featuredProducts = this.allProducts.slice(0, 4);
        this.newProducts = [...this.allProducts].reverse().slice(0, 4);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.allProducts = [];
        this.filteredProducts = [];
        this.isLoading = false;
      }
    });
  }

  private listenToCartCount(): void {
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });
  }

  private listenToWishlistCount(): void {
    this.wishlistService.wishlistCount$.subscribe((count) => {
      this.wishlistCount = count;
    });
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(product);
  }

  toggleWishlist(product: Product, event: Event): void {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(product);
  }

  isFavorite(productId?: string): boolean {
    if (!productId) return false;
    return this.wishlistService.isInWishlist(productId);
  }

  applyFilters(): void {
    let products = [...this.allProducts];

    if (this.selectedCategory !== 'ALL') {
      products = products.filter((product) =>
        product.category?.toUpperCase() === this.selectedCategory.toUpperCase()
      );
    }

    const search = this.searchTerm.trim().toLowerCase();

    if (search) {
      products = products.filter((product) => {
        const title = product.title?.toLowerCase() ?? '';
        const name = product.name?.toLowerCase() ?? '';
        const category = product.category?.toLowerCase() ?? '';
        const description = product.description?.toLowerCase() ?? '';

        return (
          title.includes(search) ||
          name.includes(search) ||
          category.includes(search) ||
          description.includes(search)
        );
      });
    }

    this.filteredProducts = products;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();

    document.querySelector('.products-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  goToDetails(product: Product): void {
    if (!product.id) return;
    this.navCtrl.navigateForward(`/product-details/${product.id}`);
  }

  goToCart(): void {
    this.navCtrl.navigateForward('/cart');
  }

  goToWishlist(): void {
    this.navCtrl.navigateForward('/wishlist');
  }

  goToProducts(): void {
    this.selectedCategory = 'ALL';
    this.searchTerm = '';
    this.applyFilters();

    setTimeout(() => {
      document.querySelector('.products-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50);
  }

  getProductName(product: Product): string {
    return product.title || product.name || 'Product';
  }

  getProductImage(product: Product): string {
    return product.imageUrl || product.image || 'assets/logo.png';
  }

  getProductCategory(product: Product): string {
    return product.category || 'PRODUCT';
  }

  trackProduct(index: number, product: Product): string | number {
    return product.id ?? index;
  }
}