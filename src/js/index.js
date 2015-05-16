require('es6-promise').polyfill();
require('whatwg-fetch');

var Delegate = require('dom-delegate').Delegate;
var listItem = require('application-temp');
var moment = require('moment');

(function (ELEMENT) {
    ELEMENT.matches = ELEMENT.matches
        || ELEMENT.msMatchesSelector
        || ELEMENT.mozMatchesSelector
        || ELEMENT.webkitMatchesSelector;

    ELEMENT.closest = ELEMENT.closest || function (selector) {
        var node = this;
        while (node) {
            if (node.matches(selector)) {
                break;
            }
            node = node.parentElement;
        }
        return node;
    };
}(Element.prototype));

var parseHTML = function(str) {
  var tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = str;
  return tmp.body.children[0];
};

var baseurl = 'http://latestayapp.com/';

if (window.location.host === 'latestayapp.com') {
    baseurl = '/';
    console.log('baseurl is ' + '/');
}

var url = baseurl + 'applications/';
var req = fetch(url).then(function (res) {return res.json();});

appsContainer = document.querySelector('ul#applications');

req.then(function (json) {
   json.data.forEach(function (item) {
       var id = item.id;
       item.created = moment(new Date(item.created_at)).fromNow();
       var el = parseHTML(listItem(item));
       appsContainer.appendChild(el);
       el.classList.remove('removed');
   });
});

function approveApplication(evt) {
    var button = this;
    var parent = this.closest('.application');
    var id = parent.dataset.id;
    var actions = parent.querySelector('.actions');
    
    fetch(url + id + '/approve', {method: 'put'})
     .then(function (res) {
        parent.classList.remove('unprocessed');
        parent.classList.add('approved');
        parent.querySelector('.status').innerText = 'Approved';
        parent.querySelector('.action-bar').removeChild(actions);
     });
}

function denyApplication(evt) {
    var button = this;
    var parent = this.closest('.application');
    var id = parent.dataset.id;
    var actions = parent.querySelector('.actions');
    
    fetch(url + id + '/deny', {method: 'put'})
     .then(function (res) {
        parent.classList.remove('unprocessed');
        parent.classList.add('denied');
        parent.querySelector('.status').innerText = 'Denied';
        parent.querySelector('.action-bar').removeChild(actions);
     });
}

function deleteApplication(evt) {
    // console.log(this);
    // var $button = $(this);
    // var $parent = $(this).closest('.application');
    // var id = $parent.data('id');
    // $.ajax({url: url + id, method: 'DELETE'})
    //  .done(function (res) {
    //     var height = $parent.height();
    //     $parent.addClass('removed');
    //     setTimeout(function () {
    //         $parent.remove();
    //     }, 500);
    //  });
    var button = this;
    var parent = this.closest('.application');
    var id = parent.dataset.id;
    var actions = parent.querySelector('.actions');
    
    fetch(url + id, {method: 'delete'})
     .then(function (res) {
        parent.classList.add('removed');
        setTimeout(function () {
            appsContainer.removeChild(parent);
        }, 500);
     });
}

function addApplication(evt) {
    fetch(baseurl + 'addrandom').then(function (res) {return res.json()})
        .then(function (json) {
            var item = json.data;
            var id = item.id;
            item.created = moment(new Date(item.created_at)).fromNow();
            var el = parseHTML(listItem(item));
            console.log(el);
            appsContainer.insertBefore(el, appsContainer.firstChild);
            setTimeout(function () {
                el.classList.remove('removed');
            }, 1);
        });
}

var delegateContainer = new Delegate(appsContainer);
delegateContainer.on('click', 'button.approve', approveApplication);
delegateContainer.on('click', 'button.deny', denyApplication);
delegateContainer.on('click', 'button.delete', deleteApplication);
document.querySelector('#add').addEventListener('click', addApplication);