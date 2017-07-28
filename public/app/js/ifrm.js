function swapFrame(){
	var chat = $("#chatframe");
	var editor = $("#editorframe");
	//var ts = document.getElementById('editor-frame').contentWindow.document.getElementById('tool_swap');
	editor.removeClass("hidden-xs");
	chat.addClass("hidden-xs");
	editor.css({
		display: "inline"
	})
}

function swapParentFrame(){
    var chat = $("#chatframe");
    var editor = $("#editorframe");
    chat.removeClass("hidden-xs");
    editor.addClass("hidden-xs");
}

function uploadToChat(img){
	
}