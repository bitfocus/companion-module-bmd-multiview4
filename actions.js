/**
 * INTERNAL: Get the available actions.
 *
 * @returns {Object[]} the available actions
 * @access protected
 * @since 1.3.0
 */
export function getActions() {
	let actions = {}
	actions.mode = {
		name: 'Display Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Display Mode',
				id: 'setting',
				choices: this.CHOICES_DISPLAYMODE,
				default: 'true',
			},
		],
		callback: async (action) => {
			await this.action(action)
		},
	}
	actions.audio = {
		name: 'Audio from Input',
		options: [
			{
				type: 'dropdown',
				label: 'Input',
				id: 'inp',
				choices: this.CHOICES_INPUTS,
				default: 0,
			},
		],
		callback: async (action) => {
			await this.action(action)
		},
	}
	actions.solo = {
		name: 'Solo from Input',
		options: [
			{
				type: 'dropdown',
				label: 'Input',
				id: 'inp',
				choices: this.CHOICES_INPUTS,
				default: 0,
			},
		],
		callback: async (action) => {
			await this.action(action)
		},
	}
	actions.label = {
		name: 'Input Label',
		options: [
			{
				type: 'textinput',
				label: 'Label',
				id: 'label',
			},
			{
				type: 'dropdown',
				label: 'Input',
				id: 'inp',
				choices: this.CHOICES_INPUTS,
				default: 0,
			},
		],
		callback: async (action) => {
			await this.action(action)
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
				choices: this.CHOICES_OUTPUTFORMAT,
			},
		],
		callback: async (action) => {
			await this.action(action)
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
				choices: this.CHOICES_TRUEFALSE,
			},
		],
		callback: async (action) => {
			await this.action(action)
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
				choices: this.CHOICES_TRUEFALSE,
			},
		],
		callback: async (action) => {
			await this.action(action)
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
				choices: this.CHOICES_TRUEFALSE,
			},
		],
		callback: async (action) => {
			await this.action(action)
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
				choices: this.CHOICES_TRUEFALSE,
			},
		],
		callback: async (action) => {
			await this.action(action)
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
				choices: this.CHOICES_TRUEFALSE,
			},
		],
		callback: async (action) => {
			await this.action(action)
		},
	}

	return actions
}
