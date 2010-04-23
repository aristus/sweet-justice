/*
 * Sweet Justice: beautiful justified text.
 *
 * Include this file at the bottom of your pages.
 * Give any DOM element the class "sweet-justice"
 * and this code will insert appropriate "shy" hy-
 * phens into your text to produce pretty justi-
 * fication.
 *
 * Works with *both* Jquery and YUI3.
 *
 * BSD license: Enjoy, but give credit where it's due.
 *
 * @author carlos@bueno.org 23 April 2010
 *
 * github.com/aristus/sweet-justice
 *
 */


!function() {

  // don't break up short words.
  var MIN_WORD = 6;

  // don't mess with the content of these tags.
  var tag_blacklist = {
    'code': true,
    'pre': true,
    'abbr': true
  }

  // Recurse raw DOM nodes, transforming each text node.
  function justify_my_love(el) {
    var nodes = el.childNodes;
    for (var i=0; i<nodes.length; i++) {
      var node = nodes[i];
      switch (node.nodeType) {
        case 3: // Node.TEXT_NODE
          node.nodeValue = break_dance(node.nodeValue);
          break;

        case 1: // Node.ELEMENT_NODE
          if (!tag_blacklist[node.nodeName.toLowerCase()]) {
            justify_my_love(node);
          }
          break;
      }
    }
  }

  // Given a plain-text string, insert shy-phens into long words.
  // Does *not* follow English syllable rules, but tries to be som-
  // ewhat sensible. Whitespace is not preserved.
  function break_dance(text) {
    var words = text.split(/[\s\n\r\v\t]+/);
    for (var i=0; i<words.length; i++) {
      var word = words[i];
      if (word.length >= MIN_WORD && word.charAt(0) !== '&') {
        words[i] = word.replace(simple, insert)
          .replace(/\u00AD(.{0,1})$/, '$1'); // no "hyphen-s"
      }
    }
    return words.join(' ');
  }

  var faux_english = /.{1,3}[aeiouy]/gi;
  var simple = /[\w]{1,4}/g;

  function insert(text) {
    //return text + '*'; // debugging
    return text + '\u00AD';
  }

  // the shy-phen character is an odd duck. on copy/paste
  // most systems will translate them to hard spaces, which is
  // usually not what you want. so on copy we take 'em out.
  // The selection APIs are very different across browsers
  // so there is a lot of jazzhands in this function.
  function copy_protect(e) {
    var body = document.getElementsByTagName("body")[0];
    var sel = '';
    if (typeof window.getSelection != "undefined") {
      sel = window.getSelection();
      var range = sel.getRangeAt(0);
      var shadow = document.createElement("div");
      shadow.style.overflow = 'hidden';
      shadow.style.position = 'absolute';
      shadow.style.top = '-5000px';
      shadow.style.height = '1px';
      body.appendChild(shadow);
      shadow.appendChild(range.cloneContents());
      shadow.innerHTML = shadow.innerHTML.replace(/\u00AD/g, '');
      sel.selectAllChildren(shadow);
      window.setTimeout(function() {
        shadow.parentNode.removeChild(shadow);
        if (typeof window.getSelection().setBaseAndExtent != "undefined") {
          sel.setBaseAndExtent(
            range.startContainer,
            range.startOffset,
            range.endContainer,
            range.endOffset
          );
        }
      },0);
    } else {
      // Internet Explorer. need halp! :(
      // sel = document.selection;
      // var range = sel.createRange();
      // var shadow = document.createElement("div");
      // shadow.innerHTML = range.htmlText.replace(/\u00AD/g, '');
      // var range2 = body.createTextRange();
      // range2.moveToElementText(shadow);
      // range2.select();
    }
    return;
  }

  // jQuery
  function sweet_justice_jq() {
    $('.sweet-justice').each(function(idx,el) {
      $(el).css({'text-align':'justify'});
      justify_my_love(el);
    });
    $('body').bind('copy', copy_protect);
  }

  // YUI3
  function sweet_justice_yui(Y) {
    Y.all('.sweet-justice').each(function(el) {
      el.setStyle('text-align','justify');
      justify_my_love(el._node);
    });

    // Y.one('body').on('copy', copy_protect); //hmm.YUI3 doesn't work with this.
    var body = document.getElementsByTagName("body")[0];
    if (window.addEventListener) {
      body.addEventListener("copy", copy_protect, false);
    } else {
      body.attachEvent("oncopy", copy_protect);
    }
  }

  // dispatch on library
  if (window.jQuery) {
    $(window).load(sweet_justice_jq);

  } else if (window.YUI) {
    YUI().use('node', function(Y) {
        sweet_justice_yui(Y);
    });
  }
}();