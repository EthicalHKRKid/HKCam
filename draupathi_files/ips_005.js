var _like=window.IPBoard;_like.prototype.like={relid:0,app:'',aprea:'',isfave:0,popped:undefined,wrap:undefined,uc:null,init:function()
{document.observe("dom:loaded",function()
{ipb.delegate.register('.ftoggle',ipb.like.clicked);ipb.delegate.register('._fsubmit',ipb.like.save);ipb.delegate.register('._funset',ipb.like.remove);ipb.delegate.register('._fmore',ipb.like.more);ipb.like.resetEvents();});},resetEvents:function()
{if(ipb.like.wrap){ipb.like.wrap.select("[data-tooltip]").invoke("tooltip");}},clicked:function(e,elem)
{Event.stop(e);relem=elem.up('.__like');relem.identify();ipb.like.wrap=relem;try
{ipb.like.relid=relem.readAttribute('data-relid');ipb.like.app=relem.readAttribute('data-app');ipb.like.area=relem.readAttribute('data-area');ipb.like.isfave=relem.readAttribute('data-isfave');}
catch(e)
{Debug.error(e);}
if(ipb.like.relid&&ipb.like.app&&ipb.like.area)
{if(parseInt(ipb.like.isfave)==1)
{ipb.like.dialogueUnset(e,elem);}
else
{ipb.like.dialogueSet(e,elem);}}},more:function(e,elem)
{Event.stop(e);relem=elem.up('.__like');relem.identify();ipb.like.wrap=relem;try
{ipb.like.relid=relem.readAttribute('data-relid');ipb.like.app=relem.readAttribute('data-app');ipb.like.area=relem.readAttribute('data-area');ipb.like.isfave=relem.readAttribute('data-isfave');}
catch(e)
{Debug.error(e);}
if(!Object.isUndefined(ipb.like.popped))
{ipb.like.popped.kill();}
var popid='setfave_'+ipb.like.relid;var _url=ipb.vars['base_url']+'&app=core&module=ajax&section=like&do=more&secure_key='+ipb.vars['secure_hash']+'&f_app='+ipb.like.app+'&f_area='+ipb.like.area+'&f_relid='+ipb.like.relid;Debug.write(_url);ipb.like.popped=new ipb.Popup(popid,{type:'balloon',ajaxURL:_url,stem:true,hideAtStart:false,hideClose:true,attach:{target:elem,position:'auto'},h:200,w:'250px'});},dialogueUnset:function(e,elem)
{Event.stop(e);if(!Object.isUndefined(ipb.like.popped))
{ipb.like.popped.kill();}
var popid='setfave_'+ipb.like.relid;var _content=FAVE_TEMPLATE.evaluate();ipb.like.popped=new ipb.Popup(popid,{type:'balloon',initial:_content,stem:true,hideAtStart:false,attach:{target:elem,position:'auto'},w:'350px'});},dialogueSet:function(e,elem)
{Event.stop(e);if(!Object.isUndefined(ipb.like.popped))
{ipb.like.popped.kill();}
var popid='setfave_'+ipb.like.relid;var _url=ipb.vars['base_url']+'&app=core&module=ajax&section=like&do=setDialogue&secure_key='+ipb.vars['secure_hash']+'&f_app='+ipb.like.app+'&f_area='+ipb.like.area+'&f_relid='+ipb.like.relid;Debug.write(_url);ipb.like.popped=new ipb.Popup(popid,{type:'balloon',ajaxURL:_url,stem:true,hideAtStart:false,attach:{target:elem,position:'auto'},w:'350px'});},save:function(e,elem)
{Event.stop(e);var like_notify=$('like_notify').checked?1:0;var like_freq=$F('like_freq');var like_anon=$('like_anon').checked?1:0;ipb.like.popped.hide();ipb.like.wrap.writeAttribute('data-isfave',1);ipb.like.isfave=1;var _url=ipb.vars['base_url']+'&app=core&module=ajax&section=like&do=save&secure_key='+ipb.vars['secure_hash']+'&f_app='+ipb.like.app+'&f_area='+ipb.like.area+'&f_relid='+ipb.like.relid;Debug.write(_url);new Ajax.Request(_url,{method:'post',parameters:{'like_notify':like_notify,'like_freq':like_freq,'like_anon':like_anon},onSuccess:function(t)
{if(t.responseText=='nopermission')
{alert(ipb.lang['no_permission']);}
else
{ipb.like.wrap.update(t.responseText);ipb.like.resetEvents();}}});},remove:function(e,elem)
{Event.stop(e);ipb.like.popped.hide();ipb.like.wrap.writeAttribute('data-isfave',0);ipb.like.isfave=0;var _url=ipb.vars['base_url']+'&app=core&module=ajax&section=like&do=unset&secure_key='+ipb.vars['secure_hash']+'&f_app='+ipb.like.app+'&f_area='+ipb.like.area+'&f_relid='+ipb.like.relid;Debug.write(_url);new Ajax.Request(_url,{method:'get',hideLoader:true,onSuccess:function(t)
{if(t.responseText=='nopermission')
{alert(ipb.lang['no_permission']);}
else
{ipb.like.wrap.update(t.responseText);ipb.like.resetEvents();}}});}};ipb.like.init();