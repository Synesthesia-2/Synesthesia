
suite('Conductor Model', function() {
	var conductor = new ConductorSpace.Conductor();
	
	test('should exist', function() {
		expect(ConductorSpace).to.be.ok;
	    expect(conductor).to.be.ok;
	});

	test('should have an initialize method', function() {
		expect(typeof conductor.initialize).to.equal('function');
	});

	test('should toggle strobe when called', function() {
		conductor.initialize();
		conductor.toggleStrobe();
		expect(conductor.get('strobe')).to.equal(true);
	});

});



var io = {
	listen: function () {},
	connect: function () {return {on: function() {}};}
};

suite('Conductor Server', function() {
	var server = new ConductorSpace.Server();


	test('should emit a named event', function() {
		expect(typeof server.emit).to.equal('function');
	});

});