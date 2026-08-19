import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CartPage implements OnInit {
  private cartService = inject(CartService);
  private navCtrl = inject(NavController);

  cartItems: CartItem[] = [];
  totalPrice = 0;

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.totalPrice$.subscribe(total => {
      this.totalPrice = total;
    });
  }

  increaseQuantity(itemId: string): void {
    this.cartService.increaseQuantity(itemId);
  }

  decreaseQuantity(itemId: string): void {
    this.cartService.decreaseQuantity(itemId);
  }

  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId);
  }

  goBack(): void {
    this.navCtrl.back();
  }

  goToShop(): void {
    this.navCtrl.navigateRoot('/home');
  }
}
