import type { CompanionVariableDefinition, CompanionVariableValues } from '@companion-module/base'
import type { ModelDefinition } from './model.js'
import type { MultiviewState } from './state.js'

/**
 * INTERNAL: initialize variables.
 */
export function getVariableDefinitions(model: ModelDefinition): CompanionVariableDefinition[] {
	const variableDefinitions: CompanionVariableDefinition[] = []

	for (var i = 0; i < model.inputCount; i++) {
		variableDefinitions.push({
			name: 'Label of input ' + (i + 1),
			variableId: 'input_' + (i + 1),
		})
	}

	variableDefinitions.push({
		name: 'Label of SOLO',
		variableId: 'solo',
	})

	variableDefinitions.push({
		name: 'Label of input routed to SOLO',
		variableId: 'solo_input',
	})

	variableDefinitions.push({
		name: 'Label of AUDIO',
		variableId: 'audio',
	})

	variableDefinitions.push({
		name: 'Label of input routed to AUDIO',
		variableId: 'solo_audio',
	})

	return variableDefinitions
}

/**
 * INTERNAL: get local variables variables.
 *
 * These deal with mapping the standard names to the more user-friendly ones
 */
export function getVariableValues(state: MultiviewState, model: ModelDefinition): CompanionVariableValues {
	const variableValues: CompanionVariableValues = {}

	for (let i = 0; i < model.inputCount; i++) {
		variableValues['input_' + (i + 1)] = state.getInputName(i)
	}

	variableValues['solo'] = state.getOutputName(model.outputSolo) || 'Solo Output' // TODO - is this the correct name?
	variableValues['audio'] = state.getOutputName(model.outputAudio) || 'Audio Output' // TODO - is this the correct name?

	const soloSource = state.getOutputRoute(model.outputSolo)
	variableValues['solo_input'] = soloSource !== undefined ? state.getInputName(soloSource) : ''

	const audioSource = state.getOutputRoute(model.outputAudio)
	variableValues['solo_audio'] = audioSource !== undefined ? state.getInputName(audioSource) : ''

	return variableValues
}
