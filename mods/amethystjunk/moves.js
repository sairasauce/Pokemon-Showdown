exports.BattleMovedex = {
	"darkritual": {
		num: 9000,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the weather becomes Eclipse. The power of Dark and Ghost-type attacks is 1.5x during the effect. Fails if the current weather is Eclipse.",
		shortDesc: "For 5 turns, darkness powers Dark and Ghost moves.",
		id: "darkritual",
		isViable: true,
		name: "Dark Ritual",
		pp: 5,
		priority: 0,
		weather: 'eclipse',
		secondary: false,
		target: "all",
		type: "Dark"
	},
	"breakingwind": {
		num: 9001,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "For 5 turns, the weather becomes Clear Skies. The power of Fying-type attacks is 1.5x during the effect. Fails if the current weather is Clear Skies.",
		shortDesc: "For 5 turns, heavy rain powers Water moves.",
		id: "breakingwind",
		isViable: true,
		name: "Breaking Wind",
		pp: 5,
		priority: 0,
		weather: 'clearskies',
		secondary: false,
		target: "all",
		type: "Flying"
	},
	"amethystshard": {
		num: 9002,
		accuracy: 95,
		basePower: 80,
		category: "Physical",
		desc: "Deals damage, and has a 20% chance to freeze the opponent.",
		shortDesc: "Deals damage with a chance to freeze.",
		id: "amethystshard",
		isViable: true,
		name: "Amethyst Shard",
		pp: 10,
		priority: 0,
		secondary: {
			chance: 20,
			status: 'frz'
		},
		target: "normal",
		type: "Ice"
	},
	"amethystgodmove": {
		num: 9003,
		accuracy: 100,
		basePower: 200,
		category: "Special",
		desc: "Deals massive damage and lowers all of the foe's stats by 1. The user must recharge if the attack is successful.",
		shortDesc: "Deals massive damage. User must recharge.",
		id: "amethystgodmove",
		isViable: true,
		name: "Amethyst God Move",
		pp: 5,
		priority: 0,
		self: {
			volatileStatus: 'mustrecharge'
		},
		secondary: {
			chance: 100,
			boosts: {
				atk: -1,
				def: -1,
				spa: -1,
				spd: -1,
				spe: -1
			}
		},
		target: "normal",
		type: "Psychic"
	},
	"voltbolt": {
		num: 9004,
		accuracy: 100,
		basePower: 40,
		category: "Physical",
		desc: "This attack usually goes first. Has a 10% chance of paralyzing the opponent.",
		shortDesc: "Usually goes first.",
		id: "voltbolt",
		isViable: true,
		name: "Volt Bolt",
		pp: 10,
		priority: 1,
		secondary: {
			chance: 10,
			status: 'par'
		},
		target: "normal",
		type: "Electric"
	},
	hypnosis: {
		inherit: true,
		accuracy: 85
	},
	leechseed: {
		inherit: true,
		accuracy: 100
	},
	toxic: {
		inherit: true,
		accuracy: 100
	},
	psyshock: {
		inherit: true,
		basePower: 100
	},
	moonlight: {
		inherit: true,
		onModifyMove: function(move) {
			if (this.isWeather(['sunnyday','eclipse'])) move.heal = [2,3];
			else if (this.isWeather(['raindance','sandstorm','hail'])) move.heal = [1,4];
		}
	},
	morningsun: {
		inherit: true,
		onModifyMove: function(move) {
			if (this.isWeather('sunnyday')) move.heal = [2,3];
			else if (this.isWeather(['raindance','sandstorm','hail','eclipse'])) move.heal = [1,4];
		}
	},
	synthesis: {
		inherit: true,
		onModifyMove: function(move) {
			if (this.isWeather('sunnyday')) move.heal = [2,3];
			else if (this.isWeather(['raindance','sandstorm','hail','eclipse'])) move.heal = [1,4];
		}
	},
	solarbeam: {
		inherit: true,
		basePowerCallback: function(pokemon, target) {
			if (this.isWeather(['raindance','sandstorm','hail','eclipse'])) {
				this.debug('weakened by weather');
				return 60;
			}
			return 120;
		}
	},
	thunder: {
		inherit: true,
		onModifyMove: function(move) {
			if (this.isWeather('raindance')) move.accuracy = true;
			else if (this.isWeather(['sunnyday','eclipse'])) move.accuracy = 50;
		}
	},
	hurricane: {
		inherit: true,
		onModifyMove: function(move) {
			if (this.isWeather('raindance')) move.accuracy = true;
			else if (this.isWeather(['sunnyday','eclipse'])) move.accuracy = 50;
		}
	},
	skyattack: {
		inherit: true,
		basePowerCallback: function(pokemon, target) {
			if (this.isWeather('clearskies')) {
				this.debug('weakened by weather');
				return basePower * 0.67;
			}
			return 140;
		},
		onTry: function(attacker, defender, move) {
			if (attacker.removeVolatile(move.id)) {
				return;
			}
			this.add('-prepare', attacker, move.name, defender);
			if (this.isWeather('clearskies') || !this.runEvent('ChargeMove', attacker, defender, move)) {
				this.add('-anim', attacker, move.name, defender);
				return;
			}
			attacker.addVolatile(move.id, defender);
			return null;
		}
	},
	tailwind: {
		inherit: true,
		effect: {
			duration: 4,
			durationCallback: function(target, source, effect) {
				if (this.isWeather('clearskies')) {
					return 6;
				}
				if (source && source.ability === 'persistent') {
					return 6;
				}
				return 4;
			},
			onStart: function(side) {
				this.add('-sidestart', side, 'move: Tailwind');
			},
			onModifySpe: function(spe) {
				return spe * 2;
			},
			onResidualOrder: 21,
			onResidualSubOrder: 4,
			onEnd: function(side) {
				this.add('-sideend', side, 'move: Tailwind');
			}
		}
	}
};