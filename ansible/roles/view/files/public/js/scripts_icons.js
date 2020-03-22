/* SWITCH Application Package generated: 2017-10-09T08:37:58 */
/*
 * Author: SWITCH - Yves Ettounsi
 * Date: 24.10.2014
 * 
 * Automatically adds icons to links.
 */

// ------------------------------ global variables ------------------------------ 

// elements that match those selectors will not receive an icon
var excludeList = [".noicon", ":has(img)"];

// We do not want to add icons everywhere on the page. Therefore, icons will be appended only within those target selectors
// var iconTargets = ['.swi-container', '.swi-footer-bottom'];
var iconTargets = ['.swi-container'];

// Which hosts besides the current active one shall be treated as internal hosts? (no external link icon will be added)
var internal_hosts = ['switch.ch']; // --> the current active host (location.hostname) always counts as internal and does not need to be added here
// All hosts in this list will be treated as wildcard (*.switch.ch)
// That means not only links to "switch.ch" will be ignored but also "help.switch.ch", "foo.cast.switch.ch" etc.

//------------------------------ global variables ------------------------------ 

jQuery(document).ready(function(){
	
	// use icon mechanism only in online mode, do not use it in edit mode to avoid problems with opencms inline feature
	var offlineMetaTag = jQuery("meta[data-opencms-indicator]").attr("data-opencms-edit-mode");
	if(offlineMetaTag === undefined){
		
	getSwitchJqueryCommands(); // get additional SWITCH helper commands
	addFileIcon(iconTargets, 'url', 'External Link', 'fileicon_ext');
	addFileIcon(iconTargets, 'pdf', 'Adobe .pdf', 'fileicon_pdf');
	addFileIcon(iconTargets, 'doc', 'Word .doc', 'fileicon_doc');
	addFileIcon(iconTargets, 'docx', 'Word .docx', 'fileicon_doc');
	addFileIcon(iconTargets, 'xls', 'Excel .xls', 'fileicon_xls');
	addFileIcon(iconTargets, 'xlsx', 'Excel .xlsx', 'fileicon_xls');
	addFileIcon(iconTargets, 'ppt', 'PowerPoint .ppt', 'fileicon_ppt');
	addFileIcon(iconTargets, 'pptx', 'PowerPoint .pptx', 'fileicon_ppt');
	addFileIcon(iconTargets, 'txt', 'Textfile .txt', 'fileicon_txt');
	addFileIcon(iconTargets, 'xml', 'Extensible Markup Language .xml', 'fileicon_xml');
	addFileIcon(iconTargets, 'zip', 'Compressed .zip', 'fileicon_zip');
	addFileIcon(iconTargets, 'jpg', 'Image', 'fileicon_img');
	addFileIcon(iconTargets, 'png', 'Image', 'fileicon_img');
	addFileIcon(iconTargets, 'tiff', 'Image', 'fileicon_img');
	addFileIcon(iconTargets, 'gif', 'Image', 'fileicon_img');
	addFileIcon(iconTargets, 'psd', 'Image', 'fileicon_img');
	addFileIcon(iconTargets, 'ai', 'Image', 'fileicon_img');
	addFileIcon(iconTargets, 'jpeg', 'Image', 'fileicon_img');
	addFileIcon(iconTargets, 'mp3', 'Audio', 'fileicon_audio');
	addFileIcon(iconTargets, 'wav', 'Audio', 'fileicon_audio');
	addFileIcon(iconTargets, 'ogg', 'Audio', 'fileicon_audio');
	addFileIcon(iconTargets, 'mov', 'Video', 'fileicon_video');
	addFileIcon(iconTargets, 'mp4', 'Video', 'fileicon_video');
	addFileIcon(iconTargets, 'mpeg2', 'Video', 'fileicon_video');
	addFileIcon(iconTargets, 'mpg', 'Video', 'fileicon_video');
	addFileIcon(iconTargets, 'avi', 'Video', 'fileicon_video');
	addFileIcon(iconTargets, 'rss', 'RSS Feed', 'fileicon_rss');
	addFileIcon(iconTargets, 'atom', 'Atom Feed', 'fileicon_rss');
    addExtLinkIcon();
    removeTargetAttr();
	addPopUpIcon();
	formatHelpPopup();
	
	}
});

/*
 * Automatically add an icon for links that point to an external website
 */
function addExtLinkIcon() {

	var excludeFilter = " a";

	// 0. If there are internal hosts, prepare the exclude filter string with the list of internal hosts
	if(internal_hosts!== undefined && internal_hosts.length>0){
		
		// add every host name that counts as internal host to the string that is added to the jQuery selector in the next step
		jQuery.each(internal_hosts, function(index, value){
			excludeFilter += ':not([href*="' + value + '"])';
		});
	}
	
	// 1. get all <a> elements in the specified areas (iconTargets) that do not have a href pointing to an internal host
	jQuery.each(iconTargets, function(index, value){
		jQuery(value + excludeFilter)
		// 2. now that we have all <a> elements, start to filter out undesired <a> elements
		.not(getExcludeFileEndingList()) // do not use any <a> element whose selector is in this list
		.filter(':SWITCH_parents(.noicon)') // do not use any <a> element whose parent nodes has class "noicon"
		.filter(function() {

			// filter that only returns <a> elements that do not point to the current host (because the current host is always an internal host)
//			return this.hostname && (jQuery.inArray(this.hostname, internal_hosts)== -1);
			return this.hostname && (this.hostname !== location.hostname);
		})

		// 3. now the list is completely sorted and we can start adding additional elements
		.attr("title", "External Link") // add additional attribute "title"
		.addClass("fileicon_ext"); // add the icon CSS class

	});

}

/*
 * Automatically add a popup icon for links that open in a new window
 */
function addPopUpIcon() {
	jQuery.each(iconTargets, function(index, value){
		jQuery(value + ' a[onclick*="window.open"]')
		.not(getExcludeFileEndingList())  // no icon if in this list
		.filter(':SWITCH_parents(.noicon)') // no icon if any parent node has class "noicon"
		.attr("title", "Popup Link") // add additional attribute "title"
		.addClass("fileicon_popup"); // add the icon CSS class

	});
}


/*
 * initializes icon for a desired file ending
 * 
 * w = (Array) - where shall the icon be used? (e.g. ".swi-container")
 * e = desired file ending (e.g. "pdf")
 * t = hover text
 * c = CSS class name with desired icon to add to the link
 * 
 * Example: addFileIcon(['.swi-container', '#swi-footer'], 'pdf', 'Adobe .pdf', 'fileicon_pdf');
 * 
 */
function addFileIcon(w, e, t, c){
jQuery.each(w, function(index, value){
	jQuery(value + " a[href$='." + e + "']").filter(':SWITCH_parents(.noicon)').not(".noicon, :has(img)").attr("title", t).addClass(c);
	
	var StringForList = "a[href$='."+e+"']";
	if(jQuery.inArray(StringForList, excludeList)== -1){
		excludeList.push(StringForList);		
	}
	
});

}
/*
 * generates a list with all selectors with whom no icons shall be added
 */
function getExcludeFileEndingList(){
	
	var completeList = "";
	
	jQuery.each(excludeList, function(index, value) {

		// as long as it is not the last selector...
		if(index < excludeList.length-1) {

			// ...add a comma and a whitespace as separator
			completeList += value + ", ";
		} else if(index == excludeList.length-1){
			
			// if it is the last selector, do not add a comma
			completeList += value + "";
		}
	});
	return completeList;
}

/*
 * Additional SWITCH custom jQuery functions
 */
function getSwitchJqueryCommands(){
	/* :SWITCH_parents(ParentNode):
	 * 
	 * Used in conjunction with .filter(), all objects are selected that are NOT used in the parentNode
	 * 
	 * Example:
	 * jQuery(a).filter(':SWITCH_parents(.noicon)')
	 * 
	 * --> returns all <a> tags, that are not in a parent with the class "noicon"
	 * */
	jQuery.expr[':'].SWITCH_parents = function(a,i,m){
	    return jQuery(a).parents(m[3]).length < 1;
	};	
}

/*
 * overrides onclick attributes on links to the helpbrowser with standardized attributes
 */
function formatHelpPopup() {
	
	jQuery.each(iconTargets, function(index, value){
		jQuery(value + ' a[href*="help.switch.ch"]')
		  .filter(':SWITCH_parents(.noicon)') // no icon if parent node has class "noicon"
		  .not('.noicon')
		  .filter(function() {
			// filter that only returns <a> elements that do not point to the current host (because the current host is always an internal host)
			return this.hostname && (this.hostname !== location.hostname);
		})
		  .removeAttr('onclick')
		  .addClass("fileicon_popup") // add icon
		  .click(function(ev){
			window.open(
					this.href,
					'',
					'scrollbars=yes,status=no,toolbar=yes,menubar=yes,resizable=yes,top=100,left=100'
					);
					ev.preventDefault();
					return false;
			})
	});
}

/*
 * Removes the target attribute in all links to prevent links to open in a new window. 
 * 
 */
function removeTargetAttr(){
	
	jQuery('a[target="_blank"]')
	.filter(':SWITCH_parents(.keeptarget)') // keep target if explicitly desired
	.not('.keeptarget')
	.removeAttr('target');	
	
}
