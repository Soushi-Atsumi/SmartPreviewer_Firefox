/*
 * Smart Previewer - The smart previewer which previews everything.
 * Copyright (c) 2018 Soushi Atsumi. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * 
 * This Source Code Form is "Incompatible With Secondary Licenses", as
 * defined by the Mozilla Public License, v. 2.0.
 */
'use strict';

var defaultValues;
var defaultValuesXmlHttpRequest = new XMLHttpRequest();
var storageKeys;
var storageKeysXmlHttpRequest = new XMLHttpRequest();

var audioAspectRatioInput = document.getElementById('audioAspectRatioInput');
var audioAutoplayInput = document.getElementById('audioAutoplayInput');
var audioLoopInput = document.getElementById('audioLoopInput');
var audioVolumeInput = document.getElementById('audioVolumeInput');
var audioOptions = document.getElementsByName('audio');

var imageAspectRatioInput = document.getElementById('imageAspectRatioInput');
var imageBorderWidthInput = document.getElementById('imageBorderWidthInput');
var imageOptions = document.getElementsByName('image');

var pdfAspectRatioInput = document.getElementById('pdfAspectRatioInput');
var pdfBorderWidthInput = document.getElementById('pdfBorderWidthInput');
var pdfOptions = document.getElementsByName('pdf');

var videoAspectRatioInput = document.getElementById('videoAspectRatioInput');
var videoAutoplayInput = document.getElementById('videoAutoplayInput');
var videoLoopInput = document.getElementById('videoLoopInput');
var videoVolumeInput = document.getElementById('videoVolumeInput');
var videoOptions = document.getElementsByName('video');

var initializeOptionsButton = document.getElementById('initializeOptionsButton');

main();

function main() {
	defaultValuesXmlHttpRequest.open('GET', browser.runtime.getURL('/_values/defaultValues.json'), false);
	defaultValuesXmlHttpRequest.send();
	defaultValues = JSON.parse(defaultValuesXmlHttpRequest.responseText);
	storageKeysXmlHttpRequest.open('GET', browser.runtime.getURL('/_values/storageKeys.json'), false);
	storageKeysXmlHttpRequest.send();
	storageKeys = JSON.parse(storageKeysXmlHttpRequest.responseText);

	document.getElementsByTagName('html')[0].lang = browser.i18n.getUILanguage();
	document.title = browser.i18n.getMessage('optionsHTMLTitle');
	document.getElementById('audioLegend').innerText = browser.i18n.getMessage('audio');
	document.getElementById('audioAspectRatioLabel').innerText = browser.i18n.getMessage('aspectRatio');
	document.getElementById('audioAutoplayLabel').innerText = browser.i18n.getMessage('autoplay');
	document.getElementById('audioLoopLabel').innerText = browser.i18n.getMessage('loop');
	document.getElementById('audioVolumeLabel').innerText = browser.i18n.getMessage('volume');
	document.getElementById('imageLegend').innerText = browser.i18n.getMessage('image');
	document.getElementById('imageBorderWidthLabel').innerText = browser.i18n.getMessage('borderWidth');
	document.getElementById('imageAspectRatioLabel').innerText = browser.i18n.getMessage('aspectRatio');
	document.getElementById('pdfLegend').innerText = browser.i18n.getMessage('pdf');
	document.getElementById('pdfBorderWidthLabel').innerText = browser.i18n.getMessage('borderWidth');
	document.getElementById('pdfAspectRatioLabel').innerText = browser.i18n.getMessage('aspectRatio');
	document.getElementById('videoLegend').innerText = browser.i18n.getMessage('video');
	document.getElementById('videoAspectRatioLabel').innerText = browser.i18n.getMessage('aspectRatio');
	document.getElementById('videoAutoplayLabel').innerText = browser.i18n.getMessage('autoplay');
	document.getElementById('videoLoopLabel').innerText = browser.i18n.getMessage('loop');
	document.getElementById('videoVolumeLabel').innerText = browser.i18n.getMessage('volume');
	initializeOptionsButton.innerText = browser.i18n.getMessage('initializeOptions');
	initializeOptionsButton.addEventListener('click', initializeOptions);
	document.getElementById('informationDivision').innerText = browser.i18n.getMessage('optionsHTMLInformation');

	for (let i = 0; i < audioOptions.length; i++) {
		document.options.audio[i].addEventListener('change', audioInputOnClick);
	}

	checkAudio();

	for (let i = 0; i < imageOptions.length; i++) {
		document.options.image[i].addEventListener('change', imageInputOnClick);
	}

	checkImage();

	for (let i = 0; i < pdfOptions.length; i++) {
		document.options.pdf[i].addEventListener('change', pdfInputOnClick);
	}

	checkPDF();

	for (let i = 0; i < videoOptions.length; i++) {
		document.options.video[i].addEventListener('change', videoInputOnClick);
	}

	checkVideo();
}

function audioInputOnClick(event) {
	switch (event.target.id) {
		case audioAspectRatioInput.id:
			browser.storage.sync.set({ [storageKeys.audio.aspectRatio]: parseFloat(audioAspectRatioInput.value) });
			break;
		case audioAutoplayInput.id:
			browser.storage.sync.set({ [storageKeys.audio.autoplay]: audioAutoplayInput.checked });
			break;
		case audioLoopInput.id:
			browser.storage.sync.set({ [storageKeys.audio.loop]: audioLoopInput.checked });
			break;
		case audioVolumeInput.id:
			browser.storage.sync.set({ [storageKeys.audio.volume]: parseFloat(audioVolumeInput.value) });
			break;
	}
}

function checkAudio() {
	browser.storage.sync.get(Object.values(storageKeys.audio), (options) => {
		let keys = Object.keys(options);
		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case storageKeys.audio.aspectRatio:
					audioAspectRatioInput.value = options[storageKeys.audio.aspectRatio];
					break;
				case storageKeys.audio.autoplay:
					audioAutoplayInput.checked = options[storageKeys.audio.autoplay];
					break;
				case storageKeys.audio.loop:
					audioLoopInput.checked = options[storageKeys.audio.loop];
					break;
				case storageKeys.audio.volume:
					audioVolumeInput.value = options[storageKeys.audio.volume];
					break;
			}
		}
	});
}

function imageInputOnClick(event) {
	switch (event.target.id) {
		case imageAspectRatioInput.id:
			browser.storage.sync.set({ [storageKeys.image.aspectRatio]: imageAspectRatioInput.value });
			break;
		case imageBorderWidthInput.id:
			browser.storage.sync.set({ [storageKeys.image.borderWidth]: imageBorderWidthInput.value });
			break;
	}
}

function checkImage() {
	browser.storage.sync.get(Object.values(storageKeys.image), (options) => {
		let keys = Object.keys(options);
		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case storageKeys.image.aspectRatio:
					imageAspectRatioInput.value = options[storageKeys.image.aspectRatio];
					break;
				case storageKeys.image.borderWidth:
					imageBorderWidthInput.value = options[storageKeys.image.borderWidth];
					break;
			}
		}
	});
}

function pdfInputOnClick(event) {
	switch (event.target.id) {
		case pdfAspectRatioInput.id:
			browser.storage.sync.set({ [storageKeys.pdf.aspectRatio]: pdfAspectRatioInput.value });
			break;
		case pdfBorderWidthInput.id:
			browser.storage.sync.set({ [storageKeys.pdf.borderWidth]: pdfBorderWidthInput.value });
			break;
	}
}

function checkPDF() {
	browser.storage.sync.get(Object.values(storageKeys.pdf), (options) => {
		let keys = Object.keys(options);
		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case storageKeys.pdf.aspectRatio:
					pdfAspectRatioInput.value = options[storageKeys.pdf.aspectRatio];
					break;
				case storageKeys.pdf.borderWidth:
					pdfBorderWidthInput.value = options[storageKeys.pdf.borderWidth];
					break;
			}
		}
	});
}

function videoInputOnClick(event) {
	switch (event.target.id) {
		case videoAspectRatioInput.id:
			browser.storage.sync.set({ [storageKeys.video.aspectRatio]: parseFloat(videoAspectRatioInput.value) });
			break;
		case videoAutoplayInput.id:
			browser.storage.sync.set({ [storageKeys.video.autoplay]: videoAutoplayInput.checked });
			break;
		case videoLoopInput.id:
			browser.storage.sync.set({ [storageKeys.video.loop]: videoLoopInput.checked });
			break;
		case videoVolumeInput.id:
			browser.storage.sync.set({ [storageKeys.video.volume]: parseFloat(videoVolumeInput.value) });
			break;
	}
}

function checkVideo() {
	browser.storage.sync.get(Object.values(storageKeys.video), (options) => {
		let keys = Object.keys(options);
		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case storageKeys.video.aspectRatio:
					videoAspectRatioInput.value = options[storageKeys.video.aspectRatio];
					break;
				case storageKeys.video.autoplay:
					videoAutoplayInput.checked = options[storageKeys.video.autoplay];
					break;
				case storageKeys.video.loop:
					videoLoopInput.checked = options[storageKeys.video.loop];
					break;
				case storageKeys.video.volume:
					videoVolumeInput.value = options[storageKeys.video.volume];
					break;
			}
		}
	});
}

function initializeOptions() {
	browser.storage.sync.set({ [storageKeys.audio.aspectRatio]: defaultValues.audio.aspectRatio });
	browser.storage.sync.set({ [storageKeys.audio.autoplay]: defaultValues.audio.autoplay });
	browser.storage.sync.set({ [storageKeys.audio.loop]: defaultValues.audio.loop });
	browser.storage.sync.set({ [storageKeys.audio.volume]: defaultValues.audio.volume });
	browser.storage.sync.set({ [storageKeys.image.aspectRatio]: defaultValues.image.aspectRatio });
	browser.storage.sync.set({ [storageKeys.image.borderWidth]: defaultValues.image.borderWidth });
	browser.storage.sync.set({ [storageKeys.pdf.aspectRatio]: defaultValues.pdf.aspectRatio });
	browser.storage.sync.set({ [storageKeys.pdf.borderWidth]: defaultValues.pdf.borderWidth });
	browser.storage.sync.set({ [storageKeys.video.aspectRatio]: defaultValues.video.aspectRatio });
	browser.storage.sync.set({ [storageKeys.video.autoplay]: defaultValues.video.autoplay });
	browser.storage.sync.set({ [storageKeys.video.loop]: defaultValues.video.loop });
	browser.storage.sync.set({ [storageKeys.video.volume]: defaultValues.video.volume });
}
