import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
    navBarColorChanged = new EventEmitter<{ color: string }>();

    emitNavBarColorChange(info: { color: string }) {
        this.navBarColorChanged.emit(info);
    }
}
