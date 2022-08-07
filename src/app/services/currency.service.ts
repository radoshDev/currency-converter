import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { delay, tap } from 'rxjs'
import { Base, Currency, CurrencyResponse, Rates } from '../types/currency'

const baseUrl = 'https://api.exchangeratesapi.io/v1/latest'

@Injectable({
	providedIn: 'root',
})
export class CurrencyService {
	private _currencies: Currency[] = []
	private _rates: Rates = {} as Rates
	private _inputAmount: number = 1
	private _outputAmount: number = 1
	private _inputBase: Base = 'EUR'
	private _outputBase: Base = 'UAH'

	constructor(private http: HttpClient) {}

	get currencies() {
		return this._currencies
	}
	get rates() {
		return this._rates
	}
	get inputAmount() {
		return this._inputAmount
	}
	set inputAmount(amount) {
		this._inputAmount = Number(amount.toFixed(2))
	}
	get outputAmount() {
		return this._outputAmount
	}
	set outputAmount(amount) {
		this._outputAmount = Number(amount.toFixed(2))
	}
	get inputBase() {
		return this._inputBase
	}
	get outputBase() {
		return this._outputBase
	}

	setInputAmount(amount: number) {
		const outputRate = this.getSpecificRate(this.inputBase, this.outputBase)
		this.inputAmount = amount / outputRate
	}
	setOutputAmount(amount: number) {
		const outputRate = this.getSpecificRate(this.inputBase, this.outputBase)
		this.outputAmount = amount * outputRate
	}

	setInputBase(base: Base) {
		const rate = this.getSpecificRate(base, this.outputBase)
		console.log(rate)

		this._inputBase = base
		this.outputAmount = this._inputAmount * rate
	}

	setOutputBase(base: Base) {
		const rate = this.getSpecificRate(this.inputBase, base)
		console.log(rate)

		this._outputBase = base
		this.outputAmount = this._inputAmount * rate
	}

	getAllRates(base: Base) {
		return this.http
			.get<CurrencyResponse>(baseUrl, {
				params: new HttpParams({
					fromObject: {
						access_key: 'c19a56915081430533df0a783e103977',
						base,
					},
				}),
			})
			.pipe(
				delay(500),
				tap(res => {
					this._currencies = this.mappedCurrency(res.rates)
					this._rates = res.rates
					this.outputAmount = this.getSpecificRate(base, 'UAH')
				})
			)
	}

	getSpecificRate(inputBase: Base, outputBase: Base): number {
		return (this.rates.EUR / this.rates[inputBase]) * this.rates[outputBase]
	}

	private mappedCurrency(rates: Rates): Currency[] {
		return (Object.keys(rates) as Base[]).map((base: Base) => ({
			base,
			amount: rates[base],
		}))
	}
}
