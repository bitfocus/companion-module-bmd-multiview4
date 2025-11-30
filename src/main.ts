import { InstanceBase, InstanceStatus, TCPHelper, runEntrypoint } from '@companion-module/base'
import { MODEL_MULTIVIEW4, type ModelDefinition } from './model.js'
import { getFeedbacks } from './feedback.js'
import { getPresetDefinitions } from './presets.js'
import { getConfigFields, type MultiviewConfig } from './config.js'
import { getActions } from './actions.js'
import { getVariableDefinitions, getVariableValues } from './variables.js'
import { MultiviewState } from './state.js'

interface IpAndPort {
	ip: string
	port: number | undefined
}

/**
 * Companion instance class for the Blackmagic MultiView 4.
 *
 * @extends InstanceBase
 * @version 2.0.0
 * @since 2.0.0
 * @author Per Røine <per.roine@gmail.com>
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 */
class Multiview4Instance extends InstanceBase<MultiviewConfig> {
	readonly #state = new MultiviewState()

	#socket: TCPHelper | undefined

	#model: ModelDefinition = MODEL_MULTIVIEW4
	#config: MultiviewConfig = {}

	/**
	 * Creates the configuration fields for web config.
	 */
	getConfigFields() {
		return getConfigFields()
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 */
	async init(config: MultiviewConfig): Promise<void> {
		this.#config = config

		this.#initThings()

		this.#init_tcp()
	}

	/**
	 * Process an updated configuration array.
	 */
	async configUpdated(config: MultiviewConfig): Promise<void> {
		let resetConnection = false

		if (this.#config.host != config.host || this.#config.bonjourHost != config.bonjourHost) {
			resetConnection = true
		}

		this.#config = config

		this.#initThings()

		if (resetConnection || !this.#socket) {
			this.#init_tcp()
		}
	}

	/**
	 * Clean up the instance before it is destroyed.
	 */
	async destroy(): Promise<void> {
		if (this.#socket) {
			this.#socket.destroy()
		}

		this.log('debug', 'destroy ' + this.id)
	}

	#sendMessage = async (msg: string): Promise<void> => {
		if (this.#socket && this.#socket.isConnected) {
			await this.#socket.send(msg + '\n\n')
		} else {
			this.log('warn', 'Cannot send command, socket not connected')
		}
	}

	#initThings() {
		this.setActionDefinitions(getActions(this.#state, this.#model, this.#sendMessage.bind(this)))
		this.setFeedbackDefinitions(getFeedbacks(this.#state, this.#model))
		this.setPresetDefinitions(getPresetDefinitions(this.#state, this.#model))

		this.setVariableDefinitions(getVariableDefinitions(this.#model))
		this.setVariableValues(getVariableValues(this.#state, this.#model))
	}

	#parseIpAndPort(): IpAndPort | null {
		const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

		if (this.#config.bonjourHost) {
			const [ip, rawPort] = this.#config.bonjourHost.split(':')
			const port = Number(rawPort)
			if (ip.match(ipRegex) && !isNaN(port)) {
				return {
					ip,
					port,
				}
			}
		} else if (this.#config.host) {
			if (this.#config.host.match(ipRegex)) {
				return {
					ip: this.#config.host,
					port: undefined,
				}
			}
		}
		return null
	}

	/**
	 * INTERNAL: use setup data to initalize the tcp socket object.
	 */
	#init_tcp() {
		if (this.#socket) {
			this.#socket.destroy()
			this.#socket = undefined
		}

		const ipAndPort = this.#parseIpAndPort()

		if (ipAndPort) {
			this.updateStatus(InstanceStatus.Connecting)

			this.#socket = new TCPHelper(ipAndPort.ip, ipAndPort.port || 9990)

			this.#socket.on('status_change', (status, message) => {
				this.log('error', status + ': ' + message)
			})

			this.#socket.on('end', () => {
				this.log('debug', 'Connection closed')
			})

			this.#socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', 'Network error: ' + err.message)
			})

			this.#socket.on('connect', () => {
				this.updateStatus(InstanceStatus.Ok)
				this.log('debug', 'Connected')
			})

			// separate buffered stream into lines with responses
			let receivebuffer = ''
			this.#socket.on('data', (chunk) => {
				receivebuffer += chunk.toString()
				let lineEnd = -1
				let discardOffset = 0

				while ((lineEnd = receivebuffer.indexOf('\n', discardOffset)) !== -1) {
					const line = receivebuffer.substring(discardOffset, lineEnd)
					discardOffset = lineEnd + 1
					this.#handleReceivedLine(line)
				}

				receivebuffer = receivebuffer.substring(discardOffset)
			})

			// this.pingTimer = setInterval(() => {
			// 	if (!this.socket || !this.socket.isConnected) return

			// 	this.socket.send('PING:\n\n')
			// }, 15000)
		} else {
			this.log('error', "Didn't get a target to connect to")
			this.updateStatus(InstanceStatus.Disconnected)
		}
	}

	#command: string | null = null
	#stash: string[] = []

	#handleReceivedLine(line: string) {
		try {
			if ((this.#command === null && line.match(/:/)) || line === 'ACK') {
				this.#command = line
			} else if (this.#command !== null && line.length > 0) {
				this.#stash.push(line.trim())
			} else if (line.length === 0 && this.#command !== null) {
				const cmd = this.#command.trim().split(/:/)[0]

				if (cmd !== 'ACK') {
					this.#processVideohubInformation(cmd, this.#stash)
				}

				this.#stash = []
				this.#command = null
			} else {
				this.log('debug', `weird response from videohub (${line.length} bytes): ${line}`)
			}
		} catch (e) {
			this.log('error', `Handle command failed: ${e}`)
		}
	}

	/**
	 * INTERNAL: Routes incoming data to the appropriate function for processing.
	 */
	#processVideohubInformation(key: string, data: string[]) {
		console.log('process', key, data)

		if (key.match(/(INPUT|OUTPUT) LABELS/)) {
			this.#updateLabels(key, data)
		} else if (key.match(/VIDEO OUTPUT ROUTING/)) {
			this.#updateRouting(key, data)

			// } else if (key.match(/VIDEO OUTPUT LOCKS/)) {
			//this.updateLocks(key, data)
			// } else if (key.match(/(VIDEO INPUT|VIDEO OUTPUT) STATUS/)) {
			// this.updateStatus(key, data)
			// this.actions()
			// this.initFeedbacks()
			// this.initPresets()
		} else if (key == 'MULTIVIEW DEVICE') {
			this.#updateDevice(data)
			// this.actions()
			// this.initVariables()
			// this.initFeedbacks()
			// this.initPresets()
		} else if (key == 'CONFIGURATION') {
			this.#updateDeviceConfig(data)
		} else {
			this.log('warn', `Unhandled Videohub data for key ${key}: ${data.join(', ')}`)
			// TODO: find out more about the video hub from stuff that comes in here
		}
	}

	#updateLabels(labeltype: string, data: string[]) {
		for (const line of data) {
			const [numStr, ...values] = line.split(/ /)
			const num = parseInt(numStr)
			const label = values.join(' ')

			switch (labeltype) {
				case 'INPUT LABELS': {
					this.#state.storeInputLabel(num, label)

					break
				}
				case 'OUTPUT LABELS': {
					this.#state.storeOutputLabel(num, label)

					break
				}
				default:
					this.log('debug', `Unhandled label type: ${labeltype} (${line})`)
			}
		}

		// Re-init everything, as some options changed as well as variable descriptions
		this.#initThings()
	}

	#updateRouting(labeltype: string, data: string[]) {
		for (const line of data) {
			const [destStr, srcStr] = line.split(/ /)
			const dest = parseInt(destStr)
			const src = parseInt(srcStr)

			switch (labeltype) {
				case 'VIDEO OUTPUT ROUTING': {
					this.#state.storeOutputRoute(dest, src)

					break
				}
				default:
					this.log('debug', `Unhandled routing type: ${labeltype} (${line})`)
					break
			}
		}

		// Update our local variables in case a label has changed
		this.setVariableValues(getVariableValues(this.#state, this.#model))

		this.checkFeedbacks('input_bg', 'solo_source', 'audio_source')
	}

	/**
	 * INTERNAL: Updates device data from the Videohub
	 */
	#updateDevice(data: string[]) {
		for (const line of data) {
			const [attribute, ...values] = line.split(/: /)
			const value = values.join(' ')

			switch (attribute) {
				case 'Model name':
					this.log('info', 'Connected to a ' + value)
					break
			}
		}

		// this.saveConfig(this.config)
	}

	/**
	 * INTERNAL: Updates device data from the Videohub
	 */
	#updateDeviceConfig(data: string[]) {
		const invalidateFeedbacks = new Set<string>()

		for (const line of data) {
			const [attribute, ...values] = line.split(/: /)
			const value = values.join(' ')

			switch (attribute) {
				case 'Layout':
					this.#state.configuration.layout = value
					invalidateFeedbacks.add('layout')
					break
				case 'Output format':
					this.#state.configuration.outputFormat = value
					invalidateFeedbacks.add('output_format')
					break
				case 'Solo enabled':
					this.#state.configuration.soloEnabled = value === 'true'
					invalidateFeedbacks.add('solo_enabled')
					break
				case 'Widescreen SD enable':
				// Fallthrough, to handle both possible names
				case 'Widescreen SD enabled':
					this.#state.configuration.widescreenSD = value === 'true'
					invalidateFeedbacks.add('widescreen_sd')
					break
				case 'Display border':
					this.#state.configuration.displayBorder = value === 'true'
					invalidateFeedbacks.add('display_border')
					break
				case 'Display labels':
					this.#state.configuration.displayLabels = value === 'true'
					invalidateFeedbacks.add('display_labels')
					break
				case 'Display audio meters':
					this.#state.configuration.displayMeters = value === 'true'
					invalidateFeedbacks.add('display_meters')
					break
				case 'Display SDI tally':
					this.#state.configuration.displayTally = value === 'true'
					invalidateFeedbacks.add('display_tally')
					break
			}
		}

		console.log('invalidate', data, invalidateFeedbacks)

		if (invalidateFeedbacks.size > 0) {
			this.checkFeedbacks(...invalidateFeedbacks)
		}
	}
}

runEntrypoint(Multiview4Instance, [])
