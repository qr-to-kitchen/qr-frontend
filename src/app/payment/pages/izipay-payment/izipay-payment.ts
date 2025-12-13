import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

// Declare global KR variable from Izipay SDK
declare const KR: any;

@Component({
  selector: 'app-izipay-payment',
  standalone: false,
  templateUrl: './izipay-payment.html',
  styleUrl: './izipay-payment.css'
})
export class IzipayPayment implements OnInit, OnDestroy {
  isLoading = true;
  errorMessage = '';

  // TODO: Replace with your actual Izipay credentials
  private readonly PUBLIC_KEY = 'YOUR_IZIPAY_PUBLIC_KEY';
  private readonly ENDPOINT = 'https://api.micuentaweb.pe'; // Production endpoint

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeIzipayForm();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private initializeIzipayForm(): void {
    // Wait for KR library to be loaded
    if (typeof KR === 'undefined') {
      this.errorMessage = 'Error: Izipay SDK no se ha cargado correctamente';
      this.isLoading = false;
      this.snackBar.open('Error al cargar el formulario de pago', 'Cerrar', { duration: 3000 });
      return;
    }

    try {
      // Configure Izipay
      KR.setFormConfig({
        'kr-public-key': this.PUBLIC_KEY,
        'kr-post-url-success': window.location.origin + '/payment-success',
        'kr-language': 'es-PE'
      });

      // Attach form to the container
      KR.attachForm('#izipay-form-container');

      // Add event listener for form ready
      KR.onFormReady(() => {
        this.isLoading = false;
        console.log('Izipay form is ready');
      });

      // Add event listener for payment success
      KR.onSubmit((paymentResponse: any) => {
        console.log('Payment submitted:', paymentResponse);

        if (paymentResponse.clientAnswer.orderStatus === 'PAID') {
          this.snackBar.open('Pago exitoso', 'Cerrar', { duration: 3000 });
          // TODO: Handle successful payment (e.g., call your backend API)
          // this.processPayment(paymentResponse);
        }

        return false; // Prevent default form submission
      });

      // Add event listener for errors
      KR.onError((error: any) => {
        console.error('Izipay error:', error);
        this.errorMessage = 'Error en el formulario de pago';
        this.snackBar.open('Error en el formulario de pago', 'Cerrar', { duration: 3000 });
      });

    } catch (error) {
      console.error('Error initializing Izipay:', error);
      this.errorMessage = 'Error al inicializar el formulario de pago';
      this.isLoading = false;
      this.snackBar.open('Error al inicializar el formulario', 'Cerrar', { duration: 3000 });
    }
  }

  goBack(): void {
    this.router.navigate(['/login']).then();
  }

  // TODO: Implement this method to process payment on your backend
  // private processPayment(paymentResponse: any): void {
  //   // Call your backend API to verify and process the payment
  //   // this.paymentService.processPayment(paymentResponse).subscribe({
  //   //   next: (response) => {
  //   //     this.router.navigate(['/payment-success']);
  //   //   },
  //   //   error: (error) => {
  //   //     this.snackBar.open('Error al procesar el pago', 'Cerrar', { duration: 3000 });
  //   //   }
  //   // });
  // }
}
