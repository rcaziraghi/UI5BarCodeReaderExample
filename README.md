
# ui5BarCodeReader

UI5BarCodeReader is a neat package powered by Quagga.js to add a input with barcode reading capabilities.

UI5BarCodeReader é um pacote impulsionado por Quagga.js para adicionar um input com capacidade para leitura de código de barras.

![](screenshot.gif)

## Installation/Instalação

Copy folder webapp/lib to /webapp folder in your project. Change also the bundleName of /webapp/lib/models.js to your project namespace.

Copie a pasta /webapp/lib para a pasta /webapp do seu projeto. Altere também o bundleName do arquivo /webapp/lib/models.js para o namespace do seu projeto.

## Usage/Uso

Add namespace in view.xml

Adicione o namespace à sua view.xml
```xml
<mvc:View
	controllerName="barcodereader.barcodereader.controller.ViewBarCodeReader"
	xmlns:mvc="sap.ui.core.mvc"
	displayBlock="true"
	xmlns="sap.m"
	xmlns:brc="barcodereader.barcodereader.libs.UI5BarCodeReader"
>
```
Add control in view.xml
Adicione o control ao view.xml
```xml
...
<brc:BarCodeReader  id="barCodeReader"
					submit="onBarCodeSubmit"
					detect="onCameraDetection"
					closeOnDetect="true"  />
```
## Properties/Propriedades

- **title**: { type: "string", defaultValue: BARCODE_TITLE } (MessageBundle)
    Dialog title/Titulo da janela;
- **closeText**: { type: "string", defaultValue: DEFAULT_CLOSE } (MessageBundle)
    Close dialog text/Texto para ação de fechar a janela;
- **closeIcon**: { type: "sap.ui.core.URI", defaultValue: "" },
    Close icon on dialog/Ícone de fechamento da janela;
- **changeCameraText**: { type: "string", defaultValue: BARCODE_CHANGE_CAMERA } (MessageBundle)
    Camera switch button text/Texto do botão de trocar câmera;
- **changeCameraIcon**: { type: "sap.ui.core.URI", defaultValue: "sap-icon://camera" }
    Camera switch button icon/Ícone do botão de trocar câmera;
- **inputPlaceholder**: { type: "string", defaultValue: BARCODE_INPUT_PLACEHOLDER }
    Input placeholder text/Texto do "placeholder" no input;
- **value**: { type: "string", defaultValue: "" }
    Value/valor;
- **openDialogText**: { type: "string", defaultValue: BARCODE_OPEN_DIALOG_TEXT }
    Dialog open button text/Texto do botão de abrir da janela;
- **showDialogText**: { type: "boolean", defaultValue: false }
    Dialog show button text/Texto do botão de mostrar da janela;
- **openDialogIcon**: { type: "sap.ui.core.URI", defaultValue: "sap-icon://bar-code" }
    Dialog open button icon/Ícone do botão de abrir da janela;
- **openDialogWidth**:  { type: "sap.ui.core.CSSSize", defaultValue: "10rem" }
    Dialog open button width/Largura do botão de abrir da janela;
- **closeOnDetect**: { type: "boolean", defaultValue: false }
    Close dialog on detect barcode/Fecha janela ao detectar código de barras;
- **showInput**: { type: "boolean", defaultValue: true }
    Show input value/Mostrar input;
- **readersDecoder**: { type: "array", defaultValue: ["code_128_reader"] }
    Array of types of barcodes which should be decoded during the session/Array de tipos de código de barras que devem ser decodificadas durante a sessão;
- **locate**: { type: "boolean", defaultValue: false }
    Find the barcode in the image/Localizar o código de barras na imagem

## Contributing/Contribuição

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

Solicitações pull são bem-vindas. Para mudanças importantes, abra um problema (issue) primeiro para discutir o que você gostaria de mudar.  Certifique-se de atualizar os testes conforme apropriado.

## License/Licença
[MIT](https://choosealicense.com/licenses/mit/)