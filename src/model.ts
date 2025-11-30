import type { DropdownChoice } from '@companion-module/base'

export interface DropdownChoiceExt extends DropdownChoice {
	preset: string
}

// Future: This is written to allow for more models to be defined in the future
export interface ModelDefinition {
	inputCount: number
	outputSolo: number
	outputAudio: number

	displayModes: DropdownChoiceExt[]
	outputFormats: DropdownChoiceExt[]
}

export const MODEL_MULTIVIEW4: ModelDefinition = {
	inputCount: 4,
	outputSolo: 4, // Pad to after the 'inputs'
	outputAudio: 5,

	displayModes: [
		{ id: 'true', label: 'SOLO', preset: 'SOLO' },
		{ id: 'false', label: '2x2', preset: '2x2' },
	],
	outputFormats: [
		{ id: '1080i50', label: '1080i50', preset: '1080i50' },
		{ id: '1080i5994', label: '1080i59.94', preset: '1080i59.94' },
		{ id: '2160p25', label: '2160p25', preset: '2160p25' },
		{ id: '2160p2997', label: '2160p29.97', preset: '2160p29.97' },
	],
}
