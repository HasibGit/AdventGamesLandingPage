import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown/interfaces';
import { environment } from 'src/environments/environment';
import { spigaConfig } from '../Landing_Page_Configs/Spiga_Landing_Page_Config/spiga-config';
import { emilConfig } from '../Landing_Page_Configs/Emil_Landing_Page_Config/emil-config';
import { andiamoConfig } from '../Landing_Page_Configs/Andiamo_Landing_Page_Config/andiamo-config';
import { svConfig } from '../Landing_Page_Configs/SV_Restaurant_Landing_Page_Config/sv-config';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from './app.service';
import { PrizeAndWinningCriteria } from 'src/interfaces/prize-winning-criteria.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'space-shooter-landing-page';
  secondsLeft: number = 0;
  config: CountdownConfig;
  daysTillChristmasStarts: number;
  currentEnvironment: string;
  currentlySelectedLanguage: string = 'de-DE';
  brandLogoPath: string;
  hoursTranslated: string;
  minutesTranslated: string;
  secondsTranslated: string;
  prizeAndWinningCriteria: {
    offer_en: string;
    offer_de: string;
    offer_fr: string;
    winning_criteria_en: string;
    winning_criteria_de: string;
    winning_criteria_fr: string;
  };
  offer_error: string;
  languages: { key: string; value: string }[] = [
    {
      key: 'en-US',
      value: 'English',
    },
    {
      key: 'fr-FR',
      value: 'French',
    },
    {
      key: 'de-DE',
      value: 'German',
    },
  ];
  isLoading: boolean;

  constructor(
    private renderer: Renderer2,
    private elemRef: ElementRef,
    private titleService: Title,
    private translateService: TranslateService,
    private appservice: AppService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.hoursTranslated = 'Stunden';
    this.minutesTranslated = 'Minuten';
    this.secondsTranslated = 'Sekunden';

    this.currentEnvironment = environment.environmentName;
    this.setTabTitle();
    this.setEnvironmentSpecificConfigs();
    this.getDaysTillChristmas();
    this.getSecondsLeftTillNextOffer();

    this.getWinningCriteriaAndPrice();
  }

  ngAfterViewInit(): void {
    this.setBubblesBackgroundColor();
  }

  generatePayload() {
    let gameid: string = '';
    let currentDate = new Date().getDate();
    if (this.currentEnvironment != 'SV_RESTAURANT') {
      gameid = 'space-shooter';
    } else {
      if (currentDate >= 1 && currentDate <= 5) {
        gameid = 'hungry-worm';
      } else if (currentDate >= 6 && currentDate <= 12) {
        gameid = 'sky-racer';
      } else if (currentDate >= 13 && currentDate <= 19) {
        gameid = 'candy-craze';
      } else if (currentDate >= 20 && currentDate <= 24) {
        gameid = 'memory-match';
      }
    }

    return {
      gameId: gameid,
      date: currentDate,
      lang: this.currentlySelectedLanguage.slice(0, 2),
    };
  }

  getWinningCriteriaAndPrice() {
    this.isLoading = true;
    let payload: { gameId: string; date: number; lang: string } =
      this.generatePayload();
    this.appservice
      .getWinningCriteriaAndPrize(payload.gameId, payload.date, payload.lang)
      .subscribe((response: PrizeAndWinningCriteria) => {
        if (response.errors && response.errors.errors) {
          this.offer_error = response.errors.errors[0];
          this.isLoading = false;
          return;
        }

        this.prizeAndWinningCriteria.offer_en =
          response.result.descriptions[0].value;
        this.prizeAndWinningCriteria.offer_de =
          response.result.descriptions[1].value;
        this.prizeAndWinningCriteria.offer_fr =
          response.result.descriptions[2].value;

        this.prizeAndWinningCriteria.winning_criteria_en =
          response.result.prizeWinningCriteria.WinningCriteriaDescriptions[0].value;
        this.prizeAndWinningCriteria.winning_criteria_de =
          response.result.prizeWinningCriteria.WinningCriteriaDescriptions[1].value;
        this.prizeAndWinningCriteria.winning_criteria_fr =
          response.result.prizeWinningCriteria.WinningCriteriaDescriptions[2].value;

        this.isLoading = false;
      });
  }

  selectLang(language: { key: string; value: string }) {
    this.currentlySelectedLanguage = language.key;
    this.setCountdownTimerTranslation(this.currentlySelectedLanguage);
    this.translateService.use(language.key);
  }

  setCountdownTimerTranslation(currentLanguage: string) {
    switch (currentLanguage) {
      case 'de-DE':
        this.hoursTranslated = 'Stunden';
        this.minutesTranslated = 'Minuten';
        this.secondsTranslated = 'Sekunden';
        break;
      case 'en-US':
        this.hoursTranslated = 'hours';
        this.minutesTranslated = 'minutes';
        this.secondsTranslated = 'seconds';
        break;
      case 'fr-FR':
        this.hoursTranslated = 'heures';
        this.minutesTranslated = 'minutes';
        this.secondsTranslated = 'secondes';
        break;
    }
    this.getSecondsLeftTillNextOffer();
  }

  setTabTitle() {
    switch (this.currentEnvironment) {
      case 'DEV':
        this.titleService.setTitle('Spiga');
        break;
      case 'SPIGA':
        this.titleService.setTitle('Spiga');
        break;
      case 'EMIL':
        this.titleService.setTitle('Emil');
        break;
      case 'ANDIAMO':
        this.titleService.setTitle('Andiamo');
        break;
      case 'SV_RESTAURANT':
        this.titleService.setTitle('SV Restaurant');
        break;
      default:
        this.titleService.setTitle('Spiga');
    }
  }

  setBubblesBackgroundColor() {
    if (
      this.currentEnvironment == 'DEV' ||
      this.currentEnvironment == 'SPIGA'
    ) {
      let typeOneBubbles =
        this.elemRef.nativeElement.querySelectorAll('.bubble-type-1');
      [...typeOneBubbles].forEach((element) => {
        this.renderer.setStyle(element, 'backgroundColor', '#eee4e5');
      });

      let typeTwoBubbles =
        this.elemRef.nativeElement.querySelectorAll('.bubble-type-2');
      [...typeTwoBubbles].forEach((element) => {
        this.renderer.setStyle(element, 'backgroundColor', '#caaaaf');
      });

      let typeThreeBubbles =
        this.elemRef.nativeElement.querySelectorAll('.bubble-type-3');
      [...typeThreeBubbles].forEach((element) => {
        this.renderer.setStyle(element, 'backgroundColor', '#863a46');
      });
    } else if (this.currentEnvironment == 'EMIL') {
      let typeOneBubbles =
        this.elemRef.nativeElement.querySelectorAll('.bubble-type-1');
      [...typeOneBubbles].forEach((element) => {
        this.renderer.setStyle(element, 'backgroundColor', '#e9e9e9');
      });

      let typeTwoBubbles =
        this.elemRef.nativeElement.querySelectorAll('.bubble-type-2');
      [...typeTwoBubbles].forEach((element) => {
        this.renderer.setStyle(element, 'backgroundColor', '#babab8');
      });

      let typeThreeBubbles =
        this.elemRef.nativeElement.querySelectorAll('.bubble-type-3');
      [...typeThreeBubbles].forEach((element) => {
        this.renderer.setStyle(element, 'backgroundColor', '#71716f');
      });
    } else if (
      this.currentEnvironment == 'ANDIAMO' ||
      this.currentEnvironment == 'SV_RESTAURANT'
    ) {
      let typeOneBubbles =
        this.elemRef.nativeElement.querySelectorAll('.bubble-type-1');
      [...typeOneBubbles].forEach((element) => {
        this.renderer.setStyle(element, 'backgroundColor', '#f4f4f4');
      });

      let typeTwoBubbles =
        this.elemRef.nativeElement.querySelectorAll('.bubble-type-2');
      [...typeTwoBubbles].forEach((element) => {
        this.renderer.setStyle(element, 'backgroundColor', '#dddddf');
      });

      let typeThreeBubbles =
        this.elemRef.nativeElement.querySelectorAll('.bubble-type-3');
      [...typeThreeBubbles].forEach((element) => {
        this.renderer.setStyle(element, 'backgroundColor', '#b9babc');
      });
    }
  }

  setEnvironmentSpecificConfigs() {
    if (this.currentEnvironment == 'SPIGA') {
      this.brandLogoPath = spigaConfig.brandLogoPath;
    } else if (this.currentEnvironment == 'EMIL') {
      this.brandLogoPath = emilConfig.brandLogoPath;
    } else if (this.currentEnvironment == 'ANDIAMO') {
      this.brandLogoPath = andiamoConfig.brandLogoPath;
    } else if (this.currentEnvironment == 'SV_RESTAURANT') {
      this.brandLogoPath = svConfig.brandLogoPath;
    }
  }

  getDaysTillChristmas() {
    const christmasStartDate = new Date('12/25/2022');
    const today = new Date();
    this.daysTillChristmasStarts = Math.ceil(
      (christmasStartDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
  }

  getOfferKey(): string {
    let offerKey = '';
    switch (this.currentEnvironment) {
      case 'SPIGA':
        offerKey = 'SPIGA_OFFER_DETAILS';
        break;
      case 'EMIL':
        offerKey = 'EMIL_OFFER_DETAILS';
        break;
      case 'ANDIAMO':
        offerKey = 'ANDIAMO_OFFER_DETAILS';
        break;
      case 'SV_RESTAURANT':
        offerKey = 'SV_RESTAURANT_OFFER_DETAILS';
        break;
    }
    return offerKey;
  }

  getSecondsLeftTillNextOffer() {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    this.secondsLeft = (tomorrow.getTime() - today.getTime()) / 1000;
    this.config = {
      leftTime: this.secondsLeft,
      format: 'H m s',
      prettyText: (text) => this.parseCountdownText(text),
    };
  }

  handleEvent(event: CountdownEvent) {}

  parseCountdownText(text: string) {
    // 1. Seperate string between spaces
    const splittedText = text.split(/(\s+)/);

    const hours =
      '<span>' + splittedText[0] + ' ' + this.hoursTranslated + ' : </span>';
    const minutes =
      '<span>' + splittedText[2] + ' ' + this.minutesTranslated + ' : </span>';
    const seconds =
      '<span>' + splittedText[4] + ' ' + this.secondsTranslated + '</span>';

    return hours + minutes + seconds;
  }

  openGameInNewTab() {
    window.open(environment.gameUrl, '_blank');
  }
}
