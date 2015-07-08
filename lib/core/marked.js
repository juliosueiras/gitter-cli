/**
 * This is an override of marked to be compatible with Blessed tags.
 *
 * It will override all the Renderer methods.
 */

var chalk = require('chalk');
var marked = require('marked');
var pygmentize = require('pygmentize-bundled-cached')
var async = require('async');
var timers = require('timers');

var Renderer = Object.create(marked.Renderer);
// Const declaration.
var ITALIC_COLOR = '#989898';
var test = '2';



// TODO: Dirty Workaround, should removed and seek a better way
Renderer.prototype.highlight = function(code,lang,callback){
        pygmentize({ lang: lang, format: 'terminal' }, code, function (err, result) {
            callback(err,result.toString(), 'finish');
        });
}

// Renderer.prototype.code = function(code,  lang, callback) {
//     Renderer.prototype.highlight(code,lang, function(err, result){
//         if(err) throw err;
//     });
// };
// marked.options.test_code = "1";
// Renderer.prototype.code = function(code, lang) {

//     // TODO: Remove shell syntax check for the future
//     var self = this;
//     self.out = '23';
//     if(lang != 'shell' && lang != 'finish'){
//         Renderer.prototype.highlight(code,lang, function(err,result, lang){
//             if(err) throw err;
//             self.out = Renderer.prototype.code(result,lang);
//         }.bind( { out: self.out} ));
//             return self.out;
//     }else if(lang === 'finish'){
//         return code;
//     } else {
//         return  code;
//     }

//     if (out != null) {
//         code = out;
//     }


//     if (!lang) {
//         return code;
//     }

//     return code;
// };


Renderer.prototype.code =
Renderer.prototype.codespan =
Renderer.prototype.paragraph = function (text) {
  return  text;
};

// Renderer.prototype.blockquote = function(quote) {
//   return '<blockquote>\n' + quote + '</blockquote>\n';
// };
//
// Renderer.prototype.html = function(html) {
//   return html;
// };
//
// Renderer.prototype.heading = function(text, level, raw) {
//   return '<h'
//     + level
//     + ' id="'
//     + this.options.headerPrefix
//     + raw.toLowerCase().replace(/[^\w]+/g, '-')
//     + '">'
//     + text
//     + '</h'
//     + level
//     + '>\n';
// };
//
// Renderer.prototype.hr = function() {
//   return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
// };
//
// Renderer.prototype.list = function(body, ordered) {
//   var type = ordered ? 'ol' : 'ul';
//   return '<' + type + '>\n' + body + '</' + type + '>\n';
// };
//
// Renderer.prototype.listitem = function(text) {
//   return '<li>' + text + '</li>\n';
// };
//
// Renderer.prototype.paragraph = function(text) {
//   return '<p>' + text + '</p>\n';
// };
//
// Renderer.prototype.table = function(header, body) {
//   return '<table>\n'
//     + '<thead>\n'
//     + header
//     + '</thead>\n'
//     + '<tbody>\n'
//     + body
//     + '</tbody>\n'
//     + '</table>\n';
// };
//
// Renderer.prototype.tablerow = function(content) {
//   return '<tr>\n' + content + '</tr>\n';
// };
//
// Renderer.prototype.tablecell = function(content, flags) {
//   var type = flags.header ? 'th' : 'td';
//   var tag = flags.align
//     ? '<' + type + ' style="text-align:' + flags.align + '">'
//     : '<' + type + '>';
//   return tag + content + '</' + type + '>\n';
// };

// span level renderer
Renderer.prototype.strong = function(text) {
  return '{bold}' + text + '{/bold}';
};

Renderer.prototype.em = function(text) {
  return '{' + ITALIC_COLOR + '-fg}*' + text + '*{/' + ITALIC_COLOR + '-fg}';
};

Renderer.prototype.br = function() {
  return '\n';
};

Renderer.prototype.del = function(text) {
  return chalk.strikethrough(text);
};

Renderer.prototype.link = function(href, title, text) {
  return '{underline}' + href + '{/underline}';
};

// Renderer.prototype.image = function(href, title, text) {
//   var out = '<img src="' + href + '" alt="' + text + '"';
//   if (title) {
//     out += ' title="' + title + '"';
//   }
//   out += this.options.xhtml ? '/>' : '>';
//   return out;
// };

Renderer.prototype.mention = function(href, title, text) {
  var screenName = text.charAt(0) === '@' ? text.substring(1) : text;
  // return util.format('<span data-link-type="mention" data-screen-name="%s" class="mention">%s</span>', screenName, text);
  return 'hohohoh' + screenName;
};

marked.Renderer = Renderer;
marked.setOptions({
    highlight: function(code,lang,callback){
        if(lang != "shell"){
            return pygmentize({ lang: lang, format: 'terminal' }, code, function (err, result) {
                callback(err,result.toString());
            })
        } else {
            return callback(code);
        };
    }
});


exports = module.exports = marked;
