import type { DropdownChoice } from '@companion-module/base'
import type { DropdownChoiceExt, ModelDefinition } from './model.js'
import type { MultiviewState } from './state.js'

export function getInputChoices(state: MultiviewState, model: ModelDefinition): DropdownChoice[] {
	const inputs: DropdownChoice[] = []

	for (let key = 0; key < model.inputCount; key++) {
		inputs.push({ id: key, label: state.getInputName(key) })
	}

	return inputs
}

export const CHOICES_TRUEFALSE: DropdownChoiceExt[] = [
	{ id: 'true', label: 'True', preset: 'On' },
	{ id: 'false', label: 'False', preset: 'Off' },
]
