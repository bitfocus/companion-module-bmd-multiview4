// BlackMagic Design Multiview

var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;


function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.config = config;

	self.init_tcp();
	self.actions(); // export actions
};



instance.prototype.init = function() {
	var self = this;
	debug = self.debug;
	log = self.log;
	self.init_presets();


	self.status(1,'Connecting'); // status ok!
	self.init_tcp();
	self.actions(); // export actions
};

instance.prototype.init_tcp = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	};

	if (self.config.host) {
		self.socket = new tcp(self.config.host, 9990);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.status(self.STATE_ERROR, err);
			self.log('error',"Network error: " + err.message);
		});

		self.socket.on('connect', function () {
			self.status(self.STATE_OK);
			debug("Connected");
		})

		self.socket.on('data', function (data) {});
	}
};


// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);;
};
instance.prototype.init_presets = function () {
	var self = this;
	var presets = [
		{
			category: 'Multiview',
			label: 'SOLO \\n2X2',
			bank: {
				style: 'text',
				text: 'SOLO \\n2X2',
				size: '18',
				color: self.rgb(255,255,255),
				bgcolor: self.rgb(0,0,0),
				latch: true
			},
			actions: [
				{
					action: 'mode',
					options: {
						mode: true,
					}
				}
			],
			release_actions: [
				{
					action: 'mode',
					options: {
						mode: false,
					}
				}
			]
		},
		{
				category: 'Multiview',
				label: 'VIDEO \\n1',
				bank: {
					style: 'text',
					text: 'Video \\n1',
					size: '18',
					color: self.rgb(255,255,255),
					bgcolor: self.rgb(0,0,0),

				},
				actions: [
					{
						action: 'solo',
						options: {
							inp: 0,
						}
					}
				]
		},
		{
				category: 'Multiview',
				label: 'VIDEO \\n2',
				bank: {
					style: 'text',
					text: 'Video \\n2',
					size: '18',
					color: self.rgb(255,255,255),
					bgcolor: self.rgb(0,0,0),

				},
				actions: [
					{
						action: 'solo',
						options: {
							inp: 1,
						}
					}
				]
		},
		{
				category: 'Multiview',
				label: 'VIDEO \\n3',
				bank: {
					style: 'text',
					text: 'Video \\n3',
					size: '18',
					color: self.rgb(255,255,255),
					bgcolor: self.rgb(0,0,0),

				},
				actions: [
					{
						action: 'solo',
						options: {
							inp: 2,
						}
					}
				]
		},
		{
				category: 'Multiview',
				label: 'VIDEO \\n4',
				bank: {
					style: 'text',
					text: 'Video \\n4',
					size: '18',
					color: self.rgb(255,255,255),
					bgcolor: self.rgb(0,0,0),

				},
				actions: [
					{
						action: 'solo',
						options: {
							inp: 3,
						}
					}
				]
		},
		{
				category: 'Multiview',
				label: 'Audio \\n1',
				bank: {
					style: 'text',
					text: 'Audio \\n1',
					size: '18',
					color: self.rgb(255,255,255),
					bgcolor: self.rgb(0,0,0),

				},
				actions: [
					{
						action: 'audio',
						options: {
							inp: 0,
						}
					}
				]
		},
		{
				category: 'Multiview',
				label: 'Audio \\n2',
				bank: {
					style: 'text',
					text: 'Audio \\n2',
					size: '18',
					color: self.rgb(255,255,255),
					bgcolor: self.rgb(0,0,0),

				},
				actions: [
					{
						action: 'audio',
						options: {
							inp: 1,
						}
					}
				]
		},
		{
				category: 'Multiview',
				label: 'Audio \\n3',
				bank: {
					style: 'text',
					text: 'Audio \\n3',
					size: '18',
					color: self.rgb(255,255,255),
					bgcolor: self.rgb(0,0,0),

				},
				actions: [
					{
						action: 'audio',
						options: {
							inp: 2,
						}
					}
				]
		},
		{
				category: 'Multiview',
				label: 'Audio \\n4',
				bank: {
					style: 'text',
					text: 'Audio \\n4',
					size: '18',
					color: self.rgb(255,255,255),
					bgcolor: self.rgb(0,0,0),

				},
				actions: [
					{
						action: 'audio',
						options: {
							inp: 3,
						}
					}
				]
		},



		];




	self.setPresetDefinitions(presets);
}


instance.prototype.actions = function(system) {
	var self = this;
		self.system.emit('instance_actions', self.id, {

			'mode':     {
				label: 'Display Mode',
				options: [
					{
						type:    'dropdown',
						label:   'Display Mode',
						id:      'mode',
						choices: [
							{ id: 'true',   label: 'SOLO'},
							{ id: 'false',  label: '2X2'}
						]
					}
				]
			},
			'audio':     {
				label: 'Audio from Input',
				options: [
					{
						type:    'dropdown',
						label:   'Input',
						id:      'inp',
						choices: [
							{ id: '0',   label: 'Input 1'},
							{ id: '1',   label: 'Input 2'},
							{ id: '2',   label: 'Input 3'},
							{ id: '3',   label: 'Input 4'}
						]
					}
				]
			},
			'solo':     {
				label: 'Solo from Input',
				options: [
					{
						type:    'dropdown',
						label:   'Input',
						id:      'inp',
						choices: [
							{ id: '0',   label: 'Input 1'},
							{ id: '1',   label: 'Input 2'},
							{ id: '2',   label: 'Input 3'},
							{ id: '3',   label: 'Input 4'}
						]
					}
				]
			},
			'label':     {
				label: 'Input Label',
				options: [
					{
						type:    'textinput',
						label:   'Label',
						id:      'label'
					},
					{
						type:    'dropdown',
						label:   'Input',
						id:      'inp',
						choices: [
							{ id: '0',   label: 'Input 1'},
							{ id: '1',   label: 'Input 2'},
							{ id: '2',   label: 'Input 3'},
							{ id: '3',   label: 'Input 4'}
						]
					}
				]
			},
		});
};

	instance.prototype.action = function(action) {
		var self = this;
		var opt = action.options

		switch (action.action) {

			case 'mode':
				cmd = 'CONFIGURATION:\n'+'Solo enabled: '+ opt.mode +'\n';
				break;

			case 'audio':
				cmd ='VIDEO OUTPUT ROUTING:\n 5 '+ opt.inp +'\n';
				break;

			case 'solo':
				cmd ='VIDEO OUTPUT ROUTING:\n 4 '+ opt.inp +'\n';
				break;

			case 'label':
				cmd ='INPUT LABELS:\n'+ opt.inp +' '+ opt.label +'\n';
				break;

	};
	if (cmd !== undefined) {

		debug('sending ',cmd);

		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd + "\n");
			debug('to',self.config.host)
		} else {
			debug('Socket not connected :(');
			}
		};
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
