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
	
	this.embedSelectionIn = function(startTag, endTag, bEachLine) {
		var sel = this.getInputSelection();
		var seltxt = this.getSelectedText();
		if(bEachLine) {
			var rLines = seltxt.split("\n");
			var newtxt='';
			for(i=0; i<rLines.length; i++)
				if(i>0 || rLines[i].length>0)
					newtxt += startTag + rLines[i];
			newtxt += endTag;
			$this.replaceSelectedText(newtxt);
			$this.setSelectionRange(sel.start, sel.start+newtxt.length);
		} else {
			$this.replaceSelectedText(startTag + seltxt + endTag);
			$this.setSelectionRange(sel.start+startTag.length, sel.end+startTag.length);
		}
		this.txtareaElt.focus();
	};

	this.previewFile = function() {
		var preview = document.querySelector('img');
		var file    = document.querySelector('input[type=file]').files[0];
		var reader  = new FileReader();

		reader.addEventListener("load", function () {
			preview.src = reader.result;
		}, false);

		if (file) {
			reader.readAsDataURL(file);
		}
	};

	/** constructor **/
	
	var $this = this;
	
	this.toolbarSel = toolbarSel;
	this.txtareaSel = txtareaSel;
	this.txtareaElt = $(txtareaSel).get(0);
	
	this.img_counter=0;
	
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
	
	$(this.toolbarSel + ' .mdedit-p').click(function(){
		$this.embedSelectionIn("\n", "\n");
	});
	
	$(this.toolbarSel + ' .mdedit-strong').click(function(){
		$this.embedSelectionIn('**', '**');
	});
	
	$(this.toolbarSel + ' .mdedit-em').click(function(){
		$this.embedSelectionIn('_', '_');
	});
	
	$(this.toolbarSel + ' .mdedit-ul').click(function(){
		$this.embedSelectionIn("\n- ", "\n", true);
	});
	
	$(this.toolbarSel + ' .mdedit-ol').click(function(){
		$this.embedSelectionIn("\n1. ", "\n", true);
	});
	
	$(this.toolbarSel + ' .mdedit-cite').click(function(){
		$this.embedSelectionIn("\n> ", "\n", true);
	});
	
	$(this.toolbarSel + ' .mdedit-pre').click(function(){
		var txt = $this.getSelectedText();
		if(txt.match(/\r|\n/) || txt==='')
			$this.embedSelectionIn("\n    ", "\n", true);
		else
			$this.embedSelectionIn("``", "``");
	});
	
	$(this.toolbarSel + ' .mdedit-hr').click(function(){
		$this.embedSelectionIn("\n___\n", "");
	});
	
	$(this.toolbarSel + ' .mdedit-a').click(function(){
		var url = prompt($(this).attr("data-mdedit-prompt"), "https://");
		if(url!==null)
			$this.embedSelectionIn('[', ']('+url+')');
	});
	
	$(this.toolbarSel + ' .mdedit-img-url').click(function(){
		var url = prompt($(this).attr("data-mdedit-prompt-1"), "https://");
		if(url===null)
			return;
		var alt = '';
		var txt = $this.getSelectedText();
		if(txt==='')
			alt = prompt($(this).attr("data-mdedit-prompt-2"), "");
		if(alt!==null)
			$this.embedSelectionIn('\n!['+alt, ']('+url+')\n');
	});

	$(this.toolbarSel + ' .mdedit-img-data').click(function(){
		$('#sw_img_upload').click();
	});
	
	$('#sw_img_upload').change(function(){
		var file=$('#sw_img_upload').get(0).files[0];
		var img = document.createElement("img");
		var reader  = new FileReader();
		$this.img_counter++;
		var button =  '<button id="sw_img_'+$this.img_counter+'" type="button" class="btn btn-default" title="'+file.name+'" alt="'+file.name+'">';
			button += ' <img title="'+file.name+'" alt="'+file.name+'" class="sw_img_thumb" style="max-width:18px;max-height:18px;margin:0;" />';
			button += '</button>';
		$( "#sw_images_panel" ).append(button);
		reader.onload = function (e) {
			img.src = e.target.result;
			img.onload = function () {
				var elem = $('#sw_img_'+$this.img_counter+' img').get(0);
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);
				var MAX_WIDTH = 800;
				var MAX_HEIGHT = 800;
				var width = img.width;
				var height = img.height;

				if (width > height) {
					if (width > MAX_WIDTH) {
						height *= MAX_WIDTH / width;
						width = MAX_WIDTH;
					}
				} else {
					if (height > MAX_HEIGHT) {
						width *= MAX_HEIGHT / height;
						height = MAX_HEIGHT;
					}
				}
				canvas.width = width;
				canvas.height = height;
				ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, width, height);

				elem.src = canvas.toDataURL("image/jpeg",0.8);
			};
		};
		if(file) {
			reader.readAsDataURL(file);
			$('#sw_img_'+$this.img_counter).click(function(){
				var alt = '';
				var txt = $this.getSelectedText();
				if(txt==='')
					alt = prompt($($this.toolbarSel + ' .mdedit-img-url').attr("data-mdedit-prompt-2"), $(this).attr('title'));
				if(alt!==null)
					$this.embedSelectionIn('\n!['+alt, '] [' + $(this).attr('id') + ']\n');
			});
		}
		$('#sw_img_upload').val('');
	});
}

