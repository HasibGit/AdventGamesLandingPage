import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PrizeAndWinningCriteria } from 'src/interfaces/prize-winning-criteria.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  getWinningCriteriaAndPrize(gameId: string, day: number, language: string) {
    console.log(environment);
    let httpParams = new HttpParams()
      .set('gameId', gameId)
      .set('day', day)
      .set('culture', language);

    return this.http.get<PrizeAndWinningCriteria>(
      `${environment.baseUrl}api/Query/GetGamePrize`,
      {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/json; charset=utf-8'
        ),
        params: httpParams,
        responseType: 'json',
      }
    );
  }
}
