"use strict";

var app = angular.module('listApp');

app.filter('editOptionsFilter', function(listService, listItemManagementService) {
  var editOptionsFilter = function(listItems) {
    if (!listItemManagementService.getEditMode()) {
      return listItems;
    };

    var editId = listItemManagementService.getEditId();
    var editFamily = listService.allDescendants(editId).concat(editId);
    return listService.filterOutIds(editFamily);
  };
  return editOptionsFilter;
});

app.filter('optionTitleFilter', function(listService) {
  var optionTitleFilter = function(title, itemId) {
    return '\u00A0\u00A0'.repeat(listService.numberOfAncestors(itemId)) + title;
  };
  return optionTitleFilter;
});

app.filter('removeTagsFilter', function() {
  var removeTagsFilter = function(unfilteredText) {
    return unfilteredText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };
  return removeTagsFilter;
});

app.filter('matchedSearchFilter', function() {
  var matchedSearchFilter = function(textToMatch, searchValue) {
    searchValue = searchValue.replace(/\\/g,'').replace(/\s$/,'');
    if (searchValue === '') {
      return textToMatch;
    };

    var _searchString = searchValue.split(/\s/g).join('|');

    var _re = new RegExp(_searchString, 'gi');

    return textToMatch.replace(_re, '<span class="white-background">$&</span>');
  };
  return matchedSearchFilter;
});
