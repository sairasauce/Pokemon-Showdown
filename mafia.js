//A lot of credit goes to StevoDuhHero - while he didn't directly help me with scripting this, I did learn a lot from his tournament files.

exports.mafia = function(m) {
	if (typeof m != "undefined") var mafia = m; else var mafia = new Object();
	var mafiaFunctions = {
		//reset mafia in the room - used once a round ends.
		reset: function(rid) {
			mafia[rid] = {
				game: false,
				storyteller: undefined,
				angel: new Array(),
				detective: new Array(),
				mafia: new Array(),
				players: new Array(),
				deadPlayers: new Array(),
				savedPlayers: new Array(),
				size: 0,
				spots: 0,
				//status: 0 = not started, 1 = day (morning), 2 = night, 3 = game start, 4 = day (evening)
				status: 0,
				storyTime: false,
				story: '',
				voteKill: new Array(),
				voteSave: new Array(),
				toBeKilled: new Array(),
				pollOptions: new Array(),
				hasVoted: new Array(),
				killed: false,
				saved: false,
				identified: false
			};
		},
		resetVotes: function(room) {
			mafia[room].savedPlayers = new Array();
			mafia[room].voteKill = new Array();
			mafia[room].voteSave = new Array();
			mafia[room].killed = false;
			mafia[room].saved = false;
			mafia[room].identified = false;
		},
		shuffle: function(players) {
			for (var j, x, i = players.length; i; j = Math.floor(Math.random() * i), x = players[--i], players[i] = players[j], players[j] = x);
			return players;
		},
		showStory: function(room, story) {
			Rooms.get(room).add('|raw|<hr><font size = 2>' + mafia[room].story + '</font><hr>');
			mafia[room].storyTime = false;
		},
		night: function(room) {
			for (var i = 0; i < mafia[room].mafia.length; i++) {
				if (mafia[room].deadPlayers.indexOf(mafia[room].mafia[i]) === -1) {
					Users.get(mafia[room].mafia[i]).send('|pm|*MafiaBot|'+Users.get(mafia[room].mafia[i]).getIdentity()+'|Night has fallen, so PM the other mafia to decide whom to kill. Use /mafialist for a list of the other mafia. Once you\'ve decided, one of you should use /killplayer [name].');
				}
			}
			for (var i = 0; i < mafia[room].angel.length; i++) {
				if (mafia[room].deadPlayers.indexOf(mafia[room].angel[i]) === -1) {
					Users.get(mafia[room].angel[i]).send('|pm|*MafiaBot|'+Users.get(mafia[room].angel[i]).getIdentity()+'|Night has fallen, so PM the other angel to decide whom to save. Use /angellist for a list of the other angels. Once you\'ve decided, one of you should use /saveplayer [name].');
				}
			}
			for (var i = 0; i < mafia[room].detective.length; i++) {
				if (mafia[room].deadPlayers.indexOf(mafia[room].detective[i]) === -1) {
					Users.get(mafia[room].detective[i]).send('|pm|*MafiaBot|'+Users.get(mafia[room].detective[i]).getIdentity()+'|Night has fallen, so decide whom to identify. Once you\'ve decided, you should use /identifyplayer [name].');
				}
			}
			mafia[room].status = 2;
		},
		day: function(room) {
			var storyteller = mafia[room].storyteller;
			Rooms.get(room).addRaw('The night has ended! Please wait while <b>' + Users.get(storyteller).name + '</b> writes a story.');
			Users.get(storyteller).send('|pm|*MafiaBot|'+Users.get(storyteller).getIdentity()+'|The mafia and angels and detectives have done their work. The mafia have chosen to kill **' + Users.get(mafia[room].voteKill[0]).name + '** and the angels have chosen to save **' + Users.get(mafia[room].voteSave[0]).name + '**. Now, use /story [context] to show what happened while the game moves into the day.');
			if (mafia[room].voteKill[0] === mafia[room].voteSave[0]) {
				Users.get(storyteller).send('|pm|*MafiaBot|'+Users.get(storyteller).getIdentity()+'|Keep in mind that they decided to kill and save the same player, therefore, no one died this round.');
			} else {
				mafia[room].deadPlayers.push(mafia[room].voteKill[0]);
			}
			mafia[room].storyTime = true;
			mafia[room].status = 1;
		},
		voteTime: function(room) {
			//create the poll here
			var poll = '<ul>';
			for (var i = 0; i < mafia[room].players.length; i++) {
				if (mafia[room].deadPlayers.indexOf(mafia[room].players[i]) === -1) {
					poll += '<li>'+Users.get(mafia[room].players[i]).name+'</li>';
					mafia[room].pollOptions.push(Users.get(mafia[room].players[i]).userid+':0');
				}
			}
			Rooms.get(room).addRaw('With that, it\'s time to vote for someone to be killed by the townspeople. Use /voteplayer [option] to choose one of the people.<hr>' + poll + '</ul>You will have 3 minutes to vote.');
		},
		endVote: function(room) {
			mafia[room].status = 4;
			var pollResults = '<ul>';
			var votes = new Array();
			var isMax = true;
			for (var u = 0; u < mafia[room].pollOptions.length; u++) {
				var parts = mafia[room].pollOptions[u].split(':');
				pollResults += '<li>'+parts[0]+': '+parts[1]+'</li>';
				votes.push(Number(parts[1]));
			}
			Array.max = function(array){
				return Math.max.apply(Math, array);
			};
			var mostVotes = Array.max(votes)
			var isMostVotes = new Array();
			for (var i = 0; i < mafia[room].pollOptionslength; i++) {
				var parts = mafia[room].pollOptions[u].split(':');
				if (mostVotes === Number(parts[1])) {
					isMostVotes.push(parts[0]);
				}
			}
			if (isMostVotes.length > 1) {
				isMax = false;
			}
			//what do i do if more than one person has the most votes?
			//make an array, push all users with that many votes into it, if its length is > 1, set a variable to false, then do the checking
			if (isMax) {
			var isMafia = '';
				for (var u = 0; u < mafia[room].pollOptions.length; u++) {
					var parts = mafia[room].pollOptions[u].split(':');
					if (mostVotes === Number(parts[1])) {
						var dead = parts[0];
						if (mafia[room].mafia.indexOf(dead) > -1) {
							isMafia += 'They were part of the mafia. Congratulations.';
						}
					}
				}
			}
			var results = pollResults
			if (isMax) {
				results += Users.get(dead).name+' was killed by the townspeople. '+isMafia;
			} else {
				results += 'Since no one received a deciding number of votes, no one died.';
			}
			Rooms.get(room).addRaw(results);
			if (isMax) {
				mafia[room].deadPlayers.push(Users.get(dead).userid);
			}
			mafia.checkWin(room);
		},			
		checkWin: function(room) {
			var aliveMafia = 0;
			var gameMafia = new Array();
			for (var i = 0; i < mafia[room].mafia.length; i++) {
				gameMafia.push(Users.get(mafia[room].mafia[i]).name);
				if (mafia[room].deadPlayers.indexOf(mafia[room].mafia[i]) === -1) {
					aliveMafia++
				}
			}
			if (aliveMafia - (mafia[room].players.length - mafia[room].deadPlayers.length) === 0) {
				Rooms.get(room).add('|raw|<hr><h2>Since all the remaining players are mafia, the game is over. Congratulations to the mafia! The mafia were: '+gameMafia.join(", ")+'</hr>');
				mafia.reset(room);
			}
			if (mafia[room].players.length - mafia[room].deadPlayers.length <= aliveMafia) {
				Rooms.get(room).add('|raw|<hr><h2>Since there is an equal number of mafia and non-mafia remaining, the game is over. Congratulations to the mafia! The mafia were: '+gameMafia.join(", ")+'</hr>');
				mafia.reset(room);
			}
			if (aliveMafia === 0) {
				Rooms.get(room).add('|raw|<hr><h2>Since there are no more mafia, the game is over. Congratulations to the townpeople! The mafia were: '+gameMafia.join(", ")+'</hr>');
				mafia.reset(room);
			}
			else {
				if (mafia[room].status === 1) {
					mafia.voteTime(room);
					setTimeout(function() {mafia.endVote(room);}, 180000);
				}
				if (mafia[room].status === 4) {
					mafia.night(room);
				}
			}
		},
		start: function(room) {
			var size = mafia[room].size;
			var players = mafia[room].players;
			var mafias = 0;
			var angels = 0;
			var detectives = 0;
			var verb = "are";
			var angelCount = "angels";
			var detectiveCount = "detectives";
			if (size > 16) {
				detectiveCount = "detective";
				mafias = 3;
				angels = 2;
				detectives = 1;
			}
			if (size > 8 && size <= 16) {
				detectiveCount = "detective";
				angelCount = "angel";
				mafias = 2;
				angels = 1;
				detectives = 1;
			}
			if (size <= 8) {
				verb = "is";
				angelCount = "angel";
				mafias = 1;
				angels = 1;
				detectives = 0;
			}
			var randomPlayers = mafia.shuffle(players);
			for (var i = 0; i < mafias; i++) {
				mafia[room].mafia.push(randomPlayers[i]);
			}
			for (var i = mafias; i < (mafias + angels); i++) {
				mafia[room].angel.push(randomPlayers[i]);
			}
			for (var i = (mafias + angels); i < (mafias + angels + detectives); i++) {
				mafia[room].detective.push(randomPlayers[i]);
			}
			Rooms.get(room).addRaw('The round of Mafia has started! This round, there ' +  verb + ' <b>' + mafias + '</b> mafia, <b>' + angels + '</b> ' + angelCount + ', and <b>' + detectives + '</b> ' + detectiveCount + '. Night has fallen! Go to sleep!');
			Users.get(mafia[room].storyteller).send('|pm|*MafiaBot|'+Users.get(mafia[room].storyteller).getIdentity()+'|The round of Mafia has begun. You can use /roles to view who the mafia, angels, and detectives are.');
			for (var i = 0; i < mafia[room].mafia.length; i++) {
				Users.get(mafia[room].mafia[i]).send('|pm|*MafiaBot|'+Users.get(mafia[room].mafia[i]).getIdentity()+'|You are one of the mafia for this round. The full list: ' + mafia[room].mafia.join(',') + '.');
			}
			for (var i = 0; i < mafia[room].angel.length; i++) {
				Users.get(mafia[room].angel[i]).send('|pm|*MafiaBot|'+Users.get(mafia[room].angel[i]).getIdentity()+'|You are one of the angels for this round. The full list: ' + mafia[room].angel.join(',') + '.');
			}
			for (var i = 0; i < mafia[room].detective.length; i++) {
				Users.get(mafia[room].detective[i]).send('|pm|*MafiaBot|'+Users.get(mafia[room].detective[i]).getIdentity()+'|You are the detective for this round.');
			}
		}
	};
	for (var i in mafiaFunctions) {
		mafia[i] = mafiaFunctions[i];
	}
	for (var i in Rooms.rooms) {
		if (Rooms.rooms[i].type == "chat" && !mafia[i]) {
			mafia[i] = new Object();
			mafia.reset(i);
		}
	}
	return mafia;
};
	
var cmds = {
/*	//edited commands (only in case mafia needs to be updated - which I don't see in the forseeable future. It's in there, though)
	hotpatch: function(target, room, user) {
		if (!target) return this.parse('/help hotpatch');
		if (!user.can('hotpatch')) return false;

		this.logEntry(user.name + ' used /hotpatch ' + target);

		if (target === 'chat') {
			try {
				CommandParser.uncacheTree('./command-parser.js');
				CommandParser = require('./command-parser.js');
				CommandParser.uncacheTree('./mafia.js');
				mafia = require('./mafia.js').mafia(mafia);
				return this.sendReply('Chat commands have been hot-patched.');
			} catch (e) {
				return this.sendReply('Something failed while trying to hotpatch chat: \n' + e.stack);
			}
		} else if (target === 'battles') {

			Simulator.SimulatorProcess.respawn();
			return this.sendReply('Battles have been hotpatched. Any battles started after now will use the new code; however, in-progress battles will continue to use the old code.');

		} else if (target === 'formats') {
			try {
				// uncache the tools.js dependency tree
				CommandParser.uncacheTree('./tools.js');
				// reload tools.js
				Data = {};	
				Tools = require('./tools.js'); // note: this will lock up the server for a few seconds
				// rebuild the formats list
				Rooms.global.formatListText = Rooms.global.getFormatListText();
				// respawn simulator processes
				Simulator.SimulatorProcess.respawn();
				// broadcast the new formats list to clients
				Rooms.global.send(Rooms.global.formatListText);
	
				return this.sendReply('Formats have been hotpatched.');
			} catch (e) {
				return this.sendReply('Something failed while trying to hotpatch formats: \n' + e.stack);
			}
		}
		this.sendReply('Your hot-patch command was unrecognized.');
	},*/
	
	//mafia commands
	mafiahelp: function(target, room, user) {
		if (!this.canBroadcast()) return false;
		this.sendReplyBox();
	},
	
	mafia: function(target, room, user) {
		if (room.id != 'mafia') {
			return this.sendReply('This should only be played in the room Mafia due to its inherently spammy nature.');
		}
		if (!this.can('mute', null, room)) {
			return this.sendReply('You do not have enough authority to do this.');
		}
		if (mafia[room.id].game) {
			return this.sendReply('There is already a game of mafia going on.');
		}
		if (!target) {
			return this.sendReply('The correct syntax for this command is /mafia [size]');
		}
		if (isNaN(target)) {
			return this.sendReply('Please use a real number.');
		}
		if (target < 5) {
			return this.sendReply('Don\'t make it boring.');
		}
		mafia[room.id].game = true;
		mafia[room.id].storyteller = user.userid;
		mafia[room.id].size = target;
		mafia[room.id].spots = target;
		mafia[room.id].status = 0;
		this.add('|raw|<hr><h2>Sign-ups have started for a new game of Mafia! This game has ' + mafia[room.id].size + ' spots and is being run by ' + user.name + '!</h2>Type /jm or /joinmafia to join!<hr>');
	},
	
	mafiaremind: 'mremind',
	mremind: function(target, room, user) {
		if (room.id != 'mafia') {
			return this.sendReply('This should only be played in the room Mafia due to its inherently spammy nature.');
		}
		if (!this.canBroadcast()) return false;
		if (mafia[room.id].status != 0) {
			return this.sendReply('Mafia is not in sign-ups right now.');
		}
		this.sendReply('|raw|<hr><h2>Sign-ups are in progress for a new game of Mafia! This game has ' + mafia[room.id].size + ' spots, ' + mafia[room.id].spots + ' remaining, and is being run by ' + user.name + '!</h2>Type /jm or /joinmafia to join!<hr>');	
	},
	
	mafiastatus: function(target, room, user) {
		if (room.id != 'mafia') {
			return this.sendReply('This should only be played in the room Mafia due to its inherently spammy nature.');
		}
		if (!this.canBroadcast()) {
			return this.sendReply('You do not have enough authority to do this.');
		}
		var time = '';
		var deadPlayers = '';
		if (mafia[room.id].status === 0) {
			time += 'The round is still in signups.';
		}
		if (mafia[room.id].status === 1) {
			time += 'It is currently daytime.';
		}
		if (mafia[room.id].status === 2) {
			time += 'It is currently nighttime.';
		}
		if (mafia[room.id].deadPlayers[0]) {
			deadPlayers += 'The dead players: ';
			deads = new Array();
			for (var i = 0; i < mafia[room.id].deadPlayers.length; i++) {
				deads.push(Users.get(mafia[room.id].deadPlayers[i]).name);
			}
			deadPlayers += deads.join(', ');
		}
		this.sendReply(time + '\n' + deadPlayers);
	},
	
	voteplayer: function(target, room, user) {
		if (room.id != 'mafia') {
			return this.sendReply('This should only be played in the room Mafia due to its inherently spammy nature.');
		}
		if (mafia[room.id].status != 1) {
			return this.sendReply('This is not the time to do that!');
		}
		if (mafia[room.id].hasVoted.indexOf(user.userid) > -1) {
			return this.sendReply('You have already voted!');
		}
		if (mafia[room.id].players.indexOf(user.userid) === -1) {
			return this.sendReply('You cannot vote because you are not part of this game.');
		}
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('This user was not found.');
		}
		var vote = false;
		for (var i = 0; i < mafia[room.id].pollOptions.length; i++) {
			var userid = mafia[room.id].pollOptions[i].split(':');
			if (userid[0] === targetUser.userid) {
				votes = Number(userid[1]);
				votes++;
				mafia[room.id].pollOptions[i] = targetUser.userid+':'+votes;
				vote = true;
			}
		}
		if (vote === true) {
			return this.sendReply('You are now voting for ' + targetUser.name);
			mafia[room.id].hasVoted.push(User.userid);
		} else {
			return this.sendReply(targetUser.name + ' is not an option to vote for.');
		}
	},
	
	endmafia: 'resetmafia',
	resetmafia: function(target, room, user) {
		if (room.id != 'mafia') {
			return this.sendReply('This should only be played in the room Mafia due to its inherently spammy nature.');
		}
		if (!this.can('mute', null, room)) {
			return this.sendReply('You do not have enough authority to do this.');
		}
		if (mafia[room.id].game === false) {
			return this.sendReply('There is no a game of mafia going on.');
		}
		mafia.reset(room.id);
		this.add('|raw|<hr><h3>' + user.name + ' has ended the game of Mafia.</h3><hr>');
	},
	
	joinmafia: 'jm',
	jm: function(target, room, user) {
		if (room.id != 'mafia') {
			return this.sendReply('This should only be played in the room Mafia due to its inherently spammy nature.');
		} 
		if (!mafia[room.id].game) {
			return this.sendReply('There is no a game of mafia going on.');
		}
		if (mafia[room.id].status > 0) {
			return this.sendReply('The current game of Mafia has already moved past sign-ups.');
		}
		if (mafia[room.id].players.indexOf(user.userid) > -1 || user.userid === mafia[room.id].storyteller) {
			return this.sendReply('You are already signed up for this game.');
		}
		mafia[room.id].players.push(user.userid);
		mafia[room.id].spots = mafia[room.id].spots - 1;
		var verb = "are";
		var spots = "spots";
		if (mafia[room.id].spots === 1) {
			verb = "is";
			spots = "spot";
		}
		this.add('|raw|<b>' + user.name + '</b> has joined the game of Mafia! There ' + verb + ' <b>' + mafia[room.id].spots + '</b> ' + spots + ' remaining!');
		if (mafia[room.id].spots === 0) {
			mafia.start(room.id);
			mafia.night(room.id);
		}
	},
	
	context: 'story',
	story: function(target, room, user) {
		if (room.id != 'mafia') {
			return this.sendReply('This should only be played in the room Mafia due to its inherently spammy nature.');
		} 
		if (!mafia[room.id].game) {
			return this.sendReply('There is no a game of mafia going on.');
		}
		if (user.userid != mafia[room.id].storyteller) {
			return this.sendReply('You are not the host, thus you cannot tell the story.');
		}
		if (!target) {
			return this.sendReply('The correct syntax for this command is: /story [context]');
		}
		if (!mafia[room.id].storyTime) {
			return this.sendReply('This is not the right time to do that. Wait until the next day.');
		}
		mafia[room.id].story = target;
		mafia.showStory(room.id, mafia[room.id].story);
		mafia.checkWin(room.id);
		/*if (mafia[room.id].status === 1) {
			mafia.voteTime(room.id);
			setTimeout(function() {mafia.endVote(room.id);}, 180000);
		}*/
	},
	
	killplayer: 'saveplayer',
	identifyplayer: 'saveplayer',
	saveplayer: function(target, room, user, connection, cmd) {
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('The correct syntax for this command is: /' + cmd + ' [user]');
		}
		if (mafia[room.id].status != 2) {
			return this.sendReply('This isn\'t the right time to do that.');
		}
		if (mafia[room.id].players.indexOf(targetUser.userid) === -1) {
			return this.sendReply('The user is not in the game.');
		}
		if (cmd === 'killplayer') {
			if (mafia[room.id].mafia.indexOf(user.userid) != -1) {
				mafia[room.id].voteKill.push(targetUser.userid);
				this.sendReply('You have voted to kill ' + targetUser.name + '.');
				if (mafia[room.id].voteKill.length === mafia[room.id].mafia.length) {
					if (mafia[room.id].voteKill.length === 1) {
						mafia[room.id].toBeKilled.push(targetUser.userid);
						mafia[room.id].killed = true;
					}
					for (var i = 1; i < mafia[room.id].voteKill.length; i++) {
						if (mafia[room.id].voteKill.length > 1) {
							if (mafia[room.id].voteKill[i] === mafia[room.id].voteKill[i-1]) {
								mafia[room.id].killed = true;
							} else {
								mafia[room.id].killed = false;
							}
						}
					}
					if (mafia[room.id].killed === false && mafia[room.id].voteKill.length > 1) {
						mafia[room.id].toBeKilled = new Array();
						//each angel should receive a pm saying they don't match
						for (var i = 0; i < mafia[room.id].mafia.length; i++) {
							Users.get(mafia[room].mafia[i]).send('|pm|*MafiaBot|'+Users.get(mafia[room].mafia[i]).getIdentity()+'|Your votes do not match up! Make sure to confer with the other mafia and vote for the same person.');
						}
					}
					if (mafia[room.id].killed === true && mafia[room.id].voteKill.length > 1) {
						mafia[room.id].toBeKilled.push(targetUser.userid);
						this.sendReply('You have agreed to kill ' + targetUser.name + '.');
					}
				} else {
					return this.sendReply('Thanks for sending your choice, we\'re still waiting on the other votes.');
				}
			} else {
				return this.sendReply('You\'re not a mafia this round!');
			}
		}
		if (cmd === 'saveplayer') {
			if (mafia[room.id].angel.indexOf(user.userid) != -1) {
				mafia[room.id].voteSave.push(targetUser.userid);
				this.sendReply('You have voted to save ' + targetUser.name + '.');
				if (mafia[room.id].voteSave.length === mafia[room.id].angel.length) {
					if (mafia[room.id].voteSave.length === 1) {
						mafia[room.id].saved = true;
					}
					for (var i = 1; i < mafia[room.id].voteSave.length; i++) {
						if (mafia[room.id].voteSave.length > 1) {
							if (mafia[room.id].voteSave[i] === mafia[room.id].voteSave[i-1]) {
								mafia[room.id].saved = true;
							} else {
								mafia[room.id].saved = false;
							}
						}
					}
					if (mafia[room.id].saved === false && mafia[room.id].voteSave.length > 1) {
						mafia[room.id].saved = new Array();
						for (var i = 0; i < mafia[room.id].angel.length; i++) {
							Users.get(mafia[room].angel[i]).send('|pm|*MafiaBot|'+Users.get(mafia[room].angel[i]).getIdentity()+'|Your votes do not match up! Make sure to confer with the other angels and vote for the same person.');
						}
					}
					if (mafia[room.id].saved === true && mafia[room.id].voteSave.length > 1) {
						mafia[room.id].savedPlayers.push(targetUser.userid);
						this.sendReply('You have agreed to save ' + targetUser.name + '.');
					}
				} else {
					return this.sendReply('Thanks for sending your choice, we\'re still waiting on the other votes.');
				}
			} else {
				return this.sendReply('You\'re not an angel this round!');
			}
		}
		if (cmd === 'identifyplayer') {
			if (mafia[room.id].detective.indexOf(user.userid) != -1) {
				if (mafia[room.id].mafia.indexOf(targetUser.userid) != -1) {
					this.sendReply(targetUser.name + ' is one of the mafia for this round.');
				} else {
					this.sendReply(targetUser.name + ' is not one of the mafia.');
				}
				mafia[room.id].identified = true;
			}
		}
		if (mafia[room.id].detective[0] === undefined) {
			mafia[room.id].identified = true;
		}
		if (mafia[room.id].killed === true && mafia[room.id].saved === true && mafia[room.id].identified === true) {
			mafia.day(room.id);
			mafia.resetVotes(room.id);
		}
	},
	
	angellist: 'mafialist',
	mafialist: function(target, room, user, connection, cmd) {
		if (!mafia[room.id].game) {
			return this.sendReply('There is no a game of mafia going on.');
		}
		if (cmd === 'angellist') {
			var angels = new Array();
			if (mafia[room.id].angel.indexOf(user.userid) < 0) {
				return this.sendReply('You are not an angel and cannot view the list of angels.');
			}
			for (var i = 0; i < mafia[room.id].angel.length; i++) {
				angels.push(Users.get(mafia[room.id].angel[i]).name);
			}
			return this.sendReply('The angels for this round are: '+angels.join(", "));
		}
		if (cmd === 'mafialist') {
			var mafias = new Array();
			if (mafia[room.id].mafia.indexOf(user.userid) < 0) {
				return this.sendReply('You are not an mafia and cannot view the list of mafia.');
			}
			for (var i = 0; i < mafia[room.id].mafia.length; i++) {
				mafias.push(Users.get(mafia[room.id].mafia[i]).name);
			}
			return this.sendReply('The mafia for this round are: '+mafias.join(", "));
		}
	},
	
	roles: function(target, room, user) {
		if (!mafia[room.id].game) {
			return this.sendReply('There is no a game of mafia going on.');
		}
		if (mafia[room.id].storyteller != user.userid) {
			return this.sendReply('You are not running the game, so you cannot check this.');
		}
		var mafias = new Array();
		var angels = new Array();
		var detectives = new Array();
		for (var i = 0; i < mafia[room.id].mafia.length; i++) {
			mafias.push(Users.get(mafia[room.id].mafia[i]).name);
		}
		for (var i = 0; i < mafia[room.id].angel.length; i++) {
			angels.push(Users.get(mafia[room.id].angel[i]).name);
		}
		if (mafia[room.id].detective[0]) {
			detectives.push(Users.get(mafia[room.id].detective[0]).name);
		}
		this.sendReply('The mafia are: '+mafias.join(', '));
		this.sendReply('The angel(s) are: '+angels.join(', '));
		this.sendReply('The detective is (if there are any): '+detectives);
	}
};

for (var i in cmds) CommandParser.commands[i] = cmds[i];	