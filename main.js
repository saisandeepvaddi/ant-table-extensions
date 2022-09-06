if(typeof __PLATFORM === 'undefined' && !/platform[=]/.test(location.search)) __PLATFORM = 'flash';

function main(stage) {
	//
	// Begin configuration

	// XXX POPULATE THE BELOW
	var mainModule = null;

	// End configuration
	//

	if(!mainModule) {
		var msg = "You must specify a mainModule";
		alert(msg);
		throw new Error(msg);
	}

	require({baseUrl: 'src'}, [mainModule], function(Main) {
		var m = new Main();
		if(m instanceof sp.DisplayObject) {
			stage.addChild(m);
		}
	});
}
