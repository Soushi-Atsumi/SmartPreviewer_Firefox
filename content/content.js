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

let storageKeys;
let defaultValues;
const BASE_PATH = '/_values';
const DEFAULT_VALUES_JSON_PATH = browser.runtime.getURL(`${BASE_PATH}/defaultValues.json`);
const STORAGE_KEYS_JSON_PATH = browser.runtime.getURL(`${BASE_PATH}/storageKeys.json`);
let latestMousePositionX = 0;
let latestMousePositionY = 0;
const CONTENT_STATE = { loading: 0, loaded: 1, error: 2 };
let modifiedHyperlinks = [];

//Refreshing
let refreshingIsEnabled;
let refreshingInterval;

//Audio
const FLOATING_AUDIO = document.createElement('audio');
let floatingAudioAspectRatio;
const FLOATING_AUDIO_DEFAULT_HEIGHT = 40;
let floatingAudioIsEnabled;
let floatingAudioTimeoutID = 0;
let floatingAudioTimeout;
const AUDIO_EXTENSIONS = ['aac', 'flac', 'm4a', 'mp3', 'ogg', 'wav'];
const REGEX_AUDIO = new RegExp(`https?:\\/\\/.*\\/.*\\.(${AUDIO_EXTENSIONS.join('|')})`, 'i');
const REGEX_AUDIO_REPEATING = new RegExp(`.https?:\\/\\/.*\\/.*\\.(${AUDIO_EXTENSIONS.join('|')})`, 'i');
const AUDIO_MOUSE_ENTER_EVENT_LISTENER = event => {
	if (!event.shiftKey) {
		window.clearTimeout(floatingAudioTimeoutID);
		floatingAudioTimeoutID = window.setTimeout(() => {
			let targetHref = event.target.href;
			latestMousePositionX = event.clientX;
			latestMousePositionY = event.clientY;

			if (targetHref.match(REGEX_AUDIO) === null) {
				FLOATING_AUDIO.removeAttribute('src');
			} else if (targetHref.match(REGEX_AUDIO_REPEATING) === null) {
				FLOATING_AUDIO.setAttribute('src', targetHref.match(REGEX_AUDIO)[0]);
			} else {
				let result = targetHref.match(REGEX_AUDIO_REPEATING);
				while (result !== null) {
					targetHref = result[0].match(REGEX_AUDIO)[0];
					result = targetHref.match(REGEX_AUDIO_REPEATING);
				}

				FLOATING_AUDIO.setAttribute('src', targetHref);
			}

			if (FLOATING_AUDIO.getAttribute('src') !== '') {
				setFloatingAudioSize();
				setFloatingAudioFromMousePosition(latestMousePositionX, latestMousePositionY);
				FLOATING_AUDIO.style.display = 'inline-block';
				return;
			}
		}, floatingAudioTimeout);
	}
};
const AUDIO_MOUSE_LEAVE_EVENT_LISTENER = () => window.clearTimeout(floatingAudioTimeoutID);

//Image
const FLOATING_IMAGE = document.createElement('img');
let floatingImageAspectRatio;
let floatingImageIntervalID = 0;
let floatingImageIsEnabled;
let floatingImageStyleBorderWidth;
let floatingImageTimeoutID = 0;
let floatingImageTimeout;
const IMAGE_EXTENSIONS = ['bmp', 'gif', 'gifv', 'ico', 'jpeg', 'jpg', 'png', 'svg', 'webp'];
const REGEX_IMAGE = new RegExp(`https?:\\/\\/.*\\/.*\\.(${IMAGE_EXTENSIONS.join('|')})`, 'i');
const REGEX_IMAGE_REPEATING = new RegExp(`.https?:\\/\\/.*\\/.*\\.(${IMAGE_EXTENSIONS.join('|')})`, 'i');
const IMAGE_MOUSE_ENTER_EVENT_LISTENER = event => {
	if (!event.shiftKey) {
		window.clearTimeout(floatingImageTimeoutID);
		floatingImageTimeoutID = window.setTimeout(() => {
			let targetHref = event.target.href;
			latestMousePositionX = event.clientX;
			latestMousePositionY = event.clientY;

			if (targetHref.match(REGEX_IMAGE) === null) {
				FLOATING_IMAGE.removeAttribute('src');
			} else if (targetHref.match(REGEX_IMAGE_REPEATING) === null) {
				FLOATING_IMAGE.setAttribute('src', targetHref.match(REGEX_IMAGE)[0]);
			} else {
				let result = targetHref.match(REGEX_IMAGE_REPEATING);
				while (result !== null) {
					targetHref = result[0].match(REGEX_IMAGE)[0];
					result = targetHref.match(REGEX_IMAGE_REPEATING);
				}

				FLOATING_IMAGE.setAttribute('src', targetHref);
			}

			if (FLOATING_IMAGE.getAttribute('src') !== '') {
				setFloatingImageFromMousePosition(latestMousePositionX, latestMousePositionY);
				toggleFloatingImageBorderColor(CONTENT_STATE.loading);
				FLOATING_IMAGE.style.display = 'inline-block';
				return;
			}
		}, floatingImageTimeout);
	}
};
const IMAGE_MOUSE_LEAVE_EVENT_LISTENER = () => window.clearTimeout(floatingImageTimeoutID);

//PDF
const FLOATING_PDF = document.createElement('iframe');
let floatingPDFAspectRatio;
let floatingPDFIntervalID = 0;
let floatingPDFIsEnabled;
let floatingPDFStyleBorderWidth;
let floatingPDFTimeoutID = 0;
let floatingPDFTimeout;
const PDF_EXTENSIONS = ['pdf'];
const REGEX_PDF = new RegExp(`https?:\\/\\/.*\\/.*\\.(${PDF_EXTENSIONS.join('|')})`, 'i');
const REGEX_PDF_REPEATING = new RegExp(`.https?:\\/\\/.*\\/.*\\.(${PDF_EXTENSIONS.join('|')})`, 'i');
const PDF_MOUSE_ENTER_EVENT_LISTENER = event => {
	if (!event.shiftKey) {
		window.clearTimeout(floatingPDFTimeoutID);
		floatingPDFTimeoutID = window.setTimeout(() => {
			let targetHref = event.target.href;
			latestMousePositionX = event.clientX;
			latestMousePositionY = event.clientY;

			if (targetHref.match(REGEX_PDF) === null) {
				FLOATING_PDF.removeAttribute('src');
			} else if (targetHref.match(REGEX_PDF_REPEATING) === null) {
				FLOATING_PDF.setAttribute('src', targetHref.match(REGEX_PDF)[0]);
			} else {
				let result = targetHref.match(REGEX_PDF_REPEATING);
				while (result !== null) {
					targetHref = result[0].match(REGEX_PDF)[0];
					result = targetHref.match(REGEX_PDF_REPEATING);
				}

				FLOATING_PDF.setAttribute('src', targetHref);
			}

			if (FLOATING_PDF.getAttribute('src') !== '') {
				setFloatingPDFFromMousePosition(latestMousePositionX, latestMousePositionY);
				toggleFloatingPDFBorderColor(CONTENT_STATE.loading);
				FLOATING_PDF.style.display = 'inline-block';
				return;
			}
		}, floatingPDFTimeout);
	}
};
const PDF_MOUSE_LEAVE_EVENT_LISTENER = () => window.clearTimeout(floatingPDFTimeoutID);

//Video
const FLOATING_VIDEO = document.createElement('video');
let floatingVideoAspectRatio;
let floatingVideoIsEnabled;
let floatingVideoTimeoutID = 0;
let floatingVideoTimeout;
const VIDEO_EXTENSIONS = ['mov', 'mp4', 'webm', 'wmv'];
const REGEX_VIDEO = new RegExp(`https?:\\/\\/.*\\/.*\\.(${VIDEO_EXTENSIONS.join('|')})`, 'i');
const REGEX_VIDEO_REPEATING = new RegExp(`.https?:\\/\\/.*\\/.*\\.(${VIDEO_EXTENSIONS.join('|')})`, 'i');
const VIDEO_MOUSE_ENTER_EVENT_LISTENER = event => {
	if (!event.shiftKey) {
		window.clearTimeout(floatingVideoTimeoutID);
		floatingVideoTimeoutID = window.setTimeout(() => {
			let targetHref = event.target.href;
			latestMousePositionX = event.clientX;
			latestMousePositionY = event.clientY;

			if (targetHref.match(REGEX_VIDEO) === null) {
				FLOATING_VIDEO.removeAttribute('src');
			} else if (targetHref.match(REGEX_VIDEO_REPEATING) === null) {
				FLOATING_VIDEO.setAttribute('src', targetHref.match(REGEX_VIDEO)[0]);
			} else {
				let result = targetHref.match(REGEX_VIDEO_REPEATING);
				while (result !== null) {
					targetHref = result[0].match(REGEX_VIDEO)[0];
					result = targetHref.match(REGEX_VIDEO_REPEATING);
				}

				FLOATING_VIDEO.setAttribute('src', targetHref);
			}

			if (FLOATING_VIDEO.getAttribute('src') !== '') {
				setFloatingVideoFromMousePosition(latestMousePositionX, latestMousePositionY);
				FLOATING_VIDEO.style.display = 'inline-block';
				return;
			}
		}, floatingVideoTimeout);
	}
};
const VIDEO_MOUSE_LEAVE_EVENT_LISTENER = () => window.clearTimeout(floatingVideoTimeoutID);

main();

async function main() {
	defaultValues = await (await fetch(DEFAULT_VALUES_JSON_PATH)).json();
	initializeRefreshing();
	initializeAudio();
	initializeImage();
	initializePDF();
	initializeVideo();
	await overrideOptions();
	//Audio
	floatingAudioIsEnabled && document.body.appendChild(FLOATING_AUDIO);
	//Image
	floatingImageIsEnabled && document.body.appendChild(FLOATING_IMAGE);
	//PDF
	floatingPDFIsEnabled && document.body.appendChild(FLOATING_PDF);
	//Video
	floatingVideoIsEnabled && document.body.appendChild(FLOATING_VIDEO);

	addPreviewers();
	if (refreshingIsEnabled) {
		window.setInterval(() => addPreviewers(), refreshingInterval);
	}
}

function initializeRefreshing() {
	refreshingIsEnabled = defaultValues.refreshing.enabled;
	refreshingInterval = defaultValues.refreshing.interval * 1000;
}

function initializeAudio() {
	FLOATING_AUDIO.autoplay = defaultValues.audio.autoplay;
	FLOATING_AUDIO.controls = true;
	FLOATING_AUDIO.id = 'floatingAudio';
	FLOATING_AUDIO.loop = defaultValues.audio.loop;
	FLOATING_AUDIO.style.display = 'none';
	FLOATING_AUDIO.style.height = `${FLOATING_AUDIO_DEFAULT_HEIGHT}px`;
	FLOATING_AUDIO.style.position = 'fixed';
	FLOATING_AUDIO.style.visibility = 'visible';
	FLOATING_AUDIO.style.zIndex = 2147483647;
	FLOATING_AUDIO.volume = defaultValues.audio.volume;
	floatingAudioAspectRatio = defaultValues.audio.aspectRatio;
	floatingAudioIsEnabled = defaultValues.audio.enabled;
	floatingAudioTimeout = defaultValues.audio.delay;

	FLOATING_AUDIO.addEventListener('loadedmetadata', () => {
		setFloatingAudioSize(floatingAudioAspectRatio);
		setFloatingAudioFromMousePosition(latestMousePositionX, latestMousePositionY);
	});

	FLOATING_AUDIO.addEventListener('mouseout', event => {
		if (FLOATING_AUDIO.offsetHeight + FLOATING_AUDIO.offsetTop <= event.clientY | FLOATING_AUDIO.offsetLeft >= event.clientX | FLOATING_AUDIO.offsetLeft + FLOATING_AUDIO.offsetWidth <= event.clientX | FLOATING_AUDIO.offsetTop >= event.clientY) {
			FLOATING_AUDIO.style.display = "none";
			FLOATING_AUDIO.removeAttribute('src');
			FLOATING_AUDIO.pause();
		}
	});

	FLOATING_AUDIO.addEventListener('wheel', event => {
		let floatingAudioWidthMagnification;

		if (event.deltaY > 0) {
			floatingAudioWidthMagnification = FLOATING_AUDIO.clientWidth / window.innerWidth - 0.1;
		} else {
			floatingAudioWidthMagnification = FLOATING_AUDIO.clientWidth / window.innerWidth + 0.1;
		}

		if (floatingAudioWidthMagnification > 0 && floatingAudioWidthMagnification < 1) {
			setFloatingAudioSize(floatingAudioWidthMagnification);
			setFloatingAudioFromMousePosition(latestMousePositionX, latestMousePositionY);
		}
		event.preventDefault();
	});
}

function initializeImage() {
	const FLOATING_IMAGE_DEFAULT_HEIGHT = '100px';
	const FLOATING_IMAGE_DEFAULT_WIDTH = '100px';
	floatingImageStyleBorderWidth = defaultValues.image.borderWidth;
	FLOATING_IMAGE.id = 'floatingImage';
	FLOATING_IMAGE.style.borderStyle = `solid`;
	FLOATING_IMAGE.style.borderWidth = `${floatingImageStyleBorderWidth}px`;
	FLOATING_IMAGE.style.display = 'none';
	FLOATING_IMAGE.style.height = FLOATING_IMAGE_DEFAULT_HEIGHT;
	FLOATING_IMAGE.style.position = 'fixed';
	FLOATING_IMAGE.style.visibility = 'visible';
	FLOATING_IMAGE.style.width = FLOATING_IMAGE_DEFAULT_WIDTH;
	FLOATING_IMAGE.style.zIndex = 2147483647;
	floatingImageAspectRatio = defaultValues.image.aspectRatio;
	floatingImageIsEnabled = defaultValues.image.enabled;
	floatingImageTimeout = defaultValues.image.delay;

	FLOATING_IMAGE.addEventListener('click', event => {
		if (event.button === 0) {
			if (event.ctrlKey) {
				window.open(FLOATING_IMAGE.getAttribute('src'));
			} else {
				FLOATING_IMAGE.style.display = "none";
			}
		}
	});

	FLOATING_IMAGE.addEventListener('error', () => {
		if (FLOATING_IMAGE.getAttribute('src') !== '') {
			toggleFloatingImageBorderColor(CONTENT_STATE.error);
		}
	});

	FLOATING_IMAGE.addEventListener('load', () => {
		setFloatingImageSize(floatingImageAspectRatio, floatingImageAspectRatio);
		setFloatingImageFromMousePosition(latestMousePositionX, latestMousePositionY);
		toggleFloatingImageBorderColor(CONTENT_STATE.loaded);
	});

	FLOATING_IMAGE.addEventListener('mouseout', event => {
		if (FLOATING_IMAGE.offsetHeight + FLOATING_IMAGE.offsetTop <= event.clientY | FLOATING_IMAGE.offsetLeft >= event.clientX | FLOATING_IMAGE.offsetLeft + FLOATING_IMAGE.offsetWidth <= event.clientX | FLOATING_IMAGE.offsetTop >= event.clientY) {
			FLOATING_IMAGE.removeAttribute('src');
			FLOATING_IMAGE.style.display = "none";
			FLOATING_IMAGE.style.height = FLOATING_IMAGE_DEFAULT_HEIGHT;
			FLOATING_IMAGE.style.width = FLOATING_IMAGE_DEFAULT_WIDTH;
			toggleFloatingImageBorderColor(CONTENT_STATE.loaded);
		}
	});

	FLOATING_IMAGE.addEventListener('wheel', event => {
		let floatingImageHeightMagnification;
		let floatingImageWidthMagnification;

		if (event.deltaY > 0) {
			floatingImageHeightMagnification = FLOATING_IMAGE.clientHeight / window.innerHeight - 0.1;
			floatingImageWidthMagnification = FLOATING_IMAGE.clientWidth / window.innerWidth - 0.1;
		} else {
			floatingImageHeightMagnification = FLOATING_IMAGE.clientHeight / window.innerHeight + 0.1;
			floatingImageWidthMagnification = FLOATING_IMAGE.clientWidth / window.innerWidth + 0.1;
		}

		if ((floatingImageHeightMagnification > 0 || floatingImageWidthMagnification > 0) && floatingImageHeightMagnification < 1 && floatingImageWidthMagnification < 1) {
			setFloatingImageSize(floatingImageHeightMagnification, floatingImageWidthMagnification);
			setFloatingImageFromMousePosition(latestMousePositionX, latestMousePositionY);
		}
		event.preventDefault();
	});
}

function initializePDF() {
	const FLOATING_PDF_DEFAULT_HEIGHT = '100px';
	const FLOATING_PDF_DEFAULT_WIDTH = '100px';
	floatingPDFStyleBorderWidth = defaultValues.pdf.borderWidth;
	FLOATING_PDF.id = 'floatingPDF';
	FLOATING_PDF.style.background = 'rgba(0, 0, 0, 0)';
	FLOATING_PDF.style.borderStyle = `solid`;
	FLOATING_PDF.style.borderWidth = `${floatingPDFStyleBorderWidth}px`;
	FLOATING_PDF.style.display = 'none';
	FLOATING_PDF.style.height = FLOATING_PDF_DEFAULT_HEIGHT;
	FLOATING_PDF.style.position = 'fixed';
	FLOATING_PDF.style.visibility = 'visible';
	FLOATING_PDF.style.width = FLOATING_PDF_DEFAULT_WIDTH;
	FLOATING_PDF.style.zIndex = 2147483647;
	floatingPDFAspectRatio = defaultValues.pdf.aspectRatio;
	floatingPDFIsEnabled = defaultValues.pdf.enabled;
	floatingPDFTimeout = defaultValues.pdf.delay;

	FLOATING_PDF.addEventListener('click', () => window.open(FLOATING_PDF.getAttribute('src')));

	FLOATING_PDF.addEventListener('error', () => {
		if (FLOATING_PDF.getAttribute('src') !== '') {
			toggleFloatingPDFBorderColor(CONTENT_STATE.error);
		}
	});

	FLOATING_PDF.addEventListener('load', () => {
		if (FLOATING_PDF.getAttribute('src') !== '') {
			setFloatingPDFSize(floatingPDFAspectRatio, floatingPDFAspectRatio);
			setFloatingPDFFromMousePosition(latestMousePositionX, latestMousePositionY);
			toggleFloatingPDFBorderColor(CONTENT_STATE.loaded);
		}
	});

	FLOATING_PDF.addEventListener('mouseout', event => {
		if (FLOATING_PDF.offsetHeight + FLOATING_PDF.offsetTop <= event.clientY | FLOATING_PDF.offsetLeft >= event.clientX | FLOATING_PDF.offsetLeft + FLOATING_PDF.offsetWidth <= event.clientX | FLOATING_PDF.offsetTop >= event.clientY) {
			FLOATING_PDF.removeAttribute('src');
			FLOATING_PDF.style.height = FLOATING_PDF_DEFAULT_HEIGHT;
			FLOATING_PDF.style.display = "none";
			FLOATING_PDF.style.width = FLOATING_PDF_DEFAULT_WIDTH;
			toggleFloatingPDFBorderColor(CONTENT_STATE.loaded);
		}
	});
}

function initializeVideo() {
	const FLOATING_VIDEO_DEFAULT_HEIGHT = '90px';
	const FLOATING_VIDEO_DEFAULT_WIDTH = '160px';
	FLOATING_VIDEO.autoplay = defaultValues.video.autoplay;
	FLOATING_VIDEO.controls = true;
	FLOATING_VIDEO.id = 'floatingVideo';
	FLOATING_VIDEO.loop = defaultValues.video.loop;
	FLOATING_VIDEO.style.display = 'none';
	FLOATING_VIDEO.style.height = FLOATING_VIDEO_DEFAULT_HEIGHT;
	FLOATING_VIDEO.style.position = 'fixed';
	FLOATING_VIDEO.style.visibility = 'visible';
	FLOATING_VIDEO.style.width = FLOATING_VIDEO_DEFAULT_WIDTH;
	FLOATING_VIDEO.style.zIndex = 2147483647;
	FLOATING_VIDEO.volume = defaultValues.video.volume;
	floatingVideoAspectRatio = defaultValues.video.aspectRatio;
	floatingVideoIsEnabled = defaultValues.video.enabled;
	floatingVideoTimeout = defaultValues.video.delay;

	FLOATING_VIDEO.addEventListener('mouseout', event => {
		if (document.fullscreenElement?.id !== FLOATING_VIDEO.id && FLOATING_VIDEO.offsetHeight + FLOATING_VIDEO.offsetTop <= event.clientY | FLOATING_VIDEO.offsetLeft >= event.clientX | FLOATING_VIDEO.offsetLeft + FLOATING_VIDEO.offsetWidth <= event.clientX | FLOATING_VIDEO.offsetTop >= event.clientY) {
			FLOATING_VIDEO.style.height = FLOATING_VIDEO_DEFAULT_HEIGHT;
			FLOATING_VIDEO.style.width = FLOATING_VIDEO_DEFAULT_WIDTH;
			FLOATING_VIDEO.pause();
			FLOATING_VIDEO.removeAttribute('src');
			FLOATING_VIDEO.style.display = "none";
		}
	});

	FLOATING_VIDEO.addEventListener('loadedmetadata', () => {
		setFloatingVideoSize(floatingVideoAspectRatio, floatingVideoAspectRatio);
		setFloatingVideoFromMousePosition(latestMousePositionX, latestMousePositionY);
		FLOATING_VIDEO.controls = false;
		FLOATING_VIDEO.controls = true;
	});

	FLOATING_VIDEO.addEventListener('wheel', event => {
		let floatingVideoHeightMagnification;
		let floatingVideoWidthMagnification;

		if (event.deltaY > 0) {
			floatingVideoHeightMagnification = FLOATING_VIDEO.clientHeight / window.innerHeight - 0.1;
			floatingVideoWidthMagnification = FLOATING_VIDEO.clientWidth / window.innerWidth - 0.1;
		} else {
			floatingVideoHeightMagnification = FLOATING_VIDEO.clientHeight / window.innerHeight + 0.1;
			floatingVideoWidthMagnification = FLOATING_VIDEO.clientWidth / window.innerWidth + 0.1;
		}

		if ((floatingVideoHeightMagnification > 0 || floatingVideoWidthMagnification > 0) && floatingVideoHeightMagnification < 1 && floatingVideoWidthMagnification < 1) {
			setFloatingVideoSize(floatingVideoHeightMagnification, floatingVideoWidthMagnification);
			setFloatingVideoFromMousePosition(latestMousePositionX, latestMousePositionY);
		}
		event.preventDefault();
	});
}

function addPreviewers() {
	const IS_FIRST = modifiedHyperlinks.length === 0;
	const HYPERLINKS = document.getElementsByTagName('a');
	let i = 0;
	const ADD_EVENTS = () => {
		if (floatingAudioIsEnabled && REGEX_AUDIO.test(HYPERLINKS[i].href)) {
			HYPERLINKS[i].addEventListener('mouseenter', AUDIO_MOUSE_ENTER_EVENT_LISTENER);
			HYPERLINKS[i].addEventListener('mouseleave', AUDIO_MOUSE_LEAVE_EVENT_LISTENER);
		} else if (floatingImageIsEnabled && REGEX_IMAGE.test(HYPERLINKS[i].href)) {
			HYPERLINKS[i].addEventListener('mouseenter', IMAGE_MOUSE_ENTER_EVENT_LISTENER);
			HYPERLINKS[i].addEventListener('mouseleave', IMAGE_MOUSE_LEAVE_EVENT_LISTENER);
		} else if (floatingPDFIsEnabled && REGEX_PDF.test(HYPERLINKS[i].href)) {
			HYPERLINKS[i].addEventListener('mouseenter', PDF_MOUSE_ENTER_EVENT_LISTENER);
			HYPERLINKS[i].addEventListener('mouseleave', PDF_MOUSE_LEAVE_EVENT_LISTENER);
		} else if (floatingVideoIsEnabled && REGEX_VIDEO.test(HYPERLINKS[i].href)) {
			HYPERLINKS[i].addEventListener('mouseenter', VIDEO_MOUSE_ENTER_EVENT_LISTENER);
			HYPERLINKS[i].addEventListener('mouseleave', VIDEO_MOUSE_LEAVE_EVENT_LISTENER);
		}
	};

	for (i = 0; i < HYPERLINKS.length; i++) {
		if (IS_FIRST) {
			ADD_EVENTS();
		} else if (modifiedHyperlinks.indexOf(HYPERLINKS[i]) === -1) {
			ADD_EVENTS();
			modifiedHyperlinks.push(HYPERLINKS[i]);
		}
	}

	if (IS_FIRST) {
		modifiedHyperlinks = Array.from(HYPERLINKS);
	}
}

function setFloatingAudioFromMousePosition(x, y) {
	const HEIGHT_POSITION_RATIO = y / window.innerHeight;
	const WIDTH_POSITION_RATIO = x / window.innerWidth;
	const FLOATING_AUDIO_HEIGHT = parseInt(FLOATING_AUDIO.style.height);
	const FLOATING_AUDIO_WIDTH = parseInt(FLOATING_AUDIO.style.width);
	if (FLOATING_AUDIO.clientHeight === 0 && FLOATING_AUDIO.clientWidth === 0) {
		FLOATING_AUDIO.style.top = `${y - FLOATING_AUDIO_HEIGHT * HEIGHT_POSITION_RATIO}px`;
		FLOATING_AUDIO.style.left = `${x - FLOATING_AUDIO_WIDTH * WIDTH_POSITION_RATIO}px`;
	} else {
		FLOATING_AUDIO.style.top = `${y - FLOATING_AUDIO.clientHeight * HEIGHT_POSITION_RATIO}px`;
		FLOATING_AUDIO.style.left = `${x - FLOATING_AUDIO.clientWidth * WIDTH_POSITION_RATIO}px`;
	}
}

function setFloatingImageFromMousePosition(x, y) {
	const HEIGHT_POSITION_RATIO = y / window.innerHeight;
	const WIDTH_POSITION_RATIO = x / window.innerWidth;
	if (FLOATING_IMAGE.clientHeight === 0 && FLOATING_IMAGE.clientWidth === 0) {
		FLOATING_IMAGE.style.top = `${y - parseInt(FLOATING_IMAGE.style.height) * HEIGHT_POSITION_RATIO}px`;
		FLOATING_IMAGE.style.left = `${x - parseInt(FLOATING_IMAGE.style.width) * WIDTH_POSITION_RATIO}px`;
	} else {
		FLOATING_IMAGE.style.top = `${y - (FLOATING_IMAGE.clientHeight + floatingImageStyleBorderWidth * 2) * HEIGHT_POSITION_RATIO}px`;
		FLOATING_IMAGE.style.left = `${x - (FLOATING_IMAGE.clientWidth + floatingImageStyleBorderWidth * 2) * WIDTH_POSITION_RATIO}px`;
	}
}

function setFloatingPDFFromMousePosition(x, y) {
	const HEIGHT_POSITION_RATIO = y / window.innerHeight;
	const WIDTH_POSITION_RATIO = x / window.innerWidth;
	if (FLOATING_PDF.clientHeight === 0 && FLOATING_PDF.clientWidth === 0) {
		FLOATING_PDF.style.top = `${y - parseInt(FLOATING_PDF.style.height) * HEIGHT_POSITION_RATIO}px`;
		FLOATING_PDF.style.left = `${x - parseInt(FLOATING_PDF.style.width) * WIDTH_POSITION_RATIO}px`;
	} else {
		FLOATING_PDF.style.top = `${y - (FLOATING_PDF.clientHeight + floatingPDFStyleBorderWidth * 2) * HEIGHT_POSITION_RATIO}px`;
		FLOATING_PDF.style.left = `${x - (FLOATING_PDF.clientWidth + floatingPDFStyleBorderWidth * 2) * WIDTH_POSITION_RATIO}px`;
	}
}

function setFloatingVideoFromMousePosition(x, y) {
	const HEIGHT_POSITION_RATIO = y / window.innerHeight;
	const WIDTH_POSITION_RATIO = x / window.innerWidth;
	if (FLOATING_VIDEO.clientHeight === 0 && FLOATING_VIDEO.clientWidth === 0) {
		FLOATING_VIDEO.style.top = `${y - parseInt(FLOATING_VIDEO.style.height) * HEIGHT_POSITION_RATIO}px`;
		FLOATING_VIDEO.style.left = `${x - parseInt(FLOATING_VIDEO.style.width) * WIDTH_POSITION_RATIO}px`;
	} else {
		FLOATING_VIDEO.style.top = `${y - FLOATING_VIDEO.clientHeight * HEIGHT_POSITION_RATIO}px`;
		FLOATING_VIDEO.style.left = `${x - FLOATING_VIDEO.clientWidth * WIDTH_POSITION_RATIO}px`;
	}
}

function setFloatingAudioSize(width = 0.5) {
	FLOATING_AUDIO.style.height = `${FLOATING_AUDIO_DEFAULT_HEIGHT}px`;
	FLOATING_AUDIO.style.width = `${window.innerWidth * width}px`;
}

function setFloatingImageSize(height = 0.5, width = 0.5) {
	const IMAGE_HEIGHT_RATIO = FLOATING_IMAGE.naturalHeight / window.innerHeight;
	const IMAGE_WIDTH_RATIO = FLOATING_IMAGE.naturalWidth / window.innerWidth;

	if (IMAGE_HEIGHT_RATIO > IMAGE_WIDTH_RATIO) {
		FLOATING_IMAGE.style.height = `${window.innerHeight * height}px`;
		FLOATING_IMAGE.style.width = '';
	} else {
		FLOATING_IMAGE.style.height = '';
		FLOATING_IMAGE.style.width = `${window.innerWidth * width}px`;
	}
}

function setFloatingPDFSize(height = 0.5, width = 0.5) {
	FLOATING_PDF.style.height = `${window.innerHeight * height}px`;
	FLOATING_PDF.style.width = `${window.innerWidth * width}px`;
}

function setFloatingVideoSize(height = 0.5, width = 0.5) {
	const VIDEO_HEIGHT_RATIO = parseInt(FLOATING_VIDEO.style.height) / window.innerHeight;
	const VIDEO_WIDTH_RATIO = parseInt(FLOATING_VIDEO.style.width) / window.innerWidth;

	if (VIDEO_HEIGHT_RATIO > VIDEO_WIDTH_RATIO) {
		FLOATING_VIDEO.style.height = `${window.innerHeight * height}px`;
		FLOATING_VIDEO.style.width = '';
	} else {
		FLOATING_VIDEO.style.height = '';
		FLOATING_VIDEO.style.width = `${window.innerWidth * width}px`;
	}
}

function toggleFloatingImageBorderColor(state) {
	switch (state) {
		case CONTENT_STATE.loading:
			window.clearInterval(floatingImageIntervalID);
			floatingImageIntervalID = window.setInterval(() => {
				FLOATING_IMAGE.style.borderTopColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.250)`;
				FLOATING_IMAGE.style.borderRightColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.250)`;
				FLOATING_IMAGE.style.borderBottomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.250)`;
				FLOATING_IMAGE.style.borderLeftColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.250)`;
			}, 250);
			break;
		case CONTENT_STATE.loaded:
			FLOATING_IMAGE.style.borderTopColor = 'rgba(0, 0, 0, 0.125)';
			FLOATING_IMAGE.style.borderRightColor = 'rgba(0, 0, 0, 0.125)';
			FLOATING_IMAGE.style.borderBottomColor = 'rgba(0, 0, 0, 0.125)';
			FLOATING_IMAGE.style.borderLeftColor = 'rgba(0, 0, 0, 0.125)';
			window.clearInterval(floatingImageIntervalID);
			break;
		case CONTENT_STATE.error:
			FLOATING_IMAGE.style.borderTopColor = 'rgba(255, 0, 0, 0.750)';
			FLOATING_IMAGE.style.borderRightColor = 'rgba(255, 0, 0, 0.750)';
			FLOATING_IMAGE.style.borderBottomColor = 'rgba(255, 0, 0, 0.750)';
			FLOATING_IMAGE.style.borderLeftColor = 'rgba(255, 0, 0, 0.750)';
			window.clearInterval(floatingImageIntervalID);
			break;
	}
}

function toggleFloatingPDFBorderColor(state) {
	switch (state) {
		case CONTENT_STATE.loading:
			window.clearInterval(floatingPDFIntervalID);
			floatingPDFIntervalID = window.setInterval(() => {
				FLOATING_PDF.style.borderTopColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.125)`;
				FLOATING_PDF.style.borderRightColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.125)`;
				FLOATING_PDF.style.borderBottomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.125)`;
				FLOATING_PDF.style.borderLeftColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.125)`;
			}, 250);
			break;
		case CONTENT_STATE.loaded:
			FLOATING_PDF.style.borderTopColor = 'rgba(0, 0, 0, 0.125)';
			FLOATING_PDF.style.borderRightColor = 'rgba(0, 0, 0, 0.125)';
			FLOATING_PDF.style.borderBottomColor = 'rgba(0, 0, 0, 0.125)';
			FLOATING_PDF.style.borderLeftColor = 'rgba(0, 0, 0, 0.125)';
			window.clearInterval(floatingPDFIntervalID);
			break;
		case CONTENT_STATE.error:
			FLOATING_PDF.style.borderTopColor = 'rgba(255, 0, 0, 0.750)';
			FLOATING_PDF.style.borderRightColor = 'rgba(255, 0, 0, 0.750)';
			FLOATING_PDF.style.borderBottomColor = 'rgba(255, 0, 0, 0.750)';
			FLOATING_PDF.style.borderLeftColor = 'rgba(255, 0, 0, 0.750)';
			window.clearInterval(floatingPDFIntervalID);
			break;
	}
}

async function overrideOptions() {
	storageKeys = await (await fetch(STORAGE_KEYS_JSON_PATH)).json();
	const OPTIONS = await browser.storage.sync.get(null);
	const KEYS = Object.keys(OPTIONS);
	for (const i in KEYS) {
		switch (KEYS[i]) {
			case storageKeys.refreshing.enabled:
				refreshingIsEnabled = OPTIONS[KEYS[i]];
				break;
			case storageKeys.refreshing.interval:
				refreshingInterval = OPTIONS[KEYS[i]] * 1000;
				break;
			case storageKeys.audio.aspectRatio:
				floatingAudioAspectRatio = OPTIONS[KEYS[i]];
				break;
			case storageKeys.audio.autoplay:
				FLOATING_AUDIO.autoplay = OPTIONS[KEYS[i]];
				break;
			case storageKeys.audio.delay:
				floatingAudioTimeout = OPTIONS[KEYS[i]] * 1000;
				break;
			case storageKeys.audio.enabled:
				floatingAudioIsEnabled = OPTIONS[KEYS[i]];
				break;
			case storageKeys.audio.loop:
				FLOATING_AUDIO.loop = OPTIONS[KEYS[i]];
				break;
			case storageKeys.audio.volume:
				FLOATING_AUDIO.volume = OPTIONS[KEYS[i]];
				break;
			case storageKeys.image.aspectRatio:
				floatingImageAspectRatio = OPTIONS[KEYS[i]];
				break;
			case storageKeys.image.borderWidth:
				floatingImageStyleBorderWidth = OPTIONS[KEYS[i]];
				FLOATING_IMAGE.style.borderWidth = `${floatingImageStyleBorderWidth}px`;
				break;
			case storageKeys.image.delay:
				floatingImageTimeout = OPTIONS[KEYS[i]] * 1000;
				break;
			case storageKeys.image.enabled:
				floatingImageIsEnabled = OPTIONS[KEYS[i]];
				break;
			case storageKeys.pdf.aspectRatio:
				floatingPDFAspectRatio = OPTIONS[KEYS[i]];
				break;
			case storageKeys.pdf.borderWidth:
				floatingPDFStyleBorderWidth = OPTIONS[KEYS[i]];
				FLOATING_PDF.style.borderWidth = `${floatingPDFStyleBorderWidth}px`;
				break;
			case storageKeys.pdf.delay:
				floatingPDFTimeout = OPTIONS[KEYS[i]] * 1000;
				break;
			case storageKeys.pdf.enabled:
				floatingPDFIsEnabled = OPTIONS[KEYS[i]];
				break;
			case storageKeys.video.aspectRatio:
				floatingVideoAspectRatio = OPTIONS[KEYS[i]];
				break;
			case storageKeys.video.autoplay:
				FLOATING_VIDEO.autoplay = OPTIONS[KEYS[i]];
				break;
			case storageKeys.video.delay:
				floatingVideoTimeout = OPTIONS[KEYS[i]] * 1000;
				break;
			case storageKeys.video.enabled:
				floatingVideoIsEnabled = OPTIONS[KEYS[i]];
				break;
			case storageKeys.video.loop:
				FLOATING_VIDEO.loop = OPTIONS[KEYS[i]];
				break;
			case storageKeys.video.volume:
				FLOATING_VIDEO.volume = OPTIONS[KEYS[i]];
				break;
		}
	}
}
