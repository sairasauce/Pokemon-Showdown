// Note: These are the rules that formats use
// The list of formats is stored in config/formats.js

exports.BattleFormats = {

	// Rulesets
	///////////////////////////////////////////////////////////////////

	standard: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'HP Percentage Mod'],
		banlist: ['Unreleased', 'Illegal']
	},
	standardcutemons: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'HP Percentage Mod'],
		banlist: []
	},
	standardnext: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'HP Percentage Mod'],
		banlist: ['Unreleased', 'Illegal', 'Soul Dew']
	},
	standardubers: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'Moody Clause', 'OHKO Clause', 'HP Percentage Mod'],
		banlist: ['Unreleased', 'Illegal']
	},
	standarddw: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod'],
		banlist: ['Illegal', 'Moody']
	},
	pokemon: {
		effectType: 'Banlist',
		validateSet: function(set, format) {
			var item = this.getItem(set.item);
			var template = this.getTemplate(set.species);
			var problems = [];

			if (set.species === set.name) delete set.name;
			if (template.gen > this.gen) {
				problems.push(set.species+' does not exist in gen '+this.gen+'.');
			} else if (template.isNonstandard) {
				problems.push(set.species+' is not a real Pokemon.');
			}
			if (set.ability) {
				var ability = this.getAbility(set.ability);
				if (ability.gen > this.gen) {
					problems.push(ability.name+' does not exist in gen '+this.gen+'.');
				} else if (ability.isNonstandard) {
					problems.push(ability.name+' is not a real ability.');
				}
			}
			if (set.moves) for (var i=0; i<set.moves.length; i++) {
				var move = this.getMove(set.moves[i]);
				if (move.gen > this.gen) {
					problems.push(move.name+' does not exist in gen '+this.gen+'.');
				} else if (move.isNonstandard) {
					problems.push(move.name+' is not a real move.');
				}
			}
			if (item) {
				if (item.gen > this.gen) {
					problems.push(item.name+' does not exist in gen '+this.gen+'.');
				} else if (item.isNonstandard) {
					problems.push(item.name + ' is not a real item.');
				}
			}
			if (set.moves && set.moves.length > 4) {
				problems.push((set.name||set.species) + ' has more than four moves.');
			}
			if (set.level && set.level > 100) {
				problems.push((set.name||set.species) + ' is higher than level 100.');
			}

			// ----------- legality line ------------------------------------------
			if (!format.banlistTable || !format.banlistTable['illegal']) return problems;
			// everything after this line only happens if we're doing legality enforcement

			// limit one of each move
			var moves = [];
			if (set.moves) {
				var hasMove = {};
				for (var i=0; i<set.moves.length; i++) {
					var move = this.getMove(set.moves[i]);
					var moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(set.moves[i]);
				}
			}
			set.moves = moves;

			if (template.num == 351) { // Castform
				set.species = 'Castform';
			}
			if (template.num == 421) { // Cherrim
				set.species = 'Cherrim';
			}
			if (template.num == 493) { // Arceus
				if (set.ability === 'Multitype' && item.onPlate) {
					set.species = 'Arceus-'+item.onPlate;
				} else {
					set.species = 'Arceus';
				}
			}
			if (template.num == 555) { // Darmanitan
				set.species = 'Darmanitan';
			}
			if (template.num == 487) { // Giratina
				if (item.id === 'griseousorb') {
					set.species = 'Giratina-Origin';
					set.ability = 'Levitate';
				} else {
					set.species = 'Giratina';
					set.ability = 'Pressure';
				}
			}
			if (template.num == 647) { // Keldeo
				if (set.species === 'Keldeo-Resolute' && set.moves.indexOf('Secret Sword') < 0) {
					set.species = 'Keldeo';
				}
			}
			if (template.num == 648) { // Meloetta
				set.species = 'Meloetta';
			}
			return problems;
		}
	},
	cappokemon: {
		effectType: 'Rule',
		validateSet: function(set, format) {
			// don't return
			this.getEffect('Pokemon').validateSet.call(this, set, format);

			// limit one of each move
			var moves = [];
			if (set.moves) {
				var hasMove = {};
				for (var i=0; i<set.moves.length; i++) {
					var move = this.getMove(set.moves[i]);
					var moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(set.moves[i]);
				}
			}
			set.moves = moves;
		}
	},
	legal: {
		effectType: 'Banlist',
		banlist: ['Crobat+BraveBird+Hypnosis']
	},
	potd: {
		effectType: 'Rule',
		onPotD: '',
		onStart: function() {
			if (this.effect.onPotD) {
				this.add('rule', 'Pokemon of the Day: '+this.effect.onPotD);
			}
		}
	},
	teampreviewvgc: {
		onStartPriority: -10,
		onStart: function() {
			this.add('clearpoke');
			for (var i=0; i<this.sides[0].pokemon.length; i++) {
				this.add('poke', this.sides[0].pokemon[i].side.id, this.sides[0].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++) {
				this.add('poke', this.sides[1].pokemon[i].side.id, this.sides[1].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
		},
		onTeamPreview: function() {
			this.makeRequest('teampreview', 4);
		}
	},
	teampreview1v1: {
		onStartPriority: -10,
		onStart: function() {
			this.add('clearpoke');
			for (var i=0; i<this.sides[0].pokemon.length; i++) {
				this.add('poke', this.sides[0].pokemon[i].side.id, this.sides[0].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++) {
				this.add('poke', this.sides[1].pokemon[i].side.id, this.sides[1].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
		},
		onTeamPreview: function() {
			this.makeRequest('teampreview', 1);
		}
	},
	teampreview: {
		onStartPriority: -10,
		onStart: function() {
			this.add('clearpoke');
			for (var i=0; i<this.sides[0].pokemon.length; i++) {
				this.add('poke', this.sides[0].pokemon[i].side.id, this.sides[0].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++) {
				this.add('poke', this.sides[1].pokemon[i].side.id, this.sides[1].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
		},
		onTeamPreview: function() {
			this.makeRequest('teampreview');
		}
	},
	teampreviewgbu: {
		onStartPriority: -10,
		onStart: function() {
			this.add('clearpoke');
			for (var i=0; i<this.sides[0].pokemon.length; i++) {
				this.add('poke', this.sides[0].pokemon[i].side.id, this.sides[0].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
			for (var i=0; i<this.sides[1].pokemon.length; i++) {
				this.add('poke', this.sides[1].pokemon[i].side.id, this.sides[1].pokemon[i].details.replace(/Arceus(\-[a-zA-Z\?]+)?/, 'Arceus-*'));
			}
		},
		onTeamPreview: function() {
			this.makeRequest('teampreview', 3);
		}
	},
	littlecup: {
		effectType: 'Rule',
		validateSet: function(set) {
			var template = this.getTemplate(set.species || set.name);
			if (template.prevo) {
				return [set.species+" isn't the first in its evolution family."];
			}
			if (!template.nfe) {
				return [set.species+" doesn't have an evolution family."];
			}
		}
	},
	speciesclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Species Clause: Limit one of each Pokemon');
		},
		validateTeam: function(team, format) {
			var speciesTable = {};
			for (var i=0; i<team.length; i++) {
				var template = this.getTemplate(team[i].species);
				if (speciesTable[template.num]) {
					return ["You are limited to one of each pokemon by Species Clause.","(You have more than one "+template.name+")"];
				}
				speciesTable[template.num] = true;
			}
		}
	},
	itemclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Item Clause: Limit one of each item');
		},
		validateTeam: function(team, format) {
			var itemTable = {};
			for (var i=0; i<team.length; i++) {
				var item = toId(team[i].item);
				if (!item) continue;
				if (itemTable[item]) {
					return ["You are limited to one of each item by Item Clause.","(You have more than one "+this.getItem(item).name+")"];
				}
				itemTable[item] = true;
			}
		}
	},
	ohkoclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'OHKO Clause: OHKO moves are banned');
		},
		validateSet: function(set) {
			var problems = [];
			if (set.moves) {
				for (var i in set.moves) {
					var move = this.getMove(set.moves[i]);
					if (move.ohko) problems.push(move.name+' is banned by OHKO Clause.');
				}
			}
			return problems;
		}
	},
	evasionabilitiesclause: {
		effectType: 'Banlist',
		name: 'Evasion Abilities Clause',
		banlist: ['Sand Veil', 'Snow Cloak'],
		onStart: function() {
			this.add('rule', 'Evasion Abilities Clause: Evasion abilities are banned');
		}
	},
	evasionmovesclause: {
		effectType: 'Banlist',
		name: 'Evasion Moves Clause',
		banlist: ['Minimize', 'Double Team'],
		onStart: function() {
			this.add('rule', 'Evasion Moves Clause: Evasion moves are banned');
		}
	},
	moodyclause: {
		effectType: 'Banlist',
		name: 'Moody Clause',
		banlist: ['Moody'],
		onStart: function() {
			this.add('rule', 'Moody Clause: Moody is banned');
		}
	},
	hppercentagemod: {
		effectType: 'Rule',
		name: 'HP Percentage Mod',
		onStart: function() {
			this.add('rule', 'HP Percentage Mod: HP is reported as percentages');
			this.reportPercentages = true;
		}
	},
	sleepclausemod: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Sleep Clause Mod: Limit one foe put to sleep');
		},
		onSetStatus: function(status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'slp') {
				for (var i=0; i<target.side.pokemon.length; i++) {
					var pokemon = target.side.pokemon[i];
					if (pokemon.status === 'slp') {
						if (!pokemon.statusData.source ||
							pokemon.statusData.source.side !== pokemon.side) {
							this.add('-message', 'Sleep Clause Mod activated.');
							return false;
						}
					}
				}
			}
		}
	},
	freezeclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Freeze Clause: Limit one foe frozen');
		},
		onSetStatus: function(status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'frz') {
				for (var i=0; i<target.side.pokemon.length; i++) {
					var pokemon = target.side.pokemon[i];
					if (pokemon.status === 'frz') {
						this.add('-message', 'Freeze Clause activated.');
						return false;
					}
				}
			}
		}
	},
	junk: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause'],
		banlist: ['Illegal', 'Unreleased'],
		validateSet: function(set) {
			// limit one of each move in Standard
			var moves = [];
			if (set.moves) {
				var hasMove = {};
				for (var i=0; i<set.moves.length; i++) {
					var move = this.getMove(set.moves[i]);
					var moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(set.moves[i]);
				}
			}
			set.moves = moves;
		}
	},
	amethyst: {
		effectType: 'Banlist',
		validateSet: function(set, format) {
			var item = this.getItem(set.item);
			var template = this.getTemplate(set.species);
			var problems = [];

			if (set.species === set.name) delete set.name;
			if (template.num == 493) { // Arceus
				if (set.ability === 'Multitype' && item.onPlate) {
					set.species = 'Arceus-'+item.onPlate;
				} else {
					set.species = 'Arceus';
				}
			}
			if (template.num == 487) { // Giratina
				if (item.id === 'griseousorb') {
					set.species = 'Giratina-Origin';
					if (format.banlistTable && format.banlistTable['illegal']) set.ability = 'Levitate';
				} else {
					set.species = 'Giratina';
					if (format.banlistTable && format.banlistTable['illegal']) set.ability = 'Pressure';
				}
			}
			if (template.num == 555) { // Darmanitan
				set.species = 'Darmanitan';
			}
			if (template.num == 648) { // Meloetta
				set.species = 'Meloetta';
			}
			if (template.num == 351) { // Castform
				set.species = 'Castform';
			}
			if (template.num == 421) { // Cherrim
				set.species = 'Cherrim';
			}
			if (template.num == 647) { // Keldeo
				if (set.species === 'Keldeo-Resolution' && set.moves.indexOf('Secret Sword') < 0) {
					set.species = 'Keldeo';
				}
			}
			if (item && item.isNonstandard) problems.push(item.name+' is not a real item.');

			if (set.moves && set.moves.length > 4) {
				problems.push((set.name||set.species) + ' has more than four moves.');
			}
			if (set.level && set.level > 100) {
				problems.push((set.name||set.species) + ' is higher than level 100.');
			}
			return problems;
		}
	},
cute: {
		effectType: 'Banlist',
		validateSet: function(set, format) {
			var item = this.getItem(set.item);
			var template = this.getTemplate(set.species);
			var problems = [];

			if (set.species === set.name) delete set.name;

			if (set.moves && set.moves.length > 4) {
				problems.push((set.name||set.species) + ' has more than four moves.');
			}
			if (set.level && set.level > 100) {
				problems.push((set.name||set.species) + ' is higher than level 100.');
			}


			// limit one of each move
			var moves = [];
			if (set.moves) {
				var hasMove = {};
				for (var i=0; i<set.moves.length; i++) {
					var move = this.getMove(set.moves[i]);
					var moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(set.moves[i]);
				}
			}
			set.moves = moves;

			if (template.num == 351) { // Castform
				set.species = 'Castform';
			}
			if (template.num == 421) { // Cherrim
				set.species = 'Cherrim';
			}
			if (template.num == 493) { // Arceus
				if (set.ability === 'Multitype' && item.onPlate) {
					set.species = 'Arceus-'+item.onPlate;
				} else {
					set.species = 'Arceus';
				}
			}
			if (template.num == 555) { // Darmanitan
				set.species = 'Darmanitan';
			}
			if (template.num == 487) { // Giratina
				if (item.id === 'griseousorb') {
					set.species = 'Giratina-Origin';
					set.ability = 'Levitate';
				} else {
					set.species = 'Giratina';
					set.ability = 'Pressure';
				}
			}
			if (template.num == 647) { // Keldeo
				if (set.species === 'Keldeo-Resolute' && set.moves.indexOf('Secret Sword') < 0) {
					set.species = 'Keldeo';
				}
			}
			if (template.num == 648) { // Meloetta
				set.species = 'Meloetta';
			}
			return problems;
		}
	},
	slowmonspokemon: {
		effectType: 'Banlist',
		validateSet: function(set, format) {
			var problems = [];
			if (set.level < 100) problems.push(set.species + ' must be level 100.');

			return problems;
		}
	},
	sixmoves: {
		effectType: 'Banlist',
		validateSet: function(set, format) {
			var item = this.getItem(set.item);
			var template = this.getTemplate(set.species);
			var problems = [];

			if (set.species === set.name) delete set.name;
			if (template.num == 493) { // Arceus
				if (set.ability === 'Multitype' && item.onPlate) {
					set.species = 'Arceus-'+item.onPlate;
				} else {
					set.species = 'Arceus';
				}
			}
			if (template.num == 487) { // Giratina
				if (item.id === 'griseousorb') {
					set.species = 'Giratina-Origin';
				} else {
					set.species = 'Giratina';
				}
			}
			if (template.num == 555) { // Darmanitan
				set.species = 'Darmanitan';
			}
			if (template.num == 648) { // Meloetta
				set.species = 'Meloetta';
			}
			if (template.num == 351) { // Castform
				set.species = 'Castform';
			}
			if (template.num == 421) { // Cherrim
				set.species = 'Cherrim';
			}
			if (template.num == 647) { // Keldeo
				if (set.species === 'Keldeo-Resolution' && set.moves.indexOf('Secret Sword') < 0) {
					set.species = 'Keldeo';
				}
			}
			if (template.isNonstandard) {
				problems.push(set.species+' is not a real Pokemon.');
			}
			if (set.moves) for (var i=0; i<set.moves.length; i++) {
				var move = this.getMove(set.moves[i]);
				if (move.isNonstandard) {
					problems.push(move.name+' is not a real move.');
				}
			}
			if (set.moves && set.moves.length > 6) {
				problems.push((set.name||set.species) + ' has more than six moves.');
			}
			return problems;
		}
	},
	sametypeclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Same Type Clause: Pokemon in a team must share a type');
		},
		validateTeam: function(team, format) {
			var typeTable = {};
			for (var i=0; i<team.length; i++) {
				var template = this.getTemplate(team[i].species);
				if (!template.types) continue;

				// first type
				var type = template.types[0];
				typeTable[type] = (typeTable[type]||0) + 1;

				// second type
				type = template.types[1];
				if (type) typeTable[type] = (typeTable[type]||0) + 1;
			}
			for (var type in typeTable) {
				if (typeTable[type] >= team.length) {
					return;
				}
			}
			return ["Your team must share a type."];
		}
	},
	tierclashclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Tier Clash Clause: Limit the number of each tier');
		},
		validateTeam: function(team, format) {
		var points = 0
		for(var i = 0; i < team.length; i++) {
			var template = this.getTemplate(team[i].species);
			var tier = template.tier;
			if(tier === 'OU' || tier === 'BL') {
				points = points + 5;
			}
			if(tier === 'Uber') {
				points = points + 6;
			}
			if(tier === 'UU' || tier === 'BL2') {
				points = points + 4;
			}
			if(tier === 'RU' || tier === 'BL3') {
				points = points + 3;
			}
			if(tier === 'NU' || tier === 'NFE') {
				points = points + 2;
			}
			if(tier === 'LC') {
				points = points + 1;
			}
		}
		if(points > 6) {
		return ["You have gone over your total allowed points, which is 6. Ubers are worth 6, OU is worth 5, UU is worth 4, RU is worth 3, NU is worth 2, and LC is worth 1. You currently have used " + points + " points."];
			}
			}
		},
	onepokemonclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'One Pokemon Clause: One Pokemon per team');
		},
		validateTeam: function(team, format) {
			if(team.length > 1) {
				return ["You cannot use more than one Pokemon."];
			}
		}
	},
	skybattleclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Sky Battle Clause: Pokemon must be flying or levitating');
		},
		validateSet: function(set) {
			var notflying = [];
			var template = this.getTemplate(set.species);
			if(set.ability != 'Levitate' && template.types[0] != 'Flying' && template.types[1] != 'Flying') {
				notflying.push(set.species)
			}
			if(notflying.indexOf(set.species) != -1) {
			return[notflying + ' is not levitating or flying.'];
			}
		}
	},				
	monogenclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Monogen Clause: Pokemon must be from one generation');
		},
		validateTeam: function(team, format) {
			var gen = [];
			var problem = [];
			for(var i = 0; i < team.length; i++) {
				var template = this.getTemplate(team[i].species);
				var generation = template.gen;
				gen.push(generation);
			}
			for(var i = 1; i < team.length; i++) {
				var x = i - 1;
				if(gen[i] != gen[x]) {
					problem.push('asdf');
				}
			}
			if(problem[0]) {		
			return["All Pokemon on your team must be from the same generation. Your Pokemon are from generations " + gen.join(", ") + "."];
			}
		}
	},

	monocolorclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Monocolor Clause: Pokemon must be the same color');
		},
		validateTeam: function(team, format) {
			var gen = [];
			var problem = [];
			for(var i = 0; i < team.length; i++) {
				var template = this.getTemplate(team[i].species);
				var generation = template.color;
				gen.push(generation);
			}
			for(var i = 1; i < team.length; i++) {
				var x = i - 1;
				if(gen[i] != gen[x]) {
					problem.push('asdf');
				}
			}
			if(problem[0]) {		
			return["All Pokemon on your team must be the same color. Your Pokemon are the colors " + gen.join(", ") + "."];
			}
		}
	},
	mixedtierclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Mixed Tier Clause: One Pokemon from each tier');
		},
		validateTeam: function(team, format) {
			var uber = false;
			var ou = false;
			var uu = false;
			var ru = false;
			var nu = false;
			var lc = false;
			var missingtiers = [];
			for (var i = 0; i < team.length; i++) {
				var template = this.getTemplate(team[i].species);
				var tier = template.tier;
				if (tier === 'Uber') {
					uber = true;
				}
				if (tier === 'OU' || tier === 'BL') {
					ou = true;
				}
				if (tier === 'UU' || tier === 'BL2') {
					uu = true;
				}
				if (tier === 'RU' || tier === 'BL3') {
					ru = true;
				}
				if (tier === 'NU' || tier === 'NFE') {
					nu = true;
				}
				if (tier === 'LC') {
					lc = true;
				}
			}
			if (uber === false || ou === false || uu === false || ru === false || nu === false || lc === false) {
				if (uber === false) {
					missingtiers.push('Uber');
				}
				if (ou === false) {
					missingtiers.push('OU');
				}
				if (uu === false) {
					missingtiers.push('UU');
				}
				if (ru === false) {
					missingtiers.push('RU');
				}
				if (nu === false) {
					missingtiers.push('NU');
				}
				if (lc === false) {
					missingtiers.push('LC');
				}
				return ['You must have one Pokemon from each of the following tiers: Uber, OU, UU, RU, NU, and LC. You are missing Pokemon from the following tiers: ' + missingtiers.join(', ') + '.'];
			}
		}
	},
	cutemonsclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Cutemons Clause: Pokemon must be cute');
		},
		validateTeam: function(team, format) {
			var cutemons = ['Vaporeon','Mew','Articuno','Starmie','Lapras','Chansey','Marowak','Persian','Wigglytuff','Clefable','Rapidash','Kangaskhan','Butterfree','Ninetales','Politoed','Arcanine','Slowking','Porygon2','Porygon-Z','Victini','Pikachu','Raichu','Ampharos','Bellossom','Jumpluff','Espeon','Umbreon','Hitmontop','Blissey','Raikou','Suicune','Entei','Celebi','Miltank','Linoone','Beautifly','Gardevoir','Masquerain','Breloom','Delcatty','Medicham','Milotic','Castform','Gorebyss','Luvdisc','Jirachi','Piplup','Roserade','Vespiquen','Pachirisu','Lopunny','Gabite','Togetic','Togekiss','Leafeon','Glaceon','Froslass','Ditto','Mesprit','Cresselia','Manaphy','Lucario','Serperior','Cottonee','Whimsicott','Lilligant','Cinccino','Swanna','Chandelure','Mienshao','Mandibuzz','Virizion','Ursaring','Eevee','Munchlax','Snorlax','Growlithe','Clefairy','Drifblim','Phione','Lickilicky','Ponyta','Furret','Uxie','Azelf','Weavile','Mudkip','Marshtomp','Swampert','Quagsire','Swinub','Lumineon','Flaaffy','Grotle','Floatzel','Abomasnow','Luxray','Heatran','Ambipom','Phanpy','Donphan','Ludicolo','Munna','Musharna','Swoobat','Alomomola','Solosis','Duosion','Reuniclus','Dodrio','Jolteon','Chimecho','Dragonair','Mothim','Azumarill','Hippopotas','Spheal','Sealeo','Walrein','Flareon','Mamoswine','Liepard','Galvantula','Gastrodon','Dragonite','Cherrim','Kricketune','Zorua','Zoroark','Meloetta','Maractus','Rufflet','Braviary','Pidgeot','Keldeo','Emolga','Jellicent','Audino','Simipour','Zebstrika','Stoutland','Mantine','Staraptor','Metang','Combusken','Grovyle','Volbeat','Illumise','Mawile','Plusle','Minun','Kingdra','Spinda','Xatu','Granbull','Sandslash','Latias','jd','Sawsbuck'];
			var notcute = [];
			for (var i = 0; i < team.length; i++) {
				var template = this.getTemplate(team[i].species);
				if (cutemons.indexOf(template.species) === -1) {
					notcute.push(template.species);
				}
			}
			if (notcute[0] != undefined) {
				return ['The following Pokemon are not cute enough: ' + notcute.join(", ") + '.'];
			}
		}
	},
	monostatclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Monostat Clause: Pokemon must all have the same highest base stat');
		},
		validateTeam: function(team, format) {
			var problem = [];
			for(var i = 0; i < team.length; i++) {
				var template = this.getTemplate(team[i].species);
				var stats = template.stats;
				var a = Math.max(stats.spa,stats.spd,stats.atk,stats.hp,stats.def,stats.spe);
				problem.push(a)
			}
			if(problem[0]) {		
			return[problem];
			}
		}
	},
	haxclause: {
		effectType: 'Rule',
		onStart: function() {
			this.add('rule', 'Hax Clause');
		},
		onModifyMovePriority: -100,
		onModifyMove: function(move) {
			if (move.secondaries) {
				for (var s = 0; s < move.secondaries.length; ++s) {
					move.secondaries[s].chance = 100;
				}
			}
			if (move.accuracy !== true && move.accuracy <= 99) {
				move.accuracy = 0;
				if (move.name.indexOf(' ') > -1) {
					var moveName = move.name.split(' ');
					moveName[1] = 'Miss';
					move.name = moveName[0] + '  ' + moveName[1];
				} else {
					move.name = move.name.substr(0, move.name.length-2) + 'fail';
				}
			}
			move.willCrit = true;
		}
	}
};
