import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown/interfaces';
import { environment } from 'src/environments/environment';
import { spigaConfig } from '../Spiga_Landing_Page_Config/spiga-config';
import { emilConfig } from '../Emil_Landing_Page_Config/emil-config';

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

  constructor(private renderer: Renderer2, private elemRef: ElementRef) {}

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
    }
  }

  setEnvironmentSpecificConfigs() {
    if (this.currentEnvironment == 'SPIGA') {
      this.brandLogoPath = spigaConfig.brandLogoPath;
      this.offerDetails = spigaConfig.spigaOfferDetails;
    } else {
      this.brandLogoPath = emilConfig.brandLogoPath;
      this.offerDetails = emilConfig.emilOfferDetails;
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

    // 2. Add labels to each string array
    const hours =
      '<span class="countdown-time">' + splittedText[0] + '</span> hours : ';
    const minutes =
      '<span class="countdown-time">' + splittedText[2] + '</span> minutes : ';
    const seconds =
      '<span class="countdown-time">' + splittedText[4] + '</span> seconds ';

    return hours + minutes + seconds;
  }
}
