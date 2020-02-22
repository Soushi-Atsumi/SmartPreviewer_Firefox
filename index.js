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

document.getElementsByTagName('html')[0].lang = browser.i18n.getUILanguage();
document.title = browser.i18n.getMessage('indexHTMLTitle');
document.getElementById('tutorialTitleLabel').innerText = browser.i18n.getMessage('tutorialTitle');
document.getElementById('icon').alt = browser.i18n.getMessage('iconImageAlt');
document.getElementById('listItem1').innerText = browser.i18n.getMessage('common');
document.getElementById('tutorialCommon1').innerText = browser.i18n.getMessage('tutorialCommon1');
document.getElementById('tutorialCommon2').innerText = browser.i18n.getMessage('tutorialCommon2');
document.getElementById('tutorialCommon3').innerText = browser.i18n.getMessage('tutorialCommon3');
document.getElementById('listItem2').innerText = browser.i18n.getMessage('audio');
document.getElementById('tutorialAudio1').innerText = browser.i18n.getMessage('tutorialAudio1');
document.getElementById('tutorialAudio2').innerText = browser.i18n.getMessage('tutorialAudio2');
document.getElementById('listItem3').innerText = browser.i18n.getMessage('image');
document.getElementById('tutorialImage1').innerText = browser.i18n.getMessage('tutorialImage1');
document.getElementById('tutorialImage2').innerText = browser.i18n.getMessage('tutorialImage2');
document.getElementById('tutorialImage3').innerText = browser.i18n.getMessage('tutorialImage3');
document.getElementById('tutorialImage4').innerText = browser.i18n.getMessage('tutorialImage4');
document.getElementById('tutorialImage5').innerText = browser.i18n.getMessage('tutorialImage5');
document.getElementById('listItem4').innerText = browser.i18n.getMessage('pdf');
document.getElementById('tutorialPDF1').innerText = browser.i18n.getMessage('tutorialPDF1');
document.getElementById('tutorialPDF2').innerText = browser.i18n.getMessage('tutorialPDF2');
document.getElementById('tutorialPDF3').innerText = browser.i18n.getMessage('tutorialPDF3');
document.getElementById('tutorialPDF4').innerText = browser.i18n.getMessage('tutorialPDF4');
document.getElementById('listItem5').innerText = browser.i18n.getMessage('video');
document.getElementById('tutorialVideo1').innerText = browser.i18n.getMessage('tutorialVideo1');
document.getElementById('tutorialVideo2').innerText = browser.i18n.getMessage('tutorialVideo2');

var tutorialVideoAnchor = document.getElementById('tutorialVideoAnchor');
tutorialVideoAnchor.innerText = browser.i18n.getMessage('watchTheVideo');
tutorialVideoAnchor.href = browser.i18n.getMessage('tutorialVideoHyperlink');
document.getElementById('contentPermissionReasonDivision').innerText = browser.i18n.getMessage('contentPermissionReason');
document.getElementById('contentPermissionReasonDescriptionDivision').innerText = browser.i18n.getMessage('contentPermissionReasonDescription');
document.getElementById('cautionDivision1').innerText = browser.i18n.getMessage('indexHTMLCaution1');
