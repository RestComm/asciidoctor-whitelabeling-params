const chai = require('chai');
const expect = chai.expect;
const dirtyChai = require('dirty-chai');

chai.use(dirtyChai);

const asciidoctorWlParams = require('../src/asciidoctor-wlparams.js');
const asciidoctor = require('asciidoctor.js')();

//const basicInput = 'wlparam:visual_designer[rcText="Restcomm Visual Designer"]';
//const linkInput = 'wlparam:visual_designer[rcText="Restcomm Visual Designer",rcLink="#rc_visual_designer_link"]';

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
  describe('SPS', () => {
    describe('When extension is not registered', () => {
      it('should not convert a wlparams to actual span element', () => {
        // important: we 're escaping the input before we pass it to asciidoctor because asciidoctor does some html encoding which messes up the conversion
        const input = htmlEscape('wlparam:visual_designer[rcText="Restcomm Visual Designer"]');
        const html = asciidoctor.convert(input);
        expect(html).to.contain(input);
      })
    });
    describe('When extension is registered', () => {
      /*
      it('New format: Should convert link input with default text with default link to a markup using special characters', () => {
        const input = 'wlparam:sps[parmText="visual_designer",rcText="Restcomm Visual Designer\'s",rcLink="https://restcomm.com/#rc_visual_designer_link",defaultText="Visual Designer\'s",defaultLink="https://acme.com/#visual_designer_default_link"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
        console.debug("-- HTML: " + html)
        expect(html).to.contain("<a class=\"replacement-parm\" data-parm-key=\"visual_designer\" href=\"https://restcomm.com/#rc_visual_designer_link\" data-default-text=\"Visual Designer&#8217;s\" data-default-link=\"https://acme.com/#visual_designer_default_link\">Restcomm Visual Designer&#8217;s</a>");
      });
      it('Legacy format: Should convert basic input to span markup', () => {
        const input = 'wlparam:visual_designer[rcText="Restcomm Visual Designer"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
        console.debug("-- HTML: " + html)
        expect(html).to.contain("<span class=\"replacement-parm\" data-parm-key=\"visual_designer\">Restcomm Visual Designer</span>");
      });
      it('Legacy format: Should convert input with default text to span markup', () => {
        const input = 'wlparam:visual_designer[rcText="Restcomm Visual Designer",defaultText="Visual Designer"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline'  });
        console.debug("-- HTML: " + html)
        expect(html).to.contain('<span class="replacement-parm" data-parm-key="visual_designer" data-default-text="Visual Designer">Restcomm Visual Designer</span>');
      });
      it('Legacy format: Should convert link input to a markup', () => {
        const input = 'wlparam:visual_designer[rcText="Restcomm Visual Designer",rcLink="#rc_visual_designer_link"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
        console.debug("-- HTML: " + html)
        expect(html).to.contain('<a class="replacement-parm" data-parm-key="visual_designer" href="#rc_visual_designer_link">Restcomm Visual Designer</a>');
      });
      it('Legacy format: Should convert link input with default text to a markup', () => {
        const input = 'wlparam:visual_designer[rcText="Restcomm Visual Designer",rcLink="#rc_visual_designer_link",defaultText="Visual Designer"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
        console.debug("-- HTML: " + html)
        expect(html).to.contain('<a class="replacement-parm" data-parm-key="visual_designer" href="#rc_visual_designer_link" data-default-text="Visual Designer">Restcomm Visual Designer</a>');
      });
      it('Legacy format: Should convert link input with default text with default link to a markup', () => {
        const input = 'wlparam:visual_designer[rcText="Restcomm Visual Designer",rcLink="#rc_visual_designer_link",defaultText="Visual Designer",defaultLink="#visual_designer_default_link"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
        console.debug("-- HTML: " + html)
        expect(html).to.contain('<a class="replacement-parm" data-parm-key="visual_designer" href="#rc_visual_designer_link" data-default-text="Visual Designer" data-default-link="#visual_designer_default_link">Restcomm Visual Designer</a>');
      });
      it('Legacy format: Should convert link input with default text with default link to a markup using special characters', () => {
        const input = 'wlparam:visual_designer[rcText="Restcomm Visual Designer\'s",rcLink="https://restcomm.com/#rc_visual_designer_link",defaultText="Visual Designer\'s",defaultLink="https://acme.com/#visual_designer_default_link"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
        console.debug("-- HTML: " + html)
        expect(html).to.contain('<a class="replacement-parm" data-parm-key="visual_designer" href="https://restcomm.com/#rc_visual_designer_link" data-default-text="Visual Designer&#8217;s" data-default-link="https://acme.com/#visual_designer_default_link">Restcomm Visual Designer&#8217;s</a>');
      });
      */

      it('SPS text, no link', () => {
        const input = 'wlparam:replace[textMode="sps",parmText="application_name",text="Restcomm",defaultText="$INFER_FROM_DOMAIN"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, {extension_registry: registry, doctype: 'inline'});
        console.debug("-- HTML: " + html)
        expect(html).to.contain("<span class=\"sps-text non-sps-link\" data-parm-text=\"application_name\" data-default-text=\"$INFER_FROM_DOMAIN\">Restcomm</span>");
      });
      it('Sps text, sps link with fallback', () => {
        const input = 'wlparam:replace[textMode="sps",linkMode="sps",parmText="company_name",parmLink="company_link",text="Telestax",link="https://telestax.com",defaultText="$INFER_FROM_DOMAIN",defaultLink="https://default"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, {extension_registry: registry, doctype: 'inline'});
        console.debug("-- HTML: " + html)
        expect(html).to.contain("<a href=\"https://telestax.com\" class=\"sps-text sps-link\" data-parm-text=\"company_name\" data-default-text=\"$INFER_FROM_DOMAIN\" data-parm-link=\"company_link\" data-default-link=\"https://default\">Telestax</a>");
      });
      it('Non sps static text and non sps static link', () => {
        const input = 'wlparam:replace[textMode="non-sps",linkMode="non-sps",text="https://cloud.restcomm.com/restcomm",link="https://cloud.restcomm.com/restcomm"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, {extension_registry: registry, doctype: 'inline'});
        console.debug("-- HTML: " + html)
        expect(html).to.contain("<a href=\"https://cloud.restcomm.com/restcomm\" class=\"non-sps-text non-sps-link\">https://cloud.restcomm.com/restcomm</a>");
      });
      it('Non sps dynamic text and non sps dynamic link', () => {
        const input = 'wlparam:replace[textMode="non-sps",linkMode="non-sps",text="https://$DOMAIN/restcomm",link="https://$DOMAIN/restcomm"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, {extension_registry: registry, doctype: 'inline'});
        console.debug("-- HTML: " + html)
        expect(html).to.contain("<a href=\"https://$DOMAIN/restcomm\" class=\"non-sps-text non-sps-link\">https://$DOMAIN/restcomm</a>");
      });
      it('Non sps static text and SPS link', () => {
        const input = 'wlparam:replace[textMode="non-sps",linkMode="sps",text="Terms and Conditions",parmLink="terms_link",link="https://restcomm.com/terms"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, {extension_registry: registry, doctype: 'inline'});
        console.debug("-- HTML: " + html)
        expect(html).to.contain("<a href=\"https://restcomm.com/terms\" class=\"non-sps-text sps-link\" data-parm-link=\"terms_link\">Terms and Conditions</a>");
      });
      it('Non sps dynamic text', () => {
        const input = 'wlparam:replace[text="https://$DOMAIN/restcomm"]';
        const registry = asciidoctor.Extensions.create();
        asciidoctorWlParams.register(registry);
        const html = asciidoctor.convert(input, {extension_registry: registry, doctype: 'inline'});
        console.debug("-- HTML: " + html)
        expect(html).to.contain("<span class=\"non-sps-text non-sps-link\">https://$DOMAIN/restcomm</span>");
      });

    });
  })
  /*
  describe('Local', () => {
    it('Should convert link default clickable', () => {
      const input = 'wlparam:localLink[text="http://$DOMAIN/visual-designer/"]';
      const registry = asciidoctor.Extensions.create();
      asciidoctorWlParams.register(registry);
      const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
      console.debug("-- HTML: " + html)
      expect(html).to.contain("<a href=\"http://$DOMAIN/visual-designer/\" class=\"local-link\">http://$DOMAIN/visual-designer/</a>");
    });
    it('Should convert link explicit clickable', () => {
      const input = 'wlparam:localLink[text="http://$DOMAIN/visual-designer/",clickable="true"]';
      const registry = asciidoctor.Extensions.create();
      asciidoctorWlParams.register(registry);
      const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
      console.debug("-- HTML: " + html)
      expect(html).to.contain("<a href=\"http://$DOMAIN/visual-designer/\" class=\"local-link\">http://$DOMAIN/visual-designer/</a>");
    });
    it('Should convert link non clickable', () => {
      const input = 'wlparam:localLink[text="http://$DOMAIN/visual-designer/",clickable="false"]';
      const registry = asciidoctor.Extensions.create();
      asciidoctorWlParams.register(registry);
      const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
      console.debug("-- HTML: " + html)
      expect(html).to.contain("<span class=\"local-link\">http://$DOMAIN/visual-designer/</span>");
    });
    it('Should convert domain no http non clickable', () => {
      const input = 'wlparam:localLink[text="$DOMAIN",clickable="false"]';
      const registry = asciidoctor.Extensions.create();
      asciidoctorWlParams.register(registry);
      const html = asciidoctor.convert(input, { extension_registry: registry, doctype: 'inline' });
      console.debug("-- HTML: " + html)
      expect(html).to.contain("<span class=\"local-link\">$DOMAIN</span>");
    });
  })
  */
});
