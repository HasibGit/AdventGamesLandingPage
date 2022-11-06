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
  brandLogoPath: string;
  offerDetails: string;

  constructor(
    private renderer: Renderer2,
    private elemRef: ElementRef,
    private titleService: Title
  ) {
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

  ngOnInit() {
    this.currentEnvironment = environment.environmentName;
    this.setEnvironmentSpecificConfigs();
    this.getDaysTillChristmas();
    this.getSecondsLeftTillNextOffer();
  }

  ngAfterViewInit(): void {
    this.setBubblesBackgroundColor();
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
      this.offerDetails = spigaConfig.spigaOfferDetails;
    } else if (this.currentEnvironment == 'EMIL') {
      this.brandLogoPath = emilConfig.brandLogoPath;
      this.offerDetails = emilConfig.emilOfferDetails;
    } else if (this.currentEnvironment == 'ANDIAMO') {
      this.brandLogoPath = andiamoConfig.brandLogoPath;
      this.offerDetails = andiamoConfig.andiamoOfferDetails;
    } else if (this.currentEnvironment == 'SV_RESTAURANT') {
      this.brandLogoPath = svConfig.brandLogoPath;
      this.offerDetails = svConfig.svOfferDetails;
    }
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

    let hours = '';
    let minutes = '';
    let seconds = '';
    // 2. Add labels to each string array
    switch (this.currentEnvironment) {
      case 'SPIGA':
        hours =
          '<span class="count-down spiga-font">' +
          splittedText[0] +
          ' hours : </span>';
        minutes =
          '<span class="count-down spiga-font">' +
          splittedText[2] +
          ' minutes : </span>';
        seconds =
          '<span class="count-down spiga-font">' +
          splittedText[4] +
          ' seconds </span>';
        break;

      case 'EMIL':
        hours =
          '<span class="count-down emil-font">' +
          splittedText[0] +
          ' hours : </span>';
        minutes =
          '<span class="count-down emil-font">' +
          splittedText[2] +
          ' minutes : </span>';
        seconds =
          '<span class="count-down emil-font">' +
          splittedText[4] +
          ' seconds </span>';
        break;

      case 'ANDIAMO':
        hours =
          '<span class="count-down andiamo-sv-font">' +
          splittedText[0] +
          ' hours : </span>';
        minutes =
          '<span class="count-down andiamo-sv-font">' +
          splittedText[2] +
          ' minutes : </span>';
        seconds =
          '<span class="count-down andiamo-sv-font">' +
          splittedText[4] +
          ' seconds </span>';
        break;

      case 'SV_RESTAURANT':
        hours =
          '<span class="count-down andiamo-sv-font">' +
          splittedText[0] +
          ' hours : </span>';
        minutes =
          '<span class="count-down andiamo-sv-font">' +
          splittedText[2] +
          ' minutes : </span>';
        seconds =
          '<span class="count-down andiamo-sv-font">' +
          splittedText[4] +
          ' seconds </span>';
        break;
    }

    return hours + minutes + seconds;
  }
}
