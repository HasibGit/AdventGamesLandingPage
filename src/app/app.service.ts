import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  getWinningCriteriaAndPrize(gameId: string, day: number, language: string) {
    let httpParams = new HttpParams()
      .set('gameId', gameId)
      .set('day', day)
      .set('culture', language);

    return this.http.get(
      'https://selise-space-shooter-backend.seliselocal.com/api/Query/GetGamePrize',
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        params: httpParams,
        responseType: 'json',
      }
    );
  }
}
