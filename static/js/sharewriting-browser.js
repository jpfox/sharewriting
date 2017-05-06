
var ShareWriting = new ShareWritingClass();

function ShareWritingClass() {
	this.author_name = '';
	this.keyPair ='';
	
	this.hexEncodeArray = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
	
	/**
	 * Initiate author key pairs
	 */
	this.setAuth = function(author_name, passphrase) {
		this.author_name = author_name;
		var hash512 = nacl.hash(nacl.util.decodeUTF8('[' + author_name + ':' + passphrase + ']'));
		var seed = new Uint8Array(nacl.sign.seedLength);
		for (var i = 0; i < 32; i++) seed[i] = hash512[i];
		this.keyPair = nacl.sign.keyPair.fromSeed(seed);
		return true;
	};
	
	this.toHex = function(iArray) {
		var s = '';
		for (var i = 0; i < iArray.length; i++) {
		var code = iArray[i];
			s += this.hexEncodeArray[code >>> 4];
			s += this.hexEncodeArray[code & 0x0F];
		}
		return s;
	};
	
	/**
	 * convert base64 encoded strinf to base36 encoded string
	 */
	this.b64toHex = function(s64) {
		return this.toHex(nacl.util.decodeBase64(s64));
	};
	
	/**
	 * get base64 public key
	 */
	this.getPubKey = function() {
		return nacl.util.encodeBase64(this.keyPair.publicKey);
	};
	
	/**
	 * get hex public key
	 */
	this.getPubKeyHex = function() {
		return this.toHex(this.keyPair.publicKey);
	};
	
	/**
	 * get base64 message signature
	 */
	this.getSignature = function(jsonArticle) {
		var signature = nacl.sign.detached(nacl.util.decodeUTF8(jsonArticle), this.keyPair.secretKey);
		return nacl.util.encodeBase64(signature);
	};
	
	/**
	 * get html formatted writing
	 */
	this.getFormattedWriting = function(writing) {
		var pubdate = new Date(writing.article.timestamp);
		var rTags = writing.article.tags.split(',');
		var mdbody = writing.article.body;
		if(writing.article.images && writing.article.images.length>0) {
			for (i = 0; i < writing.article.images.length; i++) {
				mdbody = mdbody + "\n[sw_img_"+(i+1)+"]: " + writing.article.images[i];
			}
		}
		var html='<article>';
		html += '<header>';
		html += '<canvas class="jdenticon" style="float:right" width="100" height="100"';
		html += ' data-jdenticon-hash="'+this.b64toHex(writing.article.pubkey)+'"';
		html += ' alt="'+writing.article.author+'\'s pub key"';
		html += ' title="'+writing.article.author+'\'s pub key"';
		html += ' ></canvas>';
		html += '<h1 class="headline">' + writing.article.title + '</h1>';
		html += '<div class="byline">';
		html += '<address class="author">By ' + writing.article.author + ' / ' + writing.article.pubkey + '</address>';
		html += '<time pubdate datetime="' + pubdate.toISOString() + '" title="' + pubdate.toDateString()  + '">On ' + pubdate.toDateString() + '</time>';
		html += '</div>';
		if(rTags.length>0 && rTags[0]!=='') {
			html += '<ul class="tags">';
			for (i = 0; i < rTags.length; i++) {
				if(rTags[i]!=='')
					html += '<li class="tag"> #' + rTags[i] + '</li>';
			}
			html += '</ul>';
		}
		html += '</header>';
		html += '<div class="article-content">' +  markdown.toHTML(mdbody) + '</div>';
		html += '<footer>';
		html += '<div class="signature">' + writing.signature + '</div>';
		html += '</footer>';
		html += '</article>';
		return html;
	};
	
}

$(function(){
	/* init input fields */
	$('input, textarea, select').val('');
	
	var swMarkdownEditor = new SwMarkdownEditor('#sw_markdown_editor_tb', '#sw_editor');
	
	/* user lang */
	var userLang = navigator.language || navigator.userLanguage;
	$('#sw_lang').val(userLang.slice(0,2));
	/*$('#sw_lang').change(function(){
		var userLang = $('#sw_lang').val();
		var mdown = $('#sw_editor').val();
		// TODO : change editor lang
		$('#sw_editor').val(mdown);
	});*/

	/* discard alert message */
	$('button').click(function(){
		$('#alert-error-message').hide();
		$('#alert-error-content').html('');
	});
	
	/* authentication */
	$('#btn-authenticate').click(function(){
		/* TODO: check author name and passphrase format */
		if($('#sw_author').val().length<3) {
			$('#alert-error-content').html('Author name must have at least 3 characters.');
			$('#alert-error-message').show();
			return;
		}
		if($('#sw_pass').val().length<10) {
			$('#alert-error-content').html('Your pass phrase is too short to be secured : at least 10 characters.');
			$('#alert-error-message').show();
			return;
		}
		var result = ShareWriting.setAuth($('#sw_author').val(), $('#sw_pass').val());
		if(result === true) {
			$('#sw_pubkey').val(ShareWriting.getPubKey());
			$('#sw_jidenticon').jdenticon(ShareWriting.getPubKeyHex());
			$('#sw_jidenticon').attr('alt',ShareWriting.author_name + "'s pub key");
			$('#sw_jidenticon').attr('title',ShareWriting.author_name + "'s pub key");
			$('#containter-pubkey').show();
		}
	});
	
	/* accept key */
	$('#btn-accept-pubkey').click(function(){
		$('#sw_author').val('');
		$('#sw_pass').val('');
		$('#sw_author_ok').val(ShareWriting.author_name);
		$('#sw_pubkey_ok').val(ShareWriting.getPubKey());
		$('#sw_jidenticon_ok').jdenticon(ShareWriting.getPubKeyHex());
		$('#sw_jidenticon_ok').attr('alt',ShareWriting.author_name + "'s pub key");
		$('#sw_jidenticon_ok').attr('title',ShareWriting.author_name + "'s pub key");
		$('#sw_jidenticon_ok').attr('title',ShareWriting.author_name + "'s pub key");
		$('#alert-authentication').hide();
		$('#alert-edition').show();
		$('#form-login').hide();
		$('#form-publish').show();
	});
	
	/* sign and preview */
	$('#btn-sign-preview').click(function(){
		/* TODO: check title, lang, tags and body format */
		if($('#sw_title').val().length===0) {
			$('#alert-error-content').html('Title is required.');
			$('#alert-error-message').show();
			return;
		}
		var images = [];
		$("body").css("cursor", "progress");
		$( "#sw_images_panel img.sw_img_thumb" ).each(function( index ) {
			images[index] = $(this).attr('src');
		});
		var article = {
			'author': ShareWriting.author_name,
			'pubkey': ShareWriting.getPubKey(),
			'timestamp': Date.now(),
			'title': $('#sw_title').val(),
			'lang': $('#sw_lang').val(),
			'tags': $('#sw_tags').val(),
			'body': $('#sw_editor').val(),
			'images': images
		};
		var signature = ShareWriting.getSignature(JSON.stringify(article));
		if(signature!==false) {
			$('#sw_signature').val(signature);
			var writing = {
				'version': 1,
				'algo': "ed25519",
				'article': article,
				'signature': signature
			};
			// console.log(writing);
			// $('#writing-json').val(JSON.stringify(writing));
			var info = writing.article.images.length + " images\n";
			var artsize = JSON.stringify(writing).length;
			if(artsize<1000)
				info += artsize + " bits\n";
			else
				info += Math.round(artsize/1024) + " kb\n";
			$('#writing-json').val(info);
			var preview = ShareWriting.getFormattedWriting(writing);
			$('#writing-preview').html(preview);
			jdenticon.update('#writing-preview canvas.jdenticon');
			$('#container-preview').show();
			window.location = '#container-preview';
		}
		$("body").css("cursor", "default");
	});
	
	/* Re-edit */
	$('#btn-reedit').click(function(){
		window.location='#form-publish';
	});
	
	/* publish */
	$('#btn-publish').click(function(){
		alert('Not yet implemented !');
	});

});
