import {ChangeDetectorRef, Component} from '@angular/core';
import {Subscription} from "rxjs";
import {CommunicationService} from "./shared/services/communicacion/communication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  navBarColorChangedSubscription: Subscription;
  navBarColor: string = '#1e40af';

  constructor(private communicationService: CommunicationService, private cdr: ChangeDetectorRef) {
    this.navBarColorChangedSubscription = this.communicationService.navBarColorChanged.subscribe((value) => {
      this.navBarColor = value.color;
      this.cdr.detectChanges();
    });
  }
}
