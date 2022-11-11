import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown/interfaces';
import { emilConfig } from '../../Landing_Page_Configs/Emil_Landing_Page_Config/emil-config';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from '../app.service';
import { PrizeAndWinningCriteria } from 'src/interfaces/prize-winning-criteria.interface';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-emil-landing-page',
  templateUrl: './emil-landing-page.component.html',
  styleUrls: ['./emil-landing-page.component.scss'],
})
export class EmilLandingPageComponent implements OnInit, AfterViewInit {
  secondsLeft: number = 0;
  config: CountdownConfig;
  daysTillChristmasStarts: number;
  currentEnvironment: string;
  currentlySelectedLanguage: string = 'de-DE';
  brandLogoPath: string;
  hoursTranslated: string;
  minutesTranslated: string;
  secondsTranslated: string;
  winningCriteriaContainsNumber: boolean = false;
  winningCriteriaThreshold: number;
  winningCriteriaLeft_en: string = '';
  winningCriteriaLeft_de: string = '';
  winningCriteriaLeft_fr: string = '';
  winningCriteriaRight_en: string = '';
  winningCriteriaRight_de: string = '';
  winningCriteriaRight_fr: string = '';
  prizeAndWinningCriteria: {
    offer_en: string;
    offer_de: string;
    offer_fr: string;
    winning_criteria_en: string;
    winning_criteria_de: string;
    winning_criteria_fr: string;
  } = {
    offer_de: '',
    offer_en: '',
    offer_fr: '',
    winning_criteria_en: '',
    winning_criteria_de: '',
    winning_criteria_fr: '',
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
    private appservice: AppService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.hoursTranslated = 'Std.';
    this.minutesTranslated = 'min';
    this.secondsTranslated = 'sek.';
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
    let gameid: string = 'space-shooter';
    let currentDate = new Date().getDate();

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
        if (
          response.errors &&
          response.errors.errors &&
          response.errors.errors.length > 0
        ) {
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
          response.result.prizeWinningCriteria.winningCriteriaDescriptions[0].value;
        this.prizeAndWinningCriteria.winning_criteria_de =
          response.result.prizeWinningCriteria.winningCriteriaDescriptions[1].value;
        this.prizeAndWinningCriteria.winning_criteria_fr =
          response.result.prizeWinningCriteria.winningCriteriaDescriptions[2].value;

        this.handleWinningCriteriaStyle();

        this.isLoading = false;
      });
  }

  handleWinningCriteriaStyle() {
    const arr_en: string[] =
      this.prizeAndWinningCriteria.winning_criteria_en.split(' ');
    const arr_de: string[] =
      this.prizeAndWinningCriteria.winning_criteria_de.split(' ');
    const arr_fr: string[] =
      this.prizeAndWinningCriteria.winning_criteria_fr.split(' ');

    let arr_en_number_index = -1;
    let arr_de_number_index = -1;
    let arr_fr_number_index = -1;

    for (let i = 0; i < arr_en.length; i++) {
      if (!isNaN(parseInt(arr_en[i]))) {
        this.winningCriteriaContainsNumber = true;
        arr_en_number_index = i;
        this.winningCriteriaThreshold = parseInt(arr_en[i]);
        break;
      }
    }

    if (this.winningCriteriaContainsNumber) {
      for (let i = 0; i < arr_de.length; i++) {
        if (!isNaN(parseInt(arr_de[i]))) {
          arr_de_number_index = i;
          break;
        }
      }

      for (let i = 0; i < arr_fr.length; i++) {
        if (!isNaN(parseInt(arr_fr[i]))) {
          arr_fr_number_index = i;
          break;
        }
      }

      for (let i = 0; i < arr_en_number_index; i++) {
        this.winningCriteriaLeft_en += arr_en[i] + ' ';
      }
      for (let i = arr_en_number_index + 1; i < arr_en.length; i++) {
        this.winningCriteriaRight_en += ' ' + arr_en[i];
      }

      for (let i = 0; i < arr_de_number_index; i++) {
        this.winningCriteriaLeft_de += arr_de[i] + ' ';
      }
      for (let i = arr_de_number_index + 1; i < arr_de.length; i++) {
        this.winningCriteriaRight_de += ' ' + arr_de[i];
      }

      for (let i = 0; i < arr_fr_number_index; i++) {
        this.winningCriteriaLeft_fr += arr_fr[i] + ' ';
      }
      for (let i = arr_fr_number_index + 1; i < arr_fr.length; i++) {
        this.winningCriteriaRight_fr += ' ' + arr_fr[i];
      }
    }
  }

  selectLang(language: { key: string; value: string }) {
    this.currentlySelectedLanguage = language.key;
    this.setCountdownTimerTranslation(this.currentlySelectedLanguage);
    this.translateService.use(language.key);

    if (this.currentlySelectedLanguage == 'en-US') {
      this.location.replaceState('/en');
    } else if (this.currentlySelectedLanguage == 'de-DE') {
      this.location.replaceState('/de');
    } else {
      this.location.replaceState('/fr');
    }
  }

  setCountdownTimerTranslation(currentLanguage: string) {
    switch (currentLanguage) {
      case 'de-DE':
        this.hoursTranslated = 'Std.';
        this.minutesTranslated = 'min';
        this.secondsTranslated = 'sek.';
        break;
      case 'en-US':
        this.hoursTranslated = 'h';
        this.minutesTranslated = 'min';
        this.secondsTranslated = 'sec';
        break;
      case 'fr-FR':
        this.hoursTranslated = 'h';
        this.minutesTranslated = 'min';
        this.secondsTranslated = 'sec';
        break;
    }
    this.getSecondsLeftTillNextOffer();
  }

  setTabTitle() {
    this.titleService.setTitle('Emil');
  }

  setBubblesBackgroundColor() {
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
  }

  setEnvironmentSpecificConfigs() {
    this.brandLogoPath = emilConfig.brandLogoPath;
  }

  getDaysTillChristmas() {
    const christmasStartDate = new Date('12/25/2022');
    const today = new Date();
    this.daysTillChristmasStarts = Math.ceil(
      (christmasStartDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
  }

  getOfferKey(): string {
    let offerKey = 'EMIL_OFFER_DETAILS';
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
    window.open(emilConfig.gameUrl, '_blank');
  }
}
