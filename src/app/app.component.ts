import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown/interfaces';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from './app.service';
import { Season, Theme, Description } from 'src/interfaces/season.interface';
import { PrizeAndWinningCriteria } from 'src/interfaces/prize-winning-criteria.interface';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { tap, concatMap } from 'rxjs/operators';
import { GameSchedule } from 'src/interfaces/game-schedule.interface';
import { BrandLogoPath } from 'src/shared/brand-logo-path.config';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  secondsLeft: number = 0;
  config: CountdownConfig;
  daysTillChristmasStarts: number;
  currentlySelectedLanguage: string = 'de-DE';
  brandLogoPath: string;
  hoursTranslated: string;
  minutesTranslated: string;
  secondsTranslated: string;
  season: Season;
  seasonDescriptions: Description[];
  seasonDescription: string;
  gameUrl: string;
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
  subscription: Subscription;

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
    this.hoursTranslated = 'Std.';
    this.minutesTranslated = 'min';
    this.secondsTranslated = 'sek.';

    this.setTabTitle();
    this.setEnvironmentSpecificConfigs();
    this.getDaysTillChristmas();
    this.getSecondsLeftTillNextOffer();
    this.getSeason();
  }

  getSeason() {
    this.subscription = this.appservice
      .getSeason(environment.companyId)
      .pipe(
        tap((seasonResponse: Season) => {
          this.season = seasonResponse;
          this.seasonDescriptions = this.season.result.seasonDescriptions;
          this.seasonDescription = this.seasonDescriptions[1].value; // as page initial lang is in german
          this.setLandingPageTheme(this.season.result.theme);
          this.isLoading = true;
        }),
        concatMap((seasonResponse: Season) =>
          this.getGameSchedule(
            seasonResponse.result.companyId,
            seasonResponse.result.id
          )
        ),
        tap((gameScheduleResponse: GameSchedule) => {
          this.gameUrl = gameScheduleResponse.result.game.gameUrl;
        }),
        concatMap((gameScheduleResponse: GameSchedule) =>
          this.getWinningCriteriaAndPrice(
            gameScheduleResponse.result.game.gameId
          )
        ),
        tap((prizeAndWinningCriteriaResponse: PrizeAndWinningCriteria) => {
          if (
            prizeAndWinningCriteriaResponse.errors &&
            prizeAndWinningCriteriaResponse.errors.errors &&
            prizeAndWinningCriteriaResponse.errors.errors.length > 0
          ) {
            this.offer_error = prizeAndWinningCriteriaResponse.errors.errors[0];
            this.isLoading = false;
            return;
          }
          this.prizeAndWinningCriteria.offer_en =
            prizeAndWinningCriteriaResponse.result.prizeDescriptions[0].value;
          this.prizeAndWinningCriteria.offer_de =
            prizeAndWinningCriteriaResponse.result.prizeDescriptions[1].value;
          this.prizeAndWinningCriteria.offer_fr =
            prizeAndWinningCriteriaResponse.result.prizeDescriptions[2].value;

          this.prizeAndWinningCriteria.winning_criteria_en =
            prizeAndWinningCriteriaResponse.result.winningCriteria.criteriaDescriptions[0].value;
          this.prizeAndWinningCriteria.winning_criteria_de =
            prizeAndWinningCriteriaResponse.result.winningCriteria.criteriaDescriptions[1].value;
          this.prizeAndWinningCriteria.winning_criteria_fr =
            prizeAndWinningCriteriaResponse.result.winningCriteria.criteriaDescriptions[2].value;

          this.handleWinningCriteriaStyle();

          this.isLoading = false;

          this.setPrizeAndWinningCriteriaColor();
        })
      )
      .subscribe();
  }

  setPrizeAndWinningCriteriaColor() {
    // had to apply to give the dom time to load before i access element using elemRef
    setTimeout(() => {
      if (this.winningCriteriaContainsNumber) {
        let requiredPoints =
          this.elemRef.nativeElement.querySelector('.required-points');
        this.renderer.setStyle(
          requiredPoints,
          'color',
          this.season.result.theme.requiredPointsColor
        );
      }

      let offer = this.elemRef.nativeElement.querySelector('.offer');
      this.renderer.setStyle(
        offer,
        'color',
        this.season.result.theme.offerColor
      );
    }, 0.01);
  }

  setLandingPageTheme(theme: Theme) {
    let container = this.elemRef.nativeElement.querySelector('.container');
    this.renderer.setStyle(container, 'backgroundColor', theme.backgroundColor);
    this.setBubblesBackgroundColor(theme);
    let card = this.elemRef.nativeElement.querySelector('.offer-card');
    this.renderer.setStyle(card, 'backgroundColor', theme.cardBackgroundColor);
    this.renderer.setStyle(card, 'borderColor', theme.cardBorder);
    let seasonDeadline = this.elemRef.nativeElement.querySelector(
      '.christmas-deadline'
    );
    this.renderer.setStyle(seasonDeadline, 'color', theme.seasonDeadlineColor);
    let playButton = this.elemRef.nativeElement.querySelector('.play-game-btn');
    this.renderer.setStyle(
      playButton,
      'backgroundColor',
      theme.playButtonBackgroundColor
    );
    this.renderer.setStyle(
      playButton,
      'borderColor',
      theme.playButtonBorderColor
    );
    let playButtonText =
      this.elemRef.nativeElement.querySelector('.button-text');
    this.renderer.setStyle(playButtonText, 'color', theme.playButtonTextColor);
  }

  generatePayload(gameId: string) {
    let gameid: string = gameId;
    let currentDate = new Date().getDate();
    return {
      gameId: gameid,
      date: currentDate,
      lang: this.currentlySelectedLanguage.slice(0, 2),
      companyId: environment.companyId,
    };
  }

  getWinningCriteriaAndPrice(gameId: string) {
    this.isLoading = true;
    let payload: {
      gameId: string;
      date: number;
      lang: string;
      companyId: string;
    } = this.generatePayload(gameId);
    return this.appservice.getWinningCriteriaAndPrize(
      payload.gameId,
      payload.date,
      payload.lang,
      payload.companyId
    );
  }

  getGameSchedule(companyId: string, seasonId: string) {
    return this.appservice.getGameSchedule(companyId, seasonId);
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

  setBubblesBackgroundColor(theme: Theme) {
    let typeOneBubbles =
      this.elemRef.nativeElement.querySelectorAll('.bubble-type-1');
    [...typeOneBubbles].forEach((element) => {
      this.renderer.setStyle(
        element,
        'backgroundColor',
        theme.bubbleType1BackgroundColor
      );
    });

    let typeTwoBubbles =
      this.elemRef.nativeElement.querySelectorAll('.bubble-type-2');
    [...typeTwoBubbles].forEach((element) => {
      this.renderer.setStyle(
        element,
        'backgroundColor',
        theme.bubbleType2BackgroundColor
      );
    });

    let typeThreeBubbles =
      this.elemRef.nativeElement.querySelectorAll('.bubble-type-3');
    [...typeThreeBubbles].forEach((element) => {
      this.renderer.setStyle(
        element,
        'backgroundColor',
        theme.bubbleType3BackgroundColor
      );
    });
  }

  setTabTitle() {
    this.titleService.setTitle(environment.tabTitle);
  }

  setEnvironmentSpecificConfigs() {
    this.brandLogoPath = BrandLogoPath.SPIGA;
  }

  getDaysTillChristmas() {
    const christmasStartDate = new Date('12/25/2022');
    const today = new Date();
    this.daysTillChristmasStarts = Math.ceil(
      (christmasStartDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
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

  selectLang(language: { key: string; value: string }) {
    this.currentlySelectedLanguage = language.key;
    this.setCountdownTimerTranslation(this.currentlySelectedLanguage);
    this.setSeasonDescriptionTranslation(this.currentlySelectedLanguage);
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

  setSeasonDescriptionTranslation(currentLanguage: string) {
    switch (currentLanguage) {
      case 'en-US':
        this.seasonDescription = this.seasonDescriptions[0].value;
        break;
      case 'de-DE':
        this.seasonDescription = this.seasonDescriptions[1].value;
        break;
      case 'fr-FR':
        this.seasonDescription = this.seasonDescriptions[2].value;
        break;
    }
  }

  getOfferKey(): string {
    let offerKey = 'SPIGA_OFFER_DETAILS';
    return offerKey;
  }

  openGameInNewTab() {
    window.open(this.gameUrl, '_blank');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
