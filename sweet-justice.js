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
  var MIN_WORD = 5;

  // don't mess with the content of these tags.
  var tag_blacklist = {
    'code': true,
    'pre': true
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

  // Given a plain-text string, insert shy hyphens into long words.
  // Does *not* follow English syllable rules, but tries to be som-
  // ewhat sensible. Whitespace is not preserved.
  function break_dance(text) {
    var words = text.split(/[\s\n\r\v\t]+/);
    for (var i=0; i<words.length; i++) {
      var word = words[i];
      if (word.length >= MIN_WORD && word.charAt(0) !== '&') {
        words[i] = word.replace(simple, insert).replace(/\u00AD$/, '');
      }
    }
    return words.join(' ');
  }

  var faux_english = /.{1,3}[aeiouy]/gi;
  var simple = /.{1,3}[^\-]/g;

  function insert(text) {
    //return text + '*'; // debugging
    return text + '\u00AD';
  }

  // jQuery
  function sweet_justice_jq() {
    $('.sweet-justice').each(function(idx,el) {
      $(el).css({'text-align':'justify'});
      justify_my_love(el);
    });
  }

  // YUI3
  function sweet_justice_yui(Y) {
    Y.all('.sweet-justice').each(function(el) {
      el.setStyle('text-align','justify');
      justify_my_love(el._node);
    });
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