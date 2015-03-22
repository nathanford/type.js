/*  Type.js
 by Nathan Ford
 @nathan_ford

 FEATURES
 - kerning pairs
 - rag adjust
 - min/max font size
 - widow tamer

 -----------------------------*/

var stylefill = {

  options: {
    externalCSS: false
  },
  properties: {},
  allRules: {},
  sheets: [],
  sheetTexts: {},

  arraySliceShim: function () { // fixes Array.prototype.slice support for IE lt 9
    'use strict';
    var _slice = Array.prototype.slice;

    try {
      _slice.call(document.documentElement);
    }
    catch (e) { // Fails in IE < 9
      Array.prototype.slice = function (begin, end) {

        var i,
          arrayLength = this.length,
          a = [];

        if (this.charAt) {
          for (i = 0; i < arrayLength; i++) {
            a.push(this.charAt(i));
          }
        }
        else {
          for (i = 0; i < this.length; i++) {
            a.push(this[i]);
          }
        }

        return _slice.call(a, begin, end || a.length);
      };
    }
  },

  setOptions: function (params) {
    this.options = params;
  },

  init: function (params) {
    this.properties = params;
    this.arraySliceShim();
    this.getStyleSheets();
  },

  loadStyles: function (count) {
    var sheet = this.sheets[count];

    if (sheet) {
      if (sheet.innerHTML) {
        this.loadCSSinner(sheet, count);
      }
      else if (!stylefill.sheets[sheet.href] && stylefill.options.externalCSS) {
        stylefill.loadFile(sheet.href, count);
      }
      else {
        stylefill.loadStyles(count + 1);
      }
    }
    else {
      stylefill.runSheets();
    }
  },

  loadCSSinner: function (sheet, count) {
    this.sheetTexts['onpage' + count] = sheet.innerHTML;
    this.loadStyles(count + 1);
  },

  loadFile: function (url, count) {
    var req;

    if (window.XMLHttpRequest) {
      req = new XMLHttpRequest();
    }
    else {
      req = new ActiveXObject("Microsoft.XMLHTTP");
    }
	},
	
	options : function (params) {
		
		this.options = params;
	
	},

	init : function (params) {
		
		this.properties = params;
		
		this.arraySliceShim();
				
		this.getStyleSheets();
	
	},
	
	loadStyles : function (count) {
		
		var sheet = this.sheets[count];
		
		if (sheet) {
		
			if (sheet.innerHTML) this.loadCSSinner(sheet, count);
			else if (!stylefill.sheets[sheet.href] && stylefill.options.externalCSS) stylefill.loadFile(sheet.href, count);
			else stylefill.loadStyles(count + 1);
			
		}
		else stylefill.runSheets();
		
	},
	
	loadCSSinner : function(sheet, count) {
		
		this.sheetTexts['onpage' + count] = sheet.innerHTML;
		
		this.loadStyles(count + 1);
		
	},
	
	loadFile : function(url, count) {
	
	    var req;
	
	    if (window.XMLHttpRequest) req = new XMLHttpRequest();
	    else req = new ActiveXObject("Microsoft.XMLHTTP");
	    
	    req.open("GET", url, true);
	    
      req.onreadystatechange = function () {
  
        if (this.readyState === 4 && this.status === 200) {
          stylefill.sheetTexts[url] = this.responseText;
          stylefill.loadStyles(count + 1);
        }
        else if (this.readyState === 4 && this.status === 000) {
          stylefill.loadStyles(count + 1);
        }
      };
  
      req.send(null);
	
	},
	
	getStyleSheets : function (property, func) {
	
		var sheetstext = new Array(),
				stylesheets = Array.prototype.slice.call(document.querySelectorAll('link[href*=".css"]')), // grab stylesheet links - not used yet
				
				styleEles = document.getElementsByTagName('style');
			
		if (styleEles.length > 0) {
			
			for (i in styleEles) {
				
				if (styleEles[i].innerHTML) stylesheets.push(Array.prototype.slice.call(styleEles)[i]); // add on page CSS
			
			}
			
		}
			
		this.sheets = stylesheets;
		
		this.loadStyles(0);
	
	},
	
	runSheets : function () {
		
		for (sheet in this.sheetTexts) {
			for (property in this.properties) {
				
				var sheetext = this.sheetTexts[sheet],
						func = this.properties[property];
				
				this.findRules(property, sheetext, func);
			
			}
		}
		
	},
	
	checkRule : function (property) {
		
		var propertyCamel = property.replace(/(^|-)([a-z])/g, function (m1, m2, m3) { return m3.toUpperCase(); });
		
		if (('Webkit' + propertyCamel) in document.body.style 
		 || ('Moz' + propertyCamel) in document.body.style 
		 || ('O' + propertyCamel) in document.body.style 
		 || property in document.body.style) return true;
	
	},
	
	findRules : function (property, sheettext, func) {
		
		var rules = { support: false };
			
		if (sheettext) {
			
			if (!this.checkRule(property)) { // check if rule is valid now
			
				var selreg = new RegExp('([^}{]+){([^}]+)?' + property.replace('-', '\\-') + '[\\s\\t]*:[\\s\\t]*([^;]+)', 'gi'), 
						selmatch, i = 0;
				
				while (selmatch = selreg.exec(sheettext)) {
		   		
		   		var sel = selmatch[1].replace(/^([\s\n\r\t]+|\/\*.*?\*\/)+/, '').replace(/[\s\n\r\t]+$/, ''),
		   				val = selmatch[3];
		   		
					rules['rule' + i] = {
						
						selector: sel,
						property: property,
						value: val
						
					};
					
					if (!stylefill.allRules[sel]) stylefill.allRules[sel] = new Object();
					stylefill.allRules[sel][property] = val;
					
					i++;
				
				}
			    
			}
			else rules.support = true;
			
			func(rules);
		
		}
		
	},

  getStyleSheets: function (property, func) {

    var sheetstext = [],
      stylesheets = Array.prototype.slice.call(document.querySelectorAll('link[href*=".css"]')), // grab stylesheet links - not used yet
      styleEles = document.getElementsByTagName('style');

    if (styleEles.length > 0) {
      for (var i in styleEles) {
        if (styleEles[i].innerHTML) {
          // add on page CSS
          stylesheets.push(Array.prototype.slice.call(styleEles)[i]);
        }
      }
    }

    this.sheets = stylesheets;
    this.loadStyles(0);
  },

  runSheets: function () {

    for (var sheet in this.sheetTexts) {
      for (var property in this.properties) {

        if (this.sheetTexts.hasOwnProperty(sheet) && this.properties.hasOwnProperty(property)) {
          var sheetText = this.sheetTexts[sheet],
            func = this.properties[property];

          this.findRules(property, sheetText, func);
        }
      }
    }
  },

  checkRule: function (property) {

    var propertyCamel = property.replace(/(^|-)([a-z])/g, function (m1, m2, m3) {
      return m3.toUpperCase();
    });

    if (
      ('Webkit' + propertyCamel) in document.body.style
      || ('Moz' + propertyCamel) in document.body.style
      || ('O' + propertyCamel) in document.body.style
      || property in document.body.style
    ) {
      return true;
    }
  },

  findRules: function (property, sheetText, func) {

    var rules = {
      support: false
    };

    if (sheetText) {
      if (!this.checkRule(property)) { // check if rule is valid now

        var selreg = new RegExp('([^}{]+){([^}]+)?' + property.replace('-', '\\-') + '[\\s\\t]*:[\\s\\t]*([^;]+)', 'gi'),
          selmatch,
          i = 0;

        while (selmatch = selreg.exec(sheetText)) {

          var sel = selmatch[1].replace(/^([\s\n\r\t]+|\/\*.*?\*\/)+/, '').replace(/[\s\n\r\t]+$/, ''),
            val = selmatch[3];

          rules['rule' + i] = {
            selector: sel,
            property: property,
            value: val
          };

          if (!stylefill.allRules[sel]) stylefill.allRules[sel] = {};
          stylefill.allRules[sel][property] = val;

          i++;
        }
      }
      else {
        rules.support = true;
      }

      func(rules);
    }
  }
};

var type = {

  kerningPairs: function (rules) {

    var traverseNodes = function (node, pairs) {
      var next;

      if (node.nodeType === 1) {
        if (node = node.firstChild) {
          do {
            next = node.nextSibling;
            traverseNodes(node, pairs);
          } while (node = next);
        }
      }
      else if (node.nodeType === 3) {
        kernText(node, pairs);
      }
    };

    var kernText = function (node, pairs) {

      var nodetext = node.textContent,
        nodechars = nodetext.split(''),
        parent = node.parentNode,
        pcount = pairs.length;

      while (pcount-- > 0) {

        var pair = pairs[pcount].replace(/^([\s\n\r\t]+|\/\*.*?\*\/)+/, '').replace(/[\s\n\r\t]+$/, ''),
          chars = pair.match(/^(.)(.)\s/i),
          amount = pair.match(/\s(\-*[0-9.]+[a-z]+)$/i)[1],
          ccount = nodechars.length;

        while (ccount-- > 0) {

          var char = nodechars[ccount],
            nextchar = nodechars[ccount + 1],
            charpair = char + nextchar,
            nextcharreg = new RegExp('^(<span[^>]+>)*' + chars[2] + '(<\/\s*span\s*>)*$', 'i');

          if (char === chars[1] && nextchar && nextchar.match(nextcharreg)) {
            nodechars[ccount] = '<span style="letter-spacing:' + amount + '">' + char + '</span>';
          }
        }
      }

      var temp = document.createElement('div');

      temp.innerHTML = nodechars.join('');

      while (temp.firstChild) {
        parent.insertBefore(temp.firstChild, node);
      }

      parent.removeChild(node);
    };

    var kernAll = function () {

      for (var i in rules) {

        if (rules[i] && rules[i] !== 'none') {

          var rule = rules[i],
            eles = document.querySelectorAll(rule.selector),
            elescount = eles.length,
            val = rule.value,
            pairs = val.split(',');

          while (elescount-- > 0) {
            var ele = eles[elescount];
            traverseNodes(ele, pairs);
          }
        }
      }
    };

    window.addEventListener('load', kernAll, false);
  },

  ragAdjust: function (rules) {

    for (var i in rules) {

      var rule = rules[i],
        eles = document.querySelectorAll(rule.selector),
        elescount = eles.length,
        preps = /(\s|^|>)((aboard|about|above|across|after|against|along|amid|among|anti|around|before|behind|below|beneath|beside|besides|between|beyond|concerning|considering|despite|down|during|except|excepting|excluding|following|from|inside|into|like|minus|near|onto|opposite|outside|over|past|plus|regarding|round|save|since|than|that|this|through|toward|towards|under|underneath|unlike|until|upon|versus|with|within|without)\s)+/gi,
        smallwords = /(\s|^)(([a-zA-Z-_(]{1,2}('|’)*[a-zA-Z-_,;]{0,1}?\s)+)/gi, // words with 3 or less characters
        dashes = /([-–—])\s/gi,
        emphasis = /(<(strong|em|b|i|a)[^>]+>)(([^\s]+\s*){2,3})?(<\/(strong|em|b|i|a)>)/gi;

      while (elescount-- > 0) {

        var ele = eles[elescount],
          elehtml = ele.innerHTML;

        if (rule.value === 'prepositions' || rule.value === 'all') {
          // replace prepositions (greater than 3 characters)
          elehtml = elehtml.replace(preps, function (contents, p1, p2) {
            return p1 + p2.replace(/\s/gi, '&#160;');
          });
        }

        if (rule.value === 'small-words' || rule.value === 'all') {
          // replace small words
          elehtml = elehtml.replace(smallwords, function (contents, p1, p2) {
            return p1 + p2.replace(/\s/g, '&#160;');
          });
        }

        if (rule.value === 'dashes' || rule.value === 'all') {
          // replace small words
          elehtml = elehtml.replace(dashes, function (contents) {
            return contents.replace(/\s/g, '&#160;');
          });
        }

        if (rule.value === 'emphasis' || rule.value === 'all') {
          // emphasized text
          elehtml = elehtml.replace(emphasis, function (contents, p1, p2, p3, p4, p5) {
            return p1 + p3.replace(/\s/gi, '&#160;') + p5;
          });
        }

        ele.innerHTML = elehtml;
      }
    }
  },

  maxFontSize: function (rules) {

    for (var i in rules) {

      var rule = rules[i];

      if (rule.value != 'none') {
        type.minMaxFontSize(rule.selector);
      }
    }
  },

  minFontSize: function (rules) {

    for (var i in rules) {
      var rule = rules[i];

      if (rule.value != 'none') {
        type.minMaxFontSize(rule.selector);
      }
    }
  },

  minMaxFontSize: function (selector) {

    var changeSize = function () {

      var eles = document.querySelectorAll(selector),
        elescount = eles.length;

      while (elescount-- > 0) {

        var ele = eles[elescount],
          selRules = stylefill.allRules[selector],
          max = selRules['max-font-size'],
          min = selRules['min-font-size'];

        ele.style.fontSize = '';

        var eleFontSize = parseFloat(window.getComputedStyle(ele, null).getPropertyValue('font-size'));

        if (eleFontSize <= parseFloat(min)) {
          ele.style.fontSize = min;
        }
        else if (eleFontSize >= parseFloat(max)) {
          ele.style.fontSize = max;
        }
      }
    };

    if (selector) {
      changeSize();
      window.addEventListener('resize', changeSize, false);
    }
  },

  widowAdjust: function (rules) {

    var fixMethod = function (method) {
      return method.replace(/-([a-zA-Z])/g, function (m) {
        return m.replace('-', '').toUpperCase();
      });
    };

    var getText = function (ele) {
      return ele.innerText || ele.textContent;
    };

    var setText = function (ele, text) {
      ele.innerHTML = text;
    };

    var runTamer = function (ele, method) {

      // check if more than one line
      if (ele.offsetHeight > type.getStyle(ele, 'line-height', true)) {

        // find a textnode longer than chars
        var nodes = ele.childNodes,
          j = nodes.length - 1,
          c = false,
          countText = getText(ele),
          height = ele.offsetHeight;

        if (countText) {

          // Reset line-heights and font-size for precise measurement
          for (j in nodes) {
            if (nodes[j].innerHTML) {
              nodes[j].style['line-height'] = '1 !important';
            }
          }

          tamer(countText, ele, height, 0, method);
        }
      }
    };

    var tamer = function (text, ele, height, i, method) {

      var origHTML = ele.innerHTML;

      setText(ele, text.slice(0, -14));

      if (ele.offsetHeight < height) {

        if (method === 'nonBreakingSpace') {
          setText(ele, origHTML.replace(/\s([^\s]+)$/, '&#160;$1'));
        }
        else {

          var inc = (method.match('padding')) ? 1 : 5,
            amount = (method.match('padding')) ? (i / 100) : (i / 1000);

          if (method.match('Spacing')) {
            inc = inc * -1;
          }

          if (method.match('padding')) {
            ele.style['boxSizing'] = 'border-box';
          }

          ele.style[method] = amount + 'em';
          setText(ele, origHTML);

          if (i < 500) {
            tamer(text, ele, height, i + inc, method);
          }
        }
      }
      else {
        setText(ele, origHTML);
      }
    };

    var adjustWidows = function () {

      for (var i in rules) {

        var rule = rules[i];

        if (rule) {
          var eles = document.querySelectorAll(rule.selector),
            elescount = eles.length,
            method = fixMethod(rule.value);

          switch (method) {

            case 'paddingRight':
            case 'nonBreakingSpace':
            case 'paddingLeft':
            case 'wordSpacing':
            case 'letterSpacing' :
            case undefined :

              while (elescount-- > 0) {
                runTamer(eles[elescount], method);
              }
              break;

            default :
              console.log('Invalid method. Please use either padding-right, padding-left, word-spacing, or letter-spacing.');
          }
        }
      }
    };

    window.addEventListener('load', adjustWidows, false);
  },

  getStyle: function (ele, style, unit) {

    var ret;

    if (ele.currentStyle) {
      ret = ele.currentStyle[style.replace(/-([A-z])/gi, function (a, b) {
        return b.toUpperCase();
      })];
    }
    else if (window.getComputedStyle) {
      ret = document.defaultView.getComputedStyle(ele, null).getPropertyValue(style);
    }

    if (unit) {
      return parseFloat(ret);
    }
    else {
      return ret;
    }
  }
};

stylefill.setOptions({
  externalCSS: false
});

stylefill.init({

  'max-font-size': type.maxFontSize,
  'min-font-size': type.minFontSize,
  'kerning-pairs': type.kerningPairs,
  'rag-adjust': type.ragAdjust,
  'widow-adjust': type.widowAdjust

});
