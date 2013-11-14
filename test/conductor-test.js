
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




// describe("A spy", function() {
//     var foo, bar = null;
 
//     beforeEach(function() {
//         foo = {
//             setBar: function(value) {
//                 bar = value;
//             }
//         };
 
//         spyOn(foo, 'setBar');
 
//         foo.setBar(123);
//         foo.setBar(456, 'another param');
//     });
 
//     it("tracks that the spy was called", function() {
//         expect(foo.setBar).toHaveBeenCalled();
//     });
 
//     it("tracks its number of calls", function() {
//         expect(foo.setBar.calls.length).toEqual(2);
//     });
 
//     it("tracks all the arguments of its calls", function() {
//         expect(foo.setBar).toHaveBeenCalledWith(123);
//         expect(foo.setBar).toHaveBeenCalledWith(456, 'another param');
//     });
 
// });



suite('Conductor Router', function() {

});


// suite('Conductor View', function() {
	//Can probably do a lot of this with PhantomJS

/*((describe("DOM Tests", function () {
   it("has the right title", function () {
     expect(document.title).to.equal('hello world');
   });
});))*/

//	var conductor = new ConductorSpace.Conductor();
    
//	conductor.set('templates', {mainView: 'mainView'});
//	conductor.set('template', function() {});

//	var server = new ConductorSpace.Server();
//	// debugger;
//	var view = new ConductorSpace.MainView({ model: conductor, server: server} );
//	var conductorApp = new ConductorSpace.ConductorApp({ model: conductor, server: server, template: function() {} });

//	//how to check if server is emitting an event
//	//i could set up my own listener
//	//test('')

//	//for toggleAudioLights i can mock up a DOM element
//	//and watch it change property

//	test('render()', function() {
//    conductorApp.render();

//    expect(this.profile.$el.html().match(/John/)).to.be.ok;
//    expect(this.profile.$el.html().match(/Black/)).to.be.ok;
//    expect(this.profile.$el.html().match(/35/)).to.be.ok;
//	});
// });