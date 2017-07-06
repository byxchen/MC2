function swapFrame(){
	var chat = document.getElementById("chatframe");
	var editor = document.getElementById("editorframe");
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