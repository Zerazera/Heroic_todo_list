"use strict";

var app = angular.module('listApp');

app.controller('listController', listController);
//app.controller('removeConfirmationController', removeConfirmationController);
app.controller('modalInstanceCtrl', modalInstanceCtrl);

function listController(listService, listItemManagementService, $scope, $controller, modalService) {

  //var modalViewModal = $scope.$new();
  //$controller('removeConfirmationController', modalViewModal);

  this.showBottomBar = true;

  this.listItems = [];


  $scope.getListItems = listService.getListItems;
  $scope.getFields = listItemManagementService.getFields;
  $scope.getEditMode = listItemManagementService.getEditMode;
  $scope.$watch('getListItems()', function(newValue) {
    this.listItems = newValue;
    listService.saveValues();
  }.bind(this), true);

  $scope.$watch('getFields()', function(newValue) {
    listItemManagementService.saveValues();
  }, true);

  $scope.$watch('getEditMode()', function(newValue) {
    listItemManagementService.saveValues();
  }, true);



  this.allChecked = listService.allCompleted.bind(listService);
  this.allCollapsed = listService.allCollapsed.bind(listService);
  this.allDescriptionsHidden = listService.allDescriptionsHidden.bind(listService);
  this.fullProportionCompleted = listService.fullProportionCompleted.bind(listService);
  this.setHoveredOn = listService.setHoveredOn.bind(listService);
  this.childrenHovered = listService.childrenHovered.bind(listService);
  this.proportionCompleted = listService.proportionCompleted.bind(listService);
  this.numberOfSiblings = listService.numberOfSiblings.bind(listService);
  this.moveItem = listService.moveItem.bind(listService);

  this.getEditMode = listItemManagementService.getEditMode.bind(listItemManagementService);
  this.getEditId = listItemManagementService.getEditId.bind(listItemManagementService);

  this.showForm = listItemManagementService.getEditMode();
  this.filterValue = '';
  this.searchValue = '';

  this.formFields = listItemManagementService.getFields();

  this.showFormWithMainQuestSelected = function(itemId) {
    listItemManagementService.setEditMode({'editMode' : false, 'saveBool' : false});
    this.formFields.parentId = itemId;
    this.showForm = true;
  }

  this.editListItem = function(item) {
    this.setFormFields({'title' : item.title, 'desc' : item.desc, 'parentId' : item.parentId});
    listItemManagementService.setEditMode({'editMode' : true, 'editId' : item.id});
    this.showForm = true;
    this.listForm.$setPristine();
  }

  this.updateFields = function() {
    listItemManagementService.setFields({
      'parentId' : this.formFields.parentId,
      'title' : this.formFields.title !== undefined ? this.formFields.title : '',
      'desc' : this.formFields.desc
    });
  };

  this.hideForm = function() {
    if (listItemManagementService.getEditMode()) {
      this.setFormFields(listItemManagementService.setEditMode({'editMode' : false, 'saveBool' : false}));
    };
    this.showForm = false;
  };

  this.setFormFields = function(fieldObject) {
    ['title', 'desc', 'parentId'].forEach(function(key) {this.formFields[key] = fieldObject[key];}.bind(this));
  };

  this.addOrSaveButton = function() {
    if (listItemManagementService.getEditMode()) {
      this.setFormFields(listItemManagementService.setEditMode({'editMode' : false, 'saveBool' : true}));
      this.listForm.$setPristine();
    }
    else {
      listItemManagementService.saveNewItem();
      this.setFormFields(listItemManagementService.clearNewFields());
      this.listForm.$setPristine();
    };
  }

  this.cancelOrExitButton = function() {
    if (listItemManagementService.getEditMode()) {
      this.setFormFields(listItemManagementService.setEditMode({'editMode' : false, 'saveBool' : false}));
      if (this.formFields.title === '' && this.formFields.desc === '' && this.formFields.parentId === '0') {
        this.listForm.$setPristine();
      };
    }
    else {
      this.setFormFields(listItemManagementService.clearNewFields());
      this.listForm.$setPristine();
    };
  };
};

function modalInstanceCtrl($uibModalInstance, $scope, configObject) {
  this.modalTitle = configObject.title;
  this.modalBody = configObject.body;
  this.okText = configObject.okText;
  this.cancelText = configObject.cancelText;

  this.ok = function () {
  $uibModalInstance.close();
  };

  this.cancel = function () {
    $uibModalInstance.dismiss();
  };
};
