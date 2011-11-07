(function($){
	if((!$.browser.msie) || ($.browser.msie && $.browser.version > 8)) return
	$.helpIE = {
		userCSS:function(){
			var htmlprotocol = window.location.protocol,
			    htmlhost = window.location.host,
			    htmlurl = window.location.href,
				creat_css_cont = '';
			htmlurl = htmlurl.substring(0,htmlurl.lastIndexOf('/'));
			var creat_css_box = $('<div class="creat_css_box" style="display:none;width:0;height:0;overflow:hidden"></div>');
			creat_css_box.appendTo($('body'));
			$('link').each(function(i){
				var css_href = this.href;
				if(css_href.indexOf('://') < 0 ){
					if(css_href.substr(0,1) === '/'){
						css_href = htmlprotocol+'//'+htmlhost+css_href;
					}else{
						css_href = htmlurl+'/'+css_href;
					}
				}
				creat_css_box.load(css_href);
				creat_css_cont += $('.creat_css_box').html();
			})
			var creat_css_array = creat_css_cont.split('}');
			return creat_css_array;
		},
		css3Selector:function(){
			var usercss = $.helpIE.userCSS();
			var creat_csstext = '';
			$.each(usercss,function(i){
				var query_selector = $.trim(usercss[i]).split('{')[0];
				var linkcss = query_selector.indexOf(':link') >= 0 ||
							  query_selector.indexOf(':visited') >= 0 ||
							  query_selector.indexOf(':hover') >= 0 ||
							  query_selector.indexOf(':active') >= 0 ||
							  query_selector.indexOf(':before') >= 0 ||
							  query_selector.indexOf(':after') >= 0;
				if(linkcss) return true;
				var query_csstext =  $.trim(usercss[i]).split('{')[1];
				var s = /[\[\]\:\~\>\+\&]/g;
				if(query_selector.match(s)){
					var diff_css_selector = query_selector;
					diff_css_selector = diff_css_selector.replace(/\^/g,'_s');
					diff_css_selector = diff_css_selector.replace(/\$/g,'_e');
					diff_css_selector = diff_css_selector.replace(/\*/g,'_a');
					var creat_css_selector = diff_css_selector.replace(/\W+/g,'_');
					creat_csstext += '.'+creat_css_selector+'{'+query_csstext+'}';
					query_selector = query_selector.replace(/&gt;/g,'>'); 
					$(query_selector).addClass(creat_css_selector);	
				}
			});
			$('head').append('<style>'+creat_csstext+'</style>');
		},
		css3Style:function(){
			var usercss = $.helpIE.userCSS();
		}
	};
	$(function(){$.helpIE.css3Selector()})
})(jQuery)