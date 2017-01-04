# Vertically Rotating "Loading" Text Ticker in style of Asana
A Javascript library for rotating text messages in the style of Asana.com

Useful for showing alternating "loading" messages or explain the steps of a process running while the user is waiting. 

## *Demo*
[![Demo](https://media.giphy.com/media/l4JzccUxHlQh5Ohri/giphy.gif)](https://omriallouche.github.io/asana-style-loader/)

## Getting started:
  - Include `asana-style-loader.css`:
```html
<link href="css/asana-style-loader.css" rel="stylesheet">
```
  - Include `asanaStyleLoader.js`:
```html
<script src="src/asanaStyleLoader.js"></script>
```
- Add loader container DIV to your HTML:
```html
<div id="asanaLoader"></div>
```
- Create new `AsanaStyleLoader` with container id as parameter : 
```javascript
var asl = new AsanaStyleLoader("asanaLoader")
```
- Optionally, you can pass parameters list when creating `AsanaStyleLoader`:
```javascript
var params = {
	messages: [
		"sniffing around",
        "getting focused",
        "finding assets",
        "pulling posts"
    ],
    verticalSpacing: 90,
    secondsPerSlide: 1.5
};
var asl = new AsanaStyleLoader("asanaLoader",params)
```

## Attributes:
AsanaStyleLoader(`containerElementId`,`params`)

 - `containerElementId` - Id for loader container
 - `params` - Configuration object. It can include:
	 - `messages` - array of messages
	 - `verticalSpacing` - vertical spacing per one slide (*default: 90*)
	 - `secondsPerSlide` - timeout between slides (*default: 1.5*) 

`params` example:
```javascript
var params = {
    messages: [
        "sniffing around",
        "getting focused",
        "finding assets",
        "pulling posts"
    ],
    verticalSpacing: 90,
    secondsPerSlide: 1.5
}
```
