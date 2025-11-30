export class MultiviewState {
	readonly configuration: MultiviewConfiguration

	#inputNames = new Map<number, string>()
	#outputNames = new Map<number, string>()
	#outputRouting = new Map<number, number>()

	constructor() {
		this.configuration = {
			layout: '2x2',
			outputFormat: '60i',
			soloEnabled: false,
			widescreenSD: true,
			displayBorder: true,
			displayLabels: true,
			displayMeters: true,
			displayTally: true,
		}
	}

	/**
	 * Get the name of an input.
	 * Zero-based input number.
	 */
	getInputName(input: number): string {
		return this.#inputNames.get(input) || `Input ${input + 1}`
	}
	getOutputName(output: number): string | undefined {
		return this.#outputNames.get(output)
	}

	getOutputRoute(output: number): number | undefined {
		return this.#outputRouting.get(output)
	}

	//

	storeInputLabel(num: number, label: string) {
		this.#inputNames.set(num, label)
	}
	storeOutputLabel(num: number, label: string) {
		this.#outputNames.set(num, label)
	}
	storeOutputRoute(dest: number, src: number) {
		this.#outputRouting.set(dest, src)
	}
}

export interface MultiviewConfiguration {
	layout: string
	outputFormat: string
	soloEnabled: boolean
	widescreenSD: boolean
	displayBorder: boolean
	displayLabels: boolean
	displayMeters: boolean
	displayTally: boolean
}
