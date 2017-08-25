var state = 0;

function swapFrame(){
	var chat = document.getElementById("chatframe");
	var editor = document.getElementById("editorframe");
	editor.style.display = "inline";
	chat.style.display = "none";
	simulateFullScreen();
}

function swapParentFrame(){
    var chat = parent.document.getElementById("chatframe");
    var editor = parent.document.getElementById("editorframe");
    editor.style.display = "none";
    chat.style.display = "inline";
    cancelFS();
}

function swapTool(){
	var SP = document.getElementById("tool_selectpath");
	if(state == 0){
		//alert(5);
		state = 1;
	}
	else{
		//alert(6);
		state = 0;
	}
}

function uploadToChat(img){
	
}

function downloadLogs(){
	var hiddenElement = document.createElement('a');

	hiddenElement.href = 'data:attachment/text,' + encodeURI(chatLog);
	hiddenElement.target = '_blank';
	hiddenElement.download = 'MC2.LOG - '+Date()+'.txt';
	hiddenElement.click();
}

function simulateFullScreen(){
	var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
}

function cancelFS(){
	alert("changing");
	var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    cancelFullScreen.call(doc);
}