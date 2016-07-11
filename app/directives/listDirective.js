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

app.directive('removeCompleted', function(listService, modalService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        scope.$apply(function() {
          var modalinstanceCtrl = modalService.open({title: "Confirm delete operation", body: "Are you sure you want to delete all completed quests?", okText: "OK", cancelText: "Cancel"});
          modalinstanceCtrl.result.then(function() {listService.removeCompletedItems();}, function() {});
        });
      });
    }
  };
});

app.directive('removeAll', function(listService, modalService) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        scope.$apply(function() {
          var modalinstanceCtrl = modalService.open({title: "Confirm delete operation", body: "Are you sure you want to delete all quests?", okText: "OK", cancelText: "Cancel"});
          modalinstanceCtrl.result.then(function() {listService.removeAll();}, function() {});
        });
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

app.directive('removeItem', function(listService, listItemManagementService, modalService) {
  return {
    restrict: 'A',
    scope: {
      itemId: '@'
    },
    link: function(scope, element, attrs) {
      element.bind('click', function() {
      scope.$apply(function() {
        var modalinstanceCtrl = modalService.open({title: "Confirm delete operation", body: "Are you sure you want to delete this quest and its subquests?", okText: "OK", cancelText: "Cancel"});
        modalinstanceCtrl.result.then(function() {
          listItemManagementService.setEditMode({'editMode' : false, 'saveBool' : false});
          listService.removeItem(scope.itemId);
        }, function() {});
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

app.directive('moveListItem', function(listService, $anchorScroll) {
  return {
    restrict: 'A',
    scope: {
      moveDown : '=',
      itemId : '@'
    },
    link : function(scope, element, attrs) {
      element.bind('click', function() {
        scope.$apply(function() {
          element[0].blur();
          listService.setHoveredOn(scope.itemId, false);
          listService.moveItem(scope.itemId, scope.moveDown);
        });
        $anchorScroll('item' + scope.itemId);
      });
    }
  };
});
