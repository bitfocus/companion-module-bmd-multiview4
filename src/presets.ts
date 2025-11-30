import type { CompanionPresetDefinitions } from '@companion-module/base'
import type { ModelDefinition } from './model.js'
import type { MultiviewState } from './state.js'
import { CHOICES_TRUEFALSE } from './choices.js'

/**
 * INTERNAL: initialize presets.
 */
export function getPresetDefinitions(state: MultiviewState, model: ModelDefinition): CompanionPresetDefinitions {
	const presets: CompanionPresetDefinitions = {}

	const PRESETS_SETTINGS = [
		{ action: 'mode', feedback: 'solo_enabled', label: 'Display Mode ', choices: model.displayModes },
		{ action: 'set_format', feedback: 'output_format', label: 'Output Format: ', choices: model.outputFormats },
		{ action: 'set_border', feedback: 'display_border', label: 'Borders ', choices: CHOICES_TRUEFALSE },
		{ action: 'set_labels', feedback: 'display_labels', label: 'Labels ', choices: CHOICES_TRUEFALSE },
		{ action: 'set_meters', feedback: 'display_meters', label: 'Audio Meters ', choices: CHOICES_TRUEFALSE },
		{ action: 'set_tally', feedback: 'display_tally', label: 'Tally ', choices: CHOICES_TRUEFALSE },
		{
			action: 'set_widescreen_sd',
			feedback: 'widescreen_sd',
			label: 'Widescreen SD ',
			choices: CHOICES_TRUEFALSE,
		},
	]

	for (var i = 0; i < model.inputCount; i++) {
		const inputName = state.getInputName(i)

		presets[`input_${i}_solo`] = {
			category: 'Multiview',
			name: `Solo: ${inputName}`,
			type: 'button',
			style: {
				text: `Solo: $(videohub:input_${i + 1})`,
				size: '14',
				color: 0xffffff,
				bgcolor: 0x000000,
			},
			feedbacks: [
				{
					feedbackId: 'solo_source',
					style: {
						bgcolor: 0xffff00,
						color: 0x000000,
					},
					options: {
						input: i,
					},
				},
			],
			steps: [
				{
					down: [
						{
							actionId: 'solo',
							options: {
								inp: i,
							},
						},
					],
					up: [],
				},
			],
		}
		presets[`input_${i}_audio`] = {
			category: 'Multiview',
			name: `Audio: ${inputName}`,
			type: 'button',
			style: {
				text: `Audio: $(videohub:input_${i + 1})`,
				size: '14',
				color: 0xffffff,
				bgcolor: 0x000000,
			},
			feedbacks: [
				{
					feedbackId: 'audio_source',
					style: {
						bgcolor: 0xffff00,
						color: 0x000000,
					},
					options: {
						input: i,
					},
				},
			],
			steps: [
				{
					down: [
						{
							actionId: 'audio',
							options: {
								inp: i,
							},
						},
					],
					up: [],
				},
			],
		}
	}

	for (const presetSettings of PRESETS_SETTINGS) {
		for (const choice of presetSettings.choices) {
			presets[`${presetSettings.action}_${choice.id}`] = {
				category: 'Settings',
				name: presetSettings.label + choice.preset,
				type: 'button',
				style: {
					text: presetSettings.label + choice.preset,
					size: '14',
					color: 0xffffff,
					bgcolor: 0x000000,
				},
				feedbacks: [
					{
						feedbackId: presetSettings.feedback,
						style: {
							bgcolor: 0xffff00,
							color: 0x000000,
						},
						options: {
							setting: choice.id,
						},
					},
				],
				steps: [
					{
						down: [
							{
								actionId: presetSettings.action,
								options: {
									setting: choice.id,
								},
							},
						],
						up: [],
					},
				],
			}
		}
	}

	return presets
}
