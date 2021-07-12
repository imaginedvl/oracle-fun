'use strict';

// ---------------------------------------------------------------------------------------------------------------- //
// Extensions
// ---------------------------------------------------------------------------------------------------------------- //
$.extend($.expr[':'], { // Contains Case Insensitive
    'containsi': function(elem, i, match, array)
    {
      return (elem.textContent || elem.innerText || '').toLowerCase()
      .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
  });


  if (!$.prototype.setContent) {
    $.prototype.setContent = function (content) {
        if (!Oracle.isEmpty(content)) {
          if(Oracle.isString(content))
          {
            this.text(content);
          }
          else{
            this.html(content);
          }
        }
    };
}
