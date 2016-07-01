"use strict";

var app = angular.module('listApp');

app.directive('checkAll', function(listService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        if (listService.getListItems().length !== 0) {
          scope.$apply(listService.setAllCompleted());
        };
      });
    }
  };
});

app.directive('toggleCollapseAll', function(listService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        if (listService.getListItems().length !== 0) {
          scope.$apply(listService.toggleCollapseAll());
        };
      });
    }
  };
});

app.directive('toggleHideAllDescriptions', function(listService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        if (listService.getListItems().length !== 0) {
          scope.$apply(listService.toggleHideAllDescriptions());
        };
      });
    }
  };
});

app.directive('removeCompleted', function(listService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        scope.$apply(listService.removeCompletedItems());
      });
    }
  };
});

app.directive('removeAll', function(listService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        scope.$apply(listService.removeAll());
      });
    }
  };
});

app.directive('updateCheck', function(listService) {
  return {
    restrict: 'A',
    scope: {
      itemId: '@'
    },
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        scope.$apply(listService.updateCompleteStatus(scope.itemId));
      });
    }
  };
});

app.directive('toggleCollapsed', function(listService) {
  return {
    restrict: 'A',
    scope: {
      itemId: '@'
    },
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        scope.$apply(listService.toggleCollapsed(scope.itemId));
      });
    }
  };
});

app.directive('toggleHideDescription', function(listService) {
  return {
    restrict: 'A',
    scope: {
      itemId: '@'
    },
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        scope.$apply(listService.toggleHideDescription(scope.itemId));
      });
    }
  };
});

app.directive('removeItem', function(listService, listItemManagementService) {
  return {
    restrict: 'A',
    scope: {
      itemId: '@'
    },
    link: function(scope, element, attrs) {
      element.bind('click', function() {
      scope.$apply(function() {
        listItemManagementService.setEditMode({'editMode' : false, 'saveBool' : false});
        listService.removeItem(scope.itemId);
      });
    });
    }
  };
});

app.directive('scrollToListItem', function($anchorScroll, listItemManagementService) {
  return {
    restrict: 'A',
    scope: {
      itemId : '=ngModel'
    },
    link: function(scope, element, attrs, ngCtrl) {
      element.bind('change', function() {
        scope.$apply(function() {
          $anchorScroll('item' + (listItemManagementService.getEditMode() ? listItemManagementService.getEditId() : scope.itemId));
        });
      });
    }
  };
});

app.directive('filterCheckedStatus', function(listService) {
  return {
    restrict: 'A',
    scope: {
      completedStatus : '=ngModel'
    },
    link: function(scope, element, attrs) {
      element.bind('change', function() {
        scope.$apply(function() {
          var completedStatus = scope.completedStatus;
          if (completedStatus !== '') {
            completedStatus = +completedStatus;
          };
          listService.filterCompleted(completedStatus);
        });
      });
    }
  };
});

app.directive('filterSearchValue', function(listService) {
  return {
    restrict: 'A',
    scope: {
      searchValue : '=ngModel'
    },
    link : function(scope, element, attrs) {
      element.bind('keyup', function() {
        scope.$apply(function() {
          listService.filterTitleAndDescription(scope.searchValue);
        });
      });
    }
  };
});
