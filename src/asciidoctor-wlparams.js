/**
 * @author: Antonis Tsakiridis
 */

//const fs = require('fs')

const generateParameterMarkup = function(parent, id, attrs) {
  let divHtml = `<script>
      // 'application_name' comes from inline macro
      if (!window.replacementParams) {
         window.replacementParams = {};
      }
      if (window.replacementParams.${id}) {
         console.error('White labeled replacement parameter already exists: ' + ${id});
      }
      window.replacementParams.${id} = '';
      </script>`

  console.log("Target: " + id)
  console.log("Attrs: " + JSON.stringify(attrs))

  if (attrs.rcLink) {
    divHtml += `<a class="${id}" href="${attrs.rcLink}"`
  }
  else {
    divHtml += `<span class="${id}"`
  }

  if (attrs.defaultText) {
    divHtml += ` data-default-text="${attrs.defaultText}"`
  }

  if (attrs.defaultLink) {
    divHtml += ` data-default-link="${attrs.defaultLink}"`
  }

  divHtml += `>${attrs.rcText}`

  if (attrs.rcLink) {
    divHtml += '</a>'
  }
  else {
    divHtml += '</span>'
  }

  return divHtml;
}

const wlparamsInlineMacro = function () {
  const self = this

  this.positionalAttributes(['rcText', 'rcLink', 'defaultText', 'defaultLink']);

  self.process(function (parent, target, attrs) {
    // If attrs have attribute named $$keys it means that a special Hash object is used, so we need
    // to covert to normal js Object. This currently happens when used from Antora. Otherwise we leave it
    // as is (like when invoked from Unit Tests)
    if ('$$keys' in attrs) {
      attrs = fromHash(attrs);
    }

    const html = generateParameterMarkup(parent, target, attrs)
    //console.debug("HTML: " + html)
    return html  //self.createInline(parent, 'quoted', html, {}).convert()
  })
}

module.exports.register = function register (registry) {
  registry.inlineMacro('wlParam', wlparamsInlineMacro)
}

const fromHash = function (hash) {
  let object = {};
  const data = hash.$$smap;
  for (let key in data) {
    object[key] = data[key];
  }
  return object;
};
