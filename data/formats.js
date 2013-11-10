// Note: These are the rules that formats use
// The list of formats is stored in config/formats.js

exports.BattleFormats = {

	// Rulesets
	///////////////////////////////////////////////////////////////////

	standardcutemons: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'HP Percentage Mod'],
		banlist: []
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
	standard: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'HP Percentage Mod'],
		banlist: ['Unreleased', 'Illegal']
	},
	standardpokebank: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'Moody Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod'],
		banlist: ['Illegal']
	},
	standardnext: {
		effectType: 'Banlist',
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'OHKO Clause', 'HP Percentage Mod'],
		banlist: ['Illegal', 'Soul Dew']
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
	standardgbu: {
		effectType: 'Banlist',
		ruleset: ['Species Clause', 'Item Clause'],
		banlist: ['Unreleased', 'Illegal', 'Dark Void', 'Soul Dew',
			'Mewtwo',
			'Lugia',
			'Ho-Oh',
			'Kyogre',
			'Groudon',
			'Rayquaza',
			'Dialga',
			'Palkia',
			'Giratina', 'Giratina-Origin',
			'Arceus', 'Arceus-Bug', 'Arceus-Dark', 'Arceus-Dragon', 'Arceus-Electric', 'Arceus-Fairy', 'Arceus-Fighting', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Ghost', 'Arceus-Grass', 'Arceus-Ground', 'Arceus-Ice', 'Arceus-Poison', 'Arceus-Psychic', 'Arceus-Rock', 'Arceus-Steel', 'Arceus-Water',
			'Reshiram',
			'Zekrom',
			'Kyurem-White',
			'Xerneas',
			'Yveltal',
			'Zygarde'
		]
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
			var ability = {};
			if (set.ability) {
				ability = this.getAbility(set.ability);
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

			if (template.requiredItem) {
				if (template.isMega) {
					// Mega evolutions evolve in-battle
					set.species = template.baseSpecies;
					var baseAbilities = Tools.getTemplate(set.species).abilities;
					var niceAbility = false;
					for (var i in baseAbilities) {
						if (baseAbilities[i] === set.ability) {
							niceAbility = true;
							break;
						}
					}
					if (!niceAbility) set.ability = baseAbilities['0'];
				}
				if (item.name !== template.requiredItem) {
					problems.push((set.name||set.species) + ' needs to hold '+template.requiredItem+'.');
				}
			}
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
				if (set.species === 'Darmanitan-Zen' && ability.id !== 'zenmode') {
					problems.push('Darmanitan-Zen transforms in-battle with Zen Mode.');
				}
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
					problems.push('Keldeo-Resolute needs to have Secret Sword.');
				}
				set.species = 'Keldeo';
			}
			if (template.num == 648) { // Meloetta
				if (set.species === 'Meloetta-Pirouette' && set.moves.indexOf('Relic Song') < 0) {
					problems.push('Meloetta-Pirouette transforms in-battle with Relic Song.');
				}
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
	abilityexchangepokemon: {
		effectType: 'Banlist',
		validateTeam: function(team, format) {
			var selectedAbilities = [];
			var defaultAbilities = [];
			var bannedAbilities = {adaptability:1, arenatrap:1, contrary:1, hugepower:1, imposter:1, purepower:1, prankster:1, serenegrace:1, shadowtag:1, simple:1, speedboost:1, tintedlens:1, wonderguard:1};
			var problems = [];
			for (var i=0; i<team.length; i++) {
				var template = this.getTemplate(team[i].species);
				var ability = this.getAbility(team[i].ability);
				var abilities = Object.extended(template.abilities).values();
				if (ability.id in bannedAbilities && abilities.indexOf(ability.name) === -1) {
					problems.push(ability.name+' is banned on Pokemon that do not legally have it.');
				}
				selectedAbilities.push(ability.name);
				defaultAbilities.push(abilities);
			}
			if (problems.length) return problems;
			if (!this.checkAbilities(selectedAbilities, defaultAbilities)) {
				return ['That is not a valid Ability Exchange team.'];
			}
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
	}
};
