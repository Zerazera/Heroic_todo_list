"use strict";

var app = angular.module('listApp');

app.service('listService', function($localStorage) {
  var _listItems = [];
  var _nextId = 1;
  var _initialized = false;

  this.initialize = function() {
    if (!_initialized) {
      if ($localStorage.listService && $localStorage.listService._listItems) {
        //pull values from local storage if they're there

          _listItems = $localStorage.listService._listItems;
          _setNextId();

          _listItems.forEach(function(listItem) {
            listItem.matchesFilter = true;
            listItem.matchesSearch = true;
            listItem.parentOfMatchedFilter = false;
            listItem.parentOfMatchedSearch = false;
          });

          if (!_validateListItems(_listItems)) {
            alert('Whoa there, adventurer! It appears that nefarious demons may have tampered with your saved quests on local storage. Take heed of this, and if you run into issues clear your local storage for this site and reload the application.');
          };
      }
      else {
        //sample listItems
        $localStorage.listService = {'_listItems' : []};
        this.addItem('First Quest', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent placerat a elit id dignissim.', '0');
        this.addItem('First sub-quest', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent placerat a elit id dignissim.', '1');
        this.addItem('Second sub-quest', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent placerat a elit id dignissim.', '1');
        this.addItem('First sub-quest of sub-quest', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent placerat a elit id dignissim.', '3');
        this.addItem('Second sub-quest of sub-quest', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent placerat a elit id dignissim.', '3');
        this.addItem('Second Quest', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent placerat a elit id dignissim.', '0');
        this.updateCompleteStatus('2');
        this.toggleHideDescription('3');
        this.saveValues();
      };
      _initialized = true;
    };
  };

  var _validateListItems = function(listItems) { //tests listItems from localStorage for data integrity.
    if (angular.isArray(listItems)) {
      var _propertyList = {
        'id' : 'string',
        'title' : 'string',
        'desc' : 'string',
        'parentId' : 'string',
        'childrenIds' : 'object',
        'completed' : 'number',
        'hoveredOn' : 'boolean',
        'collapsed' : 'boolean',
        'hideDescription' : 'boolean',
        'matchesFilter' : 'boolean',
        'matchesSearch' : 'boolean'
      };

      var _getIds = function() {
        return listItems.map(function(listItem) {
          return listItem.id;
        });
      };

      var _objectTest = function() { //tests whether all elements in listItems are objects
        return listItems === [] || listItems.every(function(listItem) {
          return typeof listItem === 'object';
        });
      };

      var _fieldTest = function() { //tests whether the objects in listItems have the correct properties
        return listItems.every(function(listItem) {
          return Object.keys(_propertyList).every(function(property) {
            return listItem.hasOwnProperty(property);
          });
        });
      };

      var _valueTest = function() { //tests the properites for valid values
        return listItems.every(function(listItem) {
          return Object.keys(_propertyList).every(function(property) {
            return typeof listItem[property] === _propertyList[property];
          });
        });
      };

      var _childrenArrayTest = function() { //tests childrenIds property
        return listItems.every(function (listItem) {
          return angular.isArray(listItem.childrenIds) && listItem.childrenIds.every(function(childId) {
            return typeof childId === 'string' && childId !== '' && !isNaN(childId) && +childId > 0;
          });
        });
      };

      var _completedTest = function() { //tests that the completed property is 0, 1 or 2
        return listItems.every(function(listItem) {
          return [0, 1, 2].indexOf(listItem.completed) !== -1;
        });
      };

      var _uniqueIdTest = function() { //tests that each ID is unique && IDs are number strings
        return _allIds.every(function(id) {
          return id !== '' && !isNaN(id) && +id > 0 && _allIds.indexOf(id) === _allIds.lastIndexOf(id);
        });
      };

      var _parentIdValidTest = function() { //tests that all parentId fields are valid IDs
        return listItems.every(function(listItem) {
          return listItem.parentId === '0' || _allIds.indexOf(listItem.parentId) !== -1 && listItem.parentId !== listItem.id;
        });
      };

      var _childrenIdValidTest = function() { //tests that all childrenIds are valid IDs
        return listItems.every(function(listItem) {
          return listItem.childrenIds.length === 0 || listItem.childrenIds.every(function(childId) {
            return _allIds.indexOf(childId) !== -1 && childId !== listItem.id;
          });
        });
      };

      var _parentChildTest = function() { //tests that each item's parent has that item's ID in its childrenIds array
        return listItems.every(function(listItem) {
          if (listItem.parentId !== '0') {
            var _parent = _findListItem(listItem.parentId);
            return _parent.childrenIds.indexOf(listItem.id) !== -1;
          }
          else {
            return true;
          };
        });
      };

      var _childParentTest = function() { //tests that each item's child has that item's ID as its parentId
        return listItems.every(function(listItem) {
          if (listItem.childrenIds.length !== 0) {
            return listItem.childrenIds.every(function(childId) {
              var _childItem = _findListItem(childId);
              return _childItem.parentId === listItem.id;
            });
          }
          else {
            return true;
          };
        });
      };

      var _childIdTest = function() { //tests that each childId is only represented once
        var _childIds = [];
        listItems.forEach(function(listItem) {
          _childIds = _childIds.concat(listItem.childrenIds);
        });

        return _childIds.every(function(childId) {
          return _childIds.indexOf(childId) === _childIds.lastIndexOf(childId);
        });
      };

      var _findListItemIndex = function(itemId) {
        var _equalsId = function(listItem) {return listItem.id === itemId;};
        return listItems.findIndex(_equalsId);
      };

      var _findListItem = function(itemId) {
        return listItems[_findListItemIndex(itemId)];
      };

      var _childCompletedTest = function() {
        return listItems.every(function(listItem) {
          if ([0, 2].indexOf(listItem.completed) !== -1) {
            return listItem.childrenIds.every(function(childId) {
              var _childItem = _findListItem(childId);
              return _childItem.completed === listItem.completed;
              });
            }
            else {//listItem.completed === 1
              return listItem.childrenIds.length !== 0 && ((listItem.childrenIds.some(function(childId) {
                var _childItem = _findListItem(childId);
                return _childItem.completed === 1;
              })) || (listItem.childrenIds.some(function(childId) {
                var _childItem = _findListItem(childId);
                return _childItem.completed === 2;
              }) && listItem.childrenIds.some(function(childId) {
                var _childItem = _findListItem(childId);
                return _childItem.completed === 0;
              })));
            };
          });
        };

        var _allAncestors = function(itemId) {
          var _ancestorArray = [];
          var _item = _findListItem(itemId);

          while (_item.parentId !== '0') {
            _ancestorArray.push(_item.parentId);
            _item = _findListItem(_item.parentId);
          };
          return _ancestorArray;
        };

        var _allDescendants = function(itemId) {
          var _childrenArray = [];
          var _item = _findListItem(itemId);

          var sortListItems = function(childId) {
            _childrenArray.push(childId);
            var _child = _findListItem(childId);
            _child.childrenIds.forEach(sortListItems);
          };

          _item.childrenIds.forEach(sortListItems);
          return _childrenArray;
        };

        var _parentNotInDescendantsCheck = function() {
          return listItems.every(function(listItem) {
            if (listItem.parentId !== '0') {
              var _childrenIds = _allDescendants(listItem.id);
              return _childrenIds.every(function(childId) {
                return childId !== listItem.id;
              });
            }
            else {
              return true;
            };
          });
        };

        var _childrenNotInAncestorsCheck = function() {
          return listItems.every(function(listItem) {
            if (listItem.childrenIds.length !== 0) {
              var _parentIds = _allAncestors(listItem.id);
              return _parentIds.every(function(parentId) {
                return parentId !== listItem.id;
              });
            }
            else {
              return true;
            };
          });
        };

      var _allIds = _getIds();
      //return _childParentTest();

      if (_objectTest() && _fieldTest() && _valueTest() && _completedTest()) {
          var _allIds = _getIds();
          return _uniqueIdTest() && _parentIdValidTest() && _childrenIdValidTest() && _parentChildTest() && _childParentTest() &&
          _childIdTest() && _childCompletedTest() && _parentNotInDescendantsCheck() && _childrenNotInAncestorsCheck();
      }
      else {
        return false;
      };
    }
    else {
      return false;
    };
  };


  this.saveValues = function() {
    $localStorage.listService._listItems = _listItems;
  };

  var _setNextId = function() {
    var _curId = 1;
    while (_findListItemIndex('' + _curId) !== -1) {
      _curId++;
    };
    _nextId = _curId;
  };

  this.addItem = function(title, desc, parentId) {
    var _newItem = {
      'id' : '' + _nextId,
      'title' : title,
      'desc' : desc,
      'parentId' : parentId,
      'childrenIds' : [],
      'completed' : 0,
      'hoveredOn' : false,
      'collapsed' : false,
      'hideDescription' : false,
      'matchesFilter' : true,
      'matchesSearch' : true,
      'parentOfMatchedFilter' : false,
      'parentOfMatchedSearch' : false
    };

    _listItems.push(_newItem);
    _updateParent(_newItem);
    if (_newItem.parentId !== '0') {
      _updateParentCompletedStatus(_newItem.parentId);
    };
    _setNextId();
  };

  this.editItem = function(editId, title, desc, parentId) {
    var _editItem = this.findListItem(editId);

    _editItem.title = title;
    _editItem.desc = desc;
    _editItem.parentId = parentId;
    _updateParent(_editItem);
    if (_editItem.parentId !== '0') {
      _updateParentCompletedStatus(_editItem.parentId);
    };
  }.bind(this);

  this.numberOfAncestors = function(itemId) {
    var _item = this.findListItem(itemId);
    var totalLevels = 0;

    while (_item.parentId !== '0') {
      totalLevels++;
      _item = this.findListItem(_item.parentId);
    };

    return totalLevels;
  };

  this.getListItems = function() {
    _sortListItems.bind(this);
    return _listItems;
  };

  this.toggleHideDescription = function(itemId) {
    var _item = this.findListItem(itemId);
    _item.hideDescription = !_item.hideDescription;
  };

  this.allDescriptionsHidden = function() {
    return _listItems.every(function(listItem) {return listItem.hideDescription;});
  };

  this.toggleHideAllDescriptions = function() {
    var _hideDescriptionValue = this.allDescriptionsHidden();
    _listItems.forEach(function(listItem) {listItem.hideDescription = !_hideDescriptionValue;});
  };

  var _findListItemIndex = function(itemId) {
    var _equalsId = function(listItem) {return listItem.id === itemId;};
    return _listItems.findIndex(_equalsId);
  };

  this.findListItem = function(itemId) {
    return _listItems[_findListItemIndex(itemId)];
  };

  this.validListItem = function(itemId) {
    return _findListItemIndex(itemId) !== -1;
  };

  this.setHoveredOn = function(itemId, bool) {
    var _item = this.findListItem(itemId);
    _item.hoveredOn = bool;
  };

  this.childrenHovered = function(itemId) {
    var _item = this.findListItem(itemId);

    if (_item.childrenIds.length === 0) {
      return false;
    };

    var childIsHovered = function(childId) {
      var _childItem = this.findListItem(childId);
      return this.findListItem(childId).hoveredOn;
    };

    return _item.childrenIds.some(childIsHovered.bind(this));
  };

  var _updateParent = function(childItem) {
    var _childParent = childItem.parentId;

    if (_childParent !== '0') {
      var _parentItem = this.findListItem(_childParent);
    };

    var _removeChild = function(listItem) {
      var _childIndex = listItem.childrenIds.indexOf(childItem.id);
      if (_childIndex !== -1 && (_childParent === '0' || listItem.id !== _parentItem.id)) {
        listItem.childrenIds.splice(_childIndex, 1);
      };
    };

    if (_childParent !== '0' && _parentItem.childrenIds.indexOf(childItem.id) === -1) {
      _parentItem.childrenIds.push(childItem.id);
    };

    _listItems.forEach(_removeChild);
  }.bind(this);

  this.removeItem = function(itemId) {
    var _item = this.findListItem(itemId);
    var _itemIndex = _findListItemIndex(itemId);
    var _parentId = _item.parentId;

    if (_item.childrenIds.length !== 0) {
      _item.childrenIds.forEach(this.removeItem.bind(this));
    };

    _listItems.splice(_itemIndex, 1);

    if (_parentId !== '0') {
      var _parentItem = this.findListItem(_parentId);
      _parentItem.childrenIds.splice(_parentItem.childrenIds.indexOf(itemId), 1);
      _updateParentCompletedStatus(_parentId);
    };
    _setNextId();
  };

  this.removeAll = function() {
    _listItems = [];
    _nextId = 1;
  };

  this.updateCompleteStatus = function(itemId) {
    var _item = this.findListItem(itemId);
    _item.completed = [2, 2, 0][_item.completed];

    if (_item.parentId !== '0') {
      _updateParentCompletedStatus(_item.parentId);
    };

    if (_item.childrenIds.length !== 0) {
      _updateChildrenCompletedStatus(_item.childrenIds, _item.completed);
    };
  }.bind(this);

  var _updateParentCompletedStatus = function(parentId) {
    var _parentItem = this.findListItem(parentId);

    if (_parentItem.childrenIds.length !== 0) {
      var _childrenItems = _parentItem.childrenIds.map(function(childId){return this.findListItem(childId);}.bind(this));

      if (_childrenItems.every(function(item) {return item.completed === 2;})) {
        _parentItem.completed = 2;
      }

      else if (_childrenItems.some(function(item) {return [1, 2].indexOf(item.completed) !== -1;})) {
        _parentItem.completed = 1;
      }

      else {
        _parentItem.completed = 0;
      };
    };

    if (_parentItem.parentId !== '0') {
      _updateParentCompletedStatus(_parentItem.parentId);
    };

  }.bind(this);

  var _updateChildrenCompletedStatus = function(childrenArray, completedStatus) {
    var _childrenItems = childrenArray.map(function(childId) {return this.findListItem(childId);}.bind(this));
    _childrenItems.forEach(function(item) {
      item.completed = completedStatus;
      if (item.childrenIds.length !== 0) _updateChildrenCompletedStatus(item.childrenIds, completedStatus);
    });
  }.bind(this);

  this.allCompleted = function() {
    return _listItems.filter(function(listItem) {return listItem.parentId === '0';}).every(function(listItem) {return listItem.completed === 2;});
  };

  this.setAllCompleted =  function() {
    var _completedValue = this.allCompleted() ? 0 : 2;
    _listItems.forEach(function(listItem) {listItem.completed = _completedValue;})
  }.bind(this);

  this.removeCompletedItems = function() {
    var _allIds = _listItems.map(function(listItem) {return listItem.id;});
    _allIds.forEach(function(itemId) {
      if (_findListItemIndex(itemId) !== -1) {
        var _item = this.findListItem(itemId);
        if (_item.completed === 2) {
          this.removeItem(itemId);
        };
      };
    }.bind(this));
    _setNextId();
  };

  this.proportionCompleted = function(itemId) {
    var _item = this.findListItem(itemId);

    if (_item.completed === 1) {
      var _relativeWeight = 1 / _item.childrenIds.length, _sum = 0;
      _item.childrenIds.forEach(function(childId) { _sum += _relativeWeight * this.proportionCompleted(childId);}.bind(this));
      return _sum;
    }

    else {
      return _item.completed === 2 ? 1 : 0;
    };
  };

  this.fullProportionCompleted = function() {
    var _parentItems = _listItems.filter(function(listItem) {return listItem.parentId === '0';});
    var _relativeWeight = 1 / _parentItems.length, _sum = 0;
    _parentItems.forEach(function(listItem) {_sum += _relativeWeight * this.proportionCompleted(listItem.id);}.bind(this));
    return _sum;
  }.bind(this);


  this.toggleCollapsed = function(itemId) {
    var _item = this.findListItem(itemId);
    if (_item.childrenIds.length !== 0) {
      _item.collapsed = !_item.collapsed;
    };
  };

  this.allCollapsed = function() {
    return _listItems.filter(function(listItem) {return listItem.childrenIds.length !== 0;}).every(function(listItem) {return listItem.collapsed;});
  };

  this.toggleCollapseAll = function() {
    var _collapseValue = this.allCollapsed();
    _listItems.filter(function(listItem) {return listItem.childrenIds.length !==0;}).forEach(function(listItem) {listItem.collapsed = !_collapseValue;});
  };

  var _setAllListItems = function(property, value) {
      _listItems.forEach(function(listItem) {listItem[property] = value;});
  };

  var _allAncestors = function(itemId) {
    var _ancestorArray = [];
    var _item = this.findListItem(itemId);

    while (_item.parentId !== '0') {
      _ancestorArray.push(_item.parentId);
      _item = this.findListItem(_item.parentId);
    };
    return _ancestorArray;
  }.bind(this);

  this.allDescendants = function(itemId) {
    var _childrenArray = [];
    var _item = this.findListItem(itemId);

    var _childListIds = function(childId) {
      _childrenArray.push(childId);
      var _child = this.findListItem(childId);
      _child.childrenIds.forEach(_childListIds);
    }.bind(this);

    _item.childrenIds.forEach(_childListIds);
    return _childrenArray;
  };

  var _sortListItems = function() {
    var _parentItems = _parentListItems();

    var _sortOrder = [];

    _parentItems.forEach(function(parentItem) {
      _sortOrder.push(parentItem.id);
      _sortOrder.concat(this.allDescendants(parentItem.id));
    }).bind(this);

    _listItems = _listItems.sort(function(listItem1, listItem2) {return _sortOrder.indexOf(listItem1.id) - _sortOrder.indexOf(listItem2.id);});
  };

  this.filterCompleted = function(completedValue) {
    var _filteredItems = [], _showItems = [], _ancestorArray = [], _parentItems = [];
    if (completedValue === '') {
      _setAllListItems('matchesFilter', true);
      _setAllListItems('parentOfMatchedFilter', false);
    }
    else {
      _setAllListItems('matchesFilter', false);
      _setAllListItems('parentOfMatchedFilter', false);
      _filteredItems = _listItems.filter(function(listItem) {return listItem.completed === completedValue;}).map(function(listItem) {return listItem.id;});
      _showItems = _filteredItems;

      _filteredItems.forEach(function(itemId) {
        _allAncestors(itemId).forEach(function(ancestorId) {
          if (_showItems.indexOf(ancestorId) === -1) {
            _showItems.push(ancestorId);
            _parentItems.push(ancestorId);
          };
        });
      });

      _listItems.forEach(function(listItem) {listItem.matchesFilter = _showItems.indexOf(listItem.id) !== -1; listItem.parentOfMatchedFilter = _parentItems.indexOf(listItem.id) !== -1;});
    };
  };

  this.filterTitleAndDescription = function(searchValue) {
    var _matchedItems = [], _showItems = [], _ancestorArray = [], _searchString = '', _parentItems = [];
    var _searchValueArr = searchValue.split(/[^A-Za-z0-9]/);
    _searchValueArr.forEach(function(searchVal) {
      _searchString += '(?=.*' + searchVal + ')';
    });

    var _re = new RegExp(_searchString, 'gi');

    if (searchValue === '') {
      _setAllListItems('matchesSearch', true);
      _setAllListItems('parentOfMatchedSearch', false);
    }
    else {
      _setAllListItems('matchesSearch', false);
      _setAllListItems('parentOfMatchedFilter', false);
      _matchedItems = _listItems.filter(function(listItem) {return listItem.title.match(_re) !== null || listItem.desc.match(_re) !== null;}).map(function(listItem) {return listItem.id;});
      _showItems = _matchedItems;

      _matchedItems.forEach(function(itemId) {
        _allAncestors(itemId).forEach(function(ancestorId) {
          if (_showItems.indexOf(ancestorId) === -1) {
            _showItems.push(ancestorId);
            _parentItems.push(ancestorId);
          };
        });
      });

      _listItems.forEach(function(listItem) {listItem.matchesSearch = _showItems.indexOf(listItem.id) !== -1; listItem.parentOfMatchedSearch = _parentItems.indexOf(listItem.id) !== -1;});
    };
  };

  this.filterOutIds = function(itemArr) {
    return _listItems.filter(function(listItem) {return itemArr.indexOf(listItem.id) === -1;});
  };

  var _parentListItems = function() {
    return _listItems.filter(function(listItem) {return listItem.parentId === '0';});
  };
});

app.service('listItemManagementService', function(listService, $localStorage) {
  var _editMode = false;

  var _new = {
        'title' : '',
        'desc' : '',
        'parentId' : '0'
  };

  var _edit = {
        'id' : '',
        'title' : '',
        'desc' : '',
        'parentId' : '0',
        'originalTitle' : '',
        'originalDesc' : '',
        'originalParentId' : ''
  };

  this.initialize = function() {
    if ($localStorage.listItemManagementService) {
      if (!_validateValues($localStorage.listItemManagementService._new, $localStorage.listItemManagementService._edit, $localStorage.listItemManagementService._editMode)) {
        alert('Whoa there, adventurer! It appears that nefarious demons may have tampered with your saved new/editing list items on local storage. Take heed of this, and if you run into issues clear your local storage for this site and reload the application.');
      };

      if ($localStorage.listItemManagementService._editMode && typeof $localStorage.listItemManagementService._editMode === 'boolean') {
        _editMode = $localStorage.listItemManagementService._editMode;
      }

      else {
        $localStorage.listItemManagementService._editMode = _editMode;
      };

      if ($localStorage.listItemManagementService._new && typeof $localStorage.listItemManagementService._new === 'object') {
        _new.title = $localStorage.listItemManagementService._new.title;
        _new.desc = $localStorage.listItemManagementService._new.desc;
        _new.parentId = $localStorage.listItemManagementService._new.parentId;
      }

      else {
        $localStorage.listItemManagementService._new = _new;
      };

      if ($localStorage.listItemManagementService._edit && typeof $localStorage.listItemManagementService._edit === 'object') {
        _edit.id = $localStorage.listItemManagementService._edit.id;
        _edit.title = $localStorage.listItemManagementService._edit.title;
        _edit.desc = $localStorage.listItemManagementService._edit.desc;
        _edit.parentId = $localStorage.listItemManagementService._edit.parentId;
        _edit.originalTitle = $localStorage.listItemManagementService._edit.originalTitle;
        _edit.originalDesc = $localStorage.listItemManagementService._edit.originalDesc;
        _edit.originalParentId = $localStorage.listItemManagementService._edit.originalParentId;
      }

      else {
        $localStorage.listItemManagementService._edit = _edit;
      };
    }

    else {
      $localStorage.listItemManagementService = {
        '_editMode' : _editMode,
        '_new' : _new,
        '_edit' : _edit
      };
    };
  };

  var _validateValues = function(newObject, editObject, editMode) {
    var _newFields = {
          'parentId' : 'string',
          'title' : 'string',
          'desc' : 'string'
    };

    var _editFields = {
          'id' : 'string',
          'title' : 'string',
          'desc' : 'string',
          'parentId' : 'string',
          'originalTitle' : 'string',
          'originalDesc' : 'string',
          'originalParentId' : 'string'
    };

    if (typeof newObject === 'object' && typeof editObject === 'object' && typeof editMode === 'boolean') {

      var _newFieldTest = function() {
        return Object.keys(_newFields).every(function(property) {
          return newObject.hasOwnProperty(property) && typeof newObject[property] === _newFields[property];
        });
      };

      var _editFieldTest = function() {
        return Object.keys(_editFields).every(function(property){
        return editObject.hasOwnProperty(property) && typeof editObject[property] === _editFields[property];
        });
      };

      var _idCheck = function() {
        return (newObject.parentId === '0' || listService.validListItem(newObject.parentId)) && (editObject.id === '' || editObject.id === '0' || listService.validListItem(editObject.id)) &&
        (editObject.parentId === '' || editObject.parentId === '0' || listService.validListItem(editObject.parentId)) && (editObject.originalParentId === '' || editObject.originalParentId === '0'|| listService(editObject.originalParentId));
      };

      var _editModeTest = function() {
        if (_editMode) {
          return editObject.originalTitle !== '' && editObject.id !== '' && editObject.originalParentId !== '';
        }
        else {
          return true;
        };
      };

      return _newFieldTest() && _editFieldTest() && _idCheck() && _editModeTest();
    }

    else {
      return false;
    };
  }

      this.saveValues = function() {
        $localStorage.listItemManagementService._editMode = _editMode;
        $localStorage.listItemManagementService._new = _new;
        $localStorage.listItemManagementService._edit = _edit;
      };

    this.setEditMode = function(argumentObject) {
      var _bool = argumentObject.editMode;
      var _editId = argumentObject.editId;
      var _saveBool = argumentObject.saveBool;

      if (_bool) {
        if (_editMode) {
          this.setEditMode({'editMode' : false, 'saveBool' : false});
        };

        _editMode = _bool;
        return _enterEditMode(_editId);
      }

      else if (_editMode !== _bool) {
        _editMode = _bool;
        return _exitEditMode(_saveBool);
      };
    };

    this.saveNewItem = function() {
      listService.addItem(_new.title, _new.desc, _new.parentId);
      _new.title = '';
      _new.desc = '';
      _new.parentId = '0';
      return _new;
    };

    var _enterEditMode = function(editId) {
      var _editItem = listService.findListItem(editId);
      _edit.id = editId;
      _edit.title = _editItem.title;
      _edit.originalTitle = _editItem.title;
      _edit.desc = _editItem.desc;
      _edit.originalDesc = _editItem.desc;
      _edit.parentId = _editItem.parentId;
      _edit.originalParentId = _editItem.parentId;

      return this.getFields();
    }.bind(this);

    var _exitEditMode = function(saveBool) {
      if (!saveBool) {
        listService.editItem(_edit.id, _edit.originalTitle, _edit.originalDesc, _edit.originalParentId);
      };
        _clearEditFields();

      return this.getFields();
    }.bind(this);

    this.getFields = function() {
      return {
        'parentId' : _editMode ? _edit.parentId : _new.parentId,
        'title' : _editMode ? _edit.title : _new.title,
        'desc' : _editMode ? _edit.desc : _new.desc
      };
    };

    this.setFields = function(fieldObject) {
      if (_editMode) {
        _edit.parentId = fieldObject.parentId;
        _edit.title = fieldObject.title;
        _edit.desc = fieldObject.desc;
        listService.editItem(_edit.id, _edit.title, _edit.desc, _edit.parentId);
      }
      else {
        _new.parentId = fieldObject.parentId;
        _new.title = fieldObject.title;
        _new.desc = fieldObject.desc;
      };
    };

    this.getEditMode = function() {
      return _editMode;
    };

    this.getEditId = function() {
      if (_editMode) {
        return _edit.id;
      };
    };

    this.clearNewFields = function() {
      _new.title = '';
      _new.desc = '';
      _new.parentId = '0';
      return _new;
    };

    var _clearEditFields = function() {
      _edit.id = '0';
      _edit.title = '';
      _edit.desc = '';
      _edit.parentId = '0';
      _edit.originalTitle = '';
      _edit.originalDesc = '';
      _edit.originalParentId = '0';
    };
  });
