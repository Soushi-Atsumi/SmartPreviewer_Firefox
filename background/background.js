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

main();

function main() {
	defaultValuesXmlHttpRequest.open('GET', browser.runtime.getURL('/_values/defaultValues.json'), false);
	defaultValuesXmlHttpRequest.send();
	defaultValues = JSON.parse(defaultValuesXmlHttpRequest.responseText);
	storageKeysXmlHttpRequest.open('GET', browser.runtime.getURL('/_values/storageKeys.json'), false);
	storageKeysXmlHttpRequest.send();
	storageKeys = JSON.parse(storageKeysXmlHttpRequest.responseText);

	browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.file === 'defaultValues.json') {
			sendResponse(defaultValues);
		} else if (message.file === 'storageKeys.json') {
			sendResponse(storageKeys);
		}
	});
}
