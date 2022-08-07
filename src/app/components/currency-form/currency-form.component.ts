import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { CurrencyService } from 'src/app/services/currency.service'
import { Base } from 'src/app/types/currency'

@Component({
	selector: 'app-currency-form',
	templateUrl: './currency-form.component.html',
})
export class CurrencyFormComponent implements OnInit {
	@Input() selectedBase!: Base
	@Input() amount!: number
	@Output() selectBase = new EventEmitter<Base>()
	@Output() changeAmount = new EventEmitter<number>()
	constructor(public currencyService: CurrencyService) {}

	ngOnInit(): void {}
}
