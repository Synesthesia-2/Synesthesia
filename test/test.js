// test('Array', function(){
// 	it('should return -1 when the value is not present', function(){
// 		assert.equal(-1, [1,2,3].indexOf(5));
// 		assert.equal(-1, [1,2,3].indexOf(0));
// 	})
// })

suite('Conductor', function() {
	conductor = new ConductorSpace.Conductor();

	test('should exist', function() {
		expect(ConductorSpace).to.be.ok;
	    expect(conductor).to.be.ok;
	});

	test('should have an initialize method', function() {
		expect(typeof conductor.initialize).to.equal('function');
	})
})
