const chai = require('chai');
const expect = chai.expect;
const dirtyChai = require('dirty-chai');

chai.use(dirtyChai);

const asciidoctorWlParams = require('../src/asciidoctor-wlparams.js');
const asciidoctor = require('asciidoctor.js')();

//const basicInput = 'wlParam:visual_designer[rcText="Restcomm Visual Designer"]';
//const linkInput = 'wlParam:visual_designer[rcText="Restcomm Visual Designer",rcLink="#rc_visual_designer_link"]';

// Various expected results
const expectedOutputBasic = 'curl -X GET https://mycompany.restcomm.com/restcomm/2012-04-24/Accounts/ACCOUNT_SID/SMS/Messages.json \\\n' +
  '   -u "YourAccountSid:YourAuthToken"';

function htmlEscape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

describe('Asciidoctor Registration', () => {
  it('should register the extension', () => {
    const registry = asciidoctor.Extensions.create();
    expect(registry['$inline_macros?']()).to.be.false();
    asciidoctorWlParams.register(registry);
    expect(registry['$inline_macros?']()).to.be.true();
  })
});

describe('Asciidoctor Conversion', () => {
  describe('Inline macro', () => {
    describe('When extension is not registered', () => {
      it('should not convert a wlparams to actual span element', () => {
        // important: we 're escaping the input before we pass it to asciidoctor because asciidoctor does some html encoding which messes up the conversion
        const input = htmlEscape('wlParam:visual_designer[rcText="Restcomm Visual Designer"]');
        const html = asciidoctor.convert(input);
        expect(html).to.contain(input);
      })
    });
    describe('When extension is registered', () => {
      it('Should convert basic input to span markup', () => {
        const input = 'wlParam:visual_designer[rcText="Restcomm Visual Designer"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
        console.debug("-- HTML: " + html)
        expect(html).to.contain("<script>\n" +
          "      // 'application_name' comes from inline macro\n" +
          "      if (!window.replacementParams) {\n" +
          "         window.replacementParams = {};\n" +
          "      }\n" +
          "      if (window.replacementParams.visual_designer) {\n" +
          "         console.error('White labeled replacement parameter already exists: ' + visual_designer);\n" +
          "      }\n" +
          "      window.replacementParams.visual_designer = '';\n" +
          "      </script><span class=\"visual_designer\">Restcomm Visual Designer</span>");
      });
      it('Should convert input with default text to span markup', () => {
        const input = 'wlParam:visual_designer[rcText="Restcomm Visual Designer",defaultText="Visual Designer"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline'  });
        console.debug("-- HTML: " + html)
        expect(html).to.contain("<script>\n" +
          "      // 'application_name' comes from inline macro\n" +
          "      if (!window.replacementParams) {\n" +
          "         window.replacementParams = {};\n" +
          "      }\n" +
          "      if (window.replacementParams.visual_designer) {\n" +
          "         console.error('White labeled replacement parameter already exists: ' + visual_designer);\n" +
          "      }\n" +
          "      window.replacementParams.visual_designer = '';\n" +
          "      </script><span class=\"visual_designer\" data-default-text=\"Visual Designer\">Restcomm Visual Designer</span>");
      });
      it('Should convert link input to a markup', () => {
        const input = 'wlParam:visual_designer[rcText="Restcomm Visual Designer",rcLink="#rc_visual_designer_link"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
        console.debug("-- HTML: " + html)
        expect(html).to.contain("<script>\n" +
          "      // 'application_name' comes from inline macro\n" +
          "      if (!window.replacementParams) {\n" +
          "         window.replacementParams = {};\n" +
          "      }\n" +
          "      if (window.replacementParams.visual_designer) {\n" +
          "         console.error('White labeled replacement parameter already exists: ' + visual_designer);\n" +
          "      }\n" +
          "      window.replacementParams.visual_designer = '';\n" +
          "      </script><a class=\"visual_designer\" href=\"#rc_visual_designer_link\">Restcomm Visual Designer</a>");
      });
      it('Should convert link input with default text to a markup', () => {
        const input = 'wlParam:visual_designer[rcText="Restcomm Visual Designer",rcLink="#rc_visual_designer_link",defaultText="Visual Designer"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
        console.debug("-- HTML: " + html)
        expect(html).to.contain("<script>\n" +
          "      // 'application_name' comes from inline macro\n" +
          "      if (!window.replacementParams) {\n" +
          "         window.replacementParams = {};\n" +
          "      }\n" +
          "      if (window.replacementParams.visual_designer) {\n" +
          "         console.error('White labeled replacement parameter already exists: ' + visual_designer);\n" +
          "      }\n" +
          "      window.replacementParams.visual_designer = '';\n" +
          "      </script><a class=\"visual_designer\" href=\"#rc_visual_designer_link\" data-default-text=\"Visual Designer\">Restcomm Visual Designer</a>");
      });
      it('Should convert link input with default text with default link to a markup', () => {
        const input = 'wlParam:visual_designer[rcText="Restcomm Visual Designer",rcLink="#rc_visual_designer_link",defaultText="Visual Designer",defaultLink="#visual_designer_default_link"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
        console.debug("-- HTML: " + html)
        expect(html).to.contain("<script>\n" +
          "      // 'application_name' comes from inline macro\n" +
          "      if (!window.replacementParams) {\n" +
          "         window.replacementParams = {};\n" +
          "      }\n" +
          "      if (window.replacementParams.visual_designer) {\n" +
          "         console.error('White labeled replacement parameter already exists: ' + visual_designer);\n" +
          "      }\n" +
          "      window.replacementParams.visual_designer = '';\n" +
          "      </script><a class=\"visual_designer\" href=\"#rc_visual_designer_link\" data-default-text=\"Visual Designer\" data-default-link=\"#visual_designer_default_link\">Restcomm Visual Designer</a>");
      });
      it('Should convert link input with default text with default link to a markup using special characters', () => {
        const input = 'wlParam:visual_designer[rcText="Restcomm Visual Designer\'s",rcLink="https://restcomm.com/#rc_visual_designer_link",defaultText="Visual Designer\'s",defaultLink="https://acme.com/#visual_designer_default_link"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
        console.debug("-- HTML: " + html)
        expect(html).to.contain("<script>\n" +
          "      // 'application_name' comes from inline macro\n" +
          "      if (!window.replacementParams) {\n" +
          "         window.replacementParams = {};\n" +
          "      }\n" +
          "      if (window.replacementParams.visual_designer) {\n" +
          "         console.error('White labeled replacement parameter already exists: ' + visual_designer);\n" +
          "      }\n" +
          "      window.replacementParams.visual_designer = '';\n" +
          "      </script><a class=\"visual_designer\" href=\"https://restcomm.com/#rc_visual_designer_link\" data-default-text=\"Visual Designer&#8217;s\" data-default-link=\"https://acme.com/#visual_designer_default_link\">Restcomm Visual Designer&#8217;s</a>");
      });

    });
  })
});
