
suite('Client Model', function() {
	var client = new ClientSpace.Client();
	
	test('should exist in the given namespace', function() {
		expect(ClientSpace).to.be.ok;
	    expect(client).to.be.ok;
	});

	test('should initialize properly', function() {
		expect(typeof client.initialize).to.equal('function');
		expect(typeof client.get('currentShow')).to.equal('string');
		
	});

	test('should have cast and show data', function() {
		var shows = [];
		var upcoming = client.get('upcoming');
		for (var key in upcoming) {
			shows.push(upcoming[key]);
		}
		expect(shows.length > 0).to.equal(true);
	});

});

suite('Client Server', function() {
	var server = new ClientSpace.Server();


	test('should know its IP address', function() {
		expect(server.get('ip')).not.to.equal('undefined');
	});

});

