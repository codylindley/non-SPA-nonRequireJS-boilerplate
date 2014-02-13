//global hcjj
window.hcjj = {};

window.hcjj.globals = function(win, doc, $, _, undefined){

	//private properties
	var privateValue = 'privateValue';
	var privateMethod = function(){
		return privateValue;
	};

	//public properties
	var publicValue = 'publicValue';
	var publicMethod = function(){
		return publicValue;
	};

	//initalize
	var initialize = function(){

		console.log(privateValue,privateMethod(),publicValue,publicMethod());

	}();

	console.log(this); //here this is sfb object

	//public, can also place global constants here
	return {
		publicValue:publicValue,
		publicMethod:publicMethod
	};

}.call(window.hcjj, window, document, jQuery, _,  undefined/*, omitted undefined here */);