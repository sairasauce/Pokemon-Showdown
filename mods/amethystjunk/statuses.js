function clampIntRange(num, min, max) {
	num = Math.floor(num);
	if (num < min) num = min;
	if (typeof max !== 'undefined' && num > max) num = max;
	return num;
}
exports.BattleStatuses = {
	eclipse: {
		effectType: 'Weather',
		duration: 5,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Dark') {
				this.debug('eclipse dark boost');
				return basePower * 1.5;
			}
			if (move.type === 'Ghost') {
				this.debug('eclipse ghost boost');
				return basePower * 1.5;
			}
		},
		onStart: function(battle, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.effectData.duration = 0;
					this.add('-weather', 'Eclipse', '[from] ability: '+effect, '[of] '+source);
				} else {
					this.add('-weather', 'Eclipse');
				}
			},
		onResidualOrder: 1,
		onResidual: function() {
			this.add('-weather', 'Eclipse', '[upkeep]');
			this.eachEvent('Weather');
		},
		onEnd: function() {
				this.add('-weather', 'none');
		}
	},
	clearskies: {
		effectType: 'Weather',
		duration: 5,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move.type === 'Flying') {
				this.debug('clear skies flying boost');
				return basePower * 1.25;
			}
		},
		onStart: function(battle, source, effect) {
				if (effect && effect.effectType === 'Ability') {
					this.effectData.duration = 0;
					this.add('-weather', 'ClearSkies', '[from] ability: '+effect, '[of] '+source);
				} else {
					this.add('-weather', 'ClearSkies');
				}
			},
		onResidualOrder: 1,
		onResidual: function() {
			this.add('-weather', 'ClearSkies', '[upkeep]');
			this.eachEvent('Weather');
		},
		onEnd: function() {
				this.add('-weather', 'none');
		}
	},
	sandstorm: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function(source, effect) {
			if (source && source.item === 'smoothrock') {
				return 8;
			}
			return 5;
		},
		onModifyDef: function(def, pokemon) {
			if(pokemon.hasType('Ground') && this.isWeather('sandstorm')) {
				return def * 3/2
			}
		},
		onModifySpD: function(spd, pokemon) {
			if (pokemon.hasType('Rock') && this.isWeather('sandstorm')) {
				return spd * 3/2;
			}
		},
		onStart: function(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				this.effectData.duration = 0;
				this.add('-weather', 'Sandstorm', '[from] ability: '+effect, '[of] '+source);
			} else {
				this.add('-weather', 'Sandstorm');
			}
		},
		onResidualOrder: 1,
		onResidual: function() {
			this.add('-weather', 'Sandstorm', '[upkeep]');
			if (this.isWeather('sandstorm')) this.eachEvent('Weather');
		},
		onWeather: function(target) {
			this.damage(target.maxhp/16);
		},
		onEnd: function() {
			this.add('-weather', 'none');
		}
	},
	hail: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function(source, effect) {
			if (source && source.item === 'icyrock') {
				return 8;
			}
			return 5;
		},
		onModifyDef: function(def, pokemon) {
			if(pokemon.hasType('Ice') && this.isWeather('hail')) {
				return def * 3/2
			}
		},
		onStart: function(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				this.effectData.duration = 0;
				this.add('-weather', 'Hail', '[from] ability: '+effect, '[of] '+source);
			} else {
				this.add('-weather', 'Hail');
			}
		},
		onResidualOrder: 1,
		onResidual: function() {
			this.add('-weather', 'Hail', '[upkeep]');
			if (this.isWeather('hail')) this.eachEvent('Weather');
		},
		onWeather: function(target) {
			this.damage(target.maxhp/16);
		},
		onEnd: function() {
			this.add('-weather', 'none');
		}
	}
};
