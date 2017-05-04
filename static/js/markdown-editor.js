/***************************************************
 * 
 * ShareWriting
 * 
 *   Markdown editor
 * 
 * https://sharewriting.net/
 * under License GNU/AFFERO GPL v3
 * Author : jpfox
 * 
 ***************************************************/

function SwMarkdownEditor(toolbarSel, txtareaSel) {
	
	this.getInputSelection = function() {
		var start = 0, end = 0, normalizedValue, range,
			textInputRange, len, endRange;

		if (typeof this.txtareaElt.selectionStart == "number" && typeof this.txtareaElt.selectionEnd == "number") {
			start = this.txtareaElt.selectionStart;
			end = this.txtareaElt.selectionEnd;
		} else {
			range = document.selection.createRange();

			if (range && range.parentElement() == this.txtareaElt) {
				len = this.txtareaElt.value.length;
				normalizedValue = this.txtareaElt.value.replace(/\r\n/g, "\n");

				// Create a working TextRange that lives only in the input
				textInputRange = this.txtareaElt.createTextRange();
				textInputRange.moveToBookmark(range.getBookmark());

				// Check if the start and end of the selection are at the very end
				// of the input, since moveStart/moveEnd doesn't return what we want
				// in those cases
				endRange = this.txtareaElt.createTextRange();
				endRange.collapse(false);

				if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
					start = end = len;
				} else {
					start = -textInputRange.moveStart("character", -len);
					start += normalizedValue.slice(0, start).split("\n").length - 1;

					if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
						end = len;
					} else {
						end = -textInputRange.moveEnd("character", -len);
						end += normalizedValue.slice(0, end).split("\n").length - 1;
					}
				}
			}
		}

		return {
			start: start,
			end: end
		};
	};

	this.getSelectedText = function() {
		var sel = this.getInputSelection();
		var val = this.txtareaElt.value;
		return val.slice(sel.start, sel.end);
	};

	this.replaceSelectedText = function(text) {
		var sel = this.getInputSelection();
		var val = this.txtareaElt.value;
		this.txtareaElt.value = val.slice(0, sel.start) + text + val.slice(sel.end);
	};

	this.setSelectionRange = function(selectionStart, selectionEnd) {
		if (this.txtareaElt.setSelectionRange) {
			this.txtareaElt.focus();
			this.txtareaElt.setSelectionRange(selectionStart, selectionEnd);
		}
		else if (this.txtareaElt.createTextRange) {
			var range = this.txtareaElt.createTextRange();
			range.collapse(true);
			range.moveEnd('character', selectionEnd);
			range.moveStart('character', selectionStart);
			range.select();
		}
	};
	
	this.embedSelectionIn = function(startTag, endTag) {
		var sel = this.getInputSelection();
		var seltxt = this.getSelectedText();
		$this.replaceSelectedText(startTag + seltxt + endTag);
		$this.setSelectionRange(sel.start+startTag.length, sel.end+startTag.length);
		this.txtareaElt.focus();
	};

	/** constructor **/
	
	var $this = this;
	
	this.toolbarSel = toolbarSel;
	this.txtareaSel = txtareaSel;
	this.txtareaElt = $(txtareaSel).get(0);
	
	$(this.toolbarSel + ' .mdedit-h1').click(function(){
		$this.embedSelectionIn("\n# ", "\n");
	});
	
	$(this.toolbarSel + ' .mdedit-h2').click(function(){
		$this.embedSelectionIn("\n## ", "\n");
	});
	
	$(this.toolbarSel + ' .mdedit-h3').click(function(){
		$this.embedSelectionIn("\n### ", "\n");
	});
	
	$(this.toolbarSel + ' .mdedit-h4').click(function(){
		$this.embedSelectionIn("\n#### ", "\n");
	});
	
	$(this.toolbarSel + ' .mdedit-h5').click(function(){
		$this.embedSelectionIn("\n##### ", "\n");
	});
	
	$(this.toolbarSel + ' .mdedit-h6').click(function(){
		$this.embedSelectionIn("\n###### ", "\n");
	});
	
	
	$(this.toolbarSel + ' .mdedit-strong').click(function(){
		$this.embedSelectionIn('**', '**');
	});
	
	$(this.toolbarSel + ' .mdedit-em').click(function(){
		$this.embedSelectionIn('_', '_');
	});
	
	$(this.toolbarSel + ' .mdedit-ul').click(function(){
		$this.embedSelectionIn("\n- ", "\n");
	});
	
	$(this.toolbarSel + ' .mdedit-ol').click(function(){
		$this.embedSelectionIn("\n1. ", "\n");
	});
	
	$(this.toolbarSel + ' .mdedit-cite').click(function(){
		$this.embedSelectionIn("\n> ", "\n");
	});
	
	$(this.toolbarSel + ' .mdedit-pre').click(function(){
		var txt = $this.getSelectedText();
		if(txt.match(/\r|\n/) || txt==='')
			$this.embedSelectionIn("\n\n    ", "\n");
		else
			$this.embedSelectionIn("``", "``");
	});
	
	$(this.toolbarSel + ' .mdedit-hr').click(function(){
		$this.embedSelectionIn("\n___\n", "");
	});
	
	$(this.toolbarSel + ' .mdedit-a').click(function(){
		var url = prompt($(this).attr("data-mdedit"), "https://");
		$this.embedSelectionIn('[', ']('+url+')');
	});
	
	$(this.toolbarSel + ' .mdedit-img-url').click(function(){
		var url = prompt($(this).attr("data-mdedit"), "https://");
		$this.embedSelectionIn('![', ']('+url+')');
	});

}

