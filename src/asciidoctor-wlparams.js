/**
 * @author: Antonis Tsakiridis
 */


const generateParameterMarkup = function(parent, id, attrs) {
  let divHtml = '';

  let classes = [];

  // Handle defaults and any normalizations
  // default textMode to SPS
  if (!attrs.textMode) {
    attrs.textMode = 'non-sps';
  }
  if (!attrs.linkMode) {
    attrs.linkMode = 'non-sps';
  }
  console.log("Attrs: " + JSON.stringify(attrs));
  if (attrs.text.match(/^http/)) {
    // We need to add a '\' in the beginning of the link text so that asciidoctor
    // doesn't touch it (if we don't do that we get an additional <a> element)
    attrs.text = '\\' + attrs.text;
  }

  // Validations
  if (attrs.textMode === 'sps' && (!attrs.parmText || attrs.parmText.length === 0)) {
    console.error("SPS mode for text, but no SPS parameter name passed");
  }
  if (attrs.linkMode === 'sps' && (!attrs.parmLink || attrs.parmLink.length === 0)) {
    console.error("SPS mode for link, but no SPS parameter link passed");
  }
  if (!attrs.text || attrs.text.length === 0) {
    console.error("text parameter is mandatory");
  }

  // Setup styling vars
  if (attrs.textMode === 'non-sps') {
    classes.push('non-sps-text');
  }
  else {
    classes.push('sps-text');
  }
  if (attrs.linkMode === 'non-sps') {
    classes.push('non-sps-link');
  }
  else {
    classes.push('sps-link');
  }

  let isLink = false;
  // Main logic
  if (attrs.link && attrs.link.length > 0) {
    divHtml += `<a href="${attrs.link}"`;
    isLink = true;
  }
  else {
    divHtml += `<span`;
  }
  divHtml += ` class="${classes.join(' ')}"`;
  if (attrs.parmText && attrs.parmText.length > 0) {
    divHtml += ` data-parm-text="${attrs.parmText}"`;
  }
  if (attrs.defaultText && attrs.defaultText.length > 0) {
    divHtml += ` data-default-text="${attrs.defaultText}"`;
  }
  if (attrs.parmLink && attrs.parmLink.length > 0) {
    divHtml += ` data-parm-link="${attrs.parmLink}"`;
  }
  if (attrs.defaultLink && attrs.defaultLink.length > 0) {
    divHtml += ` data-default-link="${attrs.defaultLink}"`;
  }

  divHtml += `>${attrs.text}`;

  if (isLink) {
    divHtml += '</a>';
  } else {
    divHtml += '</span>';
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
