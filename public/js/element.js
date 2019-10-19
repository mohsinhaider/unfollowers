Element.prototype.appendAfter = function (element) {
    element.parentNode.insertBefore(this, element.nextSibling);
}