IPBoard.prototype.hoverCardRegister={mainStore:$H(),initialize:function(key,options)
{var store=$H();if(!ipb.hoverCardRegister.mainStore.get(key))
{ipb.hoverCardRegister.mainStore.set(key,options);}
$$('._hovertrigger').each(function(elem)
{try
{_key=$(elem).readAttribute("hovercard-ref");if(key==_key)
{$(elem).addClassName('___hover___'+key);store.set('key',key);$(elem).removeClassName('_hovertrigger');$(elem).addClassName('_hoversetup');}}
catch(err)
{Debug.error(err);}});store.each(function(elem)
{new ipb.hoverCard('___hover___'+elem.value,options);});},postAjaxInit:function()
{ipb.hoverCardRegister.mainStore.each(function(elem)
{ipb.hoverCardRegister.initialize(elem.key,elem.value);});}};IPBoard.prototype.hoverCard=Class.create({initialize:function(className,options)
{this.id=className;this.timer={},this.card=false,this.ajaxCache={},this.popupActive={},this.openId=false;this.curEvent=false;this.options=Object.extend({type:'balloon',position:'bottomLeft',w:'500px',openOnClick:false,openOnHover:true,ajaxUrl:false,delay:800,ajaxCacheExpire:0,black:false,getId:false,setIdParam:'id',callback:false},arguments[1]);this.init();},init:function()
{this.debugWrite("hoverCard.init()");var _hc=this;document.observe('mousemove',_hc.mMove.bindAsEventListener(_hc));$$('.'+this.id).each(function(elem)
{elem.identify();try
{Event.stopObserving($(elem.id),'mouseout');Event.stopObserving($(elem.id),'mouseover');$(elem.id).writeAttribute('title','');if($(elem.id).down('a'))
{$(elem.id).down('a').writeAttribute('title','');}
if($(elem.id).down('img'))
{$(elem.id).down('img').writeAttribute('title','');$(elem.id).down('img').writeAttribute('alt','');}}
catch(aBall){}
$(elem.id).observe('contextmenu',_hc.mContext.bindAsEventListener(_hc,elem.id));$(elem.id).observe('click',_hc.mClick.bindAsEventListener(_hc,elem.id));$(elem.id).observe('mouseover',_hc.mOver.bindAsEventListener(_hc,elem.id));$(elem.id).observe('mouseout',_hc.mOut.bindAsEventListener(_hc,elem.id));});},mMove:function(e)
{var _newEvent={};for(var i in e){_newEvent[i]=e[i];}
this.curEvent=_newEvent;},mClick:function(e,id)
{if(!this.options.openOnClick)
{this.close(id);}
else
{if($(id).tagName.toLowerCase()=='input'&&$(id).type.toLowerCase()=='checkbox')
{if($(id).checked!==true)
{return true;}}
this.show(id);}},mContext:function(e,id)
{this.close(id);},mOver:function(e,id)
{Event.stop(e);if(this.overPopUp(id)===true)
{return false;}
if(this.options.openOnHover!==true)
{return false;}
this.debugWrite("mover - setting time OVER "+id);if(!Object.isUndefined(this.timer[id+'_out']))
{clearTimeout(this.timer[id+'_out']);}
this.timer[id+'_over']=setTimeout(this.show.bind(this,id),this.options.delay);},mOut:function(e,id)
{Event.stop(e);if(this.overPopUp(id)===true)
{return false;}
Event.stopObserving($(id),'mouseover');$(id).observe('mouseover',this.mOver.bindAsEventListener(this,id));if(!Object.isUndefined(this.timer[id+'_over']))
{clearTimeout(this.timer[id+'_over']);}
this.debugWrite("Mout - setting time OUT "+id);this.timer[id+'_out']=setTimeout(this.close.bind(this,id),800);},show:function(id)
{var popup='pu__'+this.id+'_popup';if(!Object.isUndefined(this.timer[id+'_out']))
{clearTimeout(this.timer[id+'_out']);}
if(!Object.isUndefined(this.card)&&this.card!==false)
{this.card.kill();this.card=false;}
if($(popup))
{$(popup).remove();}
this.openId=id;var content=false;if(this.options.ajaxUrl)
{content="<div class='general_box pad' style='height: 130px; padding-top: 130px; text-align:center'><img src='"+ipb.vars['loading_img']+"' alt='' /></div>";}
else
{if(Object.isFunction(this.options.callback))
{content=this.options.callback(this,id);if(content===false)
{return false;}}
else
{Debug.error("No AJAX or Callback specified. Whaddayagonnado?!");}}
this.card=new ipb.Popup('pu__'+this.id,{type:'balloon',initial:content,stem:true,hideAtStart:false,hideClose:true,defer:false,black:this.options.black,attach:{target:$(id),position:this.options.position},w:this.options.w});Event.stopObserving($(id),'mouseout');Event.stopObserving($(id),'contextmenu');Event.stopObserving($(id),'click');$(id).observe('mouseout',this.mOut.bindAsEventListener(this,id));$(id).observe('contextmenu',this.mContext.bindAsEventListener(this,id));$(id).observe('click',this.mClick.bindAsEventListener(this,id));if(this.options.ajaxUrl)
{this.ajax(id);}},close:function(id)
{if(this.overPopUp(id)===true)
{return false;}
this.debugWrite("Close: "+id);if(!Object.isUndefined(this.timer[id+'_out']))
{this.debugWrite("-- Clearing: "+id+'_out');clearTimeout(this.timer[id+'_out']);}
if(!Object.isUndefined(this.timer[id+'_over']))
{this.debugWrite("-- Clearing: "+id+'_over');clearTimeout(this.timer[id+'_over']);}
if(!Object.isUndefined(this.card)&&this.card!==false&&id==this.openId)
{this.card.hide();this.card=false;this.openId=false;}},ajax:function(id)
{var now=this.unixtime();var url=this.options.ajaxUrl;var bDims={};var aDims={};var popup='pu__'+this.id+'_popup';bDims['height']=$(popup).getHeight();bDims['top']=parseInt($(popup).style.top);if(!Object.isUndefined(this.ajaxCache[id]))
{if(this.options.AjaxCacheExpire)
{if(now-parseInt(this.options.AjaxCacheExpire)<this.ajaxCache[id]['time'])
{this.debugWrite("Fetching from cache "+id);this.card.update(this.ajaxCache[id]['content']);this.card.ready=true;this._rePos(bDims,popup,this.id);return;}}
else
{this.debugWrite("Fetching from cache "+id);this.card.update(this.ajaxCache[id]['content']);this.card.ready=true;this._rePos(bDims,popup,this.id);return;}}
if(this.options.getId)
{var _id=$(id).readAttribute('hovercard-id');url=url+'&'+this.options.setIdParam+'='+_id;}
this.debugWrite("Ajax load "+id+" "+url);new Ajax.Request(url,{method:'get',onSuccess:function(t)
{if(t.responseText!='error')
{if(t.responseText=='nopermission')
{alert(ipb.lang['no_permission']);return;}
if(t.responseText.match("__session__expired__log__out__"))
{this.update('');alert("Your session has expired, please refresh the page and log back in");return false;}
this.debugWrite("AJAX done!");this.card.update(t.responseText);this.card.ready=true;this._rePos(bDims,popup,this.id);this.ajaxCache[id]={'content':t.responseText,'time':now};}
else
{this.debugWrite(t.responseText);return;}}.bind(this)});},_rePos:function(bDims,popup,id)
{aDims={};aDims['height']=$(popup).getHeight();aDims['top']=parseInt($(popup).getStyle('top'));if($('pu__'+id+'_stem').className.match(/top/)&&(aDims['height']!=bDims['height']))
{var _nt=bDims['top']-(aDims['height']-bDims['height'])-10;$(popup).setStyle({'top':_nt+'px'});}},unixtime:function()
{var _time=new Date();return Date.parse(_time)/1000;},overPopUp:function(id)
{var myevent=this.curEvent;if(!id){return;}
try
{if($(Event.findElement(myevent))&&$(Event.findElement(myevent)).descendantOf($('pu__'+this.id+'_popup')))
{this.debugWrite("*** Over Pop Up ***");if(this.openId!==false)
{this.timer[id+'_out']=setTimeout(this.close.bind(this,id),800);}
return true;}}
catch(err){}
return false;},debugWrite:function(text)
{Debug.write(text);}});