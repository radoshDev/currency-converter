import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, delay, tap, throwError } from 'rxjs'
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
	isLoading = false
	errorMessage = ''
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

	handleInputAmount(amount: number) {
		const rate = this.getSpecificRate(this.inputBase, this.outputBase)
		if (!amount) amount = 0
		this.inputAmount = amount
		this.outputAmount = amount * rate
	}
	handleOutputAmount(amount: number) {
		const rate = this.getSpecificRate(this.inputBase, this.outputBase)
		if (!amount) amount = 0
		this.outputAmount = amount
		this.inputAmount = amount / rate
	}

	handleInputBase(base: Base) {
		const rate = this.getSpecificRate(base, this.outputBase)

		this._inputBase = base
		this.outputAmount = this.inputAmount * rate
	}

	handleOutputBase(base: Base) {
		const rate = this.getSpecificRate(this.inputBase, base)

		this._outputBase = base
		this.outputAmount = this.inputAmount * rate
	}

	getAllRates(base: Base) {
		this.isLoading = true
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
					this.isLoading = false
					this.errorMessage = ''
				}),
				catchError(this.errorHandler.bind(this))
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

	private errorHandler(error: HttpErrorResponse) {
		this.errorMessage = 'Problem to load service. Try again later.'
		this.isLoading = false
		return throwError(() => error.message)
	}
}
