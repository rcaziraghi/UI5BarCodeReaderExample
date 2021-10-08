/*global QUnit*/

sap.ui.define([
	"barcodereader/barcodereader/controller/ViewBarCodeReader.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ViewBarCodeReader Controller");

	QUnit.test("I should test the ViewBarCodeReader controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
