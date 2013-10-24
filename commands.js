/**
 * System commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are system commands - commands required for Pokemon Showdown
 * to run. A lot of these are sent by the client.
 *
 * If you'd like to modify commands, please go to config/commands.js,
 * which also teaches you how to use commands.
 *
 * @license MIT license
 */

var crypto = require('crypto');
var poofeh = true;
var ipbans = fs.createWriteStream('config/ipbans.txt', {'flags': 'a'});
var logeval = fs.createWriteStream('logs/eval.txt', {'flags': 'a'});
var avatar = fs.createWriteStream('config/avatars.csv', {'flags': 'a'});
//spamroom
if (typeof spamroom == "undefined") {
        spamroom = new Object();
}
if (!Rooms.rooms.spamroom) {
        Rooms.rooms.spamroom = new Rooms.ChatRoom("spamroom", "spamroom");
        Rooms.rooms.spamroom.isPrivate = true;
}
//rps
var rockpaperscissors  = false;
var numberofspots = 2;
var gamestart = false;
var rpsplayers = new Array();
var rpsplayersid = new Array();
var player1response = new Array();
var player2response = new Array();
//gym leaders
var ougymleaders = ['gymlederewok','gymlederross','elitfourross','elitefournord','gymledersam','gymlederlove','onlylove','gymledermassman','gymledercuddly','miner0','gymlederboss','chmpionboss','gymlederdelibird','colonialmustang','laxxus','gymledermustang','miloticnob','gymledermarlon','aortega','gymledervolkner','modernwolf','johanl','energ218','gymlderhope','gymledereon','piiiikachuuu','jd','elitefurkozman','gymlederbrawl'];
var admins = ['elitefournord','jd','energ218','colonialmustang','piiiikachuuu','elitefurkozman'];
//tells
if (typeof tells === 'undefined') {
	tells = {};
}

var commands = exports.commands = {

	pickrandom: function (target, room, user) {
		if (!target) return this.sendReply('/pickrandom [option 1], [option 2], ... - Randomly chooses one of the given options.');
		if (!this.canBroadcast()) return;
		var targets;
		if (target.indexOf(',') === -1) {
			targets = target.split(' ');
		} else {
			targets = target.split(',');
		};
		var result = Math.floor(Math.random() * targets.length);
		return this.sendReplyBox(targets[result].trim());
	},
	/*********************************************************
	 * Badge System Base                                     *
	 *********************************************************/
	showbadges: function(target, room, user, connection) {
	if (!this.canBroadcast()) return;
	if (!target) {
	var data = fs.readFileSync('config/badges.csv','utf8')
		var match = false;
		var numBadges = 0;
		var stuff = (''+data).split("\n");
		for (var i = stuff.length; i > -1; i--) {
			if (!stuff[i]) continue;
			var row = stuff[i].split(",");
			var userid = toUserid(row[0]);
			if (user.userid == userid) {
			var x = Number(row[1]);
			var numBadges = x;
			match = true;
			if (match === true) {
				break;
			}
			}
		}
		if (match === true) {
			this.sendReplyBox(user.name + ' has ' + numBadges + ' badge(s).');
		}
		if (match === false) {
			connection.sendTo(room, 'You have no badges.');
		}
		user.badges = numBadges;
	} else {
	var data = fs.readFileSync('config/badges.csv','utf8')
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		var match = false;
		var numBadges = 0;
		var stuff = (''+data).split("\n");
		for (var i = stuff.length; i > -1; i--) {
			if (!stuff[i]) continue;
			var row = stuff[i].split(",");
			var userid = toUserid(row[0]);
			if (targetUser.userid == userid || target == userid) {
			var x = Number(row[1]);
			var numBadges = x;
			match = true;
			if (match === true) {
				break;
			}
			}
		}
		if (match === true) {
			this.sendReplyBox(targetUser.name + ' has ' + numBadges + ' badge(s).');
		}
		if (match === false) {
			connection.sendTo(room, '' + targetUser.name + ' has no badges.');
		}
		Users.get(targetUser.userid).badges = numBadges;
	}
	},
	
	givebadge: function(target, room, user, connection) {
		if (ougymleaders.indexOf(user.userid) != -1 || admins.indexOf(user.userid) != -1) {
		if (!target) {
		var data = fs.readFileSync('config/badges.csv','utf8')
		var match = false;
		var numBadges = 0;
		var stuff = (''+data).split("\n");
		var line = '';
		for (var i = stuff.length; i > -1; i--) {
			if (!stuff[i]) continue;
			var row = stuff[i].split(",");
			var userid = toUserid(row[0]);
			if (user.userid == userid) {
			var x = Number(row[1]);
			var numBadges = x;
			match = true;
			if (match === true) {
				line = line + stuff[i];
				break;
			}
			}
		}
		user.badges = numBadges;
		user.badges = user.badges + 1;
		if (match === true) {
		var re = new RegExp(line,"g");
		fs.readFile('config/badges.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, user.userid+','+user.badges);
			fs.writeFile('config/badges.csv', result, 'utf8', function (err) {
			if (err) return console.log(err);
			});
		});
		} else {
			var log = fs.createWriteStream('config/badges.csv', {'flags': 'a'});
			log.write("\n"+user.userid+','+user.badges);
		}
		return this.sendReply('You were given a badge. You now have ' + user.badges + ' badges.');
	} else {
		if (target.indexOf(',') === -1) {
		var data = fs.readFileSync('config/badges.csv','utf8')
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		var match = false;
		var numBadges = 0;
		var stuff = (''+data).split("\n");
		var line = '';
		for (var i = stuff.length; i > -1; i--) {
			if (!stuff[i]) continue;
			var row = stuff[i].split(",");
			var userid = toUserid(row[0]);
			if (targetUser.userid == userid) {
			var x = Number(row[1]);
			var numBadges = x;
			match = true;
			if (match === true) {
				line = line + stuff[i];
				break;
			}
			}
		}
		Users.get(targetUser.userid).badges = numBadges;
		Users.get(targetUser.userid).badges = Users.get(targetUser.userid).badges + 1;
		if (match === true) {
		var re = new RegExp(line,"g");
		fs.readFile('config/badges.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, targetUser.userid+','+Users.get(targetUser.userid).badges);
			fs.writeFile('config/badges.csv', result, 'utf8', function (err) {
			if (err) return console.log(err);
			});
		});} else {
			var log = fs.createWriteStream('config/badges.csv', {'flags': 'a'});
			log.write("\n"+targetUser.userid+','+Users.get(targetUser.userid).badges);
		}
		return this.sendReply(targetUser + ' was given a badge.');
		}
		}
		}
		else {
			return this.sendReply('Yeah.....no.');
		}
		if (admins.indexOf(user.userid) != -1) {
		if (target.indexOf(',') != -1) {
			var parts = target.split(',');
			parts[0] = this.splitTarget(parts[0]);
			var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (isNaN(parts[1])) {
			return this.sendReply('Very funny, now use a real number.');
		}
	var data = fs.readFileSync('config/badges.csv','utf8')
		var match = false;
		var numBadges = 0;
		var stuff = (''+data).split("\n");
		var line = '';
		for (var i = stuff.length; i > -1; i--) {
			if (!stuff[i]) continue;
			var row = stuff[i].split(",");
			var userid = toUserid(row[0]);
			if (targetUser.userid == userid) {
			var x = Number(row[1]);
			var numBadges = x;
			match = true;
			if (match === true) {
				line = line + stuff[i];
				break;
			}
			}
		}
		Users.get(targetUser.userid).badges = numBadges;
		var asdf = parts[1].trim();
		var yay = Number(parts[1]);
		Users.get(targetUser.userid).badges = Users.get(targetUser.userid).badges + yay;
		if (match === true) {
		var re = new RegExp(line,"g");
		fs.readFile('config/badges.csv', 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
			var result = data.replace(re, targetUser.userid+','+Users.get(targetUser.userid).badges);
			fs.writeFile('config/badges.csv', result, 'utf8', function (err) {
			if (err) return console.log(err);
			});
		});} else {
			var log = fs.createWriteStream('config/badges.csv', {'flags': 'a'});
			log.write("\n"+targetUser.userid+','+Users.get(targetUser.userid).badges);
		}
		return this.sendReply(targetUser + ' was given ' + parts[1] + ' badges. ' + targetUser + ' now has ' + Users.get(targetUser.userid).badges + ' badges.');
		}
		}
		else {
			return this.sendReply('No.');
		}
		},
		
	badgesystem: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<b><font size = 3>The Badge System</font></b><br>' +
							'A work in progress, the badge system is a way to keep track of how many badges a user has. It is simply a number, nothing more, but it can easily show whether you have the twelve required badges. At the moment, this system is for the OU league only. Other leagues will be supported sometime in the future. Any OU gym leader can use the /givebadge command to give a user a badge. Users can use /showbadges to view their badges. Gym leaders can also give multiple badges, a way to implement users onto this new database. For instance, if a user has 6 badges, someone can do /givebadge [user], 6 to give them 6 badges. PM pika with any questions you have about this.');
			},
	
	/*********************************************************
	 * Rock-Paper-Scissors                                   *
	 *********************************************************/
	
	rps: "rockpaperscissors",
	rockpaperscissors: function(target, room, user) {
		/*if(room.id != 'rps') {
			return this.sendReply('|html|You must do this in the room \'rps\'. Click<button name = "joinRoom" value = "rps">here</button>to join the room.');
		}*/
		if(rockpaperscissors === false) {
			rockpaperscissors = true;
			return this.parse('/jrps');
		}
	},

	respond: 'shoot',
	shoot: function(target, room, user) {
		if(gamestart === false) {
			return this.sendReply('There is currently no game of rock-paper-scissors going on.');
		}
		else {
			if(user.userid === rpsplayersid[0]) {
				if(player1response[0]) {
					return this.sendReply('You have already responded.');
				}
			if(target === 'rock') {
				player1response.push('rock');
				if(player2response[0]) {
					return this.parse('/compare');
				}
				return this.sendReply('You responded with rock.');
			} 
			if(target === 'paper') {
				player1response.push('paper');
								if(player2response[0]) {
					return this.parse('/compare');
				}
				return this.sendReply('You responded with paper.');
			}
			if(target === 'scissors') {
				player1response.push('scissors');
								if(player2response[0]) {
					return this.parse('/compare');
				}
				return this.sendReply('You responded with scissors.');
			}
			else {
			return this.sendReply('Please respond with one of the following: rock, paper, or scissors.');
			}
		}
		if(user.userid === rpsplayersid[1]) {
			if(player2response[0]) {
				return this.sendReply('You have already responded.');
			}
			if(target === 'rock') {
				player2response.push('rock');
				if(player1response[0]) {
					return this.parse('/compare');
				}
				return this.sendReply('You responded with rock.');
			} 
			if(target === 'paper') {
				player2response.push('paper');
								if(player1response[0]) {
					return this.parse('/compare');
				}
				return this.sendReply('You responded with paper.');
			}
			if(target === 'scissors') {
				player2response.push('scissors');
								if(player1response[0]) {
					return this.parse('/compare');
				}
				return this.sendReply('You responded with scissors.');
			}
			else {
			return this.sendReply('Please respond with one of the following: rock, paper, or scissors.');
			}
		}
		else return this.sendReply('You are not in this game of rock-paper-scissors.');
	}
	},
		
	compare: function(target, room, user) {
		if(gamestart === false) {
			return this.sendReply('There is no rock-paper-scissors game going on right now.');
		}
		else {
		if(player1response[0] === undefined && player2response[0] === undefined) {
			return this.sendReply('Neither ' + rpsplayers[0] + ' nor ' + rpsplayers[1] + ' has responded yet.');
		}
		if(player1response[0] === undefined) {
			return this.sendReply(rpsplayers[0] + ' has not responded yet.');
		}
		if(player2response[0] === undefined) {
			return this.sendReply(rpsplayers[1] + ' has not responded yet.');
		}
		else {
			if(player1response[0] === player2response[0]) {
				this.add('Both players responded with \'' + player1response[0] + '\', so the game of rock-paper-scissors between ' + rpsplayers[0] + ' and ' + rpsplayers[1] + ' was a tie!');
			}
			if(player1response[0] === 'rock' && player2response[0] === 'paper') {
				this.add('|html|' + rpsplayers[0] + ' responded with \'rock\' and ' + rpsplayers[1] + ' responded with \'paper\', so <b>' + rpsplayers[1] + '</b> won the game of rock-paper-scissors!');
			}
			if(player1response[0] === 'rock' && player2response[0] === 'scissors') {
				this.add('|html|' + rpsplayers[0] + ' responded with \'rock\' and ' + rpsplayers[1] + ' responded with \'scissors\', so <b>' + rpsplayers[0] + '</b> won the game of rock-paper-scissors!');
			}
			if(player1response[0] === 'paper' && player2response[0] === 'rock') {
				this.add('|html|' + rpsplayers[0] + ' responded with \'paper\' and ' + rpsplayers[1] + ' responded with \'rock\', so <b>' + rpsplayers[0] + '</b> won the game of rock-paper-scissors!');
			}
			if(player1response[0] === 'paper' && player2response[0] === 'scissors') {
				this.add('|html|' + rpsplayers[0] + ' responded with \'paper\' and ' + rpsplayers[1] + ' responded with \'scissors\', so <b>' + rpsplayers[1] + '</b> won the game of rock-paper-scissors!');
			}
			if(player1response[0] === 'scissors' && player2response[0] === 'rock') {
				this.add('|html|' + rpsplayers[0] + ' responded with \'scissors\' and ' + rpsplayers[1] + ' responded with \'rock\', so <b>' + rpsplayers[1] + '</b> won the game of rock-paper-scissors!');
			}
			if(player1response[0] === 'scissors' && player2response[0] === 'paper') {
				this.add('|html|' + rpsplayers[0] + ' responded with \'scissors\' and ' + rpsplayers[1] + ' responded with \'paper\', so <b>' + rpsplayers[0] + '</b> won the game of rock-paper-scissors!');
			}

		rockpaperscissors = false;
		numberofspots = 2;
		gamestart = false;
		rpsplayers = [];
		rpsplayersid = [];
		player1response = [];
		player2response = [];
		}
		}
	},
	
	endrps: function(target, room, user) {
		if(!user.can('broadcast')) {
			return this.sendReply('You do not have enough authority to do this.');
		}
		if(rockpaperscissors === false) {
			return this.sendReply('There is no game of rock-paper-scissors happening right now.');
		}
		if(user.can('broadcast') && rockpaperscissors === true) {
			rockpaperscissors = false;
			numberofspots = 2;
			gamestart = false;
			rpsplayers = [];
			rpsplayersid = [];
			player1response = [];
			player2response = [];
			return this.add('|html|<b>' + user.name + '</b> ended the game of rock-paper-scissors.');
		}
	},
	
	jrps: 'joinrps',
	joinrps: function(target, room, user) {
		if(rockpaperscissors === false) {
			return this.sendReply('There is no game going on right now.');
		}
		if(numberofspots === 0) {
			return this.sendReply('There is no more space in the game.');
		}
		else {
			if(rpsplayers[0] === undefined) {
				numberofspots = numberofspots - 1;
				this.add('|html|<b>' + user.name + '</b> has started a game of rock-paper-scissors! /jrps or /joinrps to play against them.');
				rpsplayers.push(user.name);
				rpsplayersid.push(user.userid);
				return false;
			}
		if(rpsplayers[0] === user.name) {
			return this.sendReply('You are already in the game.');
		}
		if(rpsplayers[0] && rpsplayers[1] === undefined) {
			numberofspots = numberofspots - 1;
			this.add('|html|<b>' + user.name + '</b> has joined the game of rock-paper-scissors!');
			rpsplayers.push(user.name);
			rpsplayersid.push(user.userid);
		}
		if(numberofspots === 0) {
			this.add('|html|The game of rock-paper-scissors between <b>' + rpsplayers[0] + '</b> and <b>' + rpsplayers[1] + '</b> has begun!');
			gamestart = true;
		}
	}
	},
	/*********************************************************
	 * everything else (first, our custom stuff)
	 *********************************************************/
	 
	forum: 'forums',
	forums: function(target, room, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>The Amethyst Forums:</b><br /> - <a href = "http://amethystserver.freeforums.net/" target = _blank>Forums</a>');
                },

			
	marlon: function(target, room, user) {
		if (!this.canBroadcast()) return;
        this.sendReplyBox('<b>Information on Gym Le@der Marlon:</b><br />'+
							'Type: Water<br />' +
							'Tier: Over Used (OU)<br />' +
							'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
							'Signature Pokemon: Milotic<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/350.png"><br />' +
                                'Badge: Tidal Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/083_zps6aa5effc.png">');
                },
			anarky: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Elite Four Anarky:</b><br />'+
                                'Type: Water<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Gyarados<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/130.png"><br />' +
                                'Badge: Cascade Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/060_zps66636c1f.png">');
                },
               
        r12m: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der R12M:</b><br />'+
                                'Type: Normal<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Chansey<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/113.png"><br />' +
                                'Badge: Clear Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/S115_zpsc5c27be8.png">');
                },
                
	riles: function(target, room, user) {
	if(user.userid === 'riles') {
		user.avatar = 64;
		delete Users.users['riley'];
		user.forceRename('Riley', user.authenticated);
	}
	},
               
        bobbyv: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Bobby V:</b><br />'+
                                'Type: Steel<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Metagross<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/376.png"><br />' +
                                'Badge: Titanium Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/134_zpsf585594f.png">');
                },
               
        ewok: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Ewok:</b><br />'+
                                'Type: Fire<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Typhlosion<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/157.png"><br />' +
                                'Badge: Eruption Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/K146_zpsb8afafa3.png">');
                },
               
        delibird: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Delibird:</b><br />'+
                                'Type: Flying<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Delibird<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/225.png"><br />' +
                                'Badge: Beak Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/074_zps0f23d5ac.png">');
                },
                
      	boss: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Boss:</b><br />'+
                                'Type: Fire<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Infernape<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/392.png"><br />' +
                                'Badge: Inferno Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/006_zps6f18aed3.png"><br />');
                },
               
	n: function(target, rom, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on Gym Le@der N:</b><br />'+
                                'Type: Dragon<br />' +
                                'Tier: Over Used (OU)<br />' +
                             	'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Dragonite<br />' +
                        	'<img src="http://www.poke-amph.com/black-white/sprites/small/149.png"><br />' +
                             	'Badge: Draco Badge<br />' +
                           	'<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/555Reshiram_zps4cfa3ecc.png">');
		},
		
               
        ross: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Elite Four Ross:</b><br />'+
                                'Type: Psychic<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Victini<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/494.png"><br />' +
                                'Badge: Volcano Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/001_zpsed6f1c0f.png">');
                },
                     
        miner0: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Elite Four Miner0:</b><br />'+
                                'Type: Fire<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Darmanitan<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/555.png"><br />' +
                                'Badge: Eta Carinae Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/099_zps94a606e2.png">');
                },
        colonialmustang: 'mustang',
        mustang: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Mustang:</b><br />'+
                                'Type: Ground<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Nidoking<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/034.png"><br />' +
                                'Badge: Flame Alchemy Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/132_zpsb8a73a6e.png">');
                },
               
        kozman: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Elite Four Kozm@n:</b><br />'+
                                'Type: Fighting<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Mienshao<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/620.png"><br />' +
                                'Badge: Aikido Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/145_zps5de2fc9e.png">');
                },
        qseasons: 'seasons',   
        seasons: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('Leader qSeasons!<br>' +
                		'Type: Everything o3o<br>' +
                		'He even gets his own shiny badge: <img src = "http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/153_zpsa3af73f7.png"><br>' +
                		':D');
                },
               
        aaron: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Aaron:</b><br />'+
                                'Type: Bug<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Vespiquen<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/416.png"><br />' +
                                'Badge: Hive Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/030_zpse335231b.png">');
                },
               
        bluejob: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der BlueJob:</b><br />'+
                                'Type: Psychic<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Starmie<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/121.png"><br />' +
                                'Badge: Cognate Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/2d0fgxx_zpsca0442cd.png">');
                },
               
        sbb: 'smash',
        smashbrosbrawl: 'smash',
        smash: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Smash:</b><br />'+
                                'Type: Steel<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Lucario<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/448.png"><br />' +
                                'Badge: Steel Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/065_zpsd830d811.png">');
                },
		 massman: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Massman:</b><br />'+
                                'Type: Ice<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Cloyster<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/091.png"><br />' +
                                'Badge: Glacier Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/094_zps0f297808.png">');
                },
               
        sam: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Sam:</b><br />'+
                                'Type: Grass<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Breloom<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/286.png"><br />' +
                                'Badge: Forest Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/500TsutajaSide_zpsb8d59e72.png">');
                },
        scizornician: 'pyro',  
        pyro: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Pyro:</b><br />'+
                                'Type: Ghost<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Gengar<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/094.png"><br />' +
                                'Badge: Poltergeist Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/094_zps992c377f.png">');
                },
               
        sweet: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Sweet:</b><br />'+
                                'Type: Poison<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Muk<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/089.png"><br />' +
                                'Badge: Pollution Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/089_zpsd3d163fc.png">');
                },
 
        talon: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Talon:</b><br />'+
                                'Type: Dark<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Weavile<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/461.png"><br />' +
                                'Badge: Breaker Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/142_zpsea0762e7.png">');
                },
       
        brawl: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Brawl:</b><br />'+
                                'Type: Fighting<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Gallade<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/475.png"><br />' +
                                'Badge: Focus Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/091_zpsc55ac97a.png">');
                },
		cuddly: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Cuddly:</b><br />'+
                                'Type: Ghost<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Golurk<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/623.png"><br />' +
                                'Badge: Phantom Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/114_zps7313774a.png">');
                },
               
        eon: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Eon:</b><br />'+
                                'Type: Dragon<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Latios<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/381.png"><br />' +
                                'Badge: Rapier Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/130_zpsce775186.png">');
                },
       
        energ218: 'energ',
        enernub: 'energ',
        nubnub: 'energ,',
        energ: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der EnerG218:</b><br />'+
                                'Type: Bug<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Galvantula<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/596.png"><br />' +
                                'Badge: NubNub Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/103_zps3f304ae8.png">');
                },
               
        hope: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Hope:</b><br />'+
                                'Type: Normal<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Meloetta<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/648.png"><br />' +
                                'Badge: Hax Badge<br />' +
                                '<img src="http://i1228.photobucket.com/albums/ee449/JCKane/meloettab_zpse6f71e13.png">');
                },
               
        onlylove: 'love',      
        love: function(target, rom, user) {
                if (!this.canBroadcast()) return;
                this.sendReplyBox('<b>Information on Gym Le@der Love:</b><br />'+
                                'Type: Grass<br />' +
                                'Tier: Over Used (OU)<br />' +
                                '<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                                'Signature Pokemon: Whimsicott<br />' +
                                '<img src="http://www.poke-amph.com/black-white/sprites/small/547.png"><br />' +
                                'Badge: Attract Badge<br />' +
                                '<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/K003_zps16041652.png">');
                },
	gomewex: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on Gym Le@der Gomewex:</b><br />' +
							'Type: Steel<br />' +
							'Tier: Over Used (OU)<br />' +
							'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Registeel<br />' +
                        	'<img src="http://www.poke-amph.com/black-white/sprites/small/379.png"><br />' +
							'Badge: Titanium Badge<br />' +
                           	'<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/106_zps1cf253b1.png"><br />');
		},
		
	selecao: 'modernwolf',
	modernwolf: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on Gym Le@der 9:</b><br />'+
                                'Type: Rock<br />' +
                                'Tier: Over Used (OU)<br />' +
                             	'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Kabutops<br />' +
                        	'<img src="http://www.poke-amph.com/black-white/sprites/small/141.png"><br />' +
                             	'Badge: Obsidian Badge<br />' +
                           	'<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/146_zps098d23fa.png">');
		},
		
	elyte: 'electrolyte',
	electrolyte: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on Gym Le@der E-Lyte:</b><br />'+
                                'Type: Flying<br />' +
                                'Tier: Over Used (OU)<br />' +
                             	'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Thundurus-T<br />' +
                        	'<img src="http://sprites.pokecheck.org/icon/642-therian.png"><br />' +
                             	'Badge: Cataegis Badge<br />' +
                           	'<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/Zapmolcuno_zps229d8b2a.png">');
		},
	auraburst: 'magma',	
	magma: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on Gym Le@der Magma:</b><br />' +
				'Type: Fire<br />' +
				'Tier: Over Used (OU)<br />' + 
				'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Heatran<br />' +
                        	'<img src="http://www.poke-amph.com/black-white/sprites/small/485.png"><br />' +
				'Badge: Magma Flare Badge<br />' +
                           	'<img src="http://i.imgur.com/V0gp7hJ.png"><br />');
		},
		
			miloticnob: 'nob',
	nob: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on Gym Le@der Nob :</b><br />'+
                                'Type: Ground<br />' +
                                'Tier: Over Used (OU)<br />' +
                             	'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Seismitoad<br />' +
                        	'<img src="http://www.poke-amph.com/black-white/sprites/small/537.png"><br />' +
                             	'Badge: Tectonic Badge<br />' +
                           	'<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/056_zps8055026c.png">');
		},
	
			topazio: function(target, room, user) {
		if(!this.canBroadcast()) return;
				this.sendReplyBox('<b>Information on Gym Le@der Topazio:</b><br />' +
							'Type: Ground<br />' +
							'Tier: Over Used (OU)<br />' + 
							'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Gliscor<br />' +
							'<img src="http://www.poke-amph.com/black-white/sprites/small/472.png"><br />' +
							'Badge: Soil Badge<br />' +
						 	'<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/037_zps7830eeed.png">'	);
		},
		
			gray: function(target, room, user) {
		if(!this.canBroadcast()) return;
				this.sendReplyBox('<b>Information on Gym Le@der Gray:</b><br />' +
							'Type: Electric<br />' +
							'Tier: Over Used (OU)<br />' + 
							'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Luxray<br />' +
							'<img src="http://www.poke-amph.com/black-white/sprites/small/405.png"><br />' +
							'Badge: Kirin Badge<br />' +
						 	'<img src="http://i1305.photobucket.com/albums/s542/TheBattleTowerPS/019_zps1c48a4cf.png">'	);
		},
	//uu leaders
		cc: 'crazyclown',
	crazyclown: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on UU Le@der CC:</b><br />' +
							'Type: Psychic<br />' +
							'Tier: Under Used (UU)<br />' + 
							'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Medicham<br />' +
                        	'<img src="http://www.poke-amph.com/black-white/sprites/small/308.png"><br />' +
							'Badge: Crazy Badge<br />');
		},
		
	zact94: 'zact',	
	zact: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on UU Le@der ZacT94:</b><br />' +
							'Type: Ghost<br />' +
							'Tier: Under Used (UU)<br />' + 
							'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Cofagrigus<br />' +
                        	'<img src="http://www.poke-amph.com/black-white/sprites/small/563.png"><br />' +
							'Badge: Spook Badge<br />');
		},
		
		aidenpyralis: 'aiden',
		aiden: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on UU Elite F@ur Aiden:</b><br />' +
							'Type: Water<br />' +
							'Tier: Under Used (UU)<br />' + 
							'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Suicune<br />' +
                        	'<img src="http://www.poke-amph.com/black-white/sprites/small/245.png"><br />' +
							'Badge: Barrier Reef Badge<br />');
		},
		
		uudelibird: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on UU Le@der Delibird:</b><br />' +
							'Type: Rock<br />' +
							'Tier: Under Used (UU)<br />' + 
							'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Kabutops<br />' +
                        	'<img src="http://www.poke-amph.com/black-white/sprites/small/141.png"><br />' +
							'Badge: TM28: Tombstoner Badge<br />');
		},
		
		uuminer0: 'uuminer',
		uuminer: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on UU Elite F@ur Miner0:</b><br />' +
							'Type: Flying<br />' +
							'Tier: Under Used (UU)<br />' + 
							'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
							'Badge: Cloud Badge<br />');
		},
		
		uuross: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on UU Le@der Ross:</b><br />' +
							'Type: Poison<br />' +
							'Tier: Under Used (UU)<br />' + 
							'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Weezing<br />' +
	'<img src="http://www.poke-amph.com/black-white/sprites/small/110.png"><br />' +
							'Badge: Toxic Badge<br />');
		},
		
		batman: 'aortega',
		ao: 'aortega',
		aortega: function(target, room, user) {
			if(!this.canBroadcast()) return;
			var asdf = target;
			if(asdf.length != 0) return this.parse('/stopspammingaortega');
			this.sendReplyBox('Gym Le@der AOrtega: UU, Fighting type, etc etc.');
		},
		
		stopspammingaortega: function(target, room, user) {
			this.sendReply('ffs stop trying to say he strips');
			},
		
			uuhope: function(target, room, user) {
			if(!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on Elite F@ur Hope:</b><br />' +
							'Type: Psychic<br />' +
							'Tier: Under Used (UU)<br />' + 
							'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Mew<br />' +
							'<img src="http://www.poke-amph.com/black-white/sprites/small/151.png"><br />' +
							'Badge: ESP Badge<br />');
		},
		
	nord: function(target, room, user) {
		if(!this.canBroadcast()) return;
				this.sendReplyBox('<b>Information on Elite Four Nord:</b><br />' +
							'Type: Ice<br />' +
							'Tier: Over Used (OU)<br />' + 
							'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Regice<br />' +
							'<img src="http://www.poke-amph.com/black-white/sprites/small/378.png"><br />' +
							'Badge: Berg Badge<br />');
		},
		
	uunord: function(target, room, user) {
			if(!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on UU Le@der Nord:</b><br />' +
							'Type: Ice<br />' +
							'Tier: Under Used (UU)<br />' + 
							'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Glaceon<br />' +
							'<img src="http://www.poke-amph.com/black-white/sprites/small/471.png"><br />' +
							'Badge: Snow Badge<br />');
		},
		
		uumiloticnob: 'uunob',
		uunob: function(target, room, user) {
			if(!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on UU Le@der Nob:</b><br />' +
							'Type: Steel<br />' +
							'Tier: Under Used (UU)<br />' + 
							'<a href="gymleadermustang.wix.com%2F-amethystleague%23!gym-leaders%2FaboutPage" target="_blank">Thread</a><br />' +
                          	'Signature Pokemon: Empoleon<br />' +
							'<img src="http://www.poke-amph.com/black-white/sprites/small/395.png"><br />' +
							'Badge: Iron Badge<br />');
		},
		
		dark: 'darkgirafarig',
		darkgirafarig: function(target, room, user) {
			if(!this.canBroadcast()) return;
			this.sendReplyBox('<b>Information on NU E3 Dark Girafarig:</b><br>' +
								'Type: Psychic<br>' +
								'Tier: Never Used (NU)<br>' +
								'Signature Pokemon: Girafarig<br>' +
								'Badge: Telepathy Badge');
		},
	
	platinum: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<b>Information on NU E3 Pl@tinum:</b><br>' +
							'Type: Poison<br>' +
							'Tier: Never Used (NU)<br>' +
							'Signature Pokemon: Golbat');
		},
		
	league: 'leagueintro',
	leagueintro: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Welcome to the Amethyst League! To challenge the champion, you must win 10 badges and beat the Elite 4. Here are the <a href="http://gymleadermustang.wix.com/-amethystleague#!rules/c1w1e" target = _blank>rules</a>! Good luck!');
		},
		
		ougymleaders: 'ouleaders',
        ouleaders: function(target, room, user) {
                if(!this.canBroadcast()) return;
                this.sendReplyBox('A list of the active OU leaders can be found <a href = "hhttp://pastebin.com/4Vq73sst" target = _blank>here</a>.');
        	},
        
	uugymleaders: 'uuleaders',
	uuleaders: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('A list of the active UU leaders can be found <a href = "http://pastebin.com/2EwGFFEW" target = _blank>here</a>.');
		},
		
        nugymleaders: 'nuleaders',
        nuleaders: function(target, room, user) {
   		if (!this.canBroadcast()) return;
		this.sendReplyBox('A list of active NU leaders can be found <a href = "http://pastebin.com/WwAmXACt" target = _blank>here</a>.');
		},

	rugymleaders: 'ruleaders',
	ruleaders: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('A list of active RU leaders can be found <a href = "http://pastebin.com/VM3bJLL6" target = _blank>here</a>.');
		},
 
        pika: 'chuuu',
        chuuu: function(target, room, user) {
        if(!this.canBroadcast()) return;
        this.sendReplyBox('<b>These infoboxes were made by piiiikachuuu</b><br />'+
                'pm him if you need something to be changed or if you\'re a new gym leader/elite four and you need one.<br />'+
                                '<img src="http://i1073.photobucket.com/albums/w394/HeechulBread/Pikachu_sprite_by_Momogirl_zpsf31aafb5.gif">');
                },
               
				
	cry: 'complain',
	bitch: 'complain',
	complaint: 'complain',
	complain: function(target, room, user) {
		if(!target) return this.parse('/help complaint');
		this.sendReplyBox('Thanks for your input. We\'ll review your feedback soon. The complaint you submitted was: ' + target);
		this.logComplaint(target);
		},
		
		trivia: function(target, room, user) {
		if(!user.can('declare')) return;
		room.addRaw('<div class="infobox"><div class="broadcast-green"><font size = 3><b>Come join us for trivia!</b><br><div class="notice"><button name="joinRoom" value="trivia">Click here to join the Trivia room!</button></font></div></div></div>');
		},

	mizu: function (target, room, user) {
		if (user.userid != 'mizukurage') {
			return this.sendReply('nope');
		}
		delete Users.users.mizud;
		user.forceRename('Mizu :D', user.authenticated);
	},
		
	afk: function (target, room, user) {
		if (user.userid != 'piiiikachuuu') {
			return this.sendReply('nope');
		}
		delete Users.users.afkpiiiika;
		user.forceRename('afk piiiika', user.authenticated);
		this.parse('/away');
	},
	
	unafk: function (target, room, user) {
		if (user.userid != 'afkpiiiika') {
			return this.sendReply('nope');
		}
		delete Users.users.piiiikachuuu;
		user.forceRename('piiiikachuuu', user.authenticated);
		this.parse('/back');
	},
		
	cot: 'clashoftiers',
	clashoftiers: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<font size = 3><b>Clash of Tiers</b></font><br><font size = 2>by EnerG218</font><br>A metagame created by EnerG218, Clash of Tiers is a metagame focused on comparing the different tiers. Each player is given 6 points to make a team with. Points are spent based on tier: Ubers are worth 6, OU is worth 5, UU is worth 4, RU is worth 3, NU is worth 2, and LC is worth 1.<br>Have fun!');
	},
	
	mixedtier: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('<font size = 3><b>Mixed Tier</b></font><br><font size = 2>by Colonial Mustang</font><br>A metagame created by Colonial Mustang, Mixed Tier is a tier in which players must use one Pokemon from each of the following tiers: Uber, OU, UU, RU, NU, and LC.<br>Have fun!');
	},
	
	amethystjunk: 'junk',
	junk: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<font size = 3><b>Amethyst Junk</b></font><br>Our own metagame. The changelog can be found <a href ="https://dl.dropboxusercontent.com/u/165566535/amethystjunkchangelog.html">here</a>.');
	},
	
	cutemons: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<font size = 3><b>Cutemons</b></font><br><font size = 2>by Mizu :D and hostageclam</font><br>A metagame created by Mizu :D, Cutemons is a tier in which only Pokemon deemed cute enough are allowed. Many Pokemon also gain new abilities. A changelog can be found here: <a href = "https://dl.dropboxusercontent.com/u/165566535/cutemons.html">here</a>.<br>Have fun!');
	},
	
	fb: 'facebook',
	facebook: function(target, room, user) {
		if(!this.canBroadcast()) return;
		this.sendReplyBox('<a href = "https://www.facebook.com/pages/Amethyst-League-PKMN-Showdown/176885049163353">Our Facebook page</a>');
	},
	
	customclientlist: function(target, room, user) {
		this.sendReply('Users using the custom client:');
		for (var u in Users.users) {
			if (Users.get(u).customClient && Users.get(u).connected) {
				this.sendReply(Users.get(u).name);
			}
		}
	},
	
//it's not formatted neatly, but whatever
	poof: 'd',
	d: function(target, room, user){
		if(room.id !== 'lobby') return false;
		var btags = '<strong><font color='+hashColor(Math.random().toString())+'" >';
		var etags = '</font></strong>'
		var targetid = toUserid(user);
		if(!user.muted && target){
			var tar = toUserid(target);
			var targetUser = Users.get(tar);
				if(user.can('poof', targetUser)){
					if(!targetUser){
						user.emit('console', 'Cannot find user ' + target + '.', socket);	
					}else{
						if(poofeh)
							Rooms.rooms.lobby.addRaw(btags + '~~ '+targetUser.name+' was vanished into nothingness by ' + user.name +'! ~~' + etags);
							targetUser.disconnectAll();
							return	this.logModCommand(targetUser.name+ ' was poofed by ' + user.name);
					}
				} else {
					return this.sendReply('/poof target - Access denied.');
				}
			}
		if(poofeh && !user.muted){
			Rooms.rooms.lobby.addRaw(btags + getRandMessage(user)+ etags);
			user.disconnectAll();	
		}else{
			return this.sendReply('poof is currently disabled.');
		}
	},

	poofoff: 'nopoof',
	nopoof: function(target, room, user){
		if(!user.can('warn'))
			return this.sendReply('/nopoof - Access denied.');
		if(!poofeh)
			return this.sendReply('poof is currently disabled.');
		poofeh = false;
		this.logModCommand(user.name + ' disabled poof.');
		return this.sendReply('poof is now disabled.');
	},

	poofon: function(target, room, user){
		if(!user.can('warn'))
			return this.sendReply('/poofon - Access denied.');
		if(poofeh)
			return this.sendReply('poof is currently enabled.');
		poofeh = true;
		this.logModCommand(user.name + ' enabled poof');
		return this.sendReply('poof is now enabled.');
	},

	cpoof: function(target, room, user){
		if(!user.can('broadcast'))
			return this.sendReply('/cpoof - Access Denied');
		if(poofeh) {
			var btags = '<strong><font color="'+hashColor(Math.random().toString())+'" >';
			var etags = '</font></strong>'
			Rooms.rooms.lobby.addRaw(btags + '~~ '+user.name+' '+target+'! ~~' + etags);
			this.logModCommand(user.name + ' used a custom poof message: \n "'+target+'"');
			user.disconnectAll();	
		}else{
			return this.sendReply('Poof is currently disabled.');
		}
	},
	
	fjs: 'forcejoinstaff',
	forcejoinstaff: function(target, room, user){
		if(!user.can('declare')) return false;
		if(Rooms.rooms['staff'] == undefined){
			Rooms.rooms['staff'] = new Rooms.ChatRoom('staff', 'staff');
			Rooms.rooms['staff'].isPrivate = true;
			this.sendReply('The private room \'staff\' was created.');
		}
		for(var u in Users.users)
			if(Users.users[u].connected && config.groupsranking.indexOf(Users.users[u].group) >= 2)
				Users.users[u].joinRoom('staff');
		this.logModCommand(user.name + ' gathered the staff.')
		return this.sendReply('Staff has been gathered.');
	},
	
	tell: function(target, room, user) {
		if (user.locked) return this.sendReply('You cannot use this command while locked.');
		if (user.forceRenamed) return this.sendReply('You cannot use this command while under a name that you have been forcerenamed to.');
		if (!target) return this.parse('/help tell');
		
		var targets = target.split(',');
		if (!targets[1]) return this.parse('/help tell');
		var targetUser = toId(targets[0]);

		if (targetUser.length > 18) {
			return this.sendReply('The name of user "' + this.targetUsername + '" is too long.');
		}

		if (!tells[targetUser]) tells[targetUser] = [];
		if (tells[targetUser].length === 5) return this.sendReply('User ' + targetUser + ' has too many tells queued.');

		var date = Date();
		var message = '|raw|' + date.substring(0, date.indexOf('GMT') - 1) + ' - <b>' + user.getIdentity() + '</b> said: ' + targets[1].trim();
		tells[targetUser].add(message);

		return this.sendReply('Message "' + targets[1].trim() + '" sent to ' + targetUser + '.');
	},
	
	/*****************************************
	*    now, their stuff 					 *
	*****************************************/ 

	version: function(target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('Server version: <b>'+CommandParser.package.version+'</b> <small>(<a href="http://pokemonshowdown.com/versions#' + CommandParser.serverVersion + '">' + CommandParser.serverVersion.substr(0,10) + '</a>)</small>');
	},

	me: function(target, room, user, connection) {
		// By default, /me allows a blank message
		if (target) target = this.canTalk(target);
		if (!target) return;

		var message = '/me ' + target;
		// if user is not in spamroom
		if (spamroom[user.userid] === undefined) {
			// check to see if an alt exists in list
			for (var u in spamroom) {
				if (Users.get(user.userid) === Users.get(u)) {
					// if alt exists, add new user id to spamroom, break out of loop.
					spamroom[user.userid] = true;
					break;
				}
			}
		}

		if (user.userid in spamroom) {
			this.sendReply('|c|' + user.getIdentity() + '|' + message);
			return Rooms.rooms['spamroom'].add('|c|' + user.getIdentity() + '|' + message);
		} else {
			return message;
		}
	},

	mee: function(target, room, user, connection) {
		// By default, /mee allows a blank message
		if (target) target = this.canTalk(target);
		if (!target) return;

		var message = '/mee ' + target;
		// if user is not in spamroom
		if (spamroom[user.userid] === undefined) {
			// check to see if an alt exists in list
			for (var u in spamroom) {
				if (Users.get(user.userid) === Users.get(u)) {
					// if alt exists, add new user id to spamroom, break out of loop.
					spamroom[user.userid] = true;
					break;
				}
			}
		}

		if (user.userid in spamroom) {
			this.sendReply('|c|' + user.getIdentity() + '|' + message);
			return Rooms.rooms['spamroom'].add('|c|' + user.getIdentity() + '|' + message);
		} else {
			return message;
		}
	},

	avatar: function(target, room, user) {
		if (!target) return this.parse('/avatars');
		var parts = target.split(',');
		var avatar = parseInt(parts[0]);
		if (!avatar || avatar > 294 || avatar < 1) {
			if (!parts[1]) {
				this.sendReply("Invalid avatar.");
			}
			return false;
		}

		user.avatar = avatar;
		if (!parts[1]) {
			this.sendReply("Avatar changed to:\n" +
					'|raw|<img src="//play.pokemonshowdown.com/sprites/trainers/'+avatar+'.png" alt="" width="80" height="80" />');
		}
	},

	logout: function(target, room, user) {
		user.resetName();
	},

	r: 'reply',
	reply: function(target, room, user) {
		if (!target) return this.parse('/help reply');
		if (!user.lastPM) {
			return this.sendReply('No one has PMed you yet.');
		}
		return this.parse('/msg '+(user.lastPM||'')+', '+target);
	},

	pm: 'msg',
	whisper: 'msg',
	w: 'msg',
	msg: function(target, room, user) {
		if (!target) return this.parse('/help msg');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!target) {
			this.sendReply('You forgot the comma.');
			return this.parse('/help msg');
		}
		if (!targetUser || !targetUser.connected) {
			if (!target) {
				this.sendReply('User '+this.targetUsername+' not found. Did you forget a comma?');
			} else {
				this.sendReply('User '+this.targetUsername+' not found. Did you misspell their name?');
			}
			return this.parse('/help msg');
		}
		
		if (target.indexOf('invite') != -1 && target.indexOf('spamroom') != -1) {
			return user.sendTo('lobby', '|popup|You cannot invite people there.');
		}
		
		if (targetUser.userid === 'piiiikachuuu') {
			if (!user.isStaff && user.tries === 0) {
				user.sendTo('lobby', '|popup|Are you sure this is the right person to PM? Unless it\'s a real issue, your problem can probably be solved by messaging a member of the moderation staff. If you really need to message this user, try again.');
				user.tries = 1;
				return false
			}
		}
		
		if (user.locked && !targetUser.can('lock', user)) {
			return this.popupReply('You can only private message members of the moderation team (users marked by %, @, &, or ~) when locked.');
		}
		if (targetUser.locked && !user.can('lock', targetUser)) {
			return this.popupReply('This user is locked and cannot PM.');
		}
		if (targetUser.ignorePMs && !user.can('lock')) {
			if (!targetUser.can('lock')) {
				return this.popupReply('This user is blocking Private Messages right now.');
			} else if (targetUser.can('hotpatch')) {
				return this.popupReply('This admin is too busy to answer Private Messages right now. Please contact a different staff member.');
			}
		}

		target = this.canTalk(target, null);
		if (!target) return false;

		var message = '|pm|'+user.getIdentity()+'|'+targetUser.getIdentity()+'|'+target;
		user.send(message);
		// if user is not in spamroom
		if(spamroom[user.userid] === undefined){
			// check to see if an alt exists in list
			for(var u in spamroom){
				if(Users.get(user.userid) === Users.get(u)){
					// if alt exists, add new user id to spamroom, break out of loop.
					spamroom[user.userid] = true;
					break;
				}
			}
		}

		if (user.userid in spamroom) {
			Rooms.rooms.spamroom.add('|c|' + user.getIdentity() + '|(__Private to ' + targetUser.getIdentity()+ "__) " + target );
		} else {
			if (targetUser !== user) targetUser.send(message);
			targetUser.lastPM = user.userid;
		}
		user.lastPM = targetUser.userid;
	},

	blockpm: 'ignorepms',
	blockpms: 'ignorepms',
	ignorepm: 'ignorepms',
	ignorepms: function(target, room, user) {
		if (user.ignorePMs) return this.sendReply('You are already blocking Private Messages!');
		if (user.can('lock') && !user.can('hotpatch')) return this.sendReply('You are not allowed to block Private Messages.');
		user.ignorePMs = true;
		return this.sendReply('You are now blocking Private Messages.');
	},

	unblockpm: 'unignorepms',
	unblockpms: 'unignorepms',
	unignorepm: 'unignorepms',
	unignorepms: function(target, room, user) {
		if (!user.ignorePMs) return this.sendReply('You are not blocking Private Messages!');
		user.ignorePMs = false;
		return this.sendReply('You are no longer blocking Private Messages.');
	},

	makechatroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		var id = toId(target);
		if (!id) return this.parse('/help makechatroom');
		if (Rooms.rooms[id]) {
			return this.sendReply("The room '"+target+"' already exists.");
		}
		if (Rooms.global.addChatRoom(target)) {
			return this.sendReply("The room '"+target+"' was created.");
		}
		return this.sendReply("An error occurred while trying to create the room '"+target+"'.");
	},

	deregisterchatroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		var id = toId(target);
		if (!id) return this.parse('/help deregisterchatroom');
		var targetRoom = Rooms.get(id);
		if (!targetRoom) return this.sendReply("The room '"+id+"' doesn't exist.");
		target = targetRoom.title || targetRoom.id;
		if (Rooms.global.deregisterChatRoom(id)) {
			this.sendReply("The room '"+target+"' was deregistered.");
			this.sendReply("It will be deleted as of the next server restart.");
			return;
		}
		return this.sendReply("The room '"+target+"' isn't registered.");
	},

	privateroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		if (target === 'off') {
			delete room.isPrivate;
			this.addModCommand(user.name+' made this room public.');
			if (room.chatRoomData) {
				delete room.chatRoomData.isPrivate;
				Rooms.global.writeChatRoomData();
			}
		} else {
			room.isPrivate = true;
			this.addModCommand(user.name+' made this room private.');
			if (room.chatRoomData) {
				room.chatRoomData.isPrivate = true;
				Rooms.global.writeChatRoomData();
			}
		}
	},

	officialchatroom: 'officialroom',
	officialroom: function(target, room, user) {
		if (!this.can('makeroom')) return;
		if (!room.chatRoomData) {
			return this.sendReply("/officialroom - This room can't be made official");
		}
		if (target === 'off') {
			delete room.isOfficial;
			this.addModCommand(user.name+' made this chat room unofficial.');
			delete room.chatRoomData.isOfficial;
			Rooms.global.writeChatRoomData();
		} else {
			room.isOfficial = true;
			this.addModCommand(user.name+' made this chat room official.');
			room.chatRoomData.isOfficial = true;
			Rooms.global.writeChatRoomData();
		}
	},

	roomowner: function(target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomowner - This room isn't designed for per-room moderation to be added");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;

		if (!targetUser) return this.sendReply("User '"+this.targetUsername+"' is not online.");

		if (!this.can('makeroom', targetUser, room)) return false;

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		var name = targetUser.name;

		room.auth[targetUser.userid] = '#';
		this.addModCommand(''+name+' was appointed Room Owner by '+user.name+'.');
		room.onUpdateIdentity(targetUser);
		Rooms.global.writeChatRoomData();
	},
	
	roomdeowner: 'deroomowner',
	deroomowner: function(target, room, user) {
		if (!room.auth) {
			return this.sendReply("/roomdeowner - This room isn't designed for per-room moderation");
		}
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || userid === '') return this.sendReply("User '"+name+"' does not exist.");

		if (room.auth[userid] !== '#') return this.sendReply("User '"+name+"' is not a room owner.");
		if (!this.can('makeroom', null, room)) return false;

		delete room.auth[userid];
		this.sendReply('('+name+' is no longer Room Owner.)');
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	roomdesc: function(target, room, user) {
		if (!target) {
			if (!this.canBroadcast()) return;
			this.sendReply('The room description is: '+room.desc);
			return;
		}
		if (!this.can('roommod', null, room)) return false;
		if (target.length > 80) {
			return this.sendReply('Error: Room description is too long (must be at most 80 characters).');
		}

		room.desc = target;
		this.sendReply('(The room description is now: '+target+')');

		if (room.chatRoomData) {
			room.chatRoomData.desc = room.desc;
			Rooms.global.writeChatRoomData();
		}
	},

	roomdemote: 'roompromote',
	roompromote: function(target, room, user, connection, cmd) {
		if (!room.auth) {
			this.sendReply("/roompromote - This room isn't designed for per-room moderation");
			return this.sendReply("Before setting room mods, you need to set it up with /roomowner");
		}
		if (!target) return this.parse('/help roompromote');

		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var userid = toUserid(this.targetUsername);
		var name = targetUser ? targetUser.name : this.targetUsername;

		var currentGroup = (room.auth[userid] || ' ');
		if (!targetUser && !room.auth[userid]) {
			return this.sendReply("User '"+this.targetUsername+"' is offline and unauthed, and so can't be promoted.");
		}

		var nextGroup = target || Users.getNextGroupSymbol(currentGroup, cmd === 'roomdemote', true);
		if (target === 'deauth') nextGroup = config.groupsranking[0];
		if (!config.groups[nextGroup]) {
			return this.sendReply('Group \'' + nextGroup + '\' does not exist.');
		}
		if (currentGroup !== ' ' && !user.can('room'+config.groups[currentGroup].id, null, room)) {
			return this.sendReply('/' + cmd + ' - Access denied for promoting from '+config.groups[currentGroup].name+'.');
		}
		if (nextGroup !== ' ' && !user.can('room'+config.groups[nextGroup].id, null, room)) {
			return this.sendReply('/' + cmd + ' - Access denied for promoting to '+config.groups[nextGroup].name+'.');
		}
		if (currentGroup === nextGroup) {
			return this.sendReply("User '"+this.targetUsername+"' is already a "+(config.groups[nextGroup].name || 'regular user')+" in this room.");
		}
		if (config.groups[nextGroup].globalonly) {
			return this.sendReply("The rank of "+config.groups[nextGroup].name+" is global-only and can't be room-promoted to.");
		}

		var isDemotion = (config.groups[nextGroup].rank < config.groups[currentGroup].rank);
		var groupName = (config.groups[nextGroup].name || nextGroup || '').trim() || 'a regular user';

		if (nextGroup === ' ') {
			delete room.auth[userid];
		} else {
			room.auth[userid] = nextGroup;
		}

		if (isDemotion) {
			this.privateModCommand('('+name+' was appointed to Room ' + groupName + ' by '+user.name+'.)');
			if (targetUser) {
				targetUser.popup('You were appointed to Room ' + groupName + ' by ' + user.name + '.');
			}
		} else {
			this.addModCommand(''+name+' was appointed to Room ' + groupName + ' by '+user.name+'.');
		}
		if (targetUser) {
			targetUser.updateIdentity();
		}
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	autojoin: function(target, room, user, connection) {
		Rooms.global.autojoinRooms(user, connection)
	},

	join: function(target, room, user, connection) {
		var targetRoom = Rooms.get(target) || Rooms.get(toId(target));
		if (!targetRoom) return false;
		if (target && !targetRoom) {
			if (target === 'lobby') return connection.sendTo(target, "|noinit|nonexistent|");
			return connection.sendTo(target, "|noinit|nonexistent|The room '"+target+"' does not exist.");
		}
		if (targetRoom && targetRoom.isPrivate && !user.named) {
			return connection.sendTo(target, "|noinit|namerequired|You must have a name in order to join the room '"+target+"'.");
		}
		if (user.userid && targetRoom.bannedUsers && user.userid in targetRoom.bannedUsers) {
			return connection.sendTo(target, "|noinit|joinfailed|You are banned from that room!");
		}
		if (user.ips && targetRoom.bannedIps) {
			for (var ip in user.ips) {
				if (ip in targetRoom.bannedIps) return connection.sendTo(target, "|noinit|joinfailed|You are banned from that room!");
			}
		}

		if (!user.joinRoom(targetRoom || room, connection)) {
			// This condition appears to be impossible for now.
			return connection.sendTo(target, "|noinit|joinfailed|The room '"+target+"' could not be joined.");
		}
		if (target.toLowerCase() == "lobby") {
		/*	return connection.sendTo('lobby','|html|<div class = "infobox">You may be missing out on some features! <br /> ' +
			'For the best experience use our custom client <a href="http://amethyst-server.no-ip.org"><i>here!</i></a><br /><br />' + 
			'Welcome to Amethyst! We\'ll try to make your stay as comfortable as possible. Enjoy!<br /><br />' +
			'Please join the Amethyst forums, <a href="http://amethyst.webuda.com/forums/">here</a>, to stay more connected with us!</div>');*/
			return connection.sendTo('lobby','|html|<div class="infobox">Welcome to Amethyst! You should check out our <a href="http://amethyst.webuda.com/forums/">forums!</a><br />' +
			'We now offer league rooms on request, contact an Administrator for more information!</div>');
		}
		if (targetRoom.id === "spamroom" && !user.can('declare')) {
			return connection.sendTo(target, "|noinit|joinfailed|You cannot join this room.");
		}
	},

	roomban: function(target, room, user, connection) {
		if (!target) return this.parse('/help roomban');
		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || !targetUser) return this.sendReply("User '" + name + "' does not exist.");
		if (!this.can('ban', targetUser, room)) return false;
		if (!Rooms.rooms[room.id].users[userid]) {
			return this.sendReply('User ' + this.targetUsername + ' is not in the room ' + room.id + '.');
		}
		if (!room.bannedUsers || !room.bannedIps) {
			return this.sendReply('Room bans are not meant to be used in room ' + room.id + '.');
		}
		room.bannedUsers[userid] = true;
		for (var ip in targetUser.ips) {
			room.bannedIps[ip] = true;
		}
		targetUser.popup(user.name+" has banned you from the room " + room.id + "." + (target ? " (" + target + ")" : ""));
		this.addModCommand(""+targetUser.name+" was banned from room " + room.id + " by "+user.name+"." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand(""+targetUser.name+"'s alts were also banned from room " + room.id + ": "+alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				var altId = toId(alts[i]);
				this.add('|unlink|' + altId);
				room.bannedUsers[altId] = true;
			}
		}
		this.add('|unlink|' + targetUser.userid);
		targetUser.leaveRoom(room.id);
	},

	roomunban: function(target, room, user, connection) {
		if (!target) return this.parse('/help roomunban');
		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || !targetUser) return this.sendReply("User '"+name+"' does not exist.");
		if (!this.can('ban', targetUser, room)) return false;
		if (!room.bannedUsers || !room.bannedIps) {
			return this.sendReply('Room bans are not meant to be used in room ' + room.id + '.');
		}
		if (room.bannedUsers[userid]) delete room.bannedUsers[userid];
		for (var ip in targetUser.ips) {
			if (room.bannedIps[ip]) delete room.bannedIps[ip];
		}
		targetUser.popup(user.name+" has unbanned you from the room " + room.id + ".");
		this.addModCommand(""+targetUser.name+" was unbanned from room " + room.id + " by "+user.name+".");
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand(""+targetUser.name+"'s alts were also unbanned from room " + room.id + ": "+alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				var altId = toId(alts[i]);
				if (room.bannedUsers[altId]) delete room.bannedUsers[altId];
			}
		}
	},

	roomauth: function(target, room, user, connection) {
		if (!room.auth) return this.sendReply("/roomauth - This room isn't designed for per-room moderation and therefore has no auth list.");
		var buffer = [];
		for (var u in room.auth) {
			buffer.push(room.auth[u] + u);
		}
		if (buffer.length > 0) {
			buffer = buffer.join(', ');
		} else {
			buffer = 'This room has no auth.';
		}
		connection.popup(buffer);
	},

	leave: 'part',
	part: function(target, room, user, connection) {
		if (room.id === 'global') return false;
		var targetRoom = Rooms.get(target);
		if (target && !targetRoom) {
			return this.sendReply("The room '"+target+"' does not exist.");
		}
		user.leaveRoom(targetRoom || room, connection);
	},

	/*********************************************************
	 * Moderating: Punishments
	 *********************************************************/

	spam: 'spamroom',
	spammer: 'spamroom',
	spamroom: function(target, room, user, connection) {
		if (!target) return this.sendReply('Please specify a user.');
		var target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('The user \'' + this.targetUsername + '\' does not exist.');
		}
		if (!this.can('mute', targetUser)) {
			return false;
		}
		if (targetUser.userid === 'piiiikachuuu') {
			return this.sendReply('Nope c:');
		}
		if (spamroom[targetUser]) {
			return this.sendReply('That user\'s messages are already being redirected to the spamroom.');
		}
		spamroom[targetUser] = true;
		Rooms.rooms['spamroom'].add('|raw|<b>' + this.targetUsername + ' was added to the spamroom list.</b>');
		this.logModCommand(targetUser + ' was added to spamroom by ' + user.name);
		return this.sendReply(this.targetUsername + ' was successfully added to the spamroom list.');
	},

	unspam: 'unspamroom',
	unspammer: 'unspamroom',
	unspamroom: function(target, room, user, connection) {
		var target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('The user \'' + this.targetUsername + '\' does not exist.');
		}
		if (!this.can('mute', targetUser)) {
			return false;
		}
		if (!spamroom[targetUser]) {
			return this.sendReply('That user is not in the spamroom list.');
		}
		for(var u in spamroom)
			if(targetUser == Users.get(u))
				delete spamroom[u];
		Rooms.rooms['spamroom'].add('|raw|<b>' + this.targetUsername + ' was removed from the spamroom list.</b>');
		this.logModCommand(targetUser + ' was removed from spamroom by ' + user.name);
		return this.sendReply(this.targetUsername + ' and their alts were successfully removed from the spamroom list.');
	},

	k: 'kick',
	kick: function(target, room, user) {
		if (!target) return this.parse('/help kick');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('warn', targetUser)) return false;

		this.addModCommand(targetUser.name + ' was kicked from ' + room.id + ' by ' + user.name + '.');
		targetUser.leaveRoom(room.id);
	},
	
	warn: function(target, room, user) {
		if (!target) return this.parse('/help warn');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (room.auth) {
			return this.sendReply('You can\'t warn here: This is a privately-owned room not subject to global rules.');
		}
		if (!this.can('warn', targetUser, room)) return false;

		this.addModCommand(''+targetUser.name+' was warned by '+user.name+'.' + (target ? " (" + target + ")" : ""));
		targetUser.send('|c|~|/warn '+target);
	},

	redirect: 'redir',
	redir: function (target, room, user, connection) {
		if (!target) return this.parse('/help redirect');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		var targetRoom = Rooms.get(target) || Rooms.get(toId(target));
		if (!targetRoom) {
			return this.sendReply("The room '" + target + "' does not exist.");
		}
		if (!this.can('kick', targetUser, room)) return false;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (Rooms.rooms[targetRoom.id].users[targetUser.userid]) {
			return this.sendReply("User " + targetUser.name + " is already in the room " + target + "!");
		}
		if (targetRoom.id === "spamroom") {
			return this.sendReply('You cannot redirect users here.');
		}
		if (!Rooms.rooms[room.id].users[targetUser.userid]) {
			return this.sendReply('User '+this.targetUsername+' is not in the room ' + room.id + '.');
		}
		if (targetUser.joinRoom(target) === false) return this.sendReply('User "' + targetUser.name + '" could not be joined to room ' + target + '. They could be banned from the room.');
		var roomName = (targetRoom.isPrivate)? 'a private room' : 'room ' + target;
		this.addModCommand(targetUser.name + ' was redirected to ' + roomName + ' by ' + user.name + '.');
		targetUser.leaveRoom(room);
	},

	m: 'mute',
	mute: function(target, room, user) {
		if (!target) return this.parse('/help mute');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('mute', targetUser, room)) return false;
		if (targetUser.mutedRooms[room.id] || targetUser.locked || !targetUser.connected) {
			var problem = ' but was already '+(!targetUser.connected ? 'offline' : targetUser.locked ? 'locked' : 'muted');
			if (!target) {
				return this.privateModCommand('('+targetUser.name+' would be muted by '+user.name+problem+'.)');
			}
			return this.addModCommand(''+targetUser.name+' would be muted by '+user.name+problem+'.' + (target ? " (" + target + ")" : ""));
		}
		if (!room.auth) {
			targetUser.popup(user.name+' has muted you for 7 minutes. '+target);
			this.addModCommand(''+targetUser.name+' was muted by '+user.name+' for 7 minutes.' + (target ? " (" + target + ")" : ""));
			var alts = targetUser.getAlts();
			if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "));
			targetUser.mute(room.id, 7*60*1000);
		}
		if (room.auth) {
			targetUser.popup(user.name+' has muted you for 7 minutes in ' + room.id + '. '+target);
			this.addRoomCommand(''+targetUser.name+' was muted by '+user.name+' for 7 minutes.' + (target ? " (" + target + ")" : ""), room);
			var alts = targetUser.getAlts();
			if (alts.length) this.addRoomCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "), room);
			targetUser.mute(room.id, 7*60*1000);
		}
	},

	hourmute: function(target, room, user) {
		if (!target) return this.parse('/help hourmute');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('mute', targetUser, room)) return false;
		if (!room.auth) {
			targetUser.popup(user.name+' has muted you for 60 minutes. '+target);
			this.addModCommand(''+targetUser.name+' was muted by '+user.name+' for 60 minutes.' + (target ? " (" + target + ")" : ""));
			var alts = targetUser.getAlts();
			if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "));
			targetUser.mute(room.id, 60*60*1000, true);
		}
		if (room.auth) {
			targetUser.popup(user.name+' has muted you for 60 minutes in ' + room.id + '. '+target);
			this.addRoomCommand(''+targetUser.name+' was muted by '+user.name+' for 60 minutes.' + (target ? " (" + target + ")" : ""));
			var alts = targetUser.getAlts();
			if (alts.length) this.addRoomCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "));
			targetUser.mute(room.id, 60*60*1000, true);
		}
	},

	dmute : 'daymute',
	daymute: function(target, room, user) {
		if (!target) return this.parse('/help daymute');
		if (!this.canTalk()) return false;

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (targetUser.name === 'Brittle Wind' || targetUser.name === 'Cosy' || targetUser.name === 'Prez') return this.sendReply('This user cannot be muted');
		if (!this.can('mute', targetUser, room)) return false;
		if (((targetUser.mutedRooms[room.id] && (targetUser.muteDuration[room.id]||0) >= 50*60*1000) || targetUser.locked) && !target) {
			var problem = ' but was already '+(!targetUser.connected ? 'offline' : targetUser.locked ? 'locked' : 'muted');
			return this.privateModCommand('('+targetUser.name+' would be muted by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+' has muted you for 24 hours. '+target);
		this.addModCommand(''+targetUser.name+' was muted by '+user.name+' for 24 hours.' + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "));
		this.add('|unlink|' + targetUser.userid);

		targetUser.mute(room.id, 24*60*60*1000, true);
	},

	hm: 'hourmute',
	hourmute: function(target, room, user) {
		if (!target) return this.parse('/help hourmute');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!target) {
			return this.sendReply('You need to add how many hours the user is to be muted for.');
		}
		if (!this.can('mute', targetUser, room)) return false;
		if (((targetUser.mutedRooms[room.id] && (targetUser.muteDuration[room.id]||0) >= 50*60*1000) || targetUser.locked) && !target) {
			var problem = ' but was already '+(!targetUser.connected ? 'offline' : targetUser.locked ? 'locked' : 'muted');
			return this.privateModCommand('('+targetUser.name+' would be muted by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+' has muted you for 60 minutes. '+target);
		this.addModCommand(''+targetUser.name+' was muted by '+user.name+' for 60 minutes.' + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also muted: "+alts.join(", "));
		this.add('|unlink|' + targetUser.userid);

		targetUser.mute(room.id, 60*60*1000, true);
	},

	um: 'unmute',
	unmute: function(target, room, user) {
		if (!target) return this.parse('/help unmute');
		var targetUser = Users.get(target);
		if (!targetUser) {
			return this.sendReply('User '+target+' not found.');
		}
		if (!this.can('mute', targetUser, room)) return false;

		if (!targetUser.mutedRooms[room.id]) {
			return this.sendReply(''+targetUser.name+' isn\'t muted.');
		}

		this.addModCommand(''+targetUser.name+' was unmuted by '+user.name+'.');

		targetUser.unmute(room.id);
	},

	l: 'lock',
	ipmute: 'lock',
	lock: function(target, room, user) {
		if (!target) return this.parse('/help lock');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUser+' not found.');
		}
		if (!user.can('lock', targetUser)) {
			return this.sendReply('/lock - Access denied.');
		}

		if ((targetUser.locked || Users.checkBanned(targetUser.latestIp)) && !target) {
			var problem = ' but was already '+(targetUser.locked ? 'locked' : 'banned');
			return this.privateModCommand('('+targetUser.name+' would be locked by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+' has locked you from talking in chats, battles, and PMing regular users.\n\n'+target+'\n\nIf you feel that your lock was unjustified, you can still PM staff members (%, @, &, and ~) to discuss it.');

		this.addModCommand(""+targetUser.name+" was locked from talking by "+user.name+"." + (target ? " (" + target + ")" : ""));
		var alts = targetUser.getAlts();
		if (alts.length) this.addModCommand(""+targetUser.name+"'s alts were also locked: "+alts.join(", "));
		this.add('|unlink|' + targetUser.userid);

		targetUser.lock();
	},

	unlock: function(target, room, user) {
		if (!target) return this.parse('/help unlock');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUser+' not found.');
		}
		if (!this.can('lock', targetUser)) return false;

		var unlocked = Users.unlock(targetUser);

		if (unlocked) {
			var names = Object.keys(unlocked);
			this.addModCommand('' + names.join(', ') + ' ' +
					((names.length > 1) ? 'were' : 'was') +
					' unlocked by ' + user.name + '.');
		} else {
			this.sendReply('User '+targetUser.name+' is not locked.');
		}
	},
	
	permaban: function(target, room, user) {
		if (!target) return this.parse('/help permaban');
		if (!user.isSysadmin) return false;		
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
			var problem = ' but was already banned';
			return this.privateModCommand('('+targetUser.name+' would be banned by '+user.name+problem+'.)');
		}
		
		targetUser.popup(user.name+" has permanently banned you.");
		this.addModCommand(targetUser.name+" was permanently banned by "+user.name+".");
		targetUser.ban();
		ipbans.write('\n'+targetUser.latestIp);
	},

	b: 'ban',
	ban: function(target, room, user) {
		if (!target) return this.parse('/help ban');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('ban', targetUser)) return false;

		if (Users.checkBanned(targetUser.latestIp) && !target && !targetUser.connected) {
			var problem = ' but was already banned';
			return this.privateModCommand('('+targetUser.name+' would be banned by '+user.name+problem+'.)');
		}

		targetUser.popup(user.name+" has banned you." + (config.appealurl ? ("  If you feel that your banning was unjustified you can appeal the ban:\n" + config.appealurl) : "") + "\n\n"+target);

		this.addModCommand(""+targetUser.name+" was banned by "+user.name+"." + (target ? " (" + target + ")" : ""), ' ('+targetUser.latestIp+')');
		var alts = targetUser.getAlts();
		if (alts.length) {
			this.addModCommand(""+targetUser.name+"'s alts were also banned: "+alts.join(", "));
			for (var i = 0; i < alts.length; ++i) {
				this.add('|unlink|' + toId(alts[i]));
			}
		}

		this.add('|unlink|' + targetUser.userid);
		targetUser.ban();
	},

	unban: function(target, room, user) {
		if (!target) return this.parse('/help unban');
		if (!user.can('ban')) {
			return this.sendReply('/unban - Access denied.');
		}

		var name = Users.unban(target);

		if (name) {
			this.addModCommand(''+name+' was unbanned by '+user.name+'.');
		} else {
			this.sendReply('User '+target+' is not banned.');
		}
	},

	unbanall: function(target, room, user) {
		if (!user.can('ban')) {
			return this.sendReply('/unbanall - Access denied.');
		}
		// we have to do this the hard way since it's no longer a global
		for (var i in Users.bannedIps) {
			delete Users.bannedIps[i];
		}
		for (var i in Users.lockedIps) {
			delete Users.lockedIps[i];
		}
		this.addModCommand('All bans and locks have been lifted by '+user.name+'.');
	},

	banip: function(target, room, user) {
		target = target.trim();
		if (!target) {
			return this.parse('/help banip');
		}
		if (!this.can('rangeban')) return false;

		Users.bannedIps[target] = '#ipban';
		this.addModCommand(user.name+' temporarily banned the '+(target.charAt(target.length-1)==='*'?'IP range':'IP')+': '+target);
	},

	unbanip: function(target, room, user) {
		target = target.trim();
		if (!target) {
			return this.parse('/help unbanip');
		}
		if (!this.can('rangeban')) return false;
		if (!Users.bannedIps[target]) {
			return this.sendReply(''+target+' is not a banned IP or IP range.');
		}
		delete Users.bannedIps[target];
		this.addModCommand(user.name+' unbanned the '+(target.charAt(target.length-1)==='*'?'IP range':'IP')+': '+target);
	},

	/*********************************************************
	 * Moderating: Other
	 *********************************************************/

	modnote: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help note');
		if (!this.can('mute')) return false;
		return this.privateModCommand('(' + user.name + ' notes: ' + target + ')');
	},

	demote: 'promote',
	promote: function(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help promote');
		var target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var userid = toUserid(this.targetUsername);
		var name = targetUser ? targetUser.name : this.targetUsername;

		var currentGroup = ' ';
		if (targetUser) {
			currentGroup = targetUser.group;
		} else if (Users.usergroups[userid]) {
			currentGroup = Users.usergroups[userid].substr(0,1);
		}

		var nextGroup = target ? target : Users.getNextGroupSymbol(currentGroup, cmd === 'demote', true);
		if (target === 'deauth') nextGroup = config.groupsranking[0];
		if (!config.groups[nextGroup]) {
			return this.sendReply('Group \'' + nextGroup + '\' does not exist.');
		}
		if (!user.canPromote(currentGroup, nextGroup)) {
			return this.sendReply('/' + cmd + ' - Access denied.');
		}

		var isDemotion = (config.groups[nextGroup].rank < config.groups[currentGroup].rank);
		if (!Users.setOfflineGroup(name, nextGroup)) {
			return this.sendReply('/promote - WARNING: This user is offline and could be unregistered. Use /forcepromote if you\'re sure you want to risk it.');
		}
		var groupName = (config.groups[nextGroup].name || nextGroup || '').trim() || 'a regular user';
		if (isDemotion) {
			this.privateModCommand('('+name+' was demoted to ' + groupName + ' by '+user.name+'.)');
			if (targetUser) {
				targetUser.popup('You were demoted to ' + groupName + ' by ' + user.name + '.');
			}
		} else {
			this.addModCommand(''+name+' was promoted to ' + groupName + ' by '+user.name+'.');
		}
		if (targetUser) {
			targetUser.updateIdentity();
		}
	},

	forcepromote: function(target, room, user) {
		// warning: never document this command in /help
		if (!this.can('forcepromote')) return false;
		var target = this.splitTarget(target, true);
		var name = this.targetUsername;
		var nextGroup = target ? target : Users.getNextGroupSymbol(' ', false);

		if (!Users.setOfflineGroup(name, nextGroup, true)) {
			return this.sendReply('/forcepromote - Don\'t forcepromote unless you have to.');
		}
		var groupName = config.groups[nextGroup].name || nextGroup || '';
		this.addModCommand(''+name+' was promoted to ' + (groupName.trim()) + ' by '+user.name+'.');
	},

	deauth: function(target, room, user) {
		return this.parse('/demote '+target+', deauth');
	},

	modchat: function(target, room, user) {
		if (!target) {
			return this.sendReply('Moderated chat is currently set to: '+room.modchat);
		}
		if (!this.can('modchat', null, room)) return false;
		if (room.modchat && room.modchat.length <= 1 && config.groupsranking.indexOf(room.modchat) > 1 && !user.can('modchatall', null, room)) {
			return this.sendReply('/modchat - Access denied for removing a setting higher than ' + config.groupsranking[1] + '.');
		}

		target = target.toLowerCase();
		switch (target) {
		case 'on':
		case 'true':
		case 'yes':
		case 'registered':
			this.sendReply("Modchat registered is no longer available.");
			return false;
			break;
		case 'off':
		case 'false':
		case 'no':
			room.modchat = false;
			break;
		case 'autoconfirmed':
			room.modchat = 'autoconfirmed';
			break;
		default:
			if (!config.groups[target]) {
				return this.parse('/help modchat');
			}
			if (config.groupsranking.indexOf(target) > 1 && !user.can('modchatall', null, room)) {
				return this.sendReply('/modchat - Access denied for setting higher than ' + config.groupsranking[1] + '.');
			}
			room.modchat = target;
			break;
		}
		if (room.modchat === true) {
			this.add('|raw|<div class="broadcast-red"><b>Moderated chat was enabled!</b><br />Only registered users can talk.</div>');
		} else if (!room.modchat) {
			this.add('|raw|<div class="broadcast-blue"><b>Moderated chat was disabled!</b><br />Anyone may talk now.</div>');
		} else {
			var modchat = sanitize(room.modchat);
			this.add('|raw|<div class="broadcast-red"><b>Moderated chat was set to '+modchat+'!</b><br />Only users of rank '+modchat+' and higher can talk.</div>');
		}
		this.logModCommand(user.name+' set modchat to '+room.modchat);
	},

	declare: function(target, room, user) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;

		if (!this.canTalk()) return;

		this.add('|raw|<div class="broadcast-blue"><b>'+target+'</b></div>');
		if (room.id == 'porn') {
			return;
		}
		if (!room.auth) {
			this.logModCommand(user.name+' declared '+target);
		}
		this.logRoomCommand(user.name+' declared '+target, room);
	},

	declareall: function(target, room, user) {
		if (!target) return this.sendReply('/declareall - Declares a message in all chatrooms. Requires & ~');
		if (!this.can('declare')) return;

		if (!this.canTalk()) return;

		for (var r in Rooms.rooms) {
			if (Rooms.rooms[r].type === 'chat') Rooms.rooms[r].add('|raw|<div class="broadcast-blue"><b><i>Broadcast Message from '+user.name+':</i><br />'+target+'</b></div>');
		}
		this.logModCommand(user.name+' declared '+target);
	},

	gdeclare: 'globaldeclare',
	globaldeclare: function(target, room, user) {
		if (!target) return this.parse('/help globaldeclare');
		if (!this.can('gdeclare')) return false;

		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b>'+target+'</b></div>');
		}
		this.logModCommand(user.name+' globally declared '+target);
	},

	cdeclare: 'chatdeclare',
	chatdeclare: function(target, room, user) {
		if (!target) return this.parse('/help chatdeclare');
		if (!this.can('gdeclare')) return false;

		for (var id in Rooms.rooms) {
			if (id !== 'global') if (Rooms.rooms[id].type !== 'battle') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b>'+target+'</b></div>');
		}
		this.logModCommand(user.name+' globally declared (chat level) '+target);
	},

	wall: 'announce',
	announce: function(target, room, user) {
		if (!target) return this.parse('/help announce');

		if (!this.can('announce', null, room)) return false;

		target = this.canTalk(target);
		if (!target) return;

		return '/announce '+target;
	},

	fr: 'forcerename',
	forcerename: function(target, room, user) {
		if (!target) return this.parse('/help forcerename');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('forcerename', targetUser)) return false;

		if (targetUser.userid === toUserid(this.targetUser)) {
			var entry = ''+targetUser.name+' was forced to choose a new name by '+user.name+'' + (target ? ": " + target + "" : "");
			this.privateModCommand('(' + entry + ')');
			targetUser.resetName();
			targetUser.send('|nametaken||'+user.name+" has forced you to change your name. "+target);
		} else {
			this.sendReply("User "+targetUser.name+" is no longer using that name.");
		}
	},

	frt: 'forcerenameto',
	forcerenameto: function(target, room, user) {
		if (!target) return this.parse('/help forcerenameto');
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!target) {
			return this.sendReply('No new name was specified.');
		}
		if (!this.can('forcerenameto', targetUser)) return false;

		if (targetUser.userid === toUserid(this.targetUser)) {
			var entry = ''+targetUser.name+' was forcibly renamed to '+target+' by '+user.name+'.';
			this.privateModCommand('(' + entry + ')');
			targetUser.forceRename(target, undefined, true);
		} else {
			this.sendReply("User "+targetUser.name+" is no longer using that name.");
		}
	},

	complaintslist: 'complaintlist',
	complaintlist: function(target, room, user, connection) {
		if (!this.can('declare')) return false;
		var lines = 0;
		if (!target.match('[^0-9]')) { 
			lines = parseInt(target || 15, 10);
			if (lines > 100) lines = 100;
		}
		var filename = 'logs/complaint.txt';
		var command = 'tail -'+lines+' '+filename;
		var grepLimit = 100;
		if (!lines || lines < 0) { // searching for a word instead
			if (target.match(/^["'].+["']$/)) target = target.substring(1,target.length-1);
			command = "awk '{print NR,$0}' "+filename+" | sort -nr | cut -d' ' -f2- | grep -m"+grepLimit+" -i '"+target.replace(/\\/g,'\\\\\\\\').replace(/["'`]/g,'\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g,'[$&]')+"'";
		}

		require('child_process').exec(command, function(error, stdout, stderr) {
			if (error && stderr) {
				connection.popup('/complaintlist erred - the complaints list does not support Windows');
				console.log('/complaintlog error: '+error);
				return false;
			}
			if (lines) {
				if (!stdout) {
					connection.popup('The complaints list is empty. Great!');
				} else {
					connection.popup('Displaying the last '+lines+' lines of complaints:\n\n'+stdout);
				}
			} else {
				if (!stdout) {
					connection.popup('No complaints containing "'+target+'" were found.');
				} else {
					connection.popup('Displaying the last '+grepLimit+' logged actions containing "'+target+'":\n\n'+stdout);
				}
			}
		});
	},
	modlog: function(target, room, user, connection) {
		if (!this.can('modlog')) return false;
		var lines = 0;
		if (!target.match('[^0-9]')) {
			lines = parseInt(target || 15, 10);
			if (lines > 100) lines = 100;
		}
		var filename = 'logs/modlog.txt';
		var command = 'tail -'+lines+' '+filename;
		var grepLimit = 100;
		if (!lines || lines < 0) { // searching for a word instead
			if (target.match(/^["'].+["']$/)) target = target.substring(1,target.length-1);
			command = "awk '{print NR,$0}' "+filename+" | sort -nr | cut -d' ' -f2- | grep -m"+grepLimit+" -i '"+target.replace(/\\/g,'\\\\\\\\').replace(/["'`]/g,'\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g,'[$&]')+"'";
		}

		require('child_process').exec(command, function(error, stdout, stderr) {
			if (error && stderr) {
				connection.popup('/modlog erred - modlog does not support Windows');
				console.log('/modlog error: '+error);
				return false;
			}
			if (lines) {
				if (!stdout) {
					connection.popup('The modlog is empty. (Weird.)');
				} else {
					connection.popup('Displaying the last '+lines+' lines of the Moderator Log:\n\n'+stdout);
				}
			} else {
				if (!stdout) {
					connection.popup('No moderator actions containing "'+target+'" were found.');
				} else {
					connection.popup('Displaying the last '+grepLimit+' logged actions containing "'+target+'":\n\n'+stdout);
				}
			}
		});
	},

	roomlog: function(target, room, user, connection) {
		if (!this.can('mute', target, room)) return false;
		var lines = 0;
		if (!target.match('[^0-9]')) {
			lines = parseInt(target || 15, 10);
			if (lines > 100) lines = 100;
		}
		var filename = 'logs/chat/'+room.id+'/'+room.id+'.txt';
		var command = 'tail -'+lines+' '+filename;
		var grepLimit = 100;
		if (!lines || lines < 0) { // searching for a word instead
			if (target.match(/^["'].+["']$/)) target = target.substring(1,target.length-1);
			command = "awk '{print NR,$0}' "+filename+" | sort -nr | cut -d' ' -f2- | grep -m"+grepLimit+" -i '"+target.replace(/\\/g,'\\\\\\\\').replace(/["'`]/g,'\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g,'[$&]')+"'";
		}

		require('child_process').exec(command, function(error, stdout, stderr) {
			if (error && stderr) {
				connection.popup('/roomlog erred - roomlog does not support Windows');
				console.log('/roomlog error: '+error);
				return false;
			}
			if (lines) {
				if (!stdout) {
					connection.popup('The roomlog is empty. (Weird.)');
				} else {
					connection.popup('Displaying the last '+lines+' lines of the Moderator Log in '+room.id+':\n\n'+stdout);
				}
			} else {
				if (!stdout) {
					connection.popup('No moderator actions containing "'+target+'" were found in '+roomid+'.');
				} else {
					connection.popup('Displaying the last '+grepLimit+' logged actions in '+room.id+'containing "'+target+'":\n\n'+stdout);
				}
			}
		});
	},

	bw: 'banword',
	banword: function(target, room, user) {
		if (!this.can('declare')) return false;
		target = toId(target);
		if (!target) {
			return this.sendReply('Specify a word or phrase to ban.');
		}
		Users.addBannedWord(target);
		this.sendReply('Added \"'+target+'\" to the list of banned words.');
	},

	ubw: 'unbanword',
	unbanword: function(target, room, user) {
		if (!this.can('declare')) return false;
		target = toId(target);
		if (!target) {
			return this.sendReply('Specify a word or phrase to unban.');
		}
		Users.removeBannedWord(target);
		this.sendReply('Removed \"'+target+'\" from the list of banned words.');
	},

	/*********************************************************
	 * Server management commands
	 *********************************************************/
	
	hide: function(target, room, user) {
		if (this.can('hide')) {
			user.getIdentity = function(){
				if(this.muted)	return '!' + this.name;
				if(this.locked) return '‽' + this.name;
				return ' ' + this.name;
			};
			user.updateIdentity();
			this.sendReply('You have hidden your staff symbol.');
			return false;
		}

	},

	show: function(target, room, user) {
		if (this.can('hide')) {
			delete user.getIdentity
			user.updateIdentity();
			this.sendReply('You have revealed your staff symbol.');
			return false;
		}
	},

	customavatar: function(target, room, user, connection) {
		if (!this.can('customavatars')) return false;
		if (!target) return connection.sendTo(room, 'Usage: /customavatar username, URL');
		var http = require('http-get');
		target = target.split(", ");
		var username = Users.get(target[0]);
        var filename = target[1].split('.');
		filename = '.'+filename.pop();
		if (filename != ".png" && filename != ".gif") return connection.sendTo(room, '/customavatar - Invalid image type! Images are required to be png or gif.');
        filename = Users.get(username)+filename;
		if (!username) return this.sendReply('User '+target[0]+' not found.');
		http.get(target[1], 'config/avatars/' + filename, function (error, result) {
		    if (error) {
    		    return connection.sendTo(room, '/customavatar - You supplied an invalid URL!');
			//	console.log(error);
    		} else {
	    	//  connection.sendTo(room, 'File saved to: ' + result.file);
				avatar.write('\n'+username+','+filename);
				Users.get(username).avatar = filename;
				connection.sendTo(room, username+' has received a custom avatar.');
				Users.get(username).sendTo(room, 'You have received a custom avatar from ' + user.name + '.');
	    	}
		});
		this.logModCommand(user.name + ' added a custom avatar for ' + username + '.');
	},

	gymleader: function(target, room, user) {
		if (!this.can('gymleader')) return false;
		if (target === 'on') {
			user.getIdentity = function(){
				if (this.muted) return '!' + this.name;
				if (this.locked) return '‽' + this.name;
				return '±' + this.name;
			}
			user.updateIdentity();
			this.sendReply('You are now appearing as a Gym Leader.');
		}
		if (target === 'off') {
			delete user.getIdentity
			user.updateIdentity();
			this.sendReply('You are no longer appearing as a Gym Leader.');
		}
		if (target !== 'on' && target !== 'off') {
			this.sendReply('Usage: /gymleader [on/off]');
		}
		},

	hotpatch: function(target, room, user) {
		if (!this.can('hotpatch')) return false;

		this.logEntry(user.name + ' used /hotpatch ' + target);

		if (target === 'chat') {

			try {
				CommandParser.uncacheTree('./command-parser.js');
				CommandParser = require('./command-parser.js');
				CommandParser.uncacheTree('./tour.js');
				tour = require('./tour.js').tour(tour);
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
	},

	savelearnsets: function(target, room, user) {
		if (!this.can('hotpatch')) return false;
		fs.writeFile('data/learnsets.js', 'exports.BattleLearnsets = '+JSON.stringify(BattleLearnsets)+";\n");
		this.sendReply('learnsets.js saved.');
	},

	disableladder: function(target, room, user) {
		if (!this.can('disableladder')) return false;
		if (LoginServer.disabled) {
			return this.sendReply('/disableladder - Ladder is already disabled.');
		}
		LoginServer.disabled = true;
		this.logModCommand('The ladder was disabled by ' + user.name + '.');
		this.add('|raw|<div class="broadcast-red"><b>Due to high server load, the ladder has been temporarily disabled</b><br />Rated games will no longer update the ladder. It will be back momentarily.</div>');
	},

	enableladder: function(target, room, user) {
		if (!this.can('disableladder')) return false;
		if (!LoginServer.disabled) {
			return this.sendReply('/enable - Ladder is already enabled.');
		}
		LoginServer.disabled = false;
		this.logModCommand('The ladder was enabled by ' + user.name + '.');
		this.add('|raw|<div class="broadcast-green"><b>The ladder is now back.</b><br />Rated games will update the ladder now.</div>');
	},

	lockdown: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		Rooms.global.lockdown = true;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-red"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>');
			if (Rooms.rooms[id].requestKickInactive && !Rooms.rooms[id].battle.ended) Rooms.rooms[id].requestKickInactive(user, true);
		}

		this.logEntry(user.name + ' used /lockdown');

	},

	endlockdown: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.sendReply("We're not under lockdown right now.");
		}
		Rooms.global.lockdown = false;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b>The server shutdown was canceled.</b></div>');
		}

		this.logEntry(user.name + ' used /endlockdown');

	},

	emergency: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (config.emergency) {
			return this.sendReply("We're already in emergency mode.");
		}
		config.emergency = true;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-red">The server has entered emergency mode. Some features might be disabled or limited.</div>');
		}

		this.logEntry(user.name + ' used /emergency');
	},

	endemergency: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!config.emergency) {
			return this.sendReply("We're not in emergency mode.");
		}
		config.emergency = false;
		for (var id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-green"><b>The server is no longer in emergency mode.</b></div>');
		}

		this.logEntry(user.name + ' used /endemergency');
	},

	kill: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.sendReply('For safety reasons, /kill can only be used during lockdown.');
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply('Wait for /updateserver to finish before using /kill.');
		}

		room.destroyLog(function() {
			room.logEntry(user.name + ' used /kill');
		}, function() {
			process.exit();
		});

		// Just in the case the above never terminates, kill the process
		// after 10 seconds.
		setTimeout(function() {
			process.exit();
		}, 10000);
	},

	restart: function(target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.sendReply('For safety reasons, /restart can only be used during lockdown.');
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply('Wait for /updateserver to finish before using /kill.');
		}
		var exec = require('child_process').exec;
		exec('./restart.sh');
		Rooms.global.send('|refresh|');
	},

	loadbanlist: function(target, room, user, connection) {
		if (!this.can('hotpatch')) return false;

		connection.sendTo(room, 'Loading ipbans.txt...');
		fs.readFile('config/ipbans.txt', function (err, data) {
			if (err) return;
			data = (''+data).split("\n");
			for (var i=0; i<data.length; i++) {
				var line = data[i].split('#')[0].trim();
				if (!line) continue;
				if (line.indexOf('/') >= 0) {
					rangebans.push(line);
				} else if (line && !Users.bannedIps[line]) {
					Users.bannedIps[line] = '#ipban';
				}
			}
			Users.checkRangeBanned = Cidr.checker(rangebans);
			connection.sendTo(room, 'ibans.txt has been reloaded.');
		});
	},

	refreshpage: function(target, room, user) {
		if (!this.can('hotpatch')) return false;
		Rooms.global.send('|refresh|');
		this.logEntry(user.name + ' used /refreshpage');
	},

	updateserver: function(target, room, user, connection) {
		if (!user.hasConsoleAccess(connection) && user.userid != 'piiiikachuuu') {
			return this.sendReply('/updateserver - Access denied.');
		}

		if (CommandParser.updateServerLock) {
			return this.sendReply('/updateserver - Another update is already in progress.');
		}

		CommandParser.updateServerLock = true;

		var logQueue = [];
		logQueue.push(user.name + ' used /updateserver');

		connection.sendTo(room, 'updating...');

		var exec = require('child_process').exec;
		exec('git diff-index --quiet HEAD --', function(error) {
			var cmd = 'git pull --rebase';
			if (error) {
				if (error.code === 1) {
					// The working directory or index have local changes.
					cmd = 'git stash;' + cmd + ';git stash pop';
				} else {
					// The most likely case here is that the user does not have
					// `git` on the PATH (which would be error.code === 127).
					connection.sendTo(room, '' + error);
					logQueue.push('' + error);
					logQueue.forEach(function(line) {
						room.logEntry(line);
					});
					CommandParser.updateServerLock = false;
					return;
				}
			}
			var entry = 'Running `' + cmd + '`';
			connection.sendTo(room, entry);
			logQueue.push(entry);
			exec(cmd, function(error, stdout, stderr) {
				('' + stdout + stderr).split('\n').forEach(function(s) {
					connection.sendTo(room, s);
					logQueue.push(s);
				});
				logQueue.forEach(function(line) {
					room.logEntry(line);
				});
				CommandParser.updateServerLock = false;
			});
		});
	},

	crashfixed: function(target, room, user) {
		if (!Rooms.global.lockdown) {
			return this.sendReply('/crashfixed - There is no active crash.');
		}
		if (!this.can('hotpatch')) return false;

		Rooms.global.lockdown = false;
		if (Rooms.lobby) {
			Rooms.lobby.modchat = false;
			Rooms.lobby.addRaw('<div class="broadcast-green"><b>We fixed the crash without restarting the server!</b><br />You may resume talking in the lobby and starting new battles.</div>');
		}
		this.logEntry(user.name + ' used /crashfixed');
	},

	crashlogged: function(target, room, user) {
		if (!Rooms.global.lockdown) {
			return this.sendReply('/crashlogged - There is no active crash.');
		}
		if (!this.can('declare')) return false;

		Rooms.global.lockdown = false;
		if (Rooms.lobby) {
			Rooms.lobby.modchat = false;
			Rooms.lobby.addRaw('<div class="broadcast-green"><b>We have logged the crash and are working on fixing it!</b><br />You may resume talking in the lobby and starting new battles.</div>');
		}
		this.logEntry(user.name + ' used /crashlogged');
	},

	'memusage': 'memoryusage',
	memoryusage: function(target) {
		if (!this.can('hotpatch')) return false;
		target = toId(target) || 'all';
		if (target === 'all') {
			this.sendReply('Loading memory usage, this might take a while.');
		}
		if (target === 'all' || target === 'rooms' || target === 'room') {
			this.sendReply('Calcualting Room size...');
			var roomSize = ResourceMonitor.sizeOfObject(Rooms);
			this.sendReply("Rooms are using " + roomSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'config') {
			this.sendReply('Calculating config size...');
			var configSize = ResourceMonitor.sizeOfObject(config);
			this.sendReply("Config is using " + configSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'resourcemonitor' || target === 'rm') {
			this.sendReply('Calculating Resource Monitor size...');
			var rmSize = ResourceMonitor.sizeOfObject(ResourceMonitor);
			this.sendReply("The Resource Monitor is using " + rmSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'apps' || target === 'app' || target === 'serverapps') {
			this.sendReply('Calculating Server Apps size...');
			var appSize = ResourceMonitor.sizeOfObject(App) + ResourceMonitor.sizeOfObject(AppSSL) + ResourceMonitor.sizeOfObject(Server);
			this.sendReply("Server Apps are using " + appSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'cmdp' || target === 'cp' || target === 'commandparser') {
			this.sendReply('Calculating Command Parser size...');
			var cpSize = ResourceMonitor.sizeOfObject(CommandParser);
			this.sendReply("Command Parser is using " + cpSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'sim' || target === 'simulator') {
			this.sendReply('Calculating Simulator size...');
			var simSize = ResourceMonitor.sizeOfObject(Simulator);
			this.sendReply("Simulator is using " + simSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'users') {
			this.sendReply('Calculating Users size...');
			var usersSize = ResourceMonitor.sizeOfObject(Users);
			this.sendReply("Users is using " + usersSize + " bytes of memory.");
		}
		if (target === 'all' || target === 'tools') {
			this.sendReply('Calculating Tools size...');
			var toolsSize = ResourceMonitor.sizeOfObject(Tools);
			this.sendReply("Tools are using " + toolsSize + " bytes of memory.");
		}
		if (target === 'all') {
			this.sendReply('Calculating Total size...');
			var total = (roomSize + configSize + rmSize + appSize + cpSize + simSize + toolsSize + usersSize) || 0;
			var units = ['bytes', 'K', 'M', 'G'];
			var converted = total;
			var unit = 0;
			while (converted > 1024) {
				converted /= 1024;
				unit++;
			}
			converted = Math.round(converted);
			this.sendReply("Total memory used: " + converted + units[unit] + " (" + total + " bytes).");
		}
		return;
	},

	bash: function(target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply('/bash - Access denied.');
		}

		var exec = require('child_process').exec;
		exec(target, function(error, stdout, stderr) {
			connection.sendTo(room, ('' + stdout + stderr));
		});
	},

	eval: function(target, room, user, connection, cmd, message) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply("/eval - Access denied.");
		}
		if (!this.canBroadcast()) return;

		if (!this.broadcasting) this.sendReply('||>> '+target);
		try {
			var battle = room.battle;
			var me = user;
			this.sendReply('||<< '+eval(target));
		} catch (e) {
			this.sendReply('||<< error: '+e.message);
			var stack = '||'+(''+e.stack).replace(/\n/g,'\n||');
			connection.sendTo(room, stack);
			this.logModCommand(user.name + ' used eval');
			logeval.write('\n'+user.name+ ' used eval.  \"' + target + '\"');
		}
	},

	evalbattle: function(target, room, user, connection, cmd, message) {
		if (!user.hasConsoleAccess(connection)) {
			return this.sendReply("/evalbattle - Access denied.");
		}
		if (!this.canBroadcast()) return;
		if (!room.battle) {
			return this.sendReply("/evalbattle - This isn't a battle room.");
		}

		room.battle.send('eval', target.replace(/\n/g, '\f'));
	},

	/*********************************************************
	 * Battle commands
	 *********************************************************/

	concede: 'forfeit',
	surrender: 'forfeit',
	forfeit: function(target, room, user) {
		if (!room.battle) {
			return this.sendReply("There's nothing to forfeit here.");
		}
		if (!room.forfeit(user)) {
			return this.sendReply("You can't forfeit this battle.");
		}
	},

	savereplay: function(target, room, user, connection) {
		if (!room || !room.battle) return;
		var logidx = 2; // spectator log (no exact HP)
		if (room.battle.ended) {
			// If the battle is finished when /savereplay is used, include
			// exact HP in the replay log.
			logidx = 3;
		}
		var data = room.getLog(logidx).join("\n");
		var datahash = crypto.createHash('md5').update(data.replace(/[^(\x20-\x7F)]+/g,'')).digest('hex');

		LoginServer.request('prepreplay', {
			id: room.id.substr(7),
			loghash: datahash,
			p1: room.p1.name,
			p2: room.p2.name,
			format: room.format
		}, function(success) {
			connection.send('|queryresponse|savereplay|'+JSON.stringify({
				log: data,
				id: room.id.substr(7)
			}));
		});
	},

	mv: 'move',
	attack: 'move',
	move: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', 'move '+target);
	},

	sw: 'switch',
	switch: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', 'switch '+parseInt(target,10));
	},

	choose: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', target);
	},

	undo: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'undo', target);
	},

	team: function(target, room, user) {
		if (!room.decision) return this.sendReply('You can only do this in battle rooms.');

		room.decision(user, 'choose', 'team '+target);
	},

	joinbattle: function(target, room, user) {
		if (!room.joinBattle) return this.sendReply('You can only do this in battle rooms.');

		room.joinBattle(user);
	},

	partbattle: 'leavebattle',
	leavebattle: function(target, room, user) {
		if (!room.leaveBattle) return this.sendReply('You can only do this in battle rooms.');

		room.leaveBattle(user);
	},

	kickbattle: function(target, room, user) {
		if (!room.leaveBattle) return this.sendReply('You can only do this in battle rooms.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.sendReply('User '+this.targetUsername+' not found.');
		}
		if (!this.can('kick', targetUser)) return false;

		if (room.leaveBattle(targetUser)) {
			this.addModCommand(''+targetUser.name+' was kicked from a battle by '+user.name+'' + (target ? " (" + target + ")" : ""));
		} else {
			this.sendReply("/kickbattle - User isn\'t in battle.");
		}
	},

	kickinactive: function(target, room, user) {
		if (room.requestKickInactive) {
			room.requestKickInactive(user);
		} else {
			this.sendReply('You can only kick inactive players from inside a room.');
		}
	},

	timer: function(target, room, user) {
		target = toId(target);
		if (room.requestKickInactive) {
			if (target === 'off' || target === 'stop') {
				room.stopKickInactive(user, user.can('timer'));
			} else if (target === 'on' || !target) {
				room.requestKickInactive(user, user.can('timer'));
			} else {
				this.sendReply("'"+target+"' is not a recognized timer state.");
			}
		} else {
			this.sendReply('You can only set the timer from inside a room.');
		}
	},

	forcetie: 'forcewin',
	forcewin: function(target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!room.battle) {
			this.sendReply('/forcewin - This is not a battle room.');
			return false;
		}

		room.battle.endType = 'forced';
		if (!target) {
			room.battle.tie();
			this.logModCommand(user.name+' forced a tie.');
			return false;
		}
		target = Users.get(target);
		if (target) target = target.userid;
		else target = '';

		if (target) {
			room.battle.win(target);
			this.logModCommand(user.name+' forced a win for '+target+'.');
		}

	},

	/*********************************************************
	 * Challenging and searching commands
	 *********************************************************/

	cancelsearch: 'search',
	search: function(target, room, user) {
		if (target) {
			Rooms.global.searchBattle(user, target);
		} else {
			Rooms.global.cancelSearch(user);
		}
	},

	chall: 'challenge',
	challenge: function(target, room, user, connection) {
		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.popupReply("The user '"+this.targetUsername+"' was not found.");
		}
		if (targetUser.blockChallenges && !user.can('bypassblocks', targetUser)) {
			return this.popupReply("The user '"+this.targetUsername+"' is not accepting challenges right now.");
		}
		if (!user.prepBattle(target, 'challenge', connection)) return;
		user.makeChallenge(targetUser, target);
	},

	away: 'blockchallenges',
	idle: 'blockchallenges',
	blockchallenges: function(target, room, user) {
		user.blockChallenges = true;
		this.sendReply('You are now blocking all incoming challenge requests.');
	},

	back: 'allowchallenges',
	allowchallenges: function(target, room, user) {
		user.blockChallenges = false;
		this.sendReply('You are available for challenges from now on.');
	},

	cchall: 'cancelChallenge',
	cancelchallenge: function(target, room, user) {
		user.cancelChallengeTo(target);
	},

	accept: function(target, room, user, connection) {
		var userid = toUserid(target);
		var format = '';
		if (user.challengesFrom[userid]) format = user.challengesFrom[userid].format;
		if (!format) {
			this.popupReply(target+" cancelled their challenge before you could accept it.");
			return false;
		}
		if (!user.prepBattle(format, 'challenge', connection)) return;
		user.acceptChallengeFrom(userid);
	},

	reject: function(target, room, user) {
		user.rejectChallengeFrom(toUserid(target));
	},

	saveteam: 'useteam',
	utm: 'useteam',
	useteam: function(target, room, user) {
		try {
			user.team = JSON.parse(target);
		} catch (e) {
			this.popupReply('Not a valid team.');
		}
	},

	/*********************************************************
	 * Low-level
	 *********************************************************/

	cmd: 'query',
	query: function(target, room, user, connection) {
		// Avoid guest users to use the cmd errors to ease the app-layer attacks in emergency mode
		var trustable = (!config.emergency || (user.named && user.authenticated));
		if (config.emergency && ResourceMonitor.countCmd(connection.ip, user.name)) return false;
		var spaceIndex = target.indexOf(' ');
		var cmd = target;
		if (spaceIndex > 0) {
			cmd = target.substr(0, spaceIndex);
			target = target.substr(spaceIndex+1);
		} else {
			target = '';
		}
		if (cmd === 'userdetails') {

			var targetUser = Users.get(target);
			if (!trustable || !targetUser) {
				connection.send('|queryresponse|userdetails|'+JSON.stringify({
					userid: toId(target),
					rooms: false
				}));
				return false;
			}
			var roomList = {};
			for (var i in targetUser.roomCount) {
				if (i==='global') continue;
				var targetRoom = Rooms.get(i);
				if (!targetRoom || targetRoom.isPrivate) continue;
				var roomData = {};
				if (targetRoom.battle) {
					var battle = targetRoom.battle;
					roomData.p1 = battle.p1?' '+battle.p1:'';
					roomData.p2 = battle.p2?' '+battle.p2:'';
				}
				roomList[i] = roomData;
			}
			if (!targetUser.roomCount['global']) roomList = false;
			var userdetails = {
				userid: targetUser.userid,
				avatar: targetUser.avatar,
				rooms: roomList
			};
			if (user.can('ip', targetUser)) {
				var ips = Object.keys(targetUser.ips);
				if (ips.length === 1) {
					userdetails.ip = ips[0];
				} else {
					userdetails.ips = ips;
				}
			}
			connection.send('|queryresponse|userdetails|'+JSON.stringify(userdetails));

		} else if (cmd === 'roomlist') {
			if (!trustable) return false;
			connection.send('|queryresponse|roomlist|'+JSON.stringify({
				rooms: Rooms.global.getRoomList(true)
			}));

		} else if (cmd === 'rooms') {
			if (!trustable) return false;
			connection.send('|queryresponse|rooms|'+JSON.stringify(
				Rooms.global.getRooms()
			));

		}
	},

	trn: function(target, room, user, connection) {
		var commaIndex = target.indexOf(',');
		var targetName = target;
		var targetAuth = false;
		var targetToken = '';
		if (commaIndex >= 0) {
			targetName = target.substr(0,commaIndex);
			target = target.substr(commaIndex+1);
			commaIndex = target.indexOf(',');
			targetAuth = target;
			if (commaIndex >= 0) {
				targetAuth = !!parseInt(target.substr(0,commaIndex),10);
				targetToken = target.substr(commaIndex+1);
			}
		}
		user.rename(targetName, targetToken, targetAuth, connection);
	},

};

//poof functions, still not neat
function getRandMessage(user){
	var numMessages = 34; // numMessages will always be the highest case # + 1 //increasing this will make the default appear more often
	var message = '~~ ';
	switch(Math.floor(Math.random()*numMessages)){
		case 0: message = message + user.name + ' has vanished into nothingness!';
		break;
		case 1: message = message + user.name + ' visited kupo\'s bedroom and never returned!';
		break;
		case 2: message = message + user.name + ' used Explosion!';
		break;
		case 3: message = message + user.name + ' fell into the void.';
		break;
		case 4: message = message + user.name + ' was squished by miloticnob\'s large behind!';
		break;	
		case 5: message = message + user.name + ' became EnerG\'s slave!';
		break;
		case 6: message = message + user.name + ' became kupo\'s love slave!';
		break;
		case 7: message = message + user.name + ' has left the building.';
		break;
		case 8: message = message + user.name + ' felt Thundurus\'s wrath!';
		break;
		case 9: message = message + user.name + ' died of a broken heart.';
		break;
		case 10: message = message + user.name + ' got lost in a maze!';
		break;
		case 11: message = message + user.name + ' was hit by Magikarp\'s Revenge!';
		break;
		case 12: message = message + user.name + ' was sucked into a whirlpool!';
		break;
		case 13: message = message + user.name + ' got scared and left the server!';
		break;
		case 14: message = message + user.name + ' fell off a cliff!';
		break;
		case 15: message = message + user.name + ' got eaten by a bunch of piranhas!';
		break;
		case 16: message = message + user.name + ' is blasting off again!';
		break;
		case 17: message = message + 'A large spider descended from the sky and picked up ' + user.name + '.';
		break;
		case 18: message = message + user.name + ' was Volt Tackled by piiiikachuuu!';
		break;
		case 19: message = message + user.name + ' got their sausage smoked by Charmanderp!';
		break;
		case 20: message = message + user.name + ' was forced to give jd an oil massage!'; //huehue
		break;
		case 21: message = message + user.name + ' took an arrow to the knee... and then one to the face.';
		break;
		case 22: message = message + user.name + ' peered through the hole on Shedinja\'s back';
		break;
		case 23: message = message + user.name + ' received judgment from the almighty Arceus!';
		break;
		case 24: message = message + user.name + ' used Final Gambit and missed!';
		break;
		case 25: message = message + user.name + ' pissed off a wild AOrtega!';
		break;
		case 26: message = message + user.name + ' was frozen by Nord!';
		break;
		case 27: message = message + user.name + ' was actually a 12 year and was banned for COPPA.';
		break;
		case 28: message = message + user.name + ' got lost in the illusion of reality.';
		break;
		case 29: message = message + user.name + ' was unfortunate and didn\'t get a cool message.';
		break;
		case 30: message = message + 'The Immortal accidently kicked ' + user.name + ' from the server!';
		break;
		case 31: message = message + user.name + ' was knocked out cold by Fallacies!';
		break;
		case 32: message = message + user.name + ' died making love to an EnerG218!'; //huehuehue how long until someone notices
		break;
		case 33: message = message + user.name + ' was glomped to death by Mizu!';
		break;
		default: message = message + user.name + ' fled from colonial mustang!';
	};
	message = message + ' ~~';
	return message;
}

//i was going to format this, but wtf
function MD5(f){function i(b,c){var d,e,f,g,h;f=b&2147483648;g=c&2147483648;d=b&1073741824;e=c&1073741824;h=(b&1073741823)+(c&1073741823);return d&e?h^2147483648^f^g:d|e?h&1073741824?h^3221225472^f^g:h^1073741824^f^g:h^f^g}function j(b,c,d,e,f,g,h){b=i(b,i(i(c&d|~c&e,f),h));return i(b<<g|b>>>32-g,c)}function k(b,c,d,e,f,g,h){b=i(b,i(i(c&e|d&~e,f),h));return i(b<<g|b>>>32-g,c)}function l(b,c,e,d,f,g,h){b=i(b,i(i(c^e^d,f),h));return i(b<<g|b>>>32-g,c)}function m(b,c,e,d,f,g,h){b=i(b,i(i(e^(c|~d),
f),h));return i(b<<g|b>>>32-g,c)}function n(b){var c="",e="",d;for(d=0;d<=3;d++)e=b>>>d*8&255,e="0"+e.toString(16),c+=e.substr(e.length-2,2);return c}var g=[],o,p,q,r,b,c,d,e,f=function(b){for(var b=b.replace(/\r\n/g,"\n"),c="",e=0;e<b.length;e++){var d=b.charCodeAt(e);d<128?c+=String.fromCharCode(d):(d>127&&d<2048?c+=String.fromCharCode(d>>6|192):(c+=String.fromCharCode(d>>12|224),c+=String.fromCharCode(d>>6&63|128)),c+=String.fromCharCode(d&63|128))}return c}(f),g=function(b){var c,d=b.length;c=
d+8;for(var e=((c-c%64)/64+1)*16,f=Array(e-1),g=0,h=0;h<d;)c=(h-h%4)/4,g=h%4*8,f[c]|=b.charCodeAt(h)<<g,h++;f[(h-h%4)/4]|=128<<h%4*8;f[e-2]=d<<3;f[e-1]=d>>>29;return f}(f);b=1732584193;c=4023233417;d=2562383102;e=271733878;for(f=0;f<g.length;f+=16)o=b,p=c,q=d,r=e,b=j(b,c,d,e,g[f+0],7,3614090360),e=j(e,b,c,d,g[f+1],12,3905402710),d=j(d,e,b,c,g[f+2],17,606105819),c=j(c,d,e,b,g[f+3],22,3250441966),b=j(b,c,d,e,g[f+4],7,4118548399),e=j(e,b,c,d,g[f+5],12,1200080426),d=j(d,e,b,c,g[f+6],17,2821735955),c=
j(c,d,e,b,g[f+7],22,4249261313),b=j(b,c,d,e,g[f+8],7,1770035416),e=j(e,b,c,d,g[f+9],12,2336552879),d=j(d,e,b,c,g[f+10],17,4294925233),c=j(c,d,e,b,g[f+11],22,2304563134),b=j(b,c,d,e,g[f+12],7,1804603682),e=j(e,b,c,d,g[f+13],12,4254626195),d=j(d,e,b,c,g[f+14],17,2792965006),c=j(c,d,e,b,g[f+15],22,1236535329),b=k(b,c,d,e,g[f+1],5,4129170786),e=k(e,b,c,d,g[f+6],9,3225465664),d=k(d,e,b,c,g[f+11],14,643717713),c=k(c,d,e,b,g[f+0],20,3921069994),b=k(b,c,d,e,g[f+5],5,3593408605),e=k(e,b,c,d,g[f+10],9,38016083),
d=k(d,e,b,c,g[f+15],14,3634488961),c=k(c,d,e,b,g[f+4],20,3889429448),b=k(b,c,d,e,g[f+9],5,568446438),e=k(e,b,c,d,g[f+14],9,3275163606),d=k(d,e,b,c,g[f+3],14,4107603335),c=k(c,d,e,b,g[f+8],20,1163531501),b=k(b,c,d,e,g[f+13],5,2850285829),e=k(e,b,c,d,g[f+2],9,4243563512),d=k(d,e,b,c,g[f+7],14,1735328473),c=k(c,d,e,b,g[f+12],20,2368359562),b=l(b,c,d,e,g[f+5],4,4294588738),e=l(e,b,c,d,g[f+8],11,2272392833),d=l(d,e,b,c,g[f+11],16,1839030562),c=l(c,d,e,b,g[f+14],23,4259657740),b=l(b,c,d,e,g[f+1],4,2763975236),
e=l(e,b,c,d,g[f+4],11,1272893353),d=l(d,e,b,c,g[f+7],16,4139469664),c=l(c,d,e,b,g[f+10],23,3200236656),b=l(b,c,d,e,g[f+13],4,681279174),e=l(e,b,c,d,g[f+0],11,3936430074),d=l(d,e,b,c,g[f+3],16,3572445317),c=l(c,d,e,b,g[f+6],23,76029189),b=l(b,c,d,e,g[f+9],4,3654602809),e=l(e,b,c,d,g[f+12],11,3873151461),d=l(d,e,b,c,g[f+15],16,530742520),c=l(c,d,e,b,g[f+2],23,3299628645),b=m(b,c,d,e,g[f+0],6,4096336452),e=m(e,b,c,d,g[f+7],10,1126891415),d=m(d,e,b,c,g[f+14],15,2878612391),c=m(c,d,e,b,g[f+5],21,4237533241),
b=m(b,c,d,e,g[f+12],6,1700485571),e=m(e,b,c,d,g[f+3],10,2399980690),d=m(d,e,b,c,g[f+10],15,4293915773),c=m(c,d,e,b,g[f+1],21,2240044497),b=m(b,c,d,e,g[f+8],6,1873313359),e=m(e,b,c,d,g[f+15],10,4264355552),d=m(d,e,b,c,g[f+6],15,2734768916),c=m(c,d,e,b,g[f+13],21,1309151649),b=m(b,c,d,e,g[f+4],6,4149444226),e=m(e,b,c,d,g[f+11],10,3174756917),d=m(d,e,b,c,g[f+2],15,718787259),c=m(c,d,e,b,g[f+9],21,3951481745),b=i(b,o),c=i(c,p),d=i(d,q),e=i(e,r);return(n(b)+n(c)+n(d)+n(e)).toLowerCase()};



var colorCache = {};

function hashColor(name) {
	if (colorCache[name]) return colorCache[name];

	var hash = MD5(name);
	var H = parseInt(hash.substr(4, 4), 16) % 360;
	var S = parseInt(hash.substr(0, 4), 16) % 50 + 50;
	var L = parseInt(hash.substr(8, 4), 16) % 20 + 25;

	var m1, m2, hue;
	var r, g, b
	S /=100;
	L /= 100;
	if (S == 0)
	r = g = b = (L * 255).toString(16);
	else {
	if (L <= 0.5)
	m2 = L * (S + 1);
	else
	m2 = L + S - L * S;
	m1 = L * 2 - m2;
	hue = H / 360;
	r = HueToRgb(m1, m2, hue + 1/3);
	g = HueToRgb(m1, m2, hue);
	b = HueToRgb(m1, m2, hue - 1/3);
}


colorCache[name] = '#' + r + g + b;
return colorCache[name];
}

function HueToRgb(m1, m2, hue) {
	var v;
	if (hue < 0)
		hue += 1;
	else if (hue > 1)
		hue -= 1;

	if (6 * hue < 1)
		v = m1 + (m2 - m1) * hue * 6;
	else if (2 * hue < 1)
		v = m2;
	else if (3 * hue < 2)
		v = m1 + (m2 - m1) * (2/3 - hue) * 6;
	else
		v = m1;

	return (255 * v).toString(16);
}
