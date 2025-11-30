/**
 * INTERNAL: initialize variables.
 *
 * @access protected
 * @since 1.3.0
 */
export function initVariables() {
	var variableDefinitions = []
	var variableValues = {}

	for (var i = 0; i < this.inputCount; i++) {
		if (this.state.getInput(i).status != 'None') {
			variableDefinitions.push({
				name: 'Label of input ' + (i + 1),
				variableId: 'input_' + (i + 1),
			})

			variableValues['input_' + (i + 1)] = this.state.getInput(i).name
		}
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

	this.updateLocalVariables()

	this.setVariableDefinitions(variableDefinitions)
	this.setVariableValues(variableValues)
}

/**
 * INTERNAL: update local variables.
 *
 * These deal with mapping the standard names to the more user-friendly ones
 *
 * @access protected
 * @since 1.3.6
 */
export function updateLocalVariables() {
	var variableValues = {}

	variableValues['solo'] = this.state.getOutputById(this.outputCount).name

	variableValues['solo_input'] = this.state.getInput(this.state.getOutputById(this.outputCount).route).name

	variableValues['audio'] = this.state.getOutputById(this.outputCount + 1).name

	variableValues['solo_audio'] = this.state.getInput(this.state.getOutputById(this.outputCount + 1).route).name

	this.setVariableValues(variableValues)
}
