var _quickpm=window.IPBoard;_quickpm.prototype.quickpm={popupObj:null,sendingToUser:0,init:function()
{Debug.write("Initializing ips.quickpm.js");document.observe("dom:loaded",function(){ipb.quickpm.initEvents();});},initEvents:function()
{ipb.delegate.register(".pm_button",ipb.quickpm.launchPMform);},launchPMform:function(e,target)
{if(DISABLE_AJAX){return false;}
if(e.ctrlKey==true||e.metaKey==true||e.keyCode==91)
{return false;}
Debug.write("Launching PM form");pmInfo=target.id.match(/pm_([0-9a-z]+)_([0-9]+)/);if(!pmInfo[2]){Debug.error('Could not find member ID in string '+target.id);}
if($('pm_popup_popup'))
{if(pmInfo[2]==ipb.quickpm.sendingToUser)
{try{$('pm_error_'+ipb.quickpm.sendingToUser).hide();}catch(err){}
ipb.quickpm.popupObj.show();Event.stop(e);return;}
else
{ipb.quickpm.popupObj.getObj().remove();ipb.quickpm.sendingToUser=null;ipb.quickpm.sendingToUser=pmInfo[2];}}
else
{ipb.quickpm.sendingToUser=pmInfo[2];}
ipb.quickpm.popupObj=new ipb.Popup('pm_popup',{type:'pane',modal:true,hideAtStart:true,w:'600px'});var popup=ipb.quickpm.popupObj;new Ajax.Request(ipb.vars['base_url']+"&app=members&module=ajax&secure_key="+ipb.vars['secure_hash']+'&section=messenger&do=showQuickForm&toMemberID='+pmInfo[2],{method:'post',evalJSON:'force',onSuccess:function(t)
{if(t.responseJSON&&t.responseJSON['error'])
{switch(t.responseJSON['error'])
{case 'noSuchToMember':alert(ipb.lang['member_no_exist']);break;case 'cannotUsePMSystem':case 'nopermission':alert(ipb.lang['no_permission']);break;default:alert(t.responseJSON['error']);break;}
ipb.quickpm.sendingToUser=0;return;}
else
{popup.update(t.responseText);popup.positionPane();popup.show();if($(popup.getObj()).select('.input_submit')[0]){$(popup.getObj()).select('.input_submit')[0].observe('click',ipb.quickpm.doSend);}
if($(popup.getObj()).select('.use_full')[0]){$(popup.getObj()).select('.use_full')[0].observe('click',ipb.quickpm.useFull);}
if($(popup.getObj()).select('.cancel')[0]){$(popup.getObj()).select('.cancel')[0].observe('click',ipb.quickpm.cancelForm);}}}});Event.stop(e);},cancelForm:function(e)
{$('pm_error_'+ipb.quickpm.sendingToUser).hide();ipb.quickpm.popupObj.hide();Event.stop(e);},useFull:function(e)
{Event.stop(e);var form=new Element('form',{'method':'post','action':ipb.vars['base_url']+'&app=members&module=messaging&section=send&do=form&preview=1&_from=quickPM&fromMemberID='+ipb.quickpm.sendingToUser});var post=new Element('textarea',{'name':'Post'});var subject=new Element('input',{'type':'text','value':$F('pm_subject_'+ipb.quickpm.sendingToUser),'name':'msg_title'});var val=$F('pm_textarea_'+ipb.quickpm.sendingToUser).replace(/<script/ig,'&lt; script').replace(/<\/script/ig,'&lt; /script');val=val.replace(/</g,'&lt;').replace(/>/g,'&gt;');$(form).insert(post).insert(subject).setStyle('position: absolute; left: -500px; top: 0');$(post).update(val);$$('body')[0].insert(form);$(form).submit();},doSend:function(e)
{Debug.write("Sending");if(!ipb.quickpm.sendingToUser){return;}
Event.stop(e);if($F('pm_subject_'+ipb.quickpm.sendingToUser).blank())
{ipb.quickpm.showError(ipb.lang['quickpm_enter_subject']);return;}
if($F('pm_textarea_'+ipb.quickpm.sendingToUser).blank())
{ipb.quickpm.showError(ipb.lang['quickpm_msg_blank']);return;}
var popup=ipb.quickpm.popupObj;if($(popup.getObj()).select('.input_submit')[0]){$(popup.getObj()).select('.input_submit')[0].disabled=true;};new Ajax.Request(ipb.vars['base_url']+'&app=members&module=ajax&secure_key='+ipb.vars['secure_hash']+'&section=messenger&do=PMSend&toMemberID='+ipb.quickpm.sendingToUser,{method:'post',parameters:{'Post':$F('pm_textarea_'+ipb.quickpm.sendingToUser).encodeParam(),'std_used':1,'toMemberID':ipb.quickpm.sendingToUser,'subject':$F('pm_subject_'+ipb.quickpm.sendingToUser).encodeParam()},evalJSON:'force',onSuccess:function(t)
{if(Object.isUndefined(t.responseJSON)){alert(ipb.lang['action_failed']);}
if(t.responseJSON['error'])
{popup.hide();ipb.quickpm.sendingToUser=0;Event.stop(e);switch(t.responseJSON['error'])
{case 'cannotUsePMSystem':case 'nopermission':alert(ipb.lang['no_permission']);break;default:alert(t.responseJSON['error']);break;}}
else if(t.responseJSON['inlineError'])
{ipb.quickpm.showError(t.responseJSON['inlineError']);if($(popup.getObj()).select('.input_submit')[0]){$(popup.getObj()).select('.input_submit')[0].disabled=false;};return;}
else if(t.responseJSON['status'])
{popup.hide();ipb.quickpm.sendingToUser=0;Event.stop(e);ipb.global.showInlineNotification(ipb.lang['message_sent']);return;}
else
{Debug.dir(t.responseJSON);}}});},showError:function(msg)
{if(!ipb.quickpm.sendingToUser||!$('pm_error_'+ipb.quickpm.sendingToUser)){return;}
$('pm_error_'+ipb.quickpm.sendingToUser).select('.message')[0].update(msg);if(!$('pm_error_'+ipb.quickpm.sendingToUser).visible())
{new Effect.BlindDown($('pm_error_'+ipb.quickpm.sendingToUser),{duration:0.3});}
else
{}
return;}};ipb.quickpm.init();