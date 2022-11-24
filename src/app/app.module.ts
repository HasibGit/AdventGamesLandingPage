import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CountdownModule } from 'ngx-countdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Routes, RouterModule } from '@angular/router';
import { NgxLoadingModule } from 'ngx-loading';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'de',
    pathMatch: 'full',
  },
  {
    path: 'de',
    component: AppComponent,
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    FlexLayoutModule,
    CountdownModule,
    MatChipsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    MatCheckboxModule,
    NgxLoadingModule.forRoot({}),
    TranslateModule.forRoot({
      defaultLanguage: 'de-DE',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
