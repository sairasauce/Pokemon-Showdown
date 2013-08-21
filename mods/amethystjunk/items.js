exports.BattleItems = {
	lightball: {
		inherit: true,
		onModifyAtk: function(atk, pokemon) {
			if (pokemon.baseTemplate.species === 'Pikachu' || pokemon.baseTemplate.species === 'Emolga' || pokemon.baseTemplate.species === 'Pachirisu' || pokemon.baseTemplate.species === 'Plusle' || pokemon.baseTemplate.species === 'Minun') {
				return atk * 2;
			}
		},
		onModifySpA: function(spa, pokemon) {
			if (pokemon.baseTemplate.species === 'Pikachu' || pokemon.baseTemplate.species === 'Emolga' || pokemon.baseTemplate.species === 'Pachirisu' || pokemon.baseTemplate.species === 'Plusle' || pokemon.baseTemplate.species === 'Minun') {
				return spa * 2;
			}
		}
	}
};