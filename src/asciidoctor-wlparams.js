/**
 * @author: Antonis Tsakiridis
 */

//const fs = require('fs')

const generateParameterMarkup = function(parent, id, attrs) {
  let divHtml = '';
  //console.log("Parent: " + parent);
  //console.log("Target: " + id);
  //console.log("Attrs: " + JSON.stringify(attrs));

  if (id && id === 'localLink') {
    let link = attrs.text;
    // We need to add a '\' in the beginning of the link text so that asciidoctor
    // doesn't touch it (if we don't do that we get an additional <a> element)
    attrs.text = '\\' + attrs.text;
    useSpan = false;
    if (attrs.clickable && attrs.clickable === "false") {
      divHtml += '<span';
      useSpan = true;
    }
    else {
      divHtml += `<a href="${link}"`;
    }

    divHtml += ` class="local-link">${attrs.text}`;

    if (useSpan) {
      divHtml += '</span>'
    } else {
      divHtml += '</a>'
    }
  }
  else {
    // We need to be backward compatible which means we need to support both:
    // - old scheme: wlparam:application_name[rcText="Restcomm"]
    // - new scheme: wlparam:sps[parmName="application_name",rcText="Restcomm"]
    if (id !== 'sps' && !attrs.parmName) {
      attrs.parmName = id;
      id = 'sps'
    }

    divHtml = `<script>
      // 'application_name' comes from inline macro
      if (!window.replacementParams) {
         window.replacementParams = {};
      }
      if (window.replacementParams.${attrs.parmName}) {
         console.error('White labeled replacement parameter already exists: ' + ${attrs.parmName});
      }
      window.replacementParams.${attrs.parmName} = '';
      </script>`

    if (attrs.rcLink) {
      divHtml += `<a class="${attrs.parmName}" href="${attrs.rcLink}"`
    } else {
      divHtml += `<span class="${attrs.parmName}"`
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
    } else {
      divHtml += '</span>'
    }
  }
  return divHtml;
}

const wlparamsInlineMacro = function () {
  const self = this

  //this.positionalAttributes(['text', 'rcText', 'rcLink', 'defaultText', 'defaultLink']);

  self.process(function (parent, target, attrs) {
    // If attrs have attribute named $$keys it means that a special Hash object is used, so we need
    // to covert to normal js Object. This currently happens when used from Antora. Otherwise we leave it
    // as is (like when invoked from Unit Tests)
    if ('$$keys' in attrs) {
      attrs = fromHash(attrs);
    }

    const html = generateParameterMarkup(parent, target, attrs);
    //console.debug("Internal HTML: " + html)
    return html;  //self.createInline(parent, 'quoted', html, {}).convert()
  })
}

module.exports.register = function register (registry) {
  registry.inlineMacro('wlparam', wlparamsInlineMacro)
}

const fromHash = function (hash) {
  let object = {};
  const data = hash.$$smap;
  for (let key in data) {
    object[key] = data[key];
  }
  return object;
};
