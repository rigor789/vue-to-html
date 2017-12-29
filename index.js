require('jsdom-global')();
const Vue = require('vue/dist/vue.common');
const pretty = require('pretty');
const fs = require('fs');
const path = require('path');

Vue.config.silent = true;
Vue.config.productionTip = false;

let CURRENT_DATA;

function registerPartialsDir(dir) {
  const partials = fs.readdirSync(dir);

  partials.forEach((partial) => {
    const name = partial.replace(path.extname(partial), '');

    Vue.component(`partial:${name}`, {
      template: fs.readFileSync(path.resolve(dir, partial)).toString(),
      created() {
        Object.assign(this, CURRENT_DATA);
        Object.assign(this, this.$attrs)
      },
      mounted() {
        Object.keys(this.$attrs).forEach(attr => this.$el.removeAttribute(attr))
      }
    });
  })
}

function makeApp(template) {
  const app = new Vue({
    template,
    created() {
      Object.assign(this, CURRENT_DATA);
    }
  });
  return app.$mount(document.createElement('div'));
}


function renderToHTML(templateString, data) {
  CURRENT_DATA = data;

  const doctype = pretty(templateString, {ocd: true}).split('\n')[0];
  let renderedHTML = makeApp(templateString).$el.outerHTML;
  renderedHTML = pretty(renderedHTML, {ocd: true});

  if (doctype.indexOf('doctype') !== -1) {
    renderedHTML = doctype + '\n' + renderedHTML;
  }

  return renderedHTML;
};

module.exports = {
  render: renderToHTML,
  registerPartialsDir: registerPartialsDir
};