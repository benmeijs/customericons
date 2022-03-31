sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("f4wCustomerIcons.controller.Icons", {
		onInit: function() {

			this.getView().setModel(this.getOwnerComponent().getModel());
			var oModel = this.getView().getModel();

			var sPath = "/partnerSet(partnerId='" + this.getURLParameter("partnerId") + "')/toIcons";
			oModel.read(sPath, {
				success: function(oData, response) {
					// combine icons from one group together
					var currentGroup = 0;
					var oHlLayout = this.getView().byId("idHlIcons");
					if (oData.results.length >= 1) {
						for(var currentIconCount = 0; currentIconCount < oData.results.length; currentIconCount++ ){
							var oListIcon = oData.results[currentIconCount];
							if( currentGroup !== oListIcon.group ){
								currentGroup = oListIcon.group;
								var oHlGroupLayout = new sap.ui.layout.HorizontalLayout({
								id: "idHl" + (currentGroup)
								});
								oHlLayout.addContent(oHlGroupLayout);
							}
							var oIcon = new sap.ui.core.Icon({
									id: "idIcon" + (currentIconCount),
									src: oListIcon.source,
									size: oListIcon.size + "px",
									color: oListIcon.color,
									tooltip: oListIcon.tooltip
								});
								oIcon.addStyleClass("sapUiTinyMargin");
								var oNumber = new sap.m.ObjectNumber({
									id: "idIconNumber" + (currentIconCount),
									number: oListIcon.numberInt,
									unit: oListIcon.numberUnit,
									visible: oListIcon.showNumber
								});
								var aItems = [oIcon, oNumber];
								// Size of the flexbox is the size of an icon + 28 px to align all icons
								var oFlexBox = new sap.m.FlexBox({
									id: "idFbIcon" + (currentIconCount),
									width: (parseInt(oListIcon.size, 10) + 28) + "px",
									items: aItems
								});
								oHlGroupLayout.addContent(oFlexBox);							
						}
					}
				}.bind(this),
				error: function(oError) {
					var oHlLayout = this.getView().byId("idHlIcons");
					var sText = "";
					if (oError.responseText.error && JSON.parse(oError.responseText).error.message.value) {
						sText = JSON.parse(oError.responseText).error.message.value;
					} else {
						sText = oError.message;
					}
					var oIcon = new sap.ui.core.Icon({
						id: "idIconError",
						color: "Negative",
						src: "sap-icon://alert"
					});
					oHlLayout.addContent(oIcon);
					var oText = new sap.m.Text({
						id: "idTxtError",
						text: sText
					});
					oHlLayout.addContent(oText);

				}.bind(this)
			});
		},
		getURLParameter: function(sName) {
			return decodeURIComponent((new RegExp('[?|&]' + sName + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(
				/\+/g, '%20')) || null;
		}
	});
});