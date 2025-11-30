import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface MultiviewConfig {
	bonjourHost?: string
	host?: string
}

export function getConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module will connect to any Blackmagic Design MultiView 4 Device.',
		},
		{
			type: 'bonjour-device',
			id: 'bonjourHost',
			label: 'MultiView Device',
			width: 12,
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'MultiView IP',
			width: 12,
			regex: Regex.IP,
			isVisible: (options) => !options['bonjourHost'],
			// isVisibleExpression: '!$(option:bonjourHost)',
		},
	]
}
