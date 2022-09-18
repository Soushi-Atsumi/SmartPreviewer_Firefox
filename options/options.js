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

let defaultValues;
let storageKeys;
const BASE_PATH = '/_values';
const DEFAULT_VALUES_JSON_PATH = `${BASE_PATH}/defaultValues.json`;
const STORAGE_KEYS_JSON_PATH = `${BASE_PATH}/storageKeys.json`;

const REFRESHING_ENABLED_INPUT = document.getElementById('refreshingEnabledInput');
const REFRESHING_INTERVAL_INPUT = document.getElementById('refreshingIntervalInput');
const REFRESHING_INTERVAL_VALUE_LABEL = document.getElementById('refreshingIntervalValueLabel');
const REFRESHING_OPTIONS = document.getElementsByName('refreshing');

const AUDIO_ASPECT_RATIO_INPUT = document.getElementById('audioAspectRatioInput');
const AUDIO_ASPECT_RATIO_VALUE_LABEL = document.getElementById('audioAspectRatioValueLabel');
const AUDIO_AUTOPLAY_INPUT = document.getElementById('audioAutoplayInput');
const AUDIO_DELAY_INPUT = document.getElementById('audioDelayInput');
const AUDIO_DELAY_VALUE_LABEL = document.getElementById('audioDelayValueLabel');
const AUDIO_ENABLED_INPUT = document.getElementById('audioEnabledInput');
const AUDIO_LOOP_INPUT = document.getElementById('audioLoopInput');
const AUDIO_OPTIONS = document.getElementsByName('audio');
const AUDIO_VOLUME_INPUT = document.getElementById('audioVolumeInput');
const AUDIO_VOLUME_VALUE_LABEL = document.getElementById('audioVolumeValueLabel');

const IMAGE_ASPECT_RATIO_INPUT = document.getElementById('imageAspectRatioInput');
const IMAGE_ASPECT_RATIO_VALUE_LABEL = document.getElementById('imageAspectRatioValueLabel');
const IMAGE_BORDER_WIDTH_INPUT = document.getElementById('imageBorderWidthInput');
const IMAGE_BORDER_WIDTH_VALUE_LABEL = document.getElementById('imageBorderWidthValueLabel');
const IMAGE_DELAY_INPUT = document.getElementById('imageDelayInput');
const IMAGE_DELAY_VALUE_LABEL = document.getElementById('imageDelayValueLabel');
const IMAGE_ENABLED_INPUT = document.getElementById('imageEnabledInput');
const IMAGE_OPTIONS = document.getElementsByName('image');

const PDF_ASPECT_RATIO_INPUT = document.getElementById('pdfAspectRatioInput');
const PDF_ASPECT_RATIO_VALUE_LABEL = document.getElementById('pdfAspectRatioValueLabel');
const PDF_BORDER_WIDTH_INPUT = document.getElementById('pdfBorderWidthInput');
const PDF_BORDER_WIDTH_VALUE_LABEL = document.getElementById('pdfBorderWidthValueLabel');
const PDF_DELAY_INPUT = document.getElementById('pdfDelayInput');
const PDF_DELAY_VALUE_LABEL = document.getElementById('pdfDelayValueLabel');
const PDF_ENABLED_INPUT = document.getElementById('pdfEnabledInput');
const PDF_OPTIONS = document.getElementsByName('pdf');

const VIDEO_ASPECT_RATIO_INPUT = document.getElementById('videoAspectRatioInput');
const VIDEO_ASPECT_RATIO_VALUE_LABEL = document.getElementById('videoAspectRatioValueLabel');
const VIDEO_AUTOPLAY_INPUT = document.getElementById('videoAutoplayInput');
const VIDEO_DELAY_INPUT = document.getElementById('videoDelayInput');
const VIDEO_DELAY_VALUE_LABEL = document.getElementById('videoDelayValueLabel');
const VIDEO_ENABLED_INPUT = document.getElementById('videoEnabledInput');
const VIDEO_LOOP_INPUT = document.getElementById('videoLoopInput');
const VIDEO_OPTIONS = document.getElementsByName('video');
const VIDEO_VOLUME_INPUT = document.getElementById('videoVolumeInput');
const VIDEO_VOLUME_VALUE_LABEL = document.getElementById('videoVolumeValueLabel');

const INITIALIZE_OPTIONS_BUTTON = document.getElementById('initializeOptionsButton');

main();

async function main() {
	defaultValues = await (await fetch(DEFAULT_VALUES_JSON_PATH)).json();
	storageKeys = await (await fetch(STORAGE_KEYS_JSON_PATH)).json();

	document.getElementsByTagName('html')[0].lang = browser.i18n.getUILanguage();
	document.title = browser.i18n.getMessage('optionsHTMLTitle');
	document.getElementById('refreshingLegend').innerText = browser.i18n.getMessage('refreshing');
	document.getElementById('refreshingEnabledLabel').innerText = browser.i18n.getMessage('enabled');
	document.getElementById('refreshingNewAnchorsExplanationLabel').innerText = browser.i18n.getMessage('checkingNewAnchorsExplanation');
	document.getElementById('refreshingIntervalLabel').innerText = `${browser.i18n.getMessage('interval')}[${browser.i18n.getMessage('second')}]`;
	document.getElementById('audioLegend').innerText = browser.i18n.getMessage('audio');
	document.getElementById('audioAspectRatioLabel').innerText = browser.i18n.getMessage('aspectRatio');
	document.getElementById('audioAutoplayLabel').innerText = browser.i18n.getMessage('autoplay');
	document.getElementById('audioEnabledLabel').innerText = browser.i18n.getMessage('enabled');
	document.getElementById('audioLoopLabel').innerText = browser.i18n.getMessage('loop');
	document.getElementById('audioVolumeLabel').innerText = browser.i18n.getMessage('volume');
	document.getElementById('audioDelayLabel').innerText = `${browser.i18n.getMessage('delay')}[${browser.i18n.getMessage('second')}]`;
	document.getElementById('imageLegend').innerText = browser.i18n.getMessage('image');
	document.getElementById('imageAspectRatioLabel').innerText = browser.i18n.getMessage('aspectRatio');
	document.getElementById('imageBorderWidthLabel').innerText = browser.i18n.getMessage('borderWidth');
	document.getElementById('imageEnabledLabel').innerText = browser.i18n.getMessage('enabled');
	document.getElementById('imageDelayLabel').innerText = `${browser.i18n.getMessage('delay')}[${browser.i18n.getMessage('second')}]`;
	document.getElementById('pdfLegend').innerText = browser.i18n.getMessage('pdf');
	document.getElementById('pdfAspectRatioLabel').innerText = browser.i18n.getMessage('aspectRatio');
	document.getElementById('pdfBorderWidthLabel').innerText = browser.i18n.getMessage('borderWidth');
	document.getElementById('pdfEnabledLabel').innerText = browser.i18n.getMessage('enabled');
	document.getElementById('pdfDelayLabel').innerText = `${browser.i18n.getMessage('delay')}[${browser.i18n.getMessage('second')}]`;
	document.getElementById('videoLegend').innerText = browser.i18n.getMessage('video');
	document.getElementById('videoAspectRatioLabel').innerText = browser.i18n.getMessage('aspectRatio');
	document.getElementById('videoAutoplayLabel').innerText = browser.i18n.getMessage('autoplay');
	document.getElementById('videoEnabledLabel').innerText = browser.i18n.getMessage('enabled');
	document.getElementById('videoLoopLabel').innerText = browser.i18n.getMessage('loop');
	document.getElementById('videoVolumeLabel').innerText = browser.i18n.getMessage('volume');
	document.getElementById('videoDelayLabel').innerText = `${browser.i18n.getMessage('delay')}[${browser.i18n.getMessage('second')}]`;
	INITIALIZE_OPTIONS_BUTTON.innerText = browser.i18n.getMessage('initializeOptions');
	INITIALIZE_OPTIONS_BUTTON.addEventListener('click', initializeOptions);
	document.getElementById('informationDivision').innerText = browser.i18n.getMessage('optionsHTMLInformation');

	initializeValueLabels();

	Array.from(document.options.childNodes).filter(e => e.type === 'fieldset')
		.flatMap(e => Array.from(e.childNodes))
		.filter(e => e.type === 'range')
		.forEach(element => element.addEventListener('input', inputValueLabelOnInput));

	for (let i = 0; i < REFRESHING_OPTIONS.length; i++) {
		document.options.refreshing[i].addEventListener('change', refreshingInputOnClick);
	}

	await checkRefreshing();

	for (let i = 0; i < AUDIO_OPTIONS.length; i++) {
		document.options.audio[i].addEventListener('change', audioInputOnClick);
	}

	await checkAudio();

	for (let i = 0; i < IMAGE_OPTIONS.length; i++) {
		document.options.image[i].addEventListener('change', imageInputOnClick);
	}

	await checkImage();

	for (let i = 0; i < PDF_OPTIONS.length; i++) {
		document.options.pdf[i].addEventListener('change', pdfInputOnClick);
	}

	await checkPDF();

	for (let i = 0; i < VIDEO_OPTIONS.length; i++) {
		document.options.video[i].addEventListener('change', videoInputOnClick);
	}

	await checkVideo();
}

function inputValueLabelOnInput(event) {
	switch (event.target.id) {
		case REFRESHING_INTERVAL_INPUT.id:
			REFRESHING_INTERVAL_VALUE_LABEL.innerText = REFRESHING_INTERVAL_INPUT.value;
			break;
		case AUDIO_ASPECT_RATIO_INPUT.id:
			AUDIO_ASPECT_RATIO_VALUE_LABEL.innerText = AUDIO_ASPECT_RATIO_INPUT.value;
			break;
		case AUDIO_DELAY_INPUT.id:
			AUDIO_DELAY_VALUE_LABEL.innerText = AUDIO_DELAY_INPUT.value;
			break;
		case AUDIO_VOLUME_INPUT.id:
			AUDIO_VOLUME_VALUE_LABEL.innerText = AUDIO_VOLUME_INPUT.value;
			break;
		case IMAGE_ASPECT_RATIO_INPUT.id:
			IMAGE_ASPECT_RATIO_VALUE_LABEL.innerText = IMAGE_ASPECT_RATIO_INPUT.value;
			break;
		case IMAGE_BORDER_WIDTH_INPUT.id:
			IMAGE_BORDER_WIDTH_VALUE_LABEL.innerText = IMAGE_BORDER_WIDTH_INPUT.value;
			break;
		case IMAGE_DELAY_INPUT.id:
			IMAGE_DELAY_VALUE_LABEL.innerText = IMAGE_DELAY_INPUT.value;
			break;
		case PDF_ASPECT_RATIO_INPUT.id:
			PDF_ASPECT_RATIO_VALUE_LABEL.innerText = PDF_ASPECT_RATIO_INPUT.value;
			break;
		case PDF_BORDER_WIDTH_INPUT.id:
			PDF_BORDER_WIDTH_VALUE_LABEL.innerText = PDF_BORDER_WIDTH_INPUT.value;
			break;
		case PDF_DELAY_INPUT.id:
			PDF_DELAY_VALUE_LABEL.innerText = PDF_DELAY_INPUT.value;
			break;
		case VIDEO_ASPECT_RATIO_INPUT.id:
			VIDEO_ASPECT_RATIO_VALUE_LABEL.innerText = VIDEO_ASPECT_RATIO_INPUT.value;
			break;
		case VIDEO_DELAY_INPUT.id:
			VIDEO_DELAY_VALUE_LABEL.innerText = VIDEO_DELAY_INPUT.value;
			break;
		case VIDEO_VOLUME_INPUT.id:
			VIDEO_VOLUME_VALUE_LABEL.innerText = VIDEO_VOLUME_INPUT.value;
			break;
	}
}

function refreshingInputOnClick(event) {
	switch (event.target.id) {
		case REFRESHING_ENABLED_INPUT.id:
			browser.storage.sync.set({ [storageKeys.refreshing.enabled]: REFRESHING_ENABLED_INPUT.checked });
			break;
		case REFRESHING_INTERVAL_INPUT.id:
			browser.storage.sync.set({ [storageKeys.refreshing.interval]: parseFloat(REFRESHING_INTERVAL_INPUT.value) });
			REFRESHING_INTERVAL_VALUE_LABEL.innerText = REFRESHING_INTERVAL_INPUT.value;
			break;
	}
}

async function checkRefreshing(_) {
	const OPTIONS = await browser.storage.sync.get(Object.values(storageKeys.refreshing));
	const KEYS = Object.keys(OPTIONS);
	for (let i = 0; i < KEYS.length; i++) {
		switch (KEYS[i]) {
			case storageKeys.refreshing.enabled:
				REFRESHING_ENABLED_INPUT.checked = OPTIONS[storageKeys.refreshing.enabled];
				break;
			case storageKeys.refreshing.interval:
				REFRESHING_INTERVAL_INPUT.value = OPTIONS[storageKeys.refreshing.interval];
				REFRESHING_INTERVAL_VALUE_LABEL.innerText = REFRESHING_INTERVAL_INPUT.value;
				break;
		}
	}
}

function audioInputOnClick(event) {
	switch (event.target.id) {
		case AUDIO_ASPECT_RATIO_INPUT.id:
			browser.storage.sync.set({ [storageKeys.audio.aspectRatio]: parseFloat(AUDIO_ASPECT_RATIO_INPUT.value) });
			AUDIO_ASPECT_RATIO_VALUE_LABEL.innerText = AUDIO_ASPECT_RATIO_INPUT.value;
			break;
		case AUDIO_AUTOPLAY_INPUT.id:
			browser.storage.sync.set({ [storageKeys.audio.autoplay]: AUDIO_AUTOPLAY_INPUT.checked });
			break;
		case AUDIO_DELAY_INPUT.id:
			browser.storage.sync.set({ [storageKeys.audio.delay]: parseFloat(AUDIO_DELAY_INPUT.value) });
			AUDIO_DELAY_VALUE_LABEL.innerText = AUDIO_DELAY_INPUT.value;
			break;
		case AUDIO_ENABLED_INPUT.id:
			browser.storage.sync.set({ [storageKeys.audio.enabled]: AUDIO_ENABLED_INPUT.checked });
			break;
		case AUDIO_LOOP_INPUT.id:
			browser.storage.sync.set({ [storageKeys.audio.loop]: AUDIO_LOOP_INPUT.checked });
			break;
		case AUDIO_VOLUME_INPUT.id:
			browser.storage.sync.set({ [storageKeys.audio.volume]: parseFloat(AUDIO_VOLUME_INPUT.value) });
			AUDIO_VOLUME_VALUE_LABEL.innerText = AUDIO_VOLUME_INPUT.value;
			break;
	}
}

async function checkAudio() {
	const OPTIONS = await browser.storage.sync.get(Object.values(storageKeys.audio));
	const KEYS = Object.keys(OPTIONS);
	for (let i = 0; i < KEYS.length; i++) {
		switch (KEYS[i]) {
			case storageKeys.audio.aspectRatio:
				AUDIO_ASPECT_RATIO_INPUT.value = OPTIONS[storageKeys.audio.aspectRatio];
				AUDIO_ASPECT_RATIO_VALUE_LABEL.innerText = AUDIO_ASPECT_RATIO_INPUT.value;
				break;
			case storageKeys.audio.autoplay:
				AUDIO_AUTOPLAY_INPUT.checked = OPTIONS[storageKeys.audio.autoplay];
				break;
			case storageKeys.audio.delay:
				AUDIO_DELAY_INPUT.value = OPTIONS[storageKeys.audio.delay];
				AUDIO_DELAY_VALUE_LABEL.innerText = AUDIO_DELAY_INPUT.value;
				break;
			case storageKeys.audio.enabled:
				AUDIO_ENABLED_INPUT.checked = OPTIONS[storageKeys.audio.enabled];
				break;
			case storageKeys.audio.loop:
				AUDIO_LOOP_INPUT.checked = OPTIONS[storageKeys.audio.loop];
				break;
			case storageKeys.audio.volume:
				AUDIO_VOLUME_INPUT.value = OPTIONS[storageKeys.audio.volume];
				AUDIO_VOLUME_VALUE_LABEL.innerText = AUDIO_VOLUME_INPUT.value;
				break;
		}
	}
}

function imageInputOnClick(event) {
	switch (event.target.id) {
		case IMAGE_ASPECT_RATIO_INPUT.id:
			browser.storage.sync.set({ [storageKeys.image.aspectRatio]: IMAGE_ASPECT_RATIO_INPUT.value });
			IMAGE_ASPECT_RATIO_VALUE_LABEL.innerText = IMAGE_ASPECT_RATIO_INPUT.value;
			break;
		case IMAGE_BORDER_WIDTH_INPUT.id:
			browser.storage.sync.set({ [storageKeys.image.borderWidth]: IMAGE_BORDER_WIDTH_INPUT.value });
			IMAGE_BORDER_WIDTH_VALUE_LABEL.innerText = IMAGE_BORDER_WIDTH_INPUT.value;
			break;
		case IMAGE_DELAY_INPUT.id:
			browser.storage.sync.set({ [storageKeys.image.delay]: parseFloat(IMAGE_DELAY_INPUT.value) });
			IMAGE_DELAY_VALUE_LABEL.innerText = IMAGE_DELAY_INPUT.value;
			break;
		case IMAGE_ENABLED_INPUT.id:
			browser.storage.sync.set({ [storageKeys.image.enabled]: IMAGE_ENABLED_INPUT.checked });
			break;
	}
}

async function checkImage() {
	const OPTIONS = await browser.storage.sync.get(Object.values(storageKeys.image));
	const KEYS = Object.keys(OPTIONS);
	for (let i = 0; i < KEYS.length; i++) {
		switch (KEYS[i]) {
			case storageKeys.image.aspectRatio:
				IMAGE_ASPECT_RATIO_INPUT.value = OPTIONS[storageKeys.image.aspectRatio];
				IMAGE_ASPECT_RATIO_VALUE_LABEL.innerText = IMAGE_ASPECT_RATIO_INPUT.value;
				break;
			case storageKeys.image.borderWidth:
				IMAGE_BORDER_WIDTH_INPUT.value = OPTIONS[storageKeys.image.borderWidth];
				IMAGE_BORDER_WIDTH_VALUE_LABEL.innerText = IMAGE_BORDER_WIDTH_INPUT.value;
				break;
			case storageKeys.image.delay:
				IMAGE_DELAY_INPUT.value = OPTIONS[storageKeys.image.delay];
				IMAGE_DELAY_VALUE_LABEL.innerText = IMAGE_DELAY_INPUT.value;
				break;
			case storageKeys.image.enabled:
				IMAGE_ENABLED_INPUT.checked = OPTIONS[storageKeys.image.enabled];
				break;
		}
	}
}

function pdfInputOnClick(event) {
	switch (event.target.id) {
		case PDF_ASPECT_RATIO_INPUT.id:
			browser.storage.sync.set({ [storageKeys.pdf.aspectRatio]: PDF_ASPECT_RATIO_INPUT.value });
			PDF_ASPECT_RATIO_VALUE_LABEL.innerText = PDF_ASPECT_RATIO_INPUT.value;
			break;
		case PDF_BORDER_WIDTH_INPUT.id:
			browser.storage.sync.set({ [storageKeys.pdf.borderWidth]: PDF_BORDER_WIDTH_INPUT.value });
			PDF_BORDER_WIDTH_VALUE_LABEL.innerText = PDF_BORDER_WIDTH_INPUT.value;
			break;
		case PDF_DELAY_INPUT.id:
			browser.storage.sync.set({ [storageKeys.pdf.delay]: parseFloat(PDF_DELAY_INPUT.value) });
			PDF_DELAY_VALUE_LABEL.innerText = PDF_DELAY_INPUT.value;
			break;
		case PDF_ENABLED_INPUT.id:
			browser.storage.sync.set({ [storageKeys.pdf.enabled]: PDF_ENABLED_INPUT.checked });
			break;
	}
}

async function checkPDF() {
	const OPTIONS = await browser.storage.sync.get(Object.values(storageKeys.pdf));
	const KEYS = Object.keys(OPTIONS);
	for (let i = 0; i < KEYS.length; i++) {
		switch (KEYS[i]) {
			case storageKeys.pdf.aspectRatio:
				PDF_ASPECT_RATIO_INPUT.value = OPTIONS[storageKeys.pdf.aspectRatio];
				PDF_ASPECT_RATIO_VALUE_LABEL.innerText = PDF_ASPECT_RATIO_INPUT.value;
				break;
			case storageKeys.pdf.borderWidth:
				PDF_BORDER_WIDTH_INPUT.value = OPTIONS[storageKeys.pdf.borderWidth];
				PDF_BORDER_WIDTH_VALUE_LABEL.innerText = PDF_BORDER_WIDTH_INPUT.value;
				break;
			case storageKeys.pdf.delay:
				PDF_DELAY_INPUT.value = OPTIONS[storageKeys.pdf.delay];
				PDF_DELAY_VALUE_LABEL.innerText = PDF_DELAY_INPUT.value;
				break;
			case storageKeys.pdf.enabled:
				PDF_ENABLED_INPUT.checked = OPTIONS[storageKeys.pdf.enabled];
				break;
		}
	}
}

function videoInputOnClick(event) {
	switch (event.target.id) {
		case VIDEO_ASPECT_RATIO_INPUT.id:
			browser.storage.sync.set({ [storageKeys.video.aspectRatio]: parseFloat(VIDEO_ASPECT_RATIO_INPUT.value) });
			VIDEO_ASPECT_RATIO_VALUE_LABEL.innerText = VIDEO_ASPECT_RATIO_INPUT.value;
			break;
		case VIDEO_AUTOPLAY_INPUT.id:
			browser.storage.sync.set({ [storageKeys.video.autoplay]: VIDEO_AUTOPLAY_INPUT.checked });
			break;
		case VIDEO_DELAY_INPUT.id:
			browser.storage.sync.set({ [storageKeys.video.delay]: parseFloat(VIDEO_DELAY_INPUT.value) });
			VIDEO_DELAY_VALUE_LABEL.innerText = VIDEO_DELAY_INPUT.value;
			break;
		case VIDEO_ENABLED_INPUT.id:
			browser.storage.sync.set({ [storageKeys.video.enabled]: VIDEO_ENABLED_INPUT.checked });
			break;
		case VIDEO_LOOP_INPUT.id:
			browser.storage.sync.set({ [storageKeys.video.loop]: VIDEO_LOOP_INPUT.checked });
			break;
		case VIDEO_VOLUME_INPUT.id:
			browser.storage.sync.set({ [storageKeys.video.volume]: parseFloat(VIDEO_VOLUME_INPUT.value) });
			VIDEO_VOLUME_VALUE_LABEL.innerText = VIDEO_VOLUME_INPUT.value;
			break;
	}
}

async function checkVideo() {
	const OPTIONS = await browser.storage.sync.get(Object.values(storageKeys.video));
	const KEYS = Object.keys(OPTIONS);
	for (let i = 0; i < KEYS.length; i++) {
		switch (KEYS[i]) {
			case storageKeys.video.aspectRatio:
				VIDEO_ASPECT_RATIO_INPUT.value = OPTIONS[storageKeys.video.aspectRatio];
				VIDEO_ASPECT_RATIO_VALUE_LABEL.innerText = VIDEO_ASPECT_RATIO_INPUT.value;
				break;
			case storageKeys.video.autoplay:
				VIDEO_AUTOPLAY_INPUT.checked = OPTIONS[storageKeys.video.autoplay];
				break;
			case storageKeys.video.delay:
				VIDEO_DELAY_INPUT.value = OPTIONS[storageKeys.video.delay];
				VIDEO_DELAY_VALUE_LABEL.innerText = VIDEO_DELAY_INPUT.value;
				break;
			case storageKeys.video.enabled:
				VIDEO_ENABLED_INPUT.checked = OPTIONS[storageKeys.video.enabled];
				break;
			case storageKeys.video.loop:
				VIDEO_LOOP_INPUT.checked = OPTIONS[storageKeys.video.loop];
				break;
			case storageKeys.video.volume:
				VIDEO_VOLUME_INPUT.value = OPTIONS[storageKeys.video.volume];
				VIDEO_VOLUME_VALUE_LABEL.innerText = VIDEO_VOLUME_INPUT.value;
				break;
		}
	}
}

function initializeOptions() {
	browser.storage.sync.clear();
	initializeValueLabels();
}

function initializeValueLabels() {
	REFRESHING_INTERVAL_VALUE_LABEL.innerText = defaultValues.refreshing.interval;
	AUDIO_ASPECT_RATIO_VALUE_LABEL.innerText = defaultValues.audio.aspectRatio;
	AUDIO_DELAY_VALUE_LABEL.innerText = defaultValues.audio.delay;
	AUDIO_VOLUME_VALUE_LABEL.innerText = defaultValues.audio.volume;
	IMAGE_ASPECT_RATIO_VALUE_LABEL.innerText = defaultValues.image.aspectRatio;
	IMAGE_BORDER_WIDTH_VALUE_LABEL.innerText = defaultValues.image.borderWidth;
	IMAGE_DELAY_VALUE_LABEL.innerText = defaultValues.image.delay;
	PDF_ASPECT_RATIO_VALUE_LABEL.innerText = defaultValues.pdf.aspectRatio;
	PDF_BORDER_WIDTH_VALUE_LABEL.innerText = defaultValues.pdf.borderWidth;
	PDF_DELAY_VALUE_LABEL.innerText = defaultValues.pdf.delay;
	VIDEO_ASPECT_RATIO_VALUE_LABEL.innerText = defaultValues.video.aspectRatio;
	VIDEO_DELAY_VALUE_LABEL.innerText = defaultValues.video.delay;
	VIDEO_VOLUME_VALUE_LABEL.innerText = defaultValues.video.volume;
}
