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

var storageKeys;
var defaultValues;
var latestMousePositionX = 0;
var latestMousePositionY = 0;
const contentState = { loading: 0, loaded: 1, error: 2 };
var modifiedHyperlinks = [];

//Refreshing
var refreshingIsEnabled;
var refreshingInterval;

//Audio
const floatingAudio = document.createElement('audio');
var floatingAudioAspectRatio;
const floatingAudioDefaultHeight = 40;
var floatingAudioIsEnabled;
var floatingAudioTimeoutID = 0;
var floatingAudioTimeout;
const audioExtensions = ['aac', 'flac', 'm4a', 'mp3', 'ogg', 'wav'];
const regexAudio = new RegExp(`https?:\\/\\/.*\\/.*\\.(${audioExtensions.join('|')})`, 'i');
const regexAudioRepeating = new RegExp(`.https?:\\/\\/.*\\/.*\\.(${audioExtensions.join('|')})`, 'i');
const audioMouseEnterEventListener = function audioMouseEnterEventListener(event) {
	if (!event.shiftKey) {
		window.clearTimeout(floatingAudioTimeoutID);
		floatingAudioTimeoutID = window.setTimeout(function () {
			let targetHref = event.target.href;
			latestMousePositionX = event.clientX;
			latestMousePositionY = event.clientY;

			if (targetHref.match(regexAudio) === null) {
				floatingAudio.removeAttribute('src');
			} else if (targetHref.match(regexAudioRepeating) === null) {
				floatingAudio.setAttribute('src', targetHref.match(regexAudio)[0]);
			} else {
				let result = targetHref.match(regexAudioRepeating);
				while (result !== null) {
					targetHref = result[0].match(regexAudio)[0];
					result = targetHref.match(regexAudioRepeating);
				}

				floatingAudio.setAttribute('src', targetHref);
			}

			if (floatingAudio.getAttribute('src') !== '') {
				setFloatingAudioSize();
				setFloatingAudioFromMousePosition(latestMousePositionX, latestMousePositionY);
				floatingAudio.style.display = 'inline-block';
				return;
			}
		}, floatingAudioTimeout);
	}
};
const audioMouseLeaveEventListener = function audioMouseLeaveEventListener() { window.clearTimeout(floatingAudioTimeoutID); };

//Image
const floatingImage = document.createElement('img');
var floatingImageAspectRatio;
var floatingImageIntervalID = 0;
var floatingImageIsEnabled;
var floatingImageStyleBorderWidth;
var floatingImageTimeoutID = 0;
var floatingImageTimeout;
const imageExtensions = ['gif', 'gifv', 'ico', 'jpeg', 'jpg', 'png', 'svg'];
const regexImage = new RegExp(`https?:\\/\\/.*\\/.*\\.(${imageExtensions.join('|')})`, 'i');
const regexImageRepeating = new RegExp(`.https?:\\/\\/.*\\/.*\\.(${imageExtensions.join('|')})`, 'i');
const imageMouseEnterEventListener = function imageMouseEnterEventListener(event) {
	if (!event.shiftKey) {
		window.clearTimeout(floatingImageTimeoutID);
		floatingImageTimeoutID = window.setTimeout(function () {
			let targetHref = event.target.href;
			latestMousePositionX = event.clientX;
			latestMousePositionY = event.clientY;

			if (targetHref.match(regexImage) === null) {
				floatingImage.removeAttribute('src');
			} else if (targetHref.match(regexImageRepeating) === null) {
				floatingImage.setAttribute('src', targetHref.match(regexImage)[0]);
			} else {
				let result = targetHref.match(regexImageRepeating);
				while (result !== null) {
					targetHref = result[0].match(regexImage)[0];
					result = targetHref.match(regexImageRepeating);
				}

				floatingImage.setAttribute('src', targetHref);
			}

			if (floatingImage.getAttribute('src') !== '') {
				setFloatingImageFromMousePosition(latestMousePositionX, latestMousePositionY);
				toggleFloatingImageBorderColor(contentState.loading);
				floatingImage.style.display = 'inline-block';
				return;
			}
		}, floatingImageTimeout);
	}
};
const imageMouseLeaveEventListener = function imageMouseLeaveEventListener() { window.clearTimeout(floatingImageTimeoutID); };

//PDF
const floatingPDF = document.createElement('iframe');
var floatingPDFAspectRatio;
var floatingPDFIntervalID = 0;
var floatingPDFIsEnabled;
var floatingPDFStyleBorderWidth;
var floatingPDFTimeoutID = 0;
var floatingPDFTimeout;
const pdfExtensions = ['pdf'];
const regexPDF = new RegExp(`https?:\\/\\/.*\\/.*\\.(${pdfExtensions.join('|')})`, 'i');
const regexPDFRepeating = new RegExp(`.https?:\\/\\/.*\\/.*\\.(${pdfExtensions.join('|')})`, 'i');
const pdfMouseEnterEventListener = function pdfMouseEnterEventListener(event) {
	if (!event.shiftKey) {
		window.clearTimeout(floatingPDFTimeoutID);
		floatingPDFTimeoutID = window.setTimeout(function () {
			let targetHref = event.target.href;
			latestMousePositionX = event.clientX;
			latestMousePositionY = event.clientY;

			if (targetHref.match(regexPDF) === null) {
				floatingPDF.removeAttribute('src');
			} else if (targetHref.match(regexPDFRepeating) === null) {
				floatingPDF.setAttribute('src', targetHref.match(regexPDF)[0]);
			} else {
				let result = targetHref.match(regexPDFRepeating);
				while (result !== null) {
					targetHref = result[0].match(regexPDF)[0];
					result = targetHref.match(regexPDFRepeating);
				}

				floatingPDF.setAttribute('src', targetHref);
			}

			if (floatingPDF.getAttribute('src') !== '') {
				setFloatingPDFFromMousePosition(latestMousePositionX, latestMousePositionY);
				toggleFloatingPDFBorderColor(contentState.loading);
				floatingPDF.style.display = 'inline-block';
				return;
			}
		}, floatingPDFTimeout);
	}
};
const pdfMouseLeaveEventListener = function pdfMouseLeaveEventListener() { window.clearTimeout(floatingPDFTimeoutID); };

//Video
const floatingVideo = document.createElement('video');
var floatingVideoAspectRatio;
var floatingVideoIsEnabled;
var floatingVideoTimeoutID = 0;
var floatingVideoTimeout;
const videoExtensions = ['mov', 'mp4', 'webm', 'wmv'];
const regexVideo = new RegExp(`https?:\\/\\/.*\\/.*\\.(${videoExtensions.join('|')})`, 'i');
const regexVideoRepeating = new RegExp(`.https?:\\/\\/.*\\/.*\\.(${videoExtensions.join('|')})`, 'i');
const videoMouseEnterEventListener = function videoMouseEnterEventListener(event) {
	if (!event.shiftKey) {
		window.clearTimeout(floatingVideoTimeoutID);
		floatingVideoTimeoutID = window.setTimeout(function () {
			let targetHref = event.target.href;
			latestMousePositionX = event.clientX;
			latestMousePositionY = event.clientY;

			if (targetHref.match(regexVideo) === null) {
				floatingVideo.removeAttribute('src');
			} else if (targetHref.match(regexVideoRepeating) === null) {
				floatingVideo.setAttribute('src', targetHref.match(regexVideo)[0]);
			} else {
				let result = targetHref.match(regexVideoRepeating);
				while (result !== null) {
					targetHref = result[0].match(regexVideo)[0];
					result = targetHref.match(regexVideoRepeating);
				}

				floatingVideo.setAttribute('src', targetHref);
			}

			if (floatingVideo.getAttribute('src') !== '') {
				setFloatingVideoFromMousePosition(latestMousePositionX, latestMousePositionY);
				floatingVideo.style.display = 'inline-block';
				return;
			}
		}, floatingVideoTimeout);
	}
};
const videoMouseLeaveEventListener = function videoMouseLeaveEventListener() { window.clearTimeout(floatingVideoTimeoutID); };

main();

function main() {
	readDefaultValues().then(() => {
		if (defaultValues !== undefined) {
			initializeRefreshing();
			initializeAudio();
			initializeImage();
			initializePDF();
			initializeVideo();
			overrideOptions().then(() => {
				//Audio
				floatingAudioIsEnabled && document.body.appendChild(floatingAudio);
				//Image
				floatingImageIsEnabled && document.body.appendChild(floatingImage);
				//PDF
				floatingPDFIsEnabled && document.body.appendChild(floatingPDF);
				//Video
				floatingVideoIsEnabled && document.body.appendChild(floatingVideo);

				addPreviewers();
				if (refreshingIsEnabled) {
					window.setInterval(() => {
						addPreviewers();
					}, refreshingInterval);
				}
			});
		}
	});
}

function initializeRefreshing() {
	refreshingIsEnabled = defaultValues.refreshing.enabled;
	refreshingInterval = defaultValues.refreshing.interval * 1000;
}

function initializeAudio() {
	floatingAudio.autoplay = defaultValues.audio.autoplay;
	floatingAudio.controls = true;
	floatingAudio.id = 'floatingAudio';
	floatingAudio.loop = defaultValues.audio.loop;
	floatingAudio.style.display = 'none';
	floatingAudio.style.height = `${floatingAudioDefaultHeight}px`;
	floatingAudio.style.position = 'fixed';
	floatingAudio.style.zIndex = 2147483647;
	floatingAudio.volume = defaultValues.audio.volume;
	floatingAudioAspectRatio = defaultValues.audio.aspectRatio;
	floatingAudioIsEnabled = defaultValues.audio.enabled;
	floatingAudioTimeout = defaultValues.audio.delay;

	floatingAudio.addEventListener('loadedmetadata', () => {
		setFloatingAudioSize(floatingAudioAspectRatio);
		setFloatingAudioFromMousePosition(latestMousePositionX, latestMousePositionY);
	});

	floatingAudio.addEventListener('mouseout', (event) => {
		if (floatingAudio.offsetHeight + floatingAudio.offsetTop <= event.clientY | floatingAudio.offsetLeft >= event.clientX | floatingAudio.offsetLeft + floatingAudio.offsetWidth <= event.clientX | floatingAudio.offsetTop >= event.clientY) {
			floatingAudio.style.display = "none";
			floatingAudio.removeAttribute('src');
			floatingAudio.pause();
		}
	});

	floatingAudio.addEventListener('wheel', (event) => {
		let floatingAudioWidthMagnification;

		if (event.deltaY > 0) {
			floatingAudioWidthMagnification = floatingAudio.clientWidth / window.innerWidth - 0.1;
		} else {
			floatingAudioWidthMagnification = floatingAudio.clientWidth / window.innerWidth + 0.1;
		}

		if (floatingAudioWidthMagnification > 0 && floatingAudioWidthMagnification < 1) {
			setFloatingAudioSize(floatingAudioWidthMagnification);
			setFloatingAudioFromMousePosition(latestMousePositionX, latestMousePositionY);
		}
		event.preventDefault();
	});
}

function initializeImage() {
	const floatingImageDefaultHeight = 100;
	const floatingImageDefaultWidth = 100;
	floatingImageStyleBorderWidth = defaultValues.image.borderWidth;
	floatingImage.id = 'floatingImage';
	floatingImage.height = floatingImageDefaultHeight;
	floatingImage.style.borderStyle = `solid`;
	floatingImage.style.borderWidth = `${floatingImageStyleBorderWidth}px`;
	floatingImage.style.display = 'none';
	floatingImage.style.position = 'fixed';
	floatingImage.style.zIndex = 2147483647;
	floatingImage.width = floatingImageDefaultWidth;
	floatingImageAspectRatio = defaultValues.image.aspectRatio;
	floatingImageIsEnabled = defaultValues.image.enabled;
	floatingImageTimeout = defaultValues.image.delay;

	floatingImage.addEventListener('click', (event) => {
		if (event.button === 0) {
			if (event.ctrlKey) {
				window.open(floatingImage.getAttribute('src'));
			} else {
				floatingImage.style.display = "none";
			}
		}
	});

	floatingImage.addEventListener('error', (reason) => {
		if (floatingImage.getAttribute('src') !== '') {
			toggleFloatingImageBorderColor(contentState.error);
		}
	});

	floatingImage.addEventListener('load', () => {
		setFloatingImageSize(floatingImageAspectRatio, floatingImageAspectRatio);
		setFloatingImageFromMousePosition(latestMousePositionX, latestMousePositionY);
		toggleFloatingImageBorderColor(contentState.loaded);
	});

	floatingImage.addEventListener('mouseout', (event) => {
		if (floatingImage.offsetHeight + floatingImage.offsetTop <= event.clientY | floatingImage.offsetLeft >= event.clientX | floatingImage.offsetLeft + floatingImage.offsetWidth <= event.clientX | floatingImage.offsetTop >= event.clientY) {
			floatingImage.removeAttribute('src');
			floatingImage.style.display = "none";
			floatingImage.height = floatingImageDefaultHeight;
			floatingImage.width = floatingImageDefaultWidth;
			toggleFloatingImageBorderColor(contentState.loaded);
		}
	});

	floatingImage.addEventListener('wheel', (event) => {
		let floatingImageHeightMagnification;
		let floatingImageWidthMagnification;

		if (event.deltaY > 0) {
			floatingImageHeightMagnification = floatingImage.clientHeight / window.innerHeight - 0.1;
			floatingImageWidthMagnification = floatingImage.clientWidth / window.innerWidth - 0.1;
		} else {
			floatingImageHeightMagnification = floatingImage.clientHeight / window.innerHeight + 0.1;
			floatingImageWidthMagnification = floatingImage.clientWidth / window.innerWidth + 0.1;
		}

		if (floatingImageHeightMagnification > 0 && floatingImageWidthMagnification > 0 && floatingImageHeightMagnification < 1 && floatingImageWidthMagnification < 1) {
			setFloatingImageSize(floatingImageHeightMagnification, floatingImageWidthMagnification);
			setFloatingImageFromMousePosition(latestMousePositionX, latestMousePositionY);
		}
		event.preventDefault();
	});
}

function initializePDF() {
	const floatingPDFDefaultHeight = 100;
	const floatingPDFDefaultWidth = 100;
	floatingPDFStyleBorderWidth = defaultValues.pdf.borderWidth;
	floatingPDF.id = 'floatingPDF';
	floatingPDF.height = floatingPDFDefaultHeight;
	floatingPDF.style.background = 'rgba(0, 0, 0, 0)';
	floatingPDF.style.borderStyle = `solid`;
	floatingPDF.style.borderWidth = `${floatingPDFStyleBorderWidth}px`;
	floatingPDF.style.display = 'none';
	floatingPDF.style.position = 'fixed';
	floatingPDF.style.zIndex = 2147483647;
	floatingPDF.width = floatingPDFDefaultWidth;
	floatingPDFAspectRatio = defaultValues.pdf.aspectRatio;
	floatingPDFIsEnabled = defaultValues.pdf.enabled;
	floatingPDFTimeout = defaultValues.pdf.delay;

	floatingPDF.addEventListener('click', () => {
		window.open(floatingPDF.getAttribute('src'));
	});

	floatingPDF.addEventListener('error', () => {
		if (floatingPDF.getAttribute('src') !== '') {
			toggleFloatingPDFBorderColor(contentState.error);
		}
	});

	floatingPDF.addEventListener('load', () => {
		if (floatingPDF.getAttribute('src') !== '') {
			setFloatingPDFSize(floatingPDFAspectRatio, floatingPDFAspectRatio);
			setFloatingPDFFromMousePosition(latestMousePositionX, latestMousePositionY);
			toggleFloatingPDFBorderColor(contentState.loaded);
		}
	});

	floatingPDF.addEventListener('mouseout', (event) => {
		if (floatingPDF.offsetHeight + floatingPDF.offsetTop <= event.clientY | floatingPDF.offsetLeft >= event.clientX | floatingPDF.offsetLeft + floatingPDF.offsetWidth <= event.clientX | floatingPDF.offsetTop >= event.clientY) {
			floatingPDF.height = floatingPDFDefaultHeight;
			floatingPDF.removeAttribute('src');
			floatingPDF.style.display = "none";
			floatingPDF.width = floatingPDFDefaultWidth;
			toggleFloatingPDFBorderColor(contentState.loaded);
		}
	});
}

function initializeVideo() {
	const floatingVideoDefaultHeight = 90;
	const floatingVideoDefaultWidth = 160;
	floatingVideo.autoplay = defaultValues.video.autoplay;
	floatingVideo.controls = true;
	floatingVideo.height = floatingVideoDefaultHeight;
	floatingVideo.id = 'floatingVideo';
	floatingVideo.loop = defaultValues.video.loop;
	floatingVideo.style.display = 'none';
	floatingVideo.style.position = 'fixed';
	floatingVideo.style.zIndex = 2147483647;
	floatingVideo.volume = defaultValues.video.volume;
	floatingVideo.width = floatingVideoDefaultWidth;
	floatingVideoAspectRatio = defaultValues.video.aspectRatio;
	floatingVideoIsEnabled = defaultValues.video.enabled;
	floatingVideoTimeout = defaultValues.video.delay;

	floatingVideo.addEventListener('loadedmetadata', () => {
		setFloatingVideoSize(floatingVideoAspectRatio, floatingVideoAspectRatio);
		setFloatingVideoFromMousePosition(latestMousePositionX, latestMousePositionY);
	});

	floatingVideo.addEventListener('mouseout', (event) => {
		let firefoxIsFullScreen = document.mozFullScreenElement === undefined ? false : document.mozFullScreenElement !== null && document.mozFullScreenElement.id === floatingVideo.id;

		if (!firefoxIsFullScreen && floatingVideo.offsetHeight + floatingVideo.offsetTop <= event.clientY | floatingVideo.offsetLeft >= event.clientX | floatingVideo.offsetLeft + floatingVideo.offsetWidth <= event.clientX | floatingVideo.offsetTop >= event.clientY) {
			floatingVideo.height = floatingVideoDefaultHeight;
			floatingVideo.width = floatingVideoDefaultWidth;
			floatingVideo.pause();
			floatingVideo.removeAttribute('src');
			floatingVideo.style.display = "none";
		}
	});

	document.addEventListener('mozfullscreenchange', () => {
		let firefoxIsFullScreen = document.mozFullScreenElement === undefined ? false : document.mozFullScreenElement !== null && document.mozFullScreenElement.id === floatingVideo.id;

		if (!firefoxIsFullScreen) {
			floatingVideo.height = floatingVideoDefaultHeight;
			floatingVideo.width = floatingVideoDefaultWidth;
			floatingVideo.pause();
			floatingVideo.removeAttribute('src');
			floatingVideo.style.display = "none";
		}
	});

	floatingVideo.addEventListener('wheel', (event) => {
		let floatingVideoHeightMagnification;
		let floatingVideoWidthMagnification;

		if (event.deltaY > 0) {
			floatingVideoHeightMagnification = floatingVideo.clientHeight / window.innerHeight - 0.1;
			floatingVideoWidthMagnification = floatingVideo.clientWidth / window.innerWidth - 0.1;
		} else {
			floatingVideoHeightMagnification = floatingVideo.clientHeight / window.innerHeight + 0.1;
			floatingVideoWidthMagnification = floatingVideo.clientWidth / window.innerWidth + 0.1;
		}

		if (floatingVideoHeightMagnification > 0 && floatingVideoWidthMagnification > 0 && floatingVideoHeightMagnification < 1 && floatingVideoWidthMagnification < 1) {
			setFloatingVideoSize(floatingVideoHeightMagnification, floatingVideoWidthMagnification);
			setFloatingVideoFromMousePosition(latestMousePositionX, latestMousePositionY);
		}
		event.preventDefault();
	});
}

function addPreviewers() {
	const isFirst = modifiedHyperlinks.length === 0;
	let hyperlinks = document.getElementsByTagName('a');
	let i = 0;
	const addEvents = () => {
		if (floatingAudioIsEnabled && regexAudio.test(hyperlinks[i].href)) {
			hyperlinks[i].addEventListener('mouseenter', audioMouseEnterEventListener);
			hyperlinks[i].addEventListener('mouseleave', audioMouseLeaveEventListener);
		} else if (floatingImageIsEnabled && regexImage.test(hyperlinks[i].href)) {
			hyperlinks[i].addEventListener('mouseenter', imageMouseEnterEventListener);
			hyperlinks[i].addEventListener('mouseleave', imageMouseLeaveEventListener);
		} else if (floatingPDFIsEnabled && regexPDF.test(hyperlinks[i].href)) {
			hyperlinks[i].addEventListener('mouseenter', pdfMouseEnterEventListener);
			hyperlinks[i].addEventListener('mouseleave', pdfMouseLeaveEventListener);
		} else if (floatingVideoIsEnabled && regexVideo.test(hyperlinks[i].href)) {
			hyperlinks[i].addEventListener('mouseenter', videoMouseEnterEventListener);
			hyperlinks[i].addEventListener('mouseleave', videoMouseLeaveEventListener);
		}
	};

	for (i = 0; i < hyperlinks.length; i++) {
		if (isFirst) {
			addEvents();
		} else if (modifiedHyperlinks.indexOf(hyperlinks[i]) === -1) {
			addEvents();
			modifiedHyperlinks.push(hyperlinks[i]);
		}
	}

	if (isFirst) {
		modifiedHyperlinks = Array.from(hyperlinks);
	}
}

function setFloatingAudioFromMousePosition(x, y) {
	let heightPositionRatio = y / window.innerHeight;
	let widthPositionRatio = x / window.innerWidth;
	let floatingAudioHeight = parseInt(floatingAudio.style.height, 10);
	let floatingAudioWidth = parseInt(floatingAudio.style.width, 10);
	if (floatingAudio.clientHeight === 0 && floatingAudio.clientWidth === 0) {
		floatingAudio.style.top = `${y - floatingAudioHeight * heightPositionRatio}px`;
		floatingAudio.style.left = `${x - floatingAudioWidth * widthPositionRatio}px`;
	} else {
		floatingAudio.style.top = `${y - floatingAudio.clientHeight * heightPositionRatio}px`;
		floatingAudio.style.left = `${x - floatingAudio.clientWidth * widthPositionRatio}px`;
	}
}

function setFloatingImageFromMousePosition(x, y) {
	let heightPositionRatio = y / window.innerHeight;
	let widthPositionRatio = x / window.innerWidth;
	if (floatingImage.clientHeight === 0 && floatingImage.clientWidth === 0) {
		floatingImage.style.top = `${y - floatingImage.height * heightPositionRatio}px`;
		floatingImage.style.left = `${x - floatingImage.width * widthPositionRatio}px`;
	} else {
		floatingImage.style.top = `${y - (floatingImage.clientHeight + floatingImageStyleBorderWidth * 2) * heightPositionRatio}px`;
		floatingImage.style.left = `${x - (floatingImage.clientWidth + floatingImageStyleBorderWidth * 2) * widthPositionRatio}px`;
	}
}

function setFloatingPDFFromMousePosition(x, y) {
	let heightPositionRatio = y / window.innerHeight;
	let widthPositionRatio = x / window.innerWidth;
	if (floatingPDF.clientHeight === 0 && floatingPDF.clientWidth === 0) {
		floatingPDF.style.top = `${y - floatingPDF.height * heightPositionRatio}px`;
		floatingPDF.style.left = `${x - floatingPDF.width * widthPositionRatio}px`;
	} else {
		floatingPDF.style.top = `${y - (floatingPDF.clientHeight + floatingPDFStyleBorderWidth * 2) * heightPositionRatio}px`;
		floatingPDF.style.left = `${x - (floatingPDF.clientWidth + floatingPDFStyleBorderWidth * 2) * widthPositionRatio}px`;
	}
}

function setFloatingVideoFromMousePosition(x, y) {
	let heightPositionRatio = y / window.innerHeight;
	let widthPositionRatio = x / window.innerWidth;
	if (floatingVideo.clientHeight === 0 && floatingVideo.clientWidth === 0) {
		floatingVideo.style.top = `${y - floatingVideo.height * heightPositionRatio}px`;
		floatingVideo.style.left = `${x - floatingVideo.width * widthPositionRatio}px`;
	} else {
		floatingVideo.style.top = `${y - floatingVideo.clientHeight * heightPositionRatio}px`;
		floatingVideo.style.left = `${x - floatingVideo.clientWidth * widthPositionRatio}px`;
	}
}

function setFloatingAudioSize(width = 0.5) {
	floatingAudio.style.height = `${floatingAudioDefaultHeight}px`;
	floatingAudio.style.width = `${window.innerWidth * width}px`;
}

function setFloatingImageSize(height = 0.5, width = 0.5) {
	let imageHeightRatio = floatingImage.naturalHeight / window.innerHeight;
	let imageWidthRatio = floatingImage.naturalWidth / window.innerWidth;

	if (imageHeightRatio > imageWidthRatio) {
		floatingImage.height = window.innerHeight * height;
		floatingImage.removeAttribute('width');
	} else {
		floatingImage.removeAttribute('height');
		floatingImage.width = window.innerWidth * width;
	}
}

function setFloatingPDFSize(height = 0.5, width = 0.5) {
	floatingPDF.height = `${window.innerHeight * height}px`;
	floatingPDF.width = `${window.innerWidth * width}px`;
}

function setFloatingVideoSize(height = 0.5, width = 0.5) {
	let videoHeightRatio = floatingVideo.height / window.innerHeight;
	let videoWidthRatio = floatingVideo.width / window.innerWidth;

	if (videoHeightRatio > videoWidthRatio) {
		floatingVideo.height = window.innerHeight * height;
		floatingVideo.removeAttribute('width');
	} else {
		floatingVideo.removeAttribute('height');
		floatingVideo.width = window.innerWidth * width;
	}
}

function toggleFloatingImageBorderColor(state) {
	switch (state) {
		case contentState.loading:
			window.clearInterval(floatingImageIntervalID);
			floatingImageIntervalID = window.setInterval(function () {
				floatingImage.style.borderTopColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.250)`;
				floatingImage.style.borderRightColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.250)`;
				floatingImage.style.borderBottomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.250)`;
				floatingImage.style.borderLeftColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.250)`;
			}, 250);
			break;
		case contentState.loaded:
			floatingImage.style.borderTopColor = 'rgba(0, 0, 0, 0.125)';
			floatingImage.style.borderRightColor = 'rgba(0, 0, 0, 0.125)';
			floatingImage.style.borderBottomColor = 'rgba(0, 0, 0, 0.125)';
			floatingImage.style.borderLeftColor = 'rgba(0, 0, 0, 0.125)';
			window.clearInterval(floatingImageIntervalID);
			break;
		case contentState.error:
			floatingImage.style.borderTopColor = 'rgba(255, 0, 0, 0.750)';
			floatingImage.style.borderRightColor = 'rgba(255, 0, 0, 0.750)';
			floatingImage.style.borderBottomColor = 'rgba(255, 0, 0, 0.750)';
			floatingImage.style.borderLeftColor = 'rgba(255, 0, 0, 0.750)';
			window.clearInterval(floatingImageIntervalID);
			break;
	}
}

function toggleFloatingPDFBorderColor(state) {
	switch (state) {
		case contentState.loading:
			window.clearInterval(floatingPDFIntervalID);
			floatingPDFIntervalID = window.setInterval(function () {
				floatingPDF.style.borderTopColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.125)`;
				floatingPDF.style.borderRightColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.125)`;
				floatingPDF.style.borderBottomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.125)`;
				floatingPDF.style.borderLeftColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.125)`;
			}, 250);
			break;
		case contentState.loaded:
			floatingPDF.style.borderTopColor = 'rgba(0, 0, 0, 0.125)';
			floatingPDF.style.borderRightColor = 'rgba(0, 0, 0, 0.125)';
			floatingPDF.style.borderBottomColor = 'rgba(0, 0, 0, 0.125)';
			floatingPDF.style.borderLeftColor = 'rgba(0, 0, 0, 0.125)';
			window.clearInterval(floatingPDFIntervalID);
			break;
		case contentState.error:
			floatingPDF.style.borderTopColor = 'rgba(255, 0, 0, 0.750)';
			floatingPDF.style.borderRightColor = 'rgba(255, 0, 0, 0.750)';
			floatingPDF.style.borderBottomColor = 'rgba(255, 0, 0, 0.750)';
			floatingPDF.style.borderLeftColor = 'rgba(255, 0, 0, 0.750)';
			window.clearInterval(floatingPDFIntervalID);
			break;
	}
}

function readDefaultValues() {
	return new Promise((resolve, _) => {
		browser.runtime.sendMessage({ 'file': 'defaultValues.json' }, (message) => {
			defaultValues = message;

			resolve(true);
		});
	});
}

function overrideOptions() {
	return new Promise((resolve, _) => {
		browser.runtime.sendMessage({ 'file': 'storageKeys.json' }, (message) => {
			storageKeys = message;
			browser.storage.sync.get(null, (options) => {
				let keys = Object.keys(options);
				for (let i in keys) {
					switch (keys[i]) {
						case storageKeys.refreshing.enabled:
							refreshingIsEnabled = options[keys[i]];
							break;
						case storageKeys.refreshing.interval:
							refreshingInterval = options[keys[i]] * 1000;
							break;
						case storageKeys.audio.aspectRatio:
							floatingAudioAspectRatio = options[keys[i]];
							break;
						case storageKeys.audio.autoplay:
							floatingAudio.autoplay = options[keys[i]];
							break;
						case storageKeys.audio.delay:
							floatingAudioTimeout = options[keys[i]] * 1000;
							break;
						case storageKeys.audio.enabled:
							floatingAudioIsEnabled = options[keys[i]];
							break;
						case storageKeys.audio.loop:
							floatingAudio.loop = options[keys[i]];
							break;
						case storageKeys.audio.volume:
							floatingAudio.volume = options[keys[i]];
							break;
						case storageKeys.image.aspectRatio:
							floatingImageAspectRatio = options[keys[i]];
							break;
						case storageKeys.image.borderWidth:
							floatingImageStyleBorderWidth = options[keys[i]];
							floatingImage.style.borderWidth = `${floatingImageStyleBorderWidth}px`;
							break;
						case storageKeys.image.delay:
							floatingImageTimeout = options[keys[i]] * 1000;
							break;
						case storageKeys.image.enabled:
							floatingImageIsEnabled = options[keys[i]];
							break;
						case storageKeys.pdf.aspectRatio:
							floatingPDFAspectRatio = options[keys[i]];
							break;
						case storageKeys.pdf.borderWidth:
							floatingPDFStyleBorderWidth = options[keys[i]];
							floatingPDF.style.borderWidth = `${floatingPDFStyleBorderWidth}px`;
							break;
						case storageKeys.pdf.delay:
							floatingPDFTimeout = options[keys[i]] * 1000;
							break;
						case storageKeys.pdf.enabled:
							floatingPDFIsEnabled = options[keys[i]];
							break;
						case storageKeys.video.aspectRatio:
							floatingVideoAspectRatio = options[keys[i]];
							break;
						case storageKeys.video.autoplay:
							floatingVideo.autoplay = options[keys[i]];
							break;
						case storageKeys.video.delay:
							floatingVideoTimeout = options[keys[i]] * 1000;
							break;
						case storageKeys.video.enabled:
							floatingVideoIsEnabled = options[keys[i]];
							break;
						case storageKeys.video.loop:
							floatingVideo.loop = options[keys[i]];
							break;
						case storageKeys.video.volume:
							floatingVideo.volume = options[keys[i]];
							break;
					}
				}

				resolve(true);
			});
		});
	});
}
