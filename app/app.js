"use strict";

var app = angular.module('listApp', ['ui.bootstrap', 'ngStorage', 'ngSanitize', 'ngAnimate']);

app.run(function(listService, listItemManagementService) {
  listService.initialize(); //checks if the listItems have been saved to localStorage. Validates and loads then if they have. Otherwise, creates the localStorage object and populates listItems with a sample.
  listItemManagementService.initialize();
});
