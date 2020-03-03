var _topic=window.IPBoard;_topic.prototype.topic={totalChecked:0,inSection:'',topic_id:0,page_id:0,poll:[],pollPopups:[],deletePerms:{},deleteUrls:{},deletePopUps:[],hidePopUps:[],restorePopUps:[],counts:{},timers:{},polling:{count:0},mqBoxShowing:false,fastReplyId:'',isPosting:false,modOptionsUnapproved:0,modOptionsHidden:0,modOptionsUnhidden:0,init:function()
{Debug.write("Initializing ips.topic.js");document.observe("dom:loaded",function(){if(ipb.topic.inSection=='topicview')
{if(window.location.hash.substring(1).match(/entry/))
{var pid=window.location.hash.substring(1).replace(/entry/,'');if(ipb.topic.redirectPost&&pid&&$$('a[data-entry-pid]').length&&(!$$('a[data-entry-pid="'+pid+'"]').length&&!$('postsDelete_'+pid)))
{window.location=ipb.vars['board_url']+'/index.php?app=forums&module=forums&section=findpost&pid='+pid+'&t='+ipb.topic.topic_id;}}
if(!pid)
{pid=getQueryStringParamByName('p');}
if(pid&&$('entry'+pid))
{ipb.topic.scrollToPost(parseInt(pid));}
ipb.delegate.register('a[data-entry-pid]',ipb.topic.launchPostShare);if($('show_filters'))
{$('show_filters').observe('click',ipb.topic.toggleFilters);$('filter_form').hide();}
ipb.topic.preCheckPosts();ipb.delegate.register('.multiquote',ipb.topic.toggleMultimod);ipb.delegate.register('._ips_trigger_quote',ipb.topic.ajaxQuote);ipb.delegate.register('.edit_post',ipb.topic.ajaxEditShow);ipb.delegate.register('.hide_post',ipb.topic.hidePopUp);ipb.delegate.register('.delete_post',ipb.topic.deletePopUp);ipb.delegate.register('.toggle_post',ipb.topic.ajaxTogglePostApprove);ipb.delegate.register('.sd_content',ipb.topic.sDeletePostShow);ipb.delegate.register('.sd_remove',ipb.topic.confirmSingleDelete);ipb.delegate.register('input.post_mod',ipb.topic.checkPost);ipb.delegate.register('.modlink_09',ipb.topic.topicDeletePopUp);if($('submit_post')){$('submit_post').observe("click",ipb.topic.ajaxFastReply);}
try{quoted=ipb.Cookie.get('mqtids').split(',').compact().without('').size();}catch(err){quoted=0;}
if(quoted)
{$('multiQuoteInsert').show();ipb.topic.mqBoxShowing=true;$('mqbutton').update(ipb.lang['mq_reply_swap'].replace(/#{num}/,quoted));}
if($('multiQuoteInsert')){$('mqbutton').observe('click',ipb.topic.insertQuotedPosts);if($('multiQuoteClear')){$('multiQuoteClear').on('click',ipb.topic.clearMultiQuote);}}}
else if(ipb.topic.inSection=='searchview')
{ipb.delegate.register('input.post_mod',ipb.topic.checkPost);ipb.delegate.register('.sd_content',ipb.topic.sDeletePostShow);}});ipb.delegate.register('.hide_signature',ipb.topic.signatureCloseClick);},deleteTopicDialog:function(elem,e)
{if(confirm(ipb.lang['delete_confirm']))
{window.location=ipb.vars['base_url']+"app=forums&module=moderate&section=moderate&do=deleteArchivedTopic&t="+ipb.topic.topic_id+"&f="+ipb.topic.forum_id+"&auth_key="+ipb.vars['secure_hash'];}},restoreTopicDialogGo:function(elem,e)
{Event.stop(e);window.location=ipb.vars['base_url']+"app=forums&module=moderate&section=moderate&do=unArchiveTopic&t="+ipb.topic.topic_id+"&f="+ipb.topic.forum_id+"&auth_key="+ipb.vars['secure_hash'];},restoreTopicDialog:function(elem,e)
{Event.stop(e);var url=ipb.vars['base_url']+"app=core&amp;module=ajax&amp;section=templates&amp;topic_id="+ipb.topic.topic_id+"&secure_key="+ipb.vars['secure_hash']+"&amp;template_group=topic&amp;template_bit=restoreTopicDialog&amp;lang_module=topic&amp;lang_app=forums";new Ajax.Request(url.replace(/&amp;/g,'&'),{method:'post',evalJSON:'force',onSuccess:function(t)
{var popid='pop__restore_popup_'+ipb.topic.topic_id;var content=new Template(t.responseJSON['html']).evaluate({});ipb.topic.restorePopUps=new ipb.Popup(popid,{type:'pane',modal:true,initial:content,hideAtStart:false,w:'550px'});}});},signatureCloseClick:function(e,elem)
{postId=$(elem).up('.post_block').id.replace(/post_id_/,'');Debug.write(postId);if(!postId)
{return;}
Event.stop(e);$(elem).removeClassName('hide_signature').addClassName('sigIconStay');$(elem).identify();$(elem).addClassName('ipbmenu');url=ipb.vars['base_url']+"app=forums&module=ajax&section=topics&do=sigCloseMenu&secure_key="+ipb.vars['secure_hash']+"&pid="+postId;if(ipb.topic.inSection=='messenger')
{url=ipb.vars['base_url']+"app=members&module=ajax&section=messenger&do=sigCloseMenu&secure_key="+ipb.vars['secure_hash']+"&msgid="+postId;}
new Ajax.Request(url,{method:'post',evalJSON:'force',onSuccess:function(t)
{if(t.responseJSON&&t.responseJSON['error'])
{alert(t.responseJSON['error']);}
else
{var menuId='sigClose_'+postId+'_menucontent';$('ipboard_body').insert(new Element('div',{'id':menuId}));$(menuId).update("<div class='ipsPad ipsForm_center'><img src='"+ipb.vars['loading_img']+"' /></div>");var _newMenu=new ipb.Menu($(elem),$(menuId),{},{afterOpen:function(e){Debug.write('adding');$(elem).removeClassName('hide_signature').addClassName('sigIconStay');}});_newMenu.doOpen();ipb.topic.deletePopUps['sig_'+postId]=true;$(menuId).update(t.responseText);ipb.menus.registerCloseCallBack(ipb.topic.signatureCloseCleanUp);}}});},signatureCloseCleanUp:function()
{$$('.sigIconStay').invoke('removeClassName','sigIconStay').invoke('addClassName','hide_signature');},ignoreUsersSig:function(elem,e)
{memberId=$(elem).readAttribute('data-id');ipb.menus.closeAll(e);ipb.topic.signatureCloseCleanUp();new Ajax.Request(ipb.vars['base_url']+"app=forums&module=ajax&section=topics&do=ignoreSig&secure_key="+ipb.vars['secure_hash']+"&memberId="+memberId,{method:'post',evalJSON:'force',onSuccess:function(t)
{if(t.responseJSON&&t.responseJSON['status']=='ok')
{$$(".signature").each(function(element)
{try{_memberId=$(element).readAttribute('data-memberid');if(_memberId&&(memberId=='all'||_memberId==memberId))
{new Effect.BlindUp($(element),{duration:1.0});}}
catch(e){};});}}});},submitPostModeration:function(e)
{if($F('tact')=='delete'){if(!confirm(ipb.lang['delete_confirm'])){Event.stop(e);}}},submitTopicModeration:function(e)
{if($F('topic_moderation')=='03'){if(!confirm(ipb.lang['delete_confirm'])){Event.stop(e);}}},hidePopUp:function(e,elem)
{var postid=elem.up().id.replace(/hide_post_/,'');if(!postid){return;}
var _url_soft=ipb.topic.deleteUrls['softDelete'].evaluate({'pid':postid}).replace(/&amp;/g,'&')+'&nr=1';var _permaShow='';Event.stop(e);var url=ipb.vars['base_url']+"app=core&amp;module=ajax&amp;section=templates&amp;secure_key="+ipb.vars['secure_hash']+"&amp;template_group=topic&amp;template_bit=deletePost&amp;lang_module=topic&amp;lang_app=forums";new Ajax.Request(url.replace(/&amp;/g,'&'),{method:'post',evalJSON:'force',onSuccess:function(t)
{var popid='pop__hide_popup_'+postid;var content=new Template(t.responseJSON['html']).evaluate({removeUrl:_url_soft,permaDelete:_permaShow});ipb.topic.hidePopUps=new ipb.Popup(popid,{type:'balloon',stem:true,modal:false,initial:content,hideAtStart:false,w:'550px',attach:{target:elem,position:'auto','event':'click'}});}});},deletePopUp:function(e,elem)
{var postid=elem.up().id.replace(/del_post_/,'');if(!postid){return;}
var _url_delete=ipb.topic.deleteUrls['hardDelete'].evaluate({'pid':postid}).replace(/&amp;/g,'&')+'&nr=1';var _permaShow='';Event.stop(e);var url=ipb.vars['base_url']+"app=core&amp;module=ajax&amp;section=templates&amp;secure_key="+ipb.vars['secure_hash']+"&amp;template_group=topic&amp;template_bit=doDeletePost&amp;lang_module=topic&amp;lang_app=forums";new Ajax.Request(url.replace(/&amp;/g,'&'),{method:'post',evalJSON:'force',onSuccess:function(t)
{var popid='pop__delete_popup_'+postid;var content=new Template(t.responseJSON['html']).evaluate({permaDelete:_permaShow,permaUrl:_url_delete});ipb.topic.deletePopUps=new ipb.Popup(popid,{type:'balloon',stem:true,modal:false,initial:content,hideAtStart:false,w:'350px',attach:{target:elem,position:'auto','event':'click'}});}});},topicDeletePopUp:function(e,elem)
{var _url_delete='';var _permaShow='';Event.stop(e);var url=ipb.vars['base_url']+"app=core&amp;module=ajax&amp;section=templates&amp;secure_key="+ipb.vars['secure_hash']+"&amp;template_group=forum&amp;template_bit=deleteTopic&amp;lang_module=forums&amp;lang_app=forums";new Ajax.Request(url.replace(/&amp;/g,'&'),{method:'post',evalJSON:'force',onSuccess:function(t)
{var popid='pop__topic_delete_popup';var content=new Template(t.responseJSON['html']).evaluate({deleteUrl:elem.href});new ipb.Popup(popid,{type:'pane',stem:true,modal:true,initial:content,hideAtStart:false,w:'350px'});}});},sDeletePostShow:function(e,elem)
{Event.stop(e);var postid=elem.id.replace(/seeContent_/,'');if(!postid){return;}
if(!$('postsDelete_'+postid)._showing)
{$('postsDelete_'+postid).hide();$('postsDeleteShow_'+postid).show();$('postsDelete_'+postid)._showing=1;}
else
{$('postsDelete_'+postid).show();$('postsDeleteShow_'+postid).hide();$('postsDelete_'+postid)._showing=0;}},launchPostShare:function(e,elem)
{Event.stop(e);var pid=$(elem).readAttribute('data-entry-pid');var url=ipb.vars['base_url']+'app=forums&module=ajax&section=topics&do=postShareModal&p='+pid+'&t='+ipb.topic.topic_id+'&f='+ipb.topic.forum_id+'&md5check='+ipb.vars['secure_hash'];ipb.global.popups['psharer']=new ipb.Popup('psharer',{type:'modal',modal:true,ajaxURL:url,hideAtStart:false,evalJs:'force',w:'550px',h:300});},ajaxTogglePostApprove:function(e,elem)
{Event.stop(e);var postid=elem.id.replace(/toggle(text)?_post_/,'');if(!postid){return;}
var toApprove=($('post_id_'+postid).hasClassName('moderated'))?1:0;var url=ipb.vars['base_url']+'app=forums&module=ajax&section=topics&do=postApproveToggle&p='+postid+'&t='+ipb.topic.topic_id+'&f='+ipb.topic.forum_id+'&approve='+toApprove;new Ajax.Request(url,{method:'post',evalJSON:'force',parameters:{md5check:ipb.vars['secure_hash']},onSuccess:function(t)
{if(t.responseJSON['error'])
{switch(t.responseJSON['error'])
{case 'notopic':alert(ipb.lang['no_permission']);break;case 'nopermission':alert(ipb.lang['no_permission']);break;}}
else
{$('post_id_'+postid).removeClassName('moderated');$('postControlsUnapproved_'+postid).hide();$('postControlsNormal_'+postid).show();$('checkbox_'+postid).writeAttribute('data-status','0');}}});},ajaxEditShow:function(e,elem)
{if(DISABLE_AJAX||ipb.vars['is_touch'])
{return false;}
if(e.ctrlKey==true||e.metaKey==true||e.keyCode==91)
{return false;}
Event.stop(e);var edit=[];edit['button']=elem;if(!edit['button']){return;}
if(edit['button'].readAttribute('_editing')=='1')
{return false;}
edit['pid']=edit['button'].id.replace('edit_post_','');edit['tid']=ipb.topic.topic_id;edit['fid']=ipb.topic.forum_id;edit['post']=$('post_id_'+edit['pid']).down('.post');edit['edit_post']=new Element('div',{id:'post_id_edit_'+edit['pid']});edit['post'].insert({after:edit['edit_post']});url=ipb.vars['base_url']+'app=forums&module=ajax&section=topics&do=editBoxShow&p='+edit['pid']+'&t='+edit['tid']+'&f='+edit['fid'];if(Prototype.Browser.IE7)
{window.location='#entry'+edit['pid'];}
else
{new Effect.ScrollTo(edit['post'],{offset:-50});}
new Ajax.Request(url,{method:'post',parameters:{md5check:ipb.vars['secure_hash']},onSuccess:function(t)
{if(t.responseText=='nopermission'||t.responseText=='NO_POST_FORUM'||t.responseText=='NO_EDIT_PERMS'||t.responseText=='NO_POSTING_PPD')
{alert(ipb.lang['no_permission']);return;}
if(t.responseText=='error')
{alert(ipb.lang['action_failed']);return;}
edit['button'].writeAttribute('_editing','1');edit['post'].hide();edit['edit_post'].show().update(t.responseText);edit['pid']='e'+edit['pid'];if($('edit_save_'+edit['pid'])){$('edit_save_'+edit['pid']).observe('click',ipb.topic.ajaxEditSave);}
if($('edit_switch_'+edit['pid'])){$('edit_switch_'+edit['pid']).observe('click',ipb.topic.ajaxEditSwitch);}
if($('edit_cancel_'+edit['pid'])){$('edit_cancel_'+edit['pid']).observe('click',ipb.topic.ajaxEditCancel);}}})
Debug.write(url);},ajaxEditSwitch:function(e)
{Event.stop(e);var elem=Event.element(e);var postid=elem.id.replace('edit_switch_e','');if(!postid){return;}
var url=ipb.vars['base_url']+'app=forums&module=post&section=post&do=edit_post&f='+ipb.topic.forum_id+'&t='+ipb.topic.topic_id+'&p='+postid+'&st='+ipb.topic.start_id+'&_from=quickedit';var Post=ipb.textEditor.getEditor('edit-'+postid).getText();form=new Element('form',{action:url,method:'post'});textarea=new Element('textarea',{name:'Post'});reason=new Element('input',{name:'post_edit_reason'});md5check=new Element('input',{type:'hidden',name:'md5check',value:ipb.vars['secure_hash']});if(Prototype.Browser.Opera){textarea.value=Post;}else{textarea.value=Post;}
reason.value=($('post_edit_reason'))?$('post_edit_reason').value:'';form.insert(md5check).insert(textarea).insert(reason).hide();$$('body')[0].insert(form);form.submit();},ajaxFastReply:function(e)
{if(DISABLE_AJAX)
{return false;}
if(!ipb.vars['member_id'])
{return false;}
if(e.ctrlKey==true||e.metaKey==true||e.keyCode==91)
{return false;}
Event.stop(e);var Post=ipb.textEditor.getEditor(ipb.topic.fastReplyId).getText();var isRte=ipb.textEditor.getEditor(ipb.topic.fastReplyId).isRte();if(Post===false)
{return false;}
if(Post.blank())
{alert(ipb.lang['post_empty']);return false;}
var toggleEditorButtons=function(show){if($('fast_reply_controls')){if(show){$('fast_reply_controls').select("#fast_reply_msg").invoke('remove');$('fast_reply_controls').select("input").invoke("show");}else{$('fast_reply_controls').select("input").invoke("hide");$('fast_reply_controls').insert(new Element('span',{id:'fast_reply_msg'}).update(ipb.lang['saving_post']).addClassName('desc'));}}};toggleEditorButtons(false);ipb.topic.isPosting=true;var elements=new Hash({md5check:ipb.vars['secure_hash'],Post:Post.encodeParam(),isRte:isRte});var formElements=$('ips_fastReplyForm').getElements();for(var i=0,j=formElements.length;i<j;i++)
{if(formElements[i].getAttribute('rel')=='include')
{elements.set(formElements[i].name,formElements[i].getValue());}}
var url=ipb.vars['base_url']+'app=forums&module=ajax&section=topics&do=reply&t='+ipb.topic.topic_id+'&f='+ipb.topic.forum_id+'&pid='+ipb.topic.topPid;Debug.write(url);new Ajax.Request(url,{method:'post',encoding:ipb.vars['charset'],evalJSON:'force',parameters:elements,onSuccess:function(t)
{toggleEditorButtons(true);if(t.responseJSON&&t.responseJSON['error']){if(!Object.isUndefined(ipb.lang[t.responseJSON['error']]))
{ipb.global.errorDialogue(ipb.lang[t.responseJSON['error']]);}
else
{ipb.global.errorDialogue(t.responseJSON['error']);}
return false;}
else if(t.responseJSON&&t.responseJSON['success'])
{if(t.responseJSON['message'])
{ipb.global.okDialogue(t.responseJSON['message']);}
if(t.responseJSON['post']&&t.responseJSON['postid'])
{if(!Object.isUndefined(ipb.topic.counts)&&!Object.isUndefined(ipb.topic.counts['perPage']))
{if((ipb.topic.counts['postTotal'])&&((ipb.topic.counts['postTotal']-ipb.topic.counts['curStart'])>=ipb.topic.counts['perPage']))
{window.location=ipb.vars['base_url']+'showtopic='+ipb.topic.topic_id+'&view=getlastpost';return false;}}
ipb.topic.topPid=t.responseJSON['postid'];if($('newContent-'+ipb.topic.topPid))
{$('newContent-'+ipb.topic.topPid).update(t.responseJSON['post']);}
else if($('post_id_'+ipb.topic.topPid))
{$('post_id_'+ipb.topic.topPid).replace(t.responseJSON['post']);}
else
{$('ips_Posts').insert(new Element('div',{id:'newContent-'+ipb.topic.topPid}).insert(t.responseJSON['post']));}
if($('newContent-'+ipb.topic.topPid))
{$('newContent-'+ipb.topic.topPid).hide();new Effect.BlindDown('newContent-'+ipb.topic.topPid,{duration:0.5,queue:'front'});}
prettyPrint();}
ipb.topic.isPosting=false;var editor=ipb.textEditor.getEditor(ipb.topic.fastReplyId);editor.clearSaveMessage();editor.minimizeOpenedEditor();if(editor.options.isTypingCallBack!==false)
{editor.timers['dirty']=setInterval(editor.checkForInput.bind(editor),ipb.textEditor.IPS_TEXTEDITOR_POLLING);}
return false;}
else if(t.responseText&&t.responseText!='no_permission')
{if(!Object.isUndefined(ipb.topic.counts)&&!Object.isUndefined(ipb.topic.counts['perPage']))
{if((ipb.topic.counts['postTotal'])&&((ipb.topic.counts['postTotal']-ipb.topic.counts['curStart'])>=ipb.topic.counts['perPage']))
{window.location=ipb.vars['base_url']+'showtopic='+ipb.topic.topic_id+'&view=getlastpost';return false;}}
m=t.responseText.match(/<!--post:(\d+?)-->/);if(m&&m[1])
{ipb.topic.topPid=m[1];}
else
{return false;}
$('ips_Posts').insert(new Element('div',{id:'newContent-'+ipb.topic.topPid}).insert(t.responseText));if($('newContent-'+ipb.topic.topPid))
{$('newContent-'+ipb.topic.topPid).hide();new Effect.BlindDown('newContent-'+ipb.topic.topPid,{duration:0.5,queue:'front'});ipb.textEditor.getEditor(ipb.topic.fastReplyId).clearSaveMessage();ipb.textEditor.getEditor(ipb.topic.fastReplyId).minimizeOpenedEditor();prettyPrint();}
ipb.topic.isPosting=false;}}});},ajaxQuote:function(e,elem)
{if(DISABLE_AJAX)
{return false;}
if(e.ctrlKey==true||e.metaKey==true||e.keyCode==91)
{return false;}
Event.stop(e);pid=elem.readAttribute('pid');var url=ipb.vars['base_url']+'app=forums&module=ajax&section=topics&do=quote&t='+ipb.topic.topic_id+'&p='+pid+'&md5check='+ipb.vars['secure_hash']+'&isRte='+ipb.textEditor.getEditor(ipb.topic.fastReplyId).isRte();Debug.write(url);editor=ipb.textEditor.getEditor(ipb.topic.fastReplyId);editor.insert('','always');new Ajax.Request(url,{method:'get',encoding:ipb.vars['charset'],onSuccess:function(t)
{if(t.responseJSON&&t.responseJSON['error'])
{if(!Object.isUndefined(ipb.lang[t.responseJSON['error']]))
{ipb.global.errorDialogue(ipb.lang[t.responseJSON['error']]);}
else
{ipb.global.errorDialogue(t.responseJSON['error']);}
return false;}
else if(t.responseText&&t.responseText!='nopermission')
{editor=ipb.textEditor.getEditor(ipb.topic.fastReplyId);editor.insert(ipb.textEditor.convertQuotes(t.responseText),'always');}}});},ajaxEditSave:function(e)
{try{Event.stop(e);var elem=Event.element(e);var postid=elem.id.replace('edit_save_e','');if(!postid){alert("No post ID");return;}
var Post=ipb.textEditor.getEditor('edit-'+postid).getText();if(Post===false)
{return false;}
if(Post.blank())
{alert(ipb.lang['post_empty']);}
var add_edit=null;var edit_reason='';var post_htmlstatus='';if($('add_edit_'+postid)){add_edit=$F('add_edit_'+postid);}
if($('post_edit_reason_'+postid)){edit_reason=$F('post_edit_reason_'+postid);}
if($('post_htmlstatus_'+postid)){post_htmlstatus=$F('post_htmlstatus_'+postid);}
var url=ipb.vars['base_url']+'app=forums&module=ajax&section=topics&do=editBoxSave&p='+postid+'&t='+ipb.topic.topic_id+'&f='+ipb.topic.forum_id;new Ajax.Request(url,{method:'post',evalJSON:'force',encoding:ipb.vars['charset'],parameters:{md5check:ipb.vars['secure_hash'],Post:Post.encodeParam(),add_edit:add_edit,post_edit_reason:edit_reason.encodeParam(),post_htmlstatus:post_htmlstatus},onSuccess:function(t)
{if(t.responseJSON['error'])
{if($('error_msg_e'+postid))
{$('error_msg_e'+postid).update(t.responseJSON['error']);new Effect.BlindDown($('error_msg_e'+postid),{duration:0.4});}
else
{alert(t.responseJSON['error']);}
return false;}
else
{$('edit_post_'+postid).writeAttribute('_editing','0');ipb.textEditor.getEditor('edit-'+postid).remove();$('post_id_'+postid).down('.post').show().update(t.responseJSON['successString']);$('post_id_edit_'+postid).remove();prettyPrint();}}});}catch(err){alert(err);}},ajaxEditCancel:function(e)
{Event.stop(e);var elem=Event.element(e);var postid=elem.id.replace('edit_cancel_e','');if(!postid){return;}
ipb.textEditor.getEditor('edit-'+postid).remove();$('post_id_edit_'+postid).remove();$('post_id_'+postid).down('.post').show();ipb.editors[postid]=null;$('edit_post_'+postid).writeAttribute('_editing','0');return;},isTypingCallBack:function()
{if(!Object.isUndefined(ipb.topic.counts)&&!Object.isUndefined(ipb.topic.counts['perPage']))
{if((ipb.topic.counts['postTotal'])&&((ipb.topic.counts['postTotal']-ipb.topic.counts['curStart'])>=ipb.topic.counts['perPage']))
{return false;}}
ipb.topic.pollForReplies();ipb.textEditor.getEditor().timers['interval_hasContent']=setInterval(ipb.topic.pollForReplies,ipb.textEditor.IPS_NEW_POST_POLLING);ipb.topic.timers['_startPolling']=new Date().getTime();Debug.write("Starting timer for reply polling: "+ipb.topic.timers['_startPolling']);},pollForReplies:function()
{var timeNow=new Date().getTime();var timeDiff=(timeNow-ipb.topic.timers['_startPolling'])/1000;Debug.write("I have been polling for : "+timeDiff+" seconds");if(ipb.topic.isPosting===true)
{return;}
if(timeDiff/3600>1)
{Debug.write("I have stopped polling. Sorry.");clearInterval(ipb.textEditor.getEditor().timers['interval_hasContent']);}
else
{var url=ipb.vars['base_url']+'app=forums&module=ajax&section=topics&do=pollForReplies&t='+ipb.topic.topic_id+'&pid='+ipb.topic.topPid+'&md5check='+ipb.vars['secure_hash'];Debug.write(url);new Ajax.Request(url,{method:'get',evalJSON:'force',encoding:ipb.vars['charset'],hideLoader:true,onSuccess:function(t)
{if(t.responseJSON)
{var count=parseInt(t.responseJSON['count']);if(count==ipb.topic.polling.count)
{return false;}
ipb.topic.polling.count=count;if(count)
{string=new Template(ipb.lang['topic_polling']).evaluate({count:count,click:'ipb.topic.insertNewPosts(event)'});ipb.global.showInlineNotification(string,{'showClose':true,'displayForSeconds':20});}}}});}},insertNewPosts:function(e)
{Event.stop(e);ipb.topic.polling.count=0;var url=ipb.vars['base_url']+'app=forums&module=ajax&section=topics&do=getNewPosts&t='+ipb.topic.topic_id+'&pid='+ipb.topic.topPid+'&md5check='+ipb.vars['secure_hash'];Debug.write(url);new Ajax.Request(url,{method:'get',evalJSON:'force',encoding:ipb.vars['charset'],onSuccess:function(t)
{if(t.responseText)
{m=t.responseText.match(/.*<!--post:(\d+?)-->/);if(m&&m[1])
{ipb.topic.topPid=m[1];}
else
{return false;}
$('ips_Posts').insert(new Element('div',{id:'newContent-'+ipb.topic.topPid}).insert(t.responseText));if($('newContent-'+ipb.topic.topPid))
{$('newContent-'+ipb.topic.topPid).hide();new Effect.BlindDown('newContent-'+ipb.topic.topPid,{duration:1.0,queue:'front',afterFinish:function(){$('post_id_'+ipb.topic.topPid).scrollTo()}});prettyPrint();}
ipb.global.closeInlineNotification();}}});return false;},preCheckPosts:function()
{if(!$('selectedpidsJS')||!$F('selectedpidsJS')){return true;}
pids=$F('selectedpidsJS').split(',');if(pids)
{pids.each(function(pid)
{if(!pid.blank())
{if($('checkbox_'+pid))
{ipb.topic.checkPost(this,$('checkbox_'+pid));$('checkbox_'+pid).checked=true;}
else
{ipb.topic.totalChecked++;}}});}
ipb.topic.updatePostModButton();},checkPost:function(e,check)
{Debug.write("Check post");remove=$A();data=$F('selectedpidsJS');if(data!=null){pids=data.split(',')||$A();}else{pids=$A();}
if(check.checked==true)
{pids.push(check.id.replace('checkbox_',''));ipb.topic.totalChecked++;switch(check.readAttribute("data-status"))
{case '1':ipb.topic.modOptionsUnapproved+=1;break;case '2':ipb.topic.modOptionsHidden+=1;break;default:ipb.topic.modOptionsUnhidden+=1;break;}}
else
{remove.push(check.id.replace('checkbox_',''));ipb.topic.totalChecked--;switch(check.readAttribute("data-status"))
{case '1':ipb.topic.modOptionsUnapproved-=1;break;case '2':ipb.topic.modOptionsHidden-=1;break;default:ipb.topic.modOptionsUnhidden-=1;break;}}
pids=pids.uniq().without(remove).join(',');ipb.Cookie.set('modpids',pids,0);$('selectedpidsJS').value=pids;ipb.topic.updatePostModButton();},updatePostModButton:function()
{if(ipb.topic.totalChecked>0)
{if(!$('comment_moderate_box'))
{$$('body')[0].insert({'bottom':ipb.templates['post_moderation'].evaluate({count:ipb.topic.totalChecked})});$('submitModAction').on('click',ipb.topic.doModerate);}
else
{$('comment_count').update(ipb.topic.totalChecked);}
if(!$('comment_moderate_box').visible())
{new Effect.Appear($('comment_moderate_box'),{duration:0.3});}
$('tactInPopup').select('option').invoke('remove');if(ipb.topic.modOptionsUnapproved&&ipb.topic.modPerms['approve'])
{$('tactInPopup').insert(new Element('option',{value:'approve'}).update(ipb.lang['cpt_approve']));}
if(ipb.topic.modOptionsUnhidden&&ipb.topic.modPerms['hide'])
{$('tactInPopup').insert(new Element('option',{value:'delete'}).update(ipb.lang['cpt_hide']));}
if(ipb.topic.modOptionsHidden&&ipb.topic.modPerms['unhide'])
{$('tactInPopup').insert(new Element('option',{value:'sundelete'}).update(ipb.lang['cpt_undelete']));}
if(ipb.topic.modPerms['delete'])
{$('tactInPopup').insert(new Element('option',{value:'deletedo'}).update(ipb.lang['cpt_delete']));}
if(ipb.topic.totalChecked>1&&ipb.topic.modPerms['merge'])
{$('tactInPopup').insert(new Element('option',{value:'merge'}).update(ipb.lang['cpt_merge']));}
if(ipb.topic.modPerms['split'])
{$('tactInPopup').insert(new Element('option',{value:'split'}).update(ipb.lang['cpt_split']));}
if(ipb.topic.modPerms['move'])
{$('tactInPopup').insert(new Element('option',{value:'move'}).update(ipb.lang['cpt_move']));}}
else
{if($('comment_moderate_box'))
{new Effect.Fade($('comment_moderate_box'),{duration:0.3});}}},doModerate:function()
{if(ipb.topic.totalChecked>0)
{$('tact').value=$('tactInPopup').value;if($('tactInPopup').options[$('tactInPopup').selectedIndex].value=='deletedo')
{$('modform').confirmAction();}
else
{$('modform').submit();}}},confirmSingleDelete:function(e,elem)
{if(!confirm(ipb.lang['delete_post_confirm']))
{Event.stop(e);return false;}
return true;},insertQuotedPosts:function(e)
{quoted=ipb.Cookie.get('mqtids');var url=ipb.vars['base_url']+'app=forums&module=ajax&section=topics&do=mqquote&t='+ipb.topic.topic_id;Debug.write(url);editor=ipb.textEditor.getEditor(ipb.topic.fastReplyId);editor.insert('','always');new Ajax.Request(url,{method:'post',parameters:{pids:quoted,md5check:ipb.vars['secure_hash']},evalJSON:'force',encoding:ipb.vars['charset'],onSuccess:function(t)
{if(t.responseJSON&&t.responseJSON['error'])
{if(!Object.isUndefined(ipb.lang[t.responseJSON['error']]))
{ipb.global.errorDialogue(ipb.lang[t.responseJSON['error']]);}
else
{ipb.global.errorDialogue(t.responseJSON['error']);}
return false;}
else if(t.responseText&&t.responseText!='nopermission')
{editor=ipb.textEditor.getEditor(ipb.topic.fastReplyId)
editor.insert(ipb.textEditor.convertQuotes(t.responseText),true);}}});$('multiQuoteInsert').hide();ipb.topic.mqBoxShowing=false;$$('.multiquote').each(function(elem){$(elem).removeClassName('selected');});ipb.Cookie.set('mqtids','',0);Event.stop(e);return false;},toggleMultimod:function(e,elem)
{Event.stop(e);try{quoted=ipb.Cookie.get('mqtids').split(',').compact().without('');}catch(err){quoted=$A();}
id=elem.id.replace('multiq_','');quotedItems=0;if(elem.hasClassName('selected'))
{elem.removeClassName('selected');quoted=quoted.uniq().without(id);quotedItems=quoted.size();quoted=quoted.join(',');}
else
{elem.addClassName('selected');quoted.push(id);quotedItems=quoted.size();quoted=quoted.uniq().join(',');}
if(quoted==','){quoted='';}
if(quoted){if(!ipb.topic.mqBoxShowing)
{$('multiQuoteInsert').show();ipb.topic.mqBoxShowing=true;}
$('mqbutton').update(ipb.lang['mq_reply_swap'].replace(/#{num}/,quotedItems));}
else
{if(ipb.topic.mqBoxShowing)
{$('multiQuoteInsert').hide();ipb.topic.mqBoxShowing=false;}}
ipb.Cookie.set('mqtids',quoted,0);},clearMultiQuote:function(e){Event.stop(e);ipb.Cookie.set('mqtids','',0);if($('multiQuoteInsert').visible()){$('multiQuoteInsert').hide();ipb.topic.mqBoxShowing=false;}
$$('.multiquote.selected').invoke('removeClassName','selected');},toggleFilters:function(e)
{if($('filter_form'))
{Effect.toggle($('filter_form'),'blind',{duration:0.2});Effect.toggle($('show_filters'),'blind',{duration:0.2});}},setPostHidden:function(id)
{if($('post_id_'+id).select('.post_wrap')[0])
{$('post_id_'+id).select('.post_wrap')[0].hide();if($('unhide_post_'+id))
{$('unhide_post_'+id).observe('click',ipb.topic.showHiddenPost);}}},showHiddenPost:function(e)
{link=Event.findElement(e,'a');id=link.id.replace('unhide_post_','');if($('post_id_'+id).select('.post_wrap')[0])
{elem=$('post_id_'+id).select('.post_wrap')[0];new Effect.Parallel([new Effect.BlindDown(elem),new Effect.Appear(elem)],{duration:0.5});}
if($('post_id_'+id).select('.post_ignore')[0])
{ignoreElem=$('post_id_'+id).select('.post_ignore')[0];ignoreElem.hide();}
Event.stop(e);},scrollToPost:function(pid)
{if(!pid||!Object.isNumber(pid)){return;}
$('entry'+pid).scrollTo();},showVoters:function(e,qid,cid)
{Event.stop(e);if(!ipb.topic.poll[qid]||!ipb.topic.poll[qid][cid]){return;}
var content=ipb.templates['poll_voters'].evaluate({title:ipb.topic.poll[qid][cid]['name'],content:ipb.topic.poll[qid][cid]['users']});ipb.topic.pollPopups[qid+'_'+cid]=new ipb.Popup('b_voters_'+qid+'_'+cid,{type:'balloon',initial:content,stem:true,hideAtStart:false,attach:{target:$('l_voters_'+qid+'_'+cid),position:'auto','event':'click'},w:'500px'});}};ipb.topic.init();