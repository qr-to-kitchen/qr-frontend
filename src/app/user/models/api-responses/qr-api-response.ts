import {QrDto} from '../qr.dto';

export interface QrApiResponse {
  qr: QrDto;
  qrCode: string;
}
