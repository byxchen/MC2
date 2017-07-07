function swapFrame(){
	var chat = document.getElementById("chatframe");
	var editor = document.getElementById("editorframe");
	var ts = document.getElementById('editor-frame').contentWindow.document.getElementById('tool_swap');
	ts.style.display = "block";
	editor.style.display = "inline";
	chat.style.display = "none";
}

function swapParentFrame(){
	var chat = parent.document.getElementById("chatframe");
	var editor = parent.document.getElementById("editorframe");
	editor.style.display = "none";
	chat.style.display = "inline";
}

function uploadToChat(img){
	
}