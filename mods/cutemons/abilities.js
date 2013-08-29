exports.BattleAbilities = {
	"pedophilia": {
		desc: "When this Pokemon enters the field, its opponents cannot switch or flee the battle unless they have the same ability, are holding Shed Shell, or they use the moves Baton Pass or U-Turn.",
		shortDesc: "Prevents foes from switching out normally unless they also have this Ability.",
		onFoeModifyPokemon: function(pokemon) {
			if (pokemon.ability !== 'pedophilia') {
				pokemon.trapped = true;
			}
		},
		id: "pedophilia",
		name: "Pedophilia",
		rating: 5,
		num: 1000
	}
};