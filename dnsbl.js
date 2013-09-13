var dns = require('dns');

var blocklist = 'zen.spamhaus.org';

var dnsblCache = {};
exports.query = function queryDnsbl(ip, callback) {
	if (ip in dnsblCache) {
		callback(dnsblCache[ip]);
		return;
	}
	var reversedIp = ip.split('.').reverse().join('.');
	dns.resolve4(reversedIp+'.'+blocklist, function(err, addresses) {
		if (!err && blocklist == "zen.spamhaus.org" && addresses[0] == "127.0.0.4") return; 
		var isBlocked = dnsblCache[ip] = !err;
		callback(isBlocked);
	});
}
