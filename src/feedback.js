import { combineRgb } from '@companion-module/base'

/**
 * INTERNAL: initialize feedbacks.
 *
 * @access protected
 * @since 1.3.0
 */
export function initFeedbacks() {
	// feedbacks
	var feedbacks = []

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
				choices: this.CHOICES_INPUTS,
			},
		],
		defaultStyle: {
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		},
		callback: (feedback, bank) => {
			return this.state.getOutputById(this.outputCount).route == parseInt(feedback.options.input)
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
				choices: this.CHOICES_INPUTS,
			},
		],
		defaultStyle: {
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		},
		callback: (feedback, bank) => {
			return this.state.getOutputById(this.outputCount + 1).route == parseInt(feedback.options.input)
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
				choices: this.CHOICES_OUTPUTFORMAT,
			},
		],
		defaultStyle: {
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		},
		callback: (feedback, bank) => {
			return this.getConfig().outputFormat == feedback.options.setting
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
				choices: this.CHOICES_TRUEFALSE,
			},
		],
		defaultStyle: {
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		},
		callback: (feedback, bank) => {
			return this.getConfig().soloEnabled == feedback.options.setting
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
				choices: this.CHOICES_TRUEFALSE,
			},
		],
		defaultStyle: {
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		},
		callback: (feedback, bank) => {
			return this.getConfig().widescreenSD == feedback.options.setting
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
				choices: this.CHOICES_TRUEFALSE,
			},
		],
		defaultStyle: {
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		},
		callback: (feedback, bank) => {
			return this.getConfig().displayBorder == feedback.options.setting
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
				choices: this.CHOICES_TRUEFALSE,
			},
		],
		defaultStyle: {
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		},
		callback: (feedback, bank) => {
			return this.getConfig().displayLabels == feedback.options.setting
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
				choices: this.CHOICES_TRUEFALSE,
			},
		],
		defaultStyle: {
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		},
		callback: (feedback, bank) => {
			return this.getConfig().displayMeters == feedback.options.setting
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
				choices: this.CHOICES_TRUEFALSE,
			},
		],
		defaultStyle: {
			color: combineRgb(0, 0, 0),
			bgcolor: combineRgb(255, 255, 0),
		},
		callback: (event) => {
			return this.getConfig().displayTally == event.options.setting
		},
	}

	this.setFeedbackDefinitions(feedbacks)
}
