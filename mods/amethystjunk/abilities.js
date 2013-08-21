exports.BattleAbilities = {
	"eternalnight": {
		desc: "When this Pokemon enters the battlefield, it causes a permanent Eclipse that can only be stopped by Air Lock, Cloud Nine or another weather condition.",
		shortDesc: "On switch-in, this Pokemon summons Eclipse until another weather replaces it.",
		onStart: function(source) {
			this.setWeather('eclipse');
			this.weatherData.duration = 0;
		},
		id: "eternalnight",
		name: "Eternal Night",
		rating: 5,
		num: 9000
	},
	"shroud": {
		desc: "If Eclipse is active, this Pokemon's speed is doubled.",
		shortDesc: "Doubles speed in Eclipse.",
		onModifySpe: function(spe) {
			if (this.isWeather('eclipse')) {
				return spe * 2;
			}
		},
		id: "shroud",
		name: "Shroud",
		rating: 2,
		num: 9001
	},
	"lunarpower": {
		desc: "If active while Eclipse is in effect, this Pokemon recovers one-sixteenth of its max HP after each turn.",
		shortDesc: "If Eclipse is active, this Pokemon heals 1/16 of its max HP each turn.",
		onWeather: function(target, source, effect) {
			if (effect.id === 'eclipse') {
				this.heal(target.maxhp/16);
			}
		},
		id: "lunarpower",
		name: "Lunar Power",
		rating: 1.5,
		num: 9002
	},
	"gustingwind": {
		desc: "When this Pokemon enters the battlefield, it causes a permanent Clear Skies that can only be stopped by Air Lock, Cloud Nine or another weather condition.",
		shortDesc: "On switch-in, this Pokemon summons Clear Skies until another weather replaces it.",
		onStart: function(source) {
			this.setWeather('clearskies');
			this.weatherData.duration = 0;
		},
		id: "gustingwind",
		name: "Gusting Wind",
		rating: 5,
		num: 9003
	},
	"freeflight": {
		desc: "If Clear Skies is active, this Pokemon's speed is doubled.",
		shortDesc: "Doubles speed in Clear Skies.",
		onModifySpe: function(spe) {
			if (this.isWeather('clearskies')) {
				return spe * 2;
			}
		},
		id: "freeflight",
		name: "Free Flight",
		rating: 2,
		num: 9004
	},
	"cleansingbreeze": {
		desc: "If active while Clear Skies is in effect, this Pokemon recovers one-sixteenth of its max HP after each turn.",
		shortDesc: "If Clear Skies is active, this Pokemon heals 1/16 of its max HP each turn.",
		onWeather: function(target, source, effect) {
			if (effect.id === 'clearskies') {
				this.heal(target.maxhp/16);
			}
		},
		id: "cleansingbreeze",
		name: "Cleansing Breeze",
		rating: 1.5,
		num: 9005
	},
	"doldrum": {
		desc: "While this Pokemon is active, all weather conditions and their effects are disabled.",
		shortDesc: "While this Pokemon is active, all weather conditions and their effects are disabled.",
		onStart: function(pokemon) {
			this.add('-message', 'The effects of weather disappeared. (placeholder)');
		},
		onAnyModifyPokemon: function(pokemon) {
			pokemon.ignore['WeatherTarget'] = true;
		},
		onAnyTryWeather: false,
		id: "doldrum",
		name: "Doldrum",
		rating: 3,
		num: 9006
	},
	slowstart: {
		inherit: true,
		effect: {
			duration: 3,
			onStart: function(target) {
				this.add('-start', target, 'Slow Start');
			},
			onModifyAtk: function(atk, pokemon) {
				if (pokemon.ability !== 'slowstart') {
					pokemon.removeVolatile('slowstart');
					return;
				}
				return atk / 2;
			},
			onModifySpe: function(spe, pokemon) {
				if (pokemon.ability !== 'slowstart') {
					pokemon.removeVolatile('slowstart');
					return;
				}
				return spe / 2;
			},
			onEnd: function(target) {
				this.add('-end', target, 'Slow Start');
			}
		}
	}
};