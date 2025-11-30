import { combineRgb } from '@companion-module/base'

/**
 * INTERNAL: initialize presets.
 *
 * @access protected
 * @since 1.3.0
 */
export function initPresets() {
	let presets = []

	for (var i = 0; i < this.inputCount; i++) {
		presets[`input_${i}_solo`] = {
			category: 'Multiview',
			name: 'Solo: ' + this.state.getInput(i).name + '',
			type: 'button',
			style: {
				text: 'Solo: $(videohub:input_' + (i + 1) + ')',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			feedbacks: [
				{
					feedbackId: 'solo_source',
					style: {
						bgcolor: combineRgb(255, 255, 0),
						color: combineRgb(0, 0, 0),
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
			name: 'Audio: ' + this.state.getInput(i).name + '',
			type: 'button',
			style: {
				text: 'Audio: $(videohub:input_' + (i + 1) + ')',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			feedbacks: [
				{
					feedbackId: 'audio_source',
					style: {
						bgcolor: combineRgb(255, 255, 0),
						color: combineRgb(0, 0, 0),
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

	for (var type in this.PRESETS_SETTINGS) {
		for (var choice in this.PRESETS_SETTINGS[type].choices) {
			presets[`${this.PRESETS_SETTINGS[type].action}_${this.PRESETS_SETTINGS[type].choices[choice].id}`] = {
				category: 'Settings',
				name: this.PRESETS_SETTINGS[type].label + this.PRESETS_SETTINGS[type].choices[choice].preset,
				type: 'button',
				style: {
					text: this.PRESETS_SETTINGS[type].label + this.PRESETS_SETTINGS[type].choices[choice].preset,
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				feedbacks: [
					{
						feedbackId: this.PRESETS_SETTINGS[type].feedback,
						style: {
							bgcolor: combineRgb(255, 255, 0),
							color: combineRgb(0, 0, 0),
						},
						options: {
							setting: this.PRESETS_SETTINGS[type].choices[choice].id,
						},
					},
				],
				steps: [
					{
						down: [
							{
								actionId: this.PRESETS_SETTINGS[type].action,
								options: {
									setting: this.PRESETS_SETTINGS[type].choices[choice].id,
								},
							},
						],
						up: [],
					},
				],
			}
		}
	}

	this.setPresetDefinitions(presets)
}
