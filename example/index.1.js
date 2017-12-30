const path = require('path');
const vueToHtml = require('../index');

vueToHtml.registerPartialsDir(path.resolve(__dirname, 'partials'));

const html = vueToHtml.render(`
<div class="root">
    <div v-for="post in posts" class="post">
        <partial:test :post="post" :author="post.author"/>
    </div>  
</div>
`, {
    posts: [
        { title: 'foo', author: 'john' },
        { title: 'bar' },
    ],
    foo: 'foo is also working'
});
console.log(html);