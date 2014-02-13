window.namespace.home = function(win, doc, $, _, undefined){

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

	//public interface
	return {
		publicValue:publicValue,
		publicMethod:publicMethod
	};

}.call(window.namespace, window, document, jQuery, _, undefined /*, omitted undefined here */);
