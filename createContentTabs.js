/**
 * CreateContentTabs Plugin
 *
 * Plugin para criar tabs (bootstrap-tabs) apartir de um conteudo continuo.
 * $('.content-text .conteudo_interno').createContentTabs({
 *      contentTabs: '.glossario .nav-tabs',
 *      sectionDivider: '.sub-section'
 * });
 *
 * Dependencies: jQuery CreateContentTabs Plugin
 *
 * @author André Filipe Goulart
 * @version 1.0
 */
$.fn.createContentTabs = function(opt) {

	/**
	 * [cnf description]
	 * @type {Object}
	 */
	var cnf = {
		addId: true,
		linkMenu: true,
		classLinks: '',
		sectionToID: 'h2',
		orderReverseItens: false,
		disableEmptyContent: true,
		otherContainerSelector: '',
		sectionDivider: 'h2',
		contentTabs: '.nav-tabs',
		tagSectionContent: 'div',
		classSectionContent: 'tab-pane',
		beforeLoad: function(){},
		callback: function($boxContent){}
	}


	var cleanSpecialChars = function(string, whitespace, lowercase) {
		if(!whitespace) { whitespace = true; }
		if(!lowercase) { lowercase = true; }

		var new_text = string;
		new_text = new_text.replace(/[áàâãä]/gi, "a");
		new_text = new_text.replace(/[ÁÀÂÃÄ]/gi, "A");
		new_text = new_text.replace(/[éèê]/gi, "e");
		new_text = new_text.replace(/[ÉÈÊ]/gi, "E");
		new_text = new_text.replace(/[íì]/gi, "i");
		new_text = new_text.replace(/[ÍÌ]/gi, "I");
		new_text = new_text.replace(/[óòôõö]/gi, "o");
		new_text = new_text.replace(/[ÓÒÔÕÖ]/gi, "O");
		new_text = new_text.replace(/[úùü]/gi, "u");
		new_text = new_text.replace(/[ÚÙÜ]/gi, "U");
		new_text = new_text.replace(/ç/gi, "c");
		new_text = new_text.replace(/Ç/gi, "C");
		new_text = new_text.replace(/[\]\[\>\<\}\{\)\(\:\;\,\!\?\*\%\~\^\`\&\#\@]/gi, "");
		if(whitespace) { new_text = new_text.replace(/[\s]/gi, "-"); }
		if(lowercase) { new_text = new_text.toLowerCase(); }

		return new_text;
	};


	/**
	 * [checkLinksMenu description]
	 * @param  {[type]} $boxContent
	 * @param  {[type]} settings
	 * @return {[type]}
	 */
	var checkLinksMenu = function ($boxContent, settings){
		var $navTabs = $( settings.contentTabs );
		$boxContent.find('.' + settings.classSectionContent).each(function() {
			var $this = $(this),
				$tag = $this.find(settings.sectionToID),
				textTag = $tag.text(),
				$li = $('<li/>'),
				$link = $('<a/>');

			$link.addClass(settings.classLinks);
			$li.append( $link.attr('href', '#' + cleanSpecialChars(textTag) ).text(textTag) );
			$navTabs.append($li);
		});

		$navTabs.find('a').off('click.actionTab').on('click.actionTab', function (e) {
			e.preventDefault()
			$(this).tab('show');
		});

		$navTabs.find('a:first').tab('show');
	};

	/**
	 * [disabledTab description]
	 * @param  {Object} $divTab
	 * @param  {Object} settings
	 * @return {undefined}
	 */
	var disabledTab = function($divTab, settings){
		var $tabTitles = $divTab.find(settings.sectionToID);

		var itensComConteudo = false;
		$tabTitles.each(function(idx, el){
			var $divider = $(el);
			var $contentDivider = $divider.nextUntil(settings.sectionToID);

			if( !$contentDivider.size() ){
				$divider.hide();
			} else {
				itensComConteudo = true;
			}
		});

		if (!itensComConteudo) {
			var $navTabs = $(settings.contentTabs);
			$navTabs.find('a').each(function(index, el) {
				var $el = $(el);
				if( $el.text() == $tabTitles.text() ){
					$el.parent().addClass('disabled');
					$el.off('click.actionTab').on('click.actionTab', function(e){ e.preventDefault(); });
				}
			});
		}
	};


	return this.each(function() {
		var settings = $.extend({}, cnf, opt),
			$main = $(this),
			$boxContent = $main,
			divTabs = [];
		if(settings.otherContainerSelector){$boxContent = $(settings.otherContainerSelector);}
		$main.addClass('tab-content');
		$main.find(settings.sectionDivider).each(function(){
			var $divider = $(this);
			var $dividerContent = $divider.nextUntil(settings.sectionDivider);
			var $divTab = $('<' + settings.tagSectionContent + ' class="' + settings.classSectionContent + '" />');

			$divTab.append($divider.clone(true)).append($dividerContent.clone(true));

			var idTabPanel = $divTab.find(settings.sectionToID).text();
			if(settings.addId){
				$divTab.attr( 'id', cleanSpecialChars(idTabPanel) );
			}
			$divider.remove();
			$dividerContent.remove();
			divTabs.push($divTab);
		});
		if(settings.orderReverseItens){divTabs.reverse()};
		for(var i in divTabs){
			$boxContent.append(divTabs[i]);
		}

		if(settings.linkMenu){
			checkLinksMenu($boxContent, settings);
			if(settings.disableEmptyContent){
				for(var i in divTabs){
					disabledTab(divTabs[i], settings); // check if content exists
				}
			}
		}
		settings.callback($boxContent);
	});
}