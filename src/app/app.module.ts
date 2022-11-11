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
import { SpigaLandingPageComponent } from './spiga-landing-page/spiga-landing-page.component';
import { EmilLandingPageComponent } from './emil-landing-page/emil-landing-page.component';
import { AndiamoLandingPageComponent } from './andiamo-landing-page/andiamo-landing-page.component';
import { SvRestaurantLandingPageComponent } from './sv-restaurant-landing-page/sv-restaurant-landing-page.component';
import { environment } from 'src/environments/environment';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const appRoutes: Routes = [];

if (environment.environmentName == 'SPIGA') {
  appRoutes.push(
    {
      path: '',
      redirectTo: 'de',
      pathMatch: 'full',
    },
    {
      path: 'de',
      component: SpigaLandingPageComponent,
    },
    {
      path: 'en',
      component: SpigaLandingPageComponent,
    },
    {
      path: 'fr',
      component: SpigaLandingPageComponent,
    }
  );
}

@NgModule({
  declarations: [
    AppComponent,
    SpigaLandingPageComponent,
    EmilLandingPageComponent,
    AndiamoLandingPageComponent,
    SvRestaurantLandingPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    FlexLayoutModule,
    CountdownModule,
    MatChipsModule,
    MatProgressBarModule,
    HttpClientModule,
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
