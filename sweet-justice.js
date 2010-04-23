/*
 * Sweet Justice: beautiful justified text.
 *
 * Include this file at the bottom of your pages
 * and it will hyphenate and justify your text.
 * The script pays attention to elements with
 * any of these three CSS classes:
 *
 *   sweet-justice:  Hyphenated and justified
 *   sweet-hypens:   Hyphenation only
 *   justice-denied: No hypens or justification.
 *                   This is useful for child nodes.
 *
 * Hyphenation is accomplished by inserting soft
 * hyphen characters (0x00AD) into long words.
 *
 * Requires either jQuery or YUI3.
 *
 * BSD license: Share and enjoy.
 * @author carlos@bueno.org 23 April 2010
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

  // Recurse raw DOM nodes, hyphenating each text node.
  function justify_my_love(el) {
    var nodes = el.childNodes;
    for (var i=0; i<nodes.length; i++) {
      var node = nodes[i];

      switch (node.nodeType) {
        case 3: // Node.TEXT_NODE
          node.nodeValue = break_dance(node.nodeValue);
          break;

        case 1: // Node.ELEMENT_NODE
          if (!tag_blacklist[node.nodeName.toLowerCase()] &&
              node.className.indexOf('justice-denied') === -1) {
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
      if (word.length >= MIN_WORD && !/^[0-9\&]/.test(word)) {
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

  // The shy-phen character is an odd duck. On copy/paste
  // most apps other than browsers treat them as printable
  // instead of a hyphenation hint, which is usually not what
  // you want. So on copy we take 'em out. The selection APIs
  // are very different across browsers so there is a lot of
  // browser-specific jazzhands in this function.
  //
  // More than you ever wanted to know:
  // http://www.cs.tut.fi/~jkorpela/shy.html
  function copy_protect(e) {
    var body = document.getElementsByTagName("body")[0];
    var shadow = document.createElement("div");
    shadow.style.overflow = 'hidden';
    shadow.style.position = 'absolute';
    shadow.style.top = '-5000px';
    shadow.style.height = '1px';
    body.appendChild(shadow);

    // FF3, WebKit
    if (typeof window.getSelection != "undefined") {
      sel = window.getSelection();
      var range = sel.getRangeAt(0);
      shadow.appendChild(range.cloneContents());
      shadow.innerHTML = shadow.innerHTML
        .replace(/(?:\u00AD|\&#173;|\&shy;)/g, '');
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

    // Internet Explorer
    } else {
      sel = document.selection;
      var range = sel.createRange();
      shadow.innerHTML = range.htmlText
        .replace(/(?:\u00AD|\&#173;|\&shy;)/g, '');
      var range2 = body.createTextRange();
      range2.moveToElementText(shadow);
      range2.select();
      window.setTimeout(function() {
        shadow.parentNode.removeChild(shadow);
        if (range.text != "") {
          range.select();
        }
      },0);
    }
    return;
  }

  // jQuery
  function sweet_justice_jq() {
    $('.sweet-justice').each(function(idx,el) {
      $(el).css({
        'text-align':   'justify',
        'text-justify': 'distribute'
      });
      justify_my_love(el);
    });
    $('.sweet-hyphens').each(function(idx,el) {
      justify_my_love(el);
    });
    $('body').bind('copy', copy_protect);
  }

  // YUI3
  function sweet_justice_yui(Y) {
    Y.all('.sweet-justice').each(function(el) {
      el.setStyles({
        'textAlign':   'justify',
        'textJustify': 'distribute'
      });
      justify_my_love(el._node);
    });
    Y.all('.sweet-hyphens').each(function(el) {
      justify_my_love(el._node);
    });

    // Y.one('body').on('copy', copy_protect); //hmm. YUI3 doesn't work with this.
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