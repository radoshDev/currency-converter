import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { AppComponent } from './components/app.component'
import { HeaderComponent } from './components/header/header.component'
import { CardComponent } from './components/card/card.component'
import { CurrencyFormComponent } from './components/currency-form/currency-form.component'
import { FormsModule } from '@angular/forms'

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		CardComponent,
		CurrencyFormComponent,
	],
	imports: [BrowserModule, FormsModule, HttpClientModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
