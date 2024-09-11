import { NgModule } from '@angular/core';
import {
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule,BrowserModule],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
