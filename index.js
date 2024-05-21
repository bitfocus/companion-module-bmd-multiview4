import { InstanceBase, InstanceStatus, TCPHelper, Regex, runEntrypoint } from '@companion-module/base'
import * as actions from './actions.js'
import * as feedback from './feedback.js'
import * as presets from './presets.js'
import * as variables from './variables.js'

import { updateLabels, updateRouting } from './dist/internalAPI.js'
import { VideohubState } from './dist/state.js'

const TCPSocket = TCPHelper

/**
 * Companion instance class for the Blackmagic MultiView 4.
 *
 * @extends InstanceBase
 * @version 2.0.0
 * @since 2.0.0
 * @author Per Røine <per.roine@gmail.com>
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 */
class Multiview4Instance extends InstanceBase {
	/**
	 * Create an instance of a multiview 4 module.
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @param {string} id - the instance ID
	 * @param {Object} config - saved user configuration parameters
	 * @since 1.0.0
	 */
	constructor(instance) {
		super(instance)

		this.log('error', 'Setting actions')

		this.stash = []
		this.command = null
		this.deviceName = ''

		Object.assign(this, {
			...actions,
			...feedback,
			...presets,
			...variables,
			//...internal_api,
		})

		this.inputs = {}
		this.outputs = {}

		this.inputCount = 4
		this.outputCount = 4
		this.monitoringCount = 0
		this.serialCount = 0

		this.state = new VideohubState()

		this.CHOICES_INPUTS = []
		this.CHOICES_OUTPUTS = []

		this.CHOICES_DISPLAYMODE = [
			{ id: 'true', label: 'SOLO', preset: 'SOLO' },
			{ id: 'false', label: '2x2', preset: '2x2' },
		]

		this.CHOICES_OUTPUTFORMAT = [
			{ id: '50i', label: '50i', preset: '50i' },
			{ id: '50p', label: '50p', preset: '50p' },
			{ id: '60i', label: '60i', preset: '60i' },
			{ id: '60p', label: '60p', preset: '60p' },
			{ id: '1080i50', label: '1080i50', preset: '1080i50' },
			{ id: '1080i5994', label: '1080i59.94', preset: '1080i59.94' },
			{ id: '2160p25', label: '2160p25', preset: '2160p25' },
			{ id: '2160p2997', label: '2160p29.97', preset: '2160p29.97' },
		]

		this.CHOICES_TRUEFALSE = [
			{ id: 'true', label: 'True', preset: 'On' },
			{ id: 'false', label: 'False', preset: 'Off' },
		]

		this.PRESETS_SETTINGS = [
			{ action: 'mode', feedback: 'solo_enabled', label: 'Display Mode ', choices: this.CHOICES_DISPLAYMODE },
			{ action: 'set_format', feedback: 'output_format', label: 'Output Format: ', choices: this.CHOICES_OUTPUTFORMAT },
			{ action: 'set_border', feedback: 'display_border', label: 'Borders ', choices: this.CHOICES_TRUEFALSE },
			{ action: 'set_labels', feedback: 'display_labels', label: 'Labels ', choices: this.CHOICES_TRUEFALSE },
			{ action: 'set_meters', feedback: 'display_meters', label: 'Audio Meters ', choices: this.CHOICES_TRUEFALSE },
			{ action: 'set_tally', feedback: 'display_tally', label: 'Tally ', choices: this.CHOICES_TRUEFALSE },
			{
				action: 'set_widescreen_sd',
				feedback: 'widescreen_sd',
				label: 'Widescreen SD ',
				choices: this.CHOICES_TRUEFALSE,
			},
		]

		this.actions() // export actions
	}

	configUpdated(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Connecting)
		this.init_tcp()
	}

	/**
	 * Setup the actions.
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @access public
	 * @since 1.0.0
	 */
	actions(system) {
		this.setupChoices()

		this.setActionDefinitions(this.getActions())
	}

	/**
	 * Executes the provided action.
	 *
	 * @param {Object} action - the action to be executed
	 * @access public
	 * @since 1.0.0
	 */
	action(action) {
		var cmd
		var opt = action.options

		switch (action.actionId) {
			case 'mode':
				cmd = 'CONFIGURATION:\n' + 'Solo enabled: ' + opt.setting + '\n\n'
				break
			case 'audio':
				cmd = 'VIDEO OUTPUT ROUTING:\n' + (this.outputCount + 1) + ' ' + opt.inp + '\n\n'
				break
			case 'solo':
				cmd = 'VIDEO OUTPUT ROUTING:\n' + this.outputCount + ' ' + opt.inp + '\n\n'
				break
			case 'label':
				let label = opt.label
				this.parseVariables(label, function (value) {
					label = value
				})
				cmd = 'INPUT LABELS:\n' + opt.inp + ' ' + label + '\n\n'
				break
			case 'set_format':
				cmd = 'CONFIGURATION:\n' + 'Output format: ' + opt.setting + '\n\n'
				break
			case 'set_border':
				cmd = 'CONFIGURATION:\n' + 'Display border: ' + opt.setting + '\n\n'
				break
			case 'set_labels':
				cmd = 'CONFIGURATION:\n' + 'Display labels: ' + opt.setting + '\n\n'
				break
			case 'set_meters':
				cmd = 'CONFIGURATION:\n' + 'Display audio meters: ' + opt.setting + '\n\n'
				break
			case 'set_tally':
				cmd = 'CONFIGURATION:\n' + 'Display SDI tally: ' + opt.setting + '\n\n'
				break
			case 'set_widescreen_sd':
				cmd =
					'CONFIGURATION:\n' +
					'Widescreen SD enable: ' +
					opt.setting +
					'\n' +
					'Widescreen SD enabled: ' +
					opt.setting +
					'\n\n'
				break
			default:
				this.log('error', 'Unknown action: ' + action.actionId)
		}

		if (cmd !== undefined) {
			if (this.socket !== undefined && this.socket.isConnected) {
				this.socket.send(cmd)
			} else {
				this.log('error', 'Socket not connected :(')
			}
		}
	}

	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 1.0.0
	 */
	getConfigFields() {
		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module will connect to any Blackmagic Design MultiView 4 Device.',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'MultiView IP',
				width: 6,
				regex: this.REGEX_IP,
			},
		]
	}

	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy()
		}

		this.log('debug', 'destroy ' + this.id)
	}

	/**
	 * INTERNAL: returns the device config object.
	 *
	 * @returns {Object} the device config object
	 * @access protected
	 * @since 1.3.0
	 */
	getConfig() {
		if (this.configuration === undefined) {
			this.configuration = {
				layout: '2x2',
				outputFormat: '60i',
				soloEnabled: 'false',
				widescreenSD: 'true',
				displayBorder: 'true',
				displayLabels: 'true',
				displayMeters: 'true',
				displayTally: 'true',
			}
		}

		return this.configuration
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	async init(config) {
		this.config = config

		this.actions() // export actions
		this.initVariables()
		this.initFeedbacks()
		this.initPresets()

		this.init_tcp()
	}

	/**
	 * INTERNAL: use setup data to initalize the tcp socket object.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	init_tcp() {
		var receivebuffer = ''

		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
		}

		if (this.config.port === undefined) {
			this.config.port = 9990
		}

		if (this.config.host) {
			this.socket = new TCPSocket(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.log('error', status + ': ' + message)
			})

			this.socket.on('end', () => {
				this.log('debug', 'Connection closed')
			})

			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', 'Network error: ' + err.message)
			})

			this.socket.on('connect', () => {
				this.updateStatus(InstanceStatus.Ok)
				this.log('debug', 'Connected')
			})

			// separate buffered stream into lines with responses
			this.socket.on('data', (chunk) => {
				var i = 0,
					line = '',
					offset = 0
				receivebuffer += chunk

				while ((i = receivebuffer.indexOf('\n', offset)) !== -1) {
					line = receivebuffer.substr(offset, i - offset)
					offset = i + 1
					this.socket.emit('receiveline', line.toString())
				}

				receivebuffer = receivebuffer.substr(offset)
			})

			this.socket.on('receiveline', (line) => {
				if (this.command === null && line.match(/:/)) {
					this.command = line
				} else if (this.command !== null && line.length > 0) {
					this.stash.push(line.trim())
				} else if (line.length === 0 && this.command !== null) {
					var cmd = this.command.trim().split(/:/)[0]

					this.processVideohubInformation(cmd, this.stash)

					this.stash = []
					this.command = null
				} else {
					this.log('debug', 'weird response from videohub ' + line + ' - ' + line.length)
				}
			})
		} else {
			this.log('error', "Didn't get a target to connect to")
			this.updateStatus(InstanceStatus.Disconnected)
		}
	}

	/**
	 * INTERNAL: Routes incoming data to the appropriate function for processing.
	 *
	 * @param {string} key - the command/data type being passed
	 * @param {Object} data - the collected data
	 * @access protected
	 * @since 1.3.0
	 */
	processVideohubInformation(key, data) {
		if (key.match(/(INPUT|OUTPUT) LABELS/)) {
			updateLabels(this, this.state, key, data)

			// Update our local variables in case a label has changed
			this.updateLocalVariables()

			this.actions()
			this.initFeedbacks()
			this.initPresets()
		} else if (key.match(/VIDEO OUTPUT ROUTING/)) {
			updateRouting(this, this.state, key, data)

			// Update our local variables in case a label has changed
			this.updateLocalVariables()

			this.checkFeedbacks('input_bg')
			this.checkFeedbacks('solo_source')
			this.checkFeedbacks('audio_source')
		} else if (key.match(/VIDEO OUTPUT LOCKS/)) {
			//this.updateLocks(key, data)
		} else if (key.match(/(VIDEO INPUT|VIDEO OUTPUT) STATUS/)) {
			this.updateStatus(key, data)
			this.actions()
			this.initFeedbacks()
			this.initPresets()
		} else if (key == 'MULTIVIEW DEVICE') {
			this.updateDevice(key, data)
			this.actions()
			this.initVariables()
			this.initFeedbacks()
			this.initPresets()
		} else if (key == 'CONFIGURATION') {
			this.updateDeviceConfig(key, data)
		} else {
			// TODO: find out more about the video hub from stuff that comes in here
		}
	}

	/**
	 * INTERNAL: use model data to define the choices for the dropdowns.
	 *
	 * @access protected
	 * @since 1.3.0
	 */
	setupChoices() {
		this.CHOICES_INPUTS = []
		this.CHOICES_OUTPUTS = []

		if (this.inputCount > 0) {
			for (var key = 0; key < this.inputCount; key++) {
				if (this.state.getInput(key).status != 'None') {
					this.CHOICES_INPUTS.push({ id: key, label: this.state.getInput(key).label })
				}
			}
		}

		if (this.outputCount > 0) {
			for (var key = 0; key < this.outputCount; key++) {
				if (this.state.getOutputById(key).status != 'None') {
					this.CHOICES_OUTPUTS.push({ id: key, label: this.state.getOutputById(key).label })
				}
			}
		}
	}

	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 1.0.0
	 */
	updateConfig(config) {
		var resetConnection = false

		if (this.config.host != config.host) {
			resetConnection = true
		}

		this.config = config

		this.actions()
		this.initFeedbacks()
		this.initVariables()

		if (resetConnection === true || this.socket === undefined) {
			this.init_tcp()
		}
	}

	/**
	 * INTERNAL: Updates device data from the Videohub
	 *
	 * @param {string} labeltype - the command/data type being passed
	 * @param {Object} object - the collected data
	 * @access protected
	 * @since 1.3.0
	 */
	updateDevice(labeltype, object) {
		for (var key in object) {
			var parsethis = object[key]
			var a = parsethis.split(/: /)
			var attribute = a.shift()
			var value = a.join(' ')

			switch (attribute) {
				case 'Model name':
					this.deviceName = value
					this.log('info', 'Connected to a ' + this.deviceName)
					break
			}
		}

		this.saveConfig()
	}

	/**
	 * INTERNAL: Updates device data from the Videohub
	 *
	 * @param {string} labeltype - the command/data type being passed
	 * @param {Object} object - the collected data
	 * @access protected
	 * @since 1.3.0
	 */
	updateDeviceConfig(labeltype, object) {
		for (var key in object) {
			var parsethis = object[key]
			var a = parsethis.split(/: /)
			var attribute = a.shift()
			var value = a.join(' ')

			switch (attribute) {
				case 'Layout':
					this.getConfig().layout = value
					this.checkFeedbacks('layout')
					break
				case 'Output format':
					this.getConfig().outputFormat = value
					this.checkFeedbacks('output_format')
					break
				case 'Solo enabled':
					this.getConfig().soloEnabled = value
					this.checkFeedbacks('solo_enabled')
					break
				case 'Widescreen SD enable':
				// Fallthrough, to handle both possible names
				case 'Widescreen SD enabled':
					this.getConfig().widescreenSD = value
					this.checkFeedbacks('widescreen_sd')
					break
				case 'Display border':
					this.getConfig().displayBorder = value
					this.checkFeedbacks('display_border')
					break
				case 'Display labels':
					this.getConfig().displayLabels = value
					this.checkFeedbacks('display_labels')
					break
				case 'Display audio meters':
					this.getConfig().displayMeters = value
					this.checkFeedbacks('display_meters')
					break
				case 'Display SDI tally':
					this.getConfig().displayTally = value
					this.checkFeedbacks('display_tally')
					break
			}
		}
	}
}

runEntrypoint(Multiview4Instance, [])
