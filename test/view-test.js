// console.log("we can log stuff out.");
 
// function add(a, b) {
//     return a + b;
// }
 
// console.log("We can execute regular JS too:", add(1, 2));
 
// phantom.exit();


var page = require("webpage").create();
 
page.open("http://net.tutsplus.com", function () {
    var title = page.evaluate(function () {
        var posts = document.getElementsByClassName("post");
        posts[0].style.backgroundColor = "#000000";
        return document.title;
    });
    page.clipRect = { top: 0, left: 0, width: 600, height: 700 };
    page.render(title + ".png");
    phantom.exit();
});


describe("DOM Tests", function () {
    var el = document.createElement("div");
    el.id = "myDiv";
    el.innerHTML = "Hi there!";
    el.style.background = "#ccc";
    document.body.appendChild(el);
 
    var myEl = document.getElementById('myDiv');
    it("is in the DOM", function () {
        expect(myEl).to.not.equal(null);
    });
 
    it("is a child of the body", function () {
        expect(myEl.parentElement).to.equal(document.body);
    });
 
    it("has the right text", function () {
        expect(myEl.innerHTML).to.equal("Hi there!");
    });
 
    it("has the right background", function () {
        expect(myEl.style.background).to.equal("rgb(204, 204, 204)");
    });
});