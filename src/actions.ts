import type { CompanionActionDefinitions } from '@companion-module/base'
import { CHOICES_TRUEFALSE, getInputChoices } from './choices.js'
import type { ModelDefinition } from './model.js'
import type { MultiviewState } from './state.js'

/**
 * INTERNAL: Get the available actions.
 *
 * @returns {Object[]} the available actions
 * @access protected
 * @since 1.3.0
 */
export function getActions(
	state: MultiviewState,
	model: ModelDefinition,
	sendMessage: (msg: string) => Promise<void>,
): CompanionActionDefinitions {
	const inputChoices = getInputChoices(state, model)

	const actions: CompanionActionDefinitions = {}

	actions.mode = {
		name: 'Display Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Display Mode',
				id: 'setting',
				choices: model.displayModes,
				default: 'true',
			},
		],
		callback: async (action) => {
			await sendMessage(`CONFIGURATION:\nSolo enabled: ${action.options.setting}\n\n`)
		},
	}
	actions.audio = {
		name: 'Audio from Input',
		options: [
			{
				type: 'dropdown',
				label: 'Input',
				id: 'inp',
				choices: inputChoices,
				default: 0,
			},
		],
		callback: async (action) => {
			const output = model.outputAudio
			const input = Number(action.options.inp) || 0

			await sendMessage(`VIDEO OUTPUT ROUTING:\n${output} ${input}\n\n`)
		},
	}
	actions.solo = {
		name: 'Solo from Input',
		options: [
			{
				type: 'dropdown',
				label: 'Input',
				id: 'inp',
				choices: inputChoices,
				default: 0,
			},
		],
		callback: async (action) => {
			const output = model.outputSolo
			const input = Number(action.options.inp) || 0

			await sendMessage(`VIDEO OUTPUT ROUTING:\n${output} ${input}\n\n`)
		},
	}
	actions.label = {
		name: 'Input Label',
		options: [
			{
				type: 'textinput',
				label: 'Label',
				id: 'label',
				useVariables: true,
			},
			{
				type: 'dropdown',
				label: 'Input',
				id: 'inp',
				choices: inputChoices,
				default: 0,
			},
		],
		callback: async (action) => {
			const input = Number(action.options.inp) || 0
			const label = String(action.options.label ?? '')

			await sendMessage(`INPUT LABELS:\n${input} ${label}\n\n`)
		},
	}
	actions.set_format = {
		name: 'Set output format',
		options: [
			{
				type: 'dropdown',
				label: 'Format',
				id: 'setting',
				default: '60p',
				choices: model.outputFormats,
			},
		],
		callback: async (action) => {
			const setting = action.options.setting

			await sendMessage(`CONFIGURATION:\nOutput format: ${setting}\n\n`)
		},
	}
	actions.set_border = {
		name: 'Display border',
		options: [
			{
				type: 'dropdown',
				label: 'Value',
				id: 'setting',
				default: 'true',
				choices: CHOICES_TRUEFALSE,
			},
		],
		callback: async (action) => {
			const setting = action.options.setting

			await sendMessage(`CONFIGURATION:\nDisplay border: ${setting}\n\n`)
		},
	}
	actions.set_labels = {
		name: 'Display labels',
		options: [
			{
				type: 'dropdown',
				label: 'Value',
				id: 'setting',
				default: 'true',
				choices: CHOICES_TRUEFALSE,
			},
		],
		callback: async (action) => {
			const setting = action.options.setting

			await sendMessage(`CONFIGURATION:\nDisplay labels: ${setting}\n\n`)
		},
	}
	actions.set_meters = {
		name: 'Display audio meters',
		options: [
			{
				type: 'dropdown',
				label: 'Value',
				id: 'setting',
				default: 'true',
				choices: CHOICES_TRUEFALSE,
			},
		],
		callback: async (action) => {
			const setting = action.options.setting

			await sendMessage(`CONFIGURATION:\nDisplay audio meters: ${setting}\n\n`)
		},
	}
	actions.set_tally = {
		name: 'Display SDI tally',
		options: [
			{
				type: 'dropdown',
				label: 'Value',
				id: 'setting',
				default: 'true',
				choices: CHOICES_TRUEFALSE,
			},
		],
		callback: async (action) => {
			const setting = action.options.setting

			await sendMessage(`CONFIGURATION:\nDisplay SDI tally: ${setting}\n\n`)
		},
	}
	actions.set_widescreen_sd = {
		name: 'Widescreen SD enable',
		options: [
			{
				type: 'dropdown',
				label: 'Value',
				id: 'setting',
				default: 'true',
				choices: CHOICES_TRUEFALSE,
			},
		],
		callback: async (action) => {
			const setting = action.options.setting

			await sendMessage(`CONFIGURATION:\nWidescreen SD enable: ${setting}\nWidescreen SD enabled: ${setting}\n\n`)
		},
	}

	return actions
}
