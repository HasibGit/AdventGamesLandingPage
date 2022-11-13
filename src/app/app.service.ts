import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PrizeAndWinningCriteria } from 'src/interfaces/prize-winning-criteria.interface';
import { Season } from 'src/interfaces/season.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  getSeason(companyId: string) {
    let httpParams = new HttpParams().set('companyId', companyId);

    return this.http.get<Season>(
      `${environment.backendUrl}api/Query/GetSeason`,
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

  getWinningCriteriaAndPrize(
    gameId: string,
    day: number,
    language: string,
    companyId: string
  ) {
    let httpParams = new HttpParams()
      .set('gameId', gameId)
      .set('day', day)
      .set('culture', language)
      .set('companyId', companyId);

    return this.http.get<PrizeAndWinningCriteria>(
      `${environment.backendUrl}api/Query/GetGamePrize`,
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
