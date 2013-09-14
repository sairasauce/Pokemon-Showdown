var dns = require('dns');
var dnsblCache = {};

exports.query = function queryDnsbl(ip, callback) {
	if (ip in dnsblCache) {
		callback(dnsblCache[ip]);
		return;
	}
	var reversedIp = ip.split('.').reverse().join('.');
	dns.resolve4(reversedIp+'.dnsbl.dronebl.org', function(err, addresses) {
		var isBlocked = dnsblCache[ip] = !err;
		var reason = "Your IP address is listed in DroneBL.\nFor more information, visit:\nhttp://dronebl.org/lookup?ip="+ip;
		callback(isBlocked, reason);
		if (err) {
			dns.resolve4(reversedIp+'.rbl.efnetrbl.org', function(err, addresses) {
				var isBlocked = dnsblCache[ip] = !err;
				var reason = "Your IP address is listed in EFnet RBL.\nFor more information, visit:\nhttp://rbl.efnetrbl.org/?i="+ip;
				callback(isBlocked, reason);
			});
		}
	});
}

