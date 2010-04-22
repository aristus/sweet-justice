/*
 * Sweet Justice: beautiful justified text.
 *
 * Include this file at the bottom of your pages.
 * Give any DOM element the class "sweet-justice"
 * and this code will insert appropriate "shy" hy-
 * phens into your text to produce pretty justi-
 * fication.
 *
 * Works with both Jquery and YUI3.  [YUI3 not impl yet]
 *
 * BSD license: Enjoy, but give credit where it's due.
 * @author carlos@bueno.org
 * github.com/aristus/sweet-justice
 */


!function() {

  // don't break up short words.
  var MIN_WORD = 6;
  var MIN_FRAGMENT = 3;

  // don't mess with the content of these tags.
  var tag_blacklist = {
    'code': true,
    'pre': true
  }

  // courtesy http://safalra.com/web-design/javascript/dom-node-type-constants/
  if (!window.Node) {
    window.Node = {
      ELEMENT_NODE                :  1,
      ATTRIBUTE_NODE              :  2,
      TEXT_NODE                   :  3,
      CDATA_SECTION_NODE          :  4,
      ENTITY_REFERENCE_NODE       :  5,
      ENTITY_NODE                 :  6,
      PROCESSING_INSTRUCTION_NODE :  7,
      COMMENT_NODE                :  8,
      DOCUMENT_NODE               :  9,
      DOCUMENT_TYPE_NODE          : 10,
      DOCUMENT_FRAGMENT_NODE      : 11,
      NOTATION_NODE               : 12
   }
  }

  // Recurse the raw DOM nodes, taking each text node in turn.
  function justify_my_love(el) {
    var nodes = el.childNodes;
    for (var i=0; i<nodes.length; i++) {
      var node = nodes[i];
      switch (node.nodeType) {
        case Node.TEXT_NODE:
          node.replaceWholeText(break_dance(node.nodeValue));
          console.log(node.nodeValue);
          break;

        case Node.ELEMENT_NODE:
          if (!tag_blacklist[node.nodeName]) {
            justify_my_love(node);
          }
          break;

        default:
          console.log(node);
      }
    }
  }

  // Given a plain-text string, insert shy hyphens into long words.
  // Does *not* follow English syllable rules, but tries to be
  // somewhat sensible. Whitespace is not preserved.
  //  "hyphenation"  -> "hyph&shy;enat&shy;ion"
  function break_dance(text) {
    var words = text.split(/[\s\n\r\v\t]+/);
    for (var i=0; i<words.length; i++) {
      var word = words[i];
      if (word.length >= MIN_WORD && word[0] !== '&') {
        words[i] = word.replace(/.{1,3}[aeiouy]/gi, insert);
      }
    }
    return words.join(' ');
  }

  function insert(text) {
    return text + '\u00AD';
  }

  function sweet_justice() {
    $('.sweet-justice').each(function(idx,el) {
      $(el).css({'text-align':'justify'});
      justify_my_love(el);
    });
  }

  window.onload = sweet_justice;

}();