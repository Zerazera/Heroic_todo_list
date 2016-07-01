"use strict";

var app = angular.module('listApp');

app.filter('editOptionsFilter', function(listService, listItemManagementService) {
  var editOptionsFilter = function(listItems) {
    if (!listItemManagementService.getEditMode()) return listItems;

    var editId = listItemManagementService.getEditId();
    var editFamily = listService.allDescendants(editId).concat(editId);
    return listService.filterOutIds(editFamily);
  }
  return editOptionsFilter;
});

app.filter('optionTitleFilter', ['listService', function(listService) {
  var optionTitleFilter = function(title, itemId) {
    return '\u00A0\u00A0'.repeat(listService.numberOfAncestors(itemId)) + title;
  };
  return optionTitleFilter;
}]);
