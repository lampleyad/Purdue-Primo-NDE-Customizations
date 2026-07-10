import {ApplicationRef, DoBootstrap, Injector, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {createCustomElement, NgElementConstructor} from "@angular/elements";
import {Router} from "@angular/router";
import {selectorComponentMap} from "./custom1-module/customComponentMappings";
import {TranslateModule} from "@ngx-translate/core";
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { AutoAssetSrcDirective } from './services/auto-asset-src.directive';
import {SHELL_ROUTER} from "./injection-tokens";

// Configuration for the HathiTrust availability component (src/app/hathi-trust).
// In add-on mode Alma would supply MODULE_PARAMETERS; as a customization
// package we provide it here. See src/app/hathi-trust/README.md for options.
const hathiTrustParameters = {
  disableWhenAvailableOnline: true,
  disableForJournals: false,
  ignoreCopyright: false,
  matchOn: {
    oclc: true,
    isbn: false,
    issn: false
  }
};

export const AppModule = ({providers, shellRouter}: {providers:any, shellRouter: Router}) => {
   @NgModule({
    declarations: [
      AppComponent,
      AutoAssetSrcDirective
    ],
    exports: [AutoAssetSrcDirective],
    imports: [
      BrowserModule,
      CommonModule,
      TranslateModule.forRoot({})
    ],
    providers: [
      ...providers,
      {provide: SHELL_ROUTER, useValue: shellRouter},
      provideHttpClient(),
      {provide: 'MODULE_PARAMETERS', useValue: hathiTrustParameters}
    ],
    bootstrap: []
  })
  class AppModule implements DoBootstrap{
    private webComponentSelectorMap = new Map<string,  NgElementConstructor<unknown>>();

    constructor(private injector: Injector, private router: Router) {
      router.dispose(); //this prevents the router from being initialized and interfering with the shell app router
    }

    ngDoBootstrap(appRef: ApplicationRef) {
      for (const [key, value] of selectorComponentMap) {
        const customElement = createCustomElement(value, {injector: this.injector});
        this.webComponentSelectorMap.set(key, customElement);
      }
    }

    /**
     * Use componentMapping, selectorComponentMap
     * @param componentName
     */
    public getComponentRef(componentName:string) {
      return this.webComponentSelectorMap.get(componentName);
    }
  }
  return AppModule
}

