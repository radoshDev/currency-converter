import { Component, OnInit } from '@angular/core'
import { CurrencyService } from 'src/app/services/currency.service'
import { Base, Currency, Rates } from 'src/app/types/currency'

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
	currencies: (Currency & { symbol: string })[] = [
		{ base: 'USD', symbol: '$', amount: 0 },
		{ base: 'EUR', symbol: '€', amount: 0 },
	]
	constructor(public currencyService: CurrencyService) {}

	ngOnInit(): void {
		this.currencyService.getAllRates('EUR').subscribe(res => {
			this.setCurrency('EUR', res.rates)
			this.setCurrency('USD', res.rates)
		})
	}
	setCurrency(base: Base, rates: Rates): void {
		const currency = this.currencies.find(currency => currency.base === base)
		if (currency) {
			currency.amount = (rates.EUR / rates[base]) * rates.UAH
		}
	}
}
