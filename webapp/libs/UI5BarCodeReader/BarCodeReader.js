sap.ui.define([
    "sap/ui/core/Control",
    "./quagga/quagga.min",
    "./models",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/Input",
    "sap/m/FlexBox",
    "sap/m/FlexAlignItems",
    "sap/m/FlexJustifyContent",
    "sap/m/FlexItemData",
    "sap/ui/core/HTML"
], function (Control, QuaggaJS, Models, Button, Dialog, Input, FlexBox, FlexAlignItems, FlexJustifyContent, FlexItemData, coreHTML) {
    "use strict"; 

    let DEFAULT_CLOSE = Models.getText("DEFAULT_CLOSE"),
        BARCODE_TITLE = Models.getText("BARCODE_TITLE"),
        BARCODE_CHANGE_CAMERA = Models.getText("BARCODE_CHANGE_CAMERA"),
        BARCODE_INPUT_PLACEHOLDER = Models.getText("BARCODE_INPUT_PLACEHOLDER"),
        BARCODE_OPEN_DIALOG_TEXT = Models.getText("BARCODE_OPEN_DIALOG_TEXT")
        ;

    return Control.extend("UI5BarCodeReader", {
        metadata: {

            properties: {

                /* Titulo */
                title: { type: "string", defaultValue: BARCODE_TITLE },
                /* Botão de Fechar */
                closeText: { type: "string", defaultValue: DEFAULT_CLOSE },
                closeIcon: { type: "sap.ui.core.URI", defaultValue: "" },
                /* Botão de Trocar Câmera */
                changeCameraText: { type: "string", defaultValue: BARCODE_CHANGE_CAMERA },
                changeCameraIcon: { type: "sap.ui.core.URI", defaultValue: "sap-icon://camera" },
                /* Input de Chave */
                inputPlaceholder: { type: "string", defaultValue: BARCODE_INPUT_PLACEHOLDER },
                value: { type: "string", defaultValue: "" },
                /* Botão para abrir o Dialog */
                openDialogText: { type: "string", defaultValue: BARCODE_OPEN_DIALOG_TEXT },
                showDialogText: { type: "boolean", defaultValue: false },
                openDialogIcon: { type: "sap.ui.core.URI", defaultValue: "sap-icon://bar-code" },
                openDialogWidth: { type: "sap.ui.core.CSSSize", defaultValue: "10rem" },
                /* Fechar ao detectar */
                closeOnDetect: { type: "boolean", defaultValue: false },
                showInput: { type: "boolean", defaultValue: true },
                readersDecoder: { type: "array", defaultValue: ["code_128_reader"] },
                locate: { type: "boolean", defaultValue: false }

            },
            aggregations: {

            },
            events: {
                submit: {
                    parameters: {
                        value: { type: "object" }
                    }
                },
                detect: {
                    parameters: {
                        value: { type: "object" }
                    }
                }
            }

        },

        setValue: function (sText) {

            this.setProperty("value", sText, false);
            this.oInput.setValue(sText);

            return this;
        },

        getValue: function () {

            return this.getProperty("value");

        },

        openDialog: function (oEve) {
            if (this._oScanDialog) {
                this._oScanDialog.open();
            } else {
                this._createDialogAndContent();
            }
        },

        closeDialog: function () {
            if (this._oScanDialog) {
                this._oScanDialog.close();
            }
        },

        _onInputSubmit: function (oEve) {
            this.setValue(oEve.getParameter("value"));
            this.fireSubmit(oEve);
        },

        _onQuaggaDetect: function (oEve) {

            if (this.getCloseOnDetect()) {
                this.closeDialog();
            }

            this.oInput.setValue(oEve.codeResult.code);
            this.setValue(oEve.codeResult.code);
            this.fireDetect(oEve);
        },

        _createDialogAndContent: function () {


            if (!this._oScanDialog) {
                this._oCloseButton = new Button({
                    text: this.getCloseText(),
                    press: function (oEvent) {
                        this._oScanDialog.close();
                    }.bind(this)
                });

                this._oChangeCameraButton = new Button({
                    text: this.getChangeCameraText(),
                    icon: this.getChangeCameraIcon(),
                    press: function (oEvent) {
                        this.changeCamera();
                    }.bind(this)
                });

                this._scanContainer = new coreHTML({ id: "reader", content: "<div />" });

                this._oScanDialog = new sap.m.Dialog({
                    title: this.getTitle(),

                    horizontalScrolling: false,
                    verticalScrolling: false,
                    stretchOnPhone: true,
                    content: [this._scanContainer],
                    buttons: [this._oChangeCameraButton, this._oCloseButton],
                    afterOpen: function () {
                        this.startQuagga();
                    }.bind(this),
                    afterClose: function () {
                        this.stopQuagga();
                    }.bind(this)
                });

            }

            this._oScanDialog.open();
        },

        _createExternalControls: function () {

            if(!this._oFlexBoxContainer) {

                this._oFlexBoxContainer = new FlexBox( "FlexboxExternalBarCodeScanner",
                    {
                        justifyContent: FlexJustifyContent.Center,
                        alignItems: FlexAlignItems.Center,
                        fitContainer: true,
                        width: '100%'
                    }
                )

            }

            if(!this.oOpenDialogButton) {

                this.oOpenDialogButton = new Button('OpenDialogButton',
                    {
                        text: this.getShowDialogText() ? this.getOpenDialogText() : null,
                        icon: this.getOpenDialogIcon(),
                        press: this.openDialog.bind(this),
                        width: this.getOpenDialogWidth()
                    }
                )

            }
            
            if(!this.oInput) {

                this.oInput = new Input('Input',
                    {
                        placeholder: this.getOpenDialogText(),
                        submit: this._onInputSubmit.bind(this),
                        value: this.getValue(),
                        layoutData: new FlexItemData({ growFactor: 12 }),
                        visible: this.getShowInput()
                    }
                );

            }
            
            this.oOpenDialogButton.addStyleClass("sapUiTinyMarginBeginEnd");
            
            this._oFlexBoxContainer.addItem(this.oInput);
            this._oFlexBoxContainer.addItem(this.oOpenDialogButton);

        },

        init: function (oEvent) {
            this._createExternalControls();
            Models.getText("DEFAULT_CLOSE");
        },

        renderer: function (oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.writeClasses();
            oRM.write(">");
            oRM.renderControl(oControl._oFlexBoxContainer);
            oRM.write("</div>");
        },

        getVideoDevices: function () {

            let that = this;

            if (!this.videoDevices) {
                this.videoDevices = this._getDevices();
            }

            this.videoDevices.then((oDevices) => {

                if (!that.selectedVideoDevices) {
                    that.selectedVideoDevices = oDevices[0];
                    if (oDevices.length === 1) {
                        that._setCameraVisible(false);
                    } else {
                        that._setCameraVisible(true);
                    }
                }

            });

            return this.videoDevices;

        },

        changeCamera: function () {

            this.stopQuagga();
            var that = this;

            this.getVideoDevices().then((oDevices) => {

                if (oDevices.indexOf(that.selectedVideoDevices) === 0) {
                    that.selectedVideoDevices = oDevices[1];
                } else {
                    that.selectedVideoDevices = oDevices[0];
                }

                that.startQuagga();

            });

        },

        startQuagga: function () {

            if (!this.videoDevices) {
                this.videoDevices = this.getVideoDevices();
            }

            let that = this;
            this.videoDevices.then((oDevices) => {

                Quagga.init({
                    inputStream: {
                        name: "Live",
                        type: "LiveStream",
                        target: document.querySelector('#reader'),

                        constraints: {
                            width: 1280,
                            height: 980,
                            facingMode: "environment",
                            deviceId: that.selectedVideoDevices.deviceId
                        },
                        area: { // defines rectangle of the detection/localization area
                            top: "0px",    // top offset
                            right: "0px",  // right offset
                            left: "0px",   // left offset
                            bottom: "0px"  // bottom offset
                        },
                        singleChannel: false // true: only the red color-channel is read
                    },
                    locator: {
                        patchSize: "medium",
                        halfSample: true
                    },
                    numOfWorkers: 2,
                    frequency: 10,
                    locate: this.getLocate(),
                    decoder: {
                        readers: this.getReadersDecoder()
                    }
                }, function (err) {
                    if (err) {
                        console.log(err);
                        return
                    }
                    console.log("Initialization finished. Ready to start");

                    Quagga.start();
                    Quagga.onDetected(that._onQuaggaDetect.bind(that));
                    Quagga.onProcessed(that._drawBox);

                });

            });


        },

        stopQuagga: function () {
            Quagga.stop();
        },

        _getDevices: function () {

            let that = this;
            let videoDevices;

            let oPromise = new Promise((resolve, reject) => {
                return resolve(
                    navigator.mediaDevices.enumerateDevices()
                        .then((devices) => {
                            return devices.filter(device => device.kind == "videoinput");
                        })
                        .catch((err) => {
                            console.log(err.name + ": " + err.message);
                        })
                );
            })

            return oPromise;

        },

        _setCameraVisible: function (bBool) {
            this._oChangeCameraButton.setVisible(bBool);
        },

        _drawBox: function (result) {
            var drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                    result.boxes.filter(function (box) {
                        return box !== result.box;
                    }).forEach(function (box) {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                }
            }
        },

        exit: function () {
            this.oInput.destroy();
            this._oFlexBoxContainer.destroy();
            this.oOpenDialogButton.destroy();
            delete this.videoDevices;
            //this.destroy();
        }

    });
});