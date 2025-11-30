import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import { CHOICES_TRUEFALSE, getInputChoices } from './choices.js'
import type { ModelDefinition } from './model.js'
import type { MultiviewState } from './state.js'

/**
 * INTERNAL: initialize feedbacks.
 */
export function getFeedbacks(state: MultiviewState, model: ModelDefinition): CompanionFeedbackDefinitions {
	const inputChoices = getInputChoices(state, model)

	// feedbacks
	const feedbacks: CompanionFeedbackDefinitions = {}

	feedbacks['solo_source'] = {
		type: 'boolean',
		name: 'Solo source',
		description: 'If the input specified is the solo source, give feedback',
		options: [
			{
				type: 'dropdown',
				label: 'Input',
				id: 'input',
				default: '0',
				choices: inputChoices,
			},
		],
		defaultStyle: {
			color: 0x000000,
			bgcolor: 0xffff00,
		},
		callback: (feedback) => {
			return state.getOutputRoute(model.outputSolo) === Number(feedback.options.input)
		},
	}

	feedbacks['audio_source'] = {
		type: 'boolean',
		name: 'Audio source',
		description: 'If the input specified is the audio source, give feedback',
		options: [
			{
				type: 'dropdown',
				label: 'Input',
				id: 'input',
				default: '0',
				choices: inputChoices,
			},
		],
		defaultStyle: {
			color: 0x000000,
			bgcolor: 0xffff00,
		},
		callback: (feedback) => {
			return state.getOutputRoute(model.outputAudio) === Number(feedback.options.input)
		},
	}

	feedbacks['output_format'] = {
		type: 'boolean',
		name: 'Output format',
		description: 'If the output format specified is in use, give feedback',
		options: [
			{
				type: 'dropdown',
				label: 'Format',
				id: 'setting',
				default: '0',
				choices: model.outputFormats,
			},
		],
		defaultStyle: {
			color: 0x000000,
			bgcolor: 0xffff00,
		},
		callback: (feedback) => {
			return state.configuration.outputFormat == feedback.options.setting
		},
	}

	feedbacks['solo_enabled'] = {
		type: 'boolean',
		name: 'Solo enable state',
		description: 'If the solo enable state specified is active, give feedback',
		options: [
			{
				type: 'dropdown',
				label: 'Value',
				id: 'setting',
				default: '0',
				choices: CHOICES_TRUEFALSE,
			},
		],
		defaultStyle: {
			color: 0x000000,
			bgcolor: 0xffff00,
		},
		callback: (feedback) => {
			return state.configuration.soloEnabled == (feedback.options.setting === 'true')
		},
	}

	feedbacks['widescreen_sd'] = {
		type: 'boolean',
		name: 'Widescreen SD enable state',
		description: 'If the widescreen SD enable state specified is active, give feedback',
		options: [
			{
				type: 'dropdown',
				label: 'Value',
				id: 'setting',
				default: '0',
				choices: CHOICES_TRUEFALSE,
			},
		],
		defaultStyle: {
			color: 0x000000,
			bgcolor: 0xffff00,
		},
		callback: (feedback) => {
			return state.configuration.widescreenSD == (feedback.options.setting === 'true')
		},
	}

	feedbacks['display_border'] = {
		type: 'boolean',
		name: 'Display border state',
		description: 'If the display border state specified is active, give feedback',
		options: [
			{
				type: 'dropdown',
				label: 'Value',
				id: 'setting',
				default: '0',
				choices: CHOICES_TRUEFALSE,
			},
		],
		defaultStyle: {
			color: 0x000000,
			bgcolor: 0xffff00,
		},
		callback: (feedback) => {
			return state.configuration.displayBorder == (feedback.options.setting === 'true')
		},
	}

	feedbacks['display_labels'] = {
		type: 'boolean',
		name: 'Display labels state',
		description: 'If the display labels state specified is active, give feedback',
		options: [
			{
				type: 'dropdown',
				label: 'Value',
				id: 'setting',
				default: '0',
				choices: CHOICES_TRUEFALSE,
			},
		],
		defaultStyle: {
			color: 0x000000,
			bgcolor: 0xffff00,
		},
		callback: (feedback) => {
			return state.configuration.displayLabels == (feedback.options.setting === 'true')
		},
	}

	feedbacks['display_meters'] = {
		type: 'boolean',
		name: 'Display audio meters state',
		description: 'If the display audio meters state specified is active, give feedback',
		options: [
			{
				type: 'dropdown',
				label: 'Value',
				id: 'setting',
				default: '0',
				choices: CHOICES_TRUEFALSE,
			},
		],
		defaultStyle: {
			color: 0x000000,
			bgcolor: 0xffff00,
		},
		callback: (feedback) => {
			return state.configuration.displayMeters == (feedback.options.setting === 'true')
		},
	}

	feedbacks['display_tally'] = {
		type: 'boolean',
		name: 'Display SDI tally state',
		description: 'If the display SDI tally state specified is active, give feedback',
		options: [
			{
				type: 'dropdown',
				label: 'Value',
				id: 'setting',
				default: '0',
				choices: CHOICES_TRUEFALSE,
			},
		],
		defaultStyle: {
			color: 0x000000,
			bgcolor: 0xffff00,
		},
		callback: (feedback) => {
			return state.configuration.displayTally == (feedback.options.setting === 'true')
		},
	}

	return feedbacks
}
