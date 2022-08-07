import { Component } from '@angular/core'
import { CurrencyService } from '../services/currency.service'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent {
	constructor(public currencyService: CurrencyService) {}
}
