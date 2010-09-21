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
  // Variant of the VCCV algorithm
  // http://www.bramstein.com/projects/typeset/
  // http://defoe.sourceforge.net/folio/knuth-plass.html
  // If you are a student of English grammar or typography, this
  // will make you cry. If you read anything other than English,
  // this will also make you cry.
  var whitespace = /[ \s\n\r\v\t]+/;
  function break_dance(text) {
    var words = text.split(whitespace);
    for (var i=0; i<words.length; i++) {
      if (breakable(words[i])) {
        words[i] = break_word_en(words[i]);
      }
    }
    return words.join(' ');
  }

  // determine whether a word is good for hyphenation.
  // no numbers, email addresses, hyphens, or &entities;
  function breakable(word) {
    return (/\w{6,}/.test(word)) && (!/^[0-9\&]|@|\-|\u00AD/.test(word));
  }

  // Detect all Unicode vowels. Just last week I told someone
  // to never do this. Never say never, I guess. The Closure
  // compiler transforms this into ASCII-safe \u0000 encoding.
  // http://closure-compiler.appspot.com/home
  var vowels = 'aeiouyAEIOUY'+
    'ẚÁáÀàĂăẮắẰằẴẵẲẳÂâẤấẦầẪẫẨẩǍǎÅåǺǻÄäǞǟÃãȦȧǠǡĄąĀāẢảȀȁȂȃẠạẶặẬậḀḁȺⱥ'+
    'ǼǽǢǣÉƏƎǝéÈèĔĕÊêẾếỀềỄễỂểĚěËëẼẽĖėȨȩḜḝĘęĒēḖḗḔḕẺẻȄȅȆȇẸẹỆệḘḙḚḛɆɇɚɝÍíÌìĬĭÎîǏǐÏ'+
    'ïḮḯĨĩİiĮįĪīỈỉȈȉȊȋỊịḬḭIıƗɨÓóÒòŎŏÔôỐốỒồỖỗỔổǑǒÖöȪȫŐőÕõṌṍṎṏȬȭȮȯȰȱØøǾǿǪǫǬǭŌōṒṓ'+
    'ṐṑỎỏȌȍȎȏƠơỚớỜờỠỡỞởỢợỌọỘộƟɵÚúÙùŬŭÛûǓǔŮůÜüǗǘǛǜǙǚǕǖŰűŨũṸṹŲųŪūṺṻỦủȔȕȖȗƯưỨứỪừ'+
    'ỮữỬửỰựỤụṲṳṶṷṴṵɄʉÝýỲỳŶŷY̊ẙŸÿỸỹẎẏȲȳỶỷỴỵʏɎɏƳƴ';
  var c = '[^'+vowels+']';
  var v = '['+vowels+']';
  var vccv = new RegExp('('+v+c+')('+c+v+')', 'g');
  var simple = new RegExp('(.{2,4}'+v+')'+'('+c+')', 'g');

  // "algorithmic" hyphenation
  var dumb = /\u00AD(.?)|$\u00AD(.{0,2}\w+)$/;
  function break_word_default(word) {
    return word
      .replace(vccv, '$1\u00AD$2')
      .replace(simple, '$1\u00AD$2')
      .replace(dumb, '$1');
  }

  // dictionary-based hypenation similar to the original
  // TeX algo: split on well-known prefixes and suffixes
  // then along the vccv line. This is not i18n nor even
  // generally correct, but is fairly compact.
  var presuf = /^(\W*)(anti|auto|ab|an|ax|al|as|bi|bet|be|contra|cat|cath|cir|cum|cog|col|com|con|cor|could|co|desk|de|dis|did|dif|di|eas|every|ever|extra|ex|end|en|em|epi|evi|func|fund|fin|hyst|hy|han|il|in|im|ir|just|jus|loc|lig|lit|li|mech|manu|man|mal|mis|mid|mono|multi|mem|micro|non|nano|ob|oc|of|opt|op|over|para|per|post|pre|peo|pro|retro|rea|re|rhy|should|some|semi|sen|sol|sub|suc|suf|super|sup|sur|sus|syn|sym|syl|tech|trans|tri|typo|type|uni|un|van|vert|with|would|won)?(.*?)(weens?|widths?|icals?|ables?|ings?|tions?|ions?|ies|isms?|ists?|ful|ness|ments?|ly|ify|ize|ise|ity|en|ers?|ences?|tures?|ples?|als?|phy|puts?|phies|ry|ries|cy|cies|mums?|ous|cents?)?(\W*)$/i;

  function break_word_en(word) {
    // punctuation, prefix, center, suffix, punctuation
    var parts = presuf.exec(word);
    var ret = [];
    if (parts[2]) {
      ret.push(parts[2]);
    }
    if (parts[3]) {
      ret.push(parts[3].replace(vccv, '$1\u00AD$2'));
    }
    if (parts[4]) {
      ret.push(parts[4]);
    }
    return (parts[1]||'') + ret.join('\u00AD') + (parts[5]||'');
  }

  // The shy-phen character is an odd duck. On copy/paste
  // most apps other than browsers treat them as printable
  // instead of a hyphenation hint, which is usually not what
  // you want. So on copy we take 'em out. The selection APIs
  // are very different across browsers so there is a lot of
  // browser-specific jazzhands in this function. The basic
  // idea is to grab the data being copied, make a "shadow"
  // element of it, remove the shy-phens, select and copy
  // that, then reinstate the original selection.
  //
  // More than you ever wanted to know:
  // http://www.cs.tut.fi/~jkorpela/shy.html
  function copy_protect(e) {
    var body = document.getElementsByTagName('body')[0];
    var shyphen = /(?:\u00AD|\&#173;|\&shy;)/g;
    var shadow = document.createElement('div');
    shadow.style.overflow = 'hidden';
    shadow.style.position = 'absolute';
    shadow.style.top = '-5000px';
    shadow.style.height = '1px';
    body.appendChild(shadow);

    // FF3, WebKit
    if (typeof window.getSelection !== 'undefined') {
      sel = window.getSelection();
      var range = sel.getRangeAt(0);
      shadow.appendChild(range.cloneContents());
      shadow.innerHTML = shadow.innerHTML.replace(shyphen, '');
      sel.selectAllChildren(shadow);
      window.setTimeout(function() {
        shadow.parentNode.removeChild(shadow);
        if (typeof window.getSelection().setBaseAndExtent !== 'undefined') {
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
      shadow.innerHTML = range.htmlText.replace(shyphen, '');
      var range2 = body.createTextRange();
      range2.moveToElementText(shadow);
      range2.select();
      window.setTimeout(function() {
        shadow.parentNode.removeChild(shadow);
        if (range.text !== '') {
          range.select();
        }
      },0);
    }
    return;
  }

  // jQuery
  function sweet_justice_jq() {
    jQuery('.sweet-justice, .sweet-hyphens').each(function(idx,el) {
      justify_my_love(el);
    });
    jQuery('body').bind('copy', copy_protect);
  }

  // YUI3
  function sweet_justice_yui(Y) {
    Y.all('.sweet-justice, .sweet-hyphens').each(function(el) {
      justify_my_love(Y.Node.getDOMNode(el));
    });
    Y.Node.DOM_EVENTS.copy = 1; // make sure copy event is enabled in YUI
    Y.one('body').on('copy', copy_protect);
  }

  // Insert class styles. More mindless browser-banging. *sigh*
  try {
    var style = document.createElement('style');
    style.type = 'text/css';
    var css = '.sweet-justice {text-align:justify;text-justify:distribute} ' +
              '.justice-denied {text-align:left;text-justify:normal}';
    if(!!(window.attachEvent && !window.opera)) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
  } catch (e) {
    // we did our best...
  }

  // dispatch on library
  if (window.jQuery) {
    jQuery(window).load(sweet_justice_jq);
  } else if (window.YUI) {
    YUI().use('node', function(Y) {
        sweet_justice_yui(Y);
    });
  }
}();
