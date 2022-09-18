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

main();

function main() {
	document.getElementsByTagName('html')[0].lang = browser.i18n.getUILanguage();
	document.title = browser.i18n.getMessage('popupHTMLTitle');
	document.getElementById('extensionNameLabel').innerText = browser.i18n.getMessage('extensionName');
	document.getElementById('icon').alt = browser.i18n.getMessage('iconImageAlt');
	const INDEX_PAGE_ANCHOR = document.getElementById('indexPageAnchor');
	INDEX_PAGE_ANCHOR.innerText = browser.i18n.getMessage('openUsage');
	INDEX_PAGE_ANCHOR.href = '/index.html';
	const OPTIONS_PAGE_ANCHOR = document.getElementById('optionsPageAnchor');
	OPTIONS_PAGE_ANCHOR.innerText = browser.i18n.getMessage('openOptions');
	OPTIONS_PAGE_ANCHOR.href = '/options/options.html';
}
