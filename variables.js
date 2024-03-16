module.exports = {
	/**
	 * INTERNAL: initialize variables.
	 *
	 * @access protected
	 * @since 1.3.0
	 */
	initVariables() {
		var variables = []

		for (var i = 0; i < this.inputCount; i++) {
			if (this.getInput(i).status != 'None') {
				variables.push({
					label: 'Label of input ' + (i + 1),
					name: 'input_' + (i + 1),
				})

				this.setVariable('input_' + (i + 1), this.getInput(i).name)
			}
		}

		variables.push({
			label: 'Label of SOLO',
			name: 'solo',
		})

		variables.push({
			label: 'Label of input routed to SOLO',
			name: 'solo_input',
		})

		variables.push({
			label: 'Label of AUDIO',
			name: 'audio',
		})

		variables.push({
			label: 'Label of input routed to AUDIO',
			name: 'solo_audio',
		})

		this.updateLocalVariables()

		this.setVariableDefinitions(variables)
	},

	/**
	 * INTERNAL: update local variables.
	 *
	 * These deal with mapping the standard names to the more user-friendly ones
	 *
	 * @access protected
	 * @since 1.3.6
	 */
	updateLocalVariables() {
		this.setVariable('solo', this.getOutput(this.outputCount).name)

		this.setVariable('solo_input', this.getInput(this.getOutput(this.outputCount).route).name)

		this.setVariable('audio', this.getOutput(this.outputCount + 1).name)

		this.setVariable('solo_audio', this.getInput(this.getOutput(this.outputCount + 1).route).name)
	},
}
