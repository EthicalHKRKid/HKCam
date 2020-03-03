var _googleSearch=window.IPBoard;_googleSearch.prototype.googleSearch={cseKey:'',alwaysDefault:false,notProperlySetup:false,init:function()
{Debug.write("Initializing ips.googleSearch.js");document.observe('dom:loaded',function()
{ipb.googleSearch.initEvent();});},initEvent:function()
{Debug.write("Initializing googleSearch events");if(ipb.googleSearch.notProperlySetup==true)
{errorDiv=new Element('div',{'class':'message error'});errorDiv.update("<h3>Admin warning (Not visible to regular users)</h3>Google Site Search is not properly setup. Please refer to the system settings or readme file for this hook for more information on how to set it up. NB: An AJAX API key IS required!<br />If you don't want to use this hook, disable or uninstall it to remove this warning message.");$('content').insert({top:errorDiv});}
else
{if($('search-box'))
{$('search-box').observe('submit',ipb.googleSearch.doSearch);}
if(ipb.googleSearch.alwaysDefault)
{$$('#search_options_menucontent .input_radio').each(function(elem)
{$(elem).checked=false;});$('s_google').checked='checked';ipb.global.contextualSearch();}}},doSearch:function(e)
{if($('s_google').checked!=false)
{Event.stop(e);afterAjax=function(popupObj)
{var customSearchControl=new google.search.CustomSearchControl(ipb.googleSearch.cseKey);customSearchControl.addSearcher(new google.search.WebSearch());customSearchControl.addSearcher(new google.search.VideoSearch());customSearchControl.addSearcher(new google.search.BlogSearch());customSearchControl.setSearchCompleteCallback(ipb,ipb.googleSearch.pageChangeScrollTop);var drawOptions=new google.search.DrawOptions();drawOptions.setDrawMode(google.search.SearchControl.DRAW_MODE_TABBED);drawOptions.setAutoComplete(true);customSearchControl.draw('googleSearchResults',drawOptions);customSearchControl.execute($F('main_search'));$$('.gsc-input')[0].value=$F('main_search');$$('.gsc-wrapper')[0].scrollTop=0;$('googleSearchPopup_inner').scrollTop=0;$('document_modal').observe('click',function()
{popupObj.hide();});};afterHide=function(popupObj)
{$(popupObj.wrapper).remove();$('main_search').blur();$('main_search').value='';};_url=ipb.vars['base_url']+'app=core&module=ajax&section=googleSearch&secure_key='+ipb.vars['secure_hash'];popup=new ipb.Popup('googleSearchPopup',{type:'pane',modal:true,w:'800px',h:'480px',ajaxURL:_url,hideAtStart:false},{afterShow:afterAjax,afterHide:afterHide});return false;}
return true;},pageChangeScrollTop:function(searchControl,searcher)
{$$('.gsc-cursor-page').each(function(elem)
{elem.identify();$(elem).observe('click',function(e)
{$$('.gsc-wrapper')[0].scrollTop=0;$('googleSearchPopup_inner').scrollTop=0;});});$$('a.gs-title').each(function(elem)
{$(elem).writeAttribute('target','');$(elem).writeAttribute('rel','external');});}}
ipb.googleSearch.init();