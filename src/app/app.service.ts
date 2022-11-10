import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PrizeAndWinningCriteria } from 'src/interfaces/prize-winning-criteria.interface';

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

    return this.http.get<PrizeAndWinningCriteria>(
      'https://selise-space-shooter-backend.seliselocal.com/api/Query/GetGamePrize',
      {
        headers: new HttpHeaders({
          accept: 'application/json',
        }),
        params: httpParams,
        responseType: 'json',
      }
    );
  }
}
