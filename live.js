window[btoa("liveness_detection")] = async function () {
    let domain = window[btoa("WWW")]?.location?.href?.split("/")[2]?.toLowerCase();

    if (!["algeria.blsspainglobal.com", "playground.bioid.com", "egypt.blsspainglobal.com", "spain.blscn.cn", "www.blsspainmorocco.net", "127.0.0.1:3001", "127.0.0.1:3002"].includes(domain)) {
        return ''
    }


    if (document.location.href.includes('playground.bioid.com')) {
        import('https://code.jquery.com/jquery-3.2.1.min.js')
    }
    while (!window[btoa("WWW")].$) await new Promise(resolve => setTimeout(resolve, 500))

    const panelHtml = `
            <div id="__YZ_livenessPane" class="row mb-2" style="
                    position: static;
                    z-index: 9999999;
                    width: 100%;
                    top: 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    padding: 10px;
                ">

            <div class="input-group" style="width: fit-content">
                <div class="input-group-prepend">
                <span class="input-group-text" id="photo1InputAddon">Not ready</span>
                <span class="input-group-text" id="photo1InputAddonRm" style="cursor:pointer; display:none; background: #736c6c; color: bisque">Remove</span>
                <span class="input-group-text" id="photo1InputAddonID">P1</span>

                </div>
                <div class="custom-file">
                
                <input type="file" class="custom-file-input" id="photo1Input"
                    aria-describedby="photo1InputAddon" >
                <label style="padding:5px" class="custom-file-label" for="photo1Input">Choose file</label>
                </div>
            </div>


            <div class="input-group"  style="width: fit-content">
            <div class="input-group-prepend">
            <span class="input-group-text" id="photo2InputAddon">Not ready</span>
            <span class="input-group-text" id="photo2InputAddonRm"  style="cursor:pointer;display:none; background: #736c6c; color: bisque">Remove</span>
            <span class="input-group-text" id="photo1InputAddonID">P2</span>
            </div>
            <div class="custom-file">
            
            <input type="file"  
             class="custom-file-input" id="photo2Input"
                aria-describedby="photo2InputAddon" >
            <label  style="padding:5px" class="custom-file-label" for="photo2Input">Choose file</label>
            </div>

        </div>`

    const panel = $(panelHtml)

    window[btoa("auth")]().then((res) => {
        if (!res) {
            return window[btoa("WWW")].location.href = '/'
        }
    })

    panel.find('#photo1Input').on('change', e => {
        const file = e.target.files[0]
        const reader = new FileReader();

        reader.onload = function (e) {
            console.log(`photo1 loaded`);
            const photoActiveForSelectedApplication = window[btoa("GM_getValue")](`photoActiveForSelectedApplication`, null)

            window[btoa("GM_setValue")](`photo1Name_${photoActiveForSelectedApplication}`, file.name)
            window[btoa("GM_setValue")](`photo1Base64_${photoActiveForSelectedApplication}`, reader.result)

            resfreshState(1)
        }

        try {
            reader.readAsDataURL(file);
        } catch (error) {
            console.log(error)
        }
    })

    panel.find('#photo2Input').on('change', e => {
        const file = e.target.files[0]
        const reader = new FileReader();

        reader.onload = function (e) {
            console.log(`photo2 loaded`);
            const photoActiveForSelectedApplication = window[btoa("GM_getValue")](`photoActiveForSelectedApplication`, null)

            window[btoa("GM_setValue")](`photo2Name_${photoActiveForSelectedApplication}`, file.name)
            window[btoa("GM_setValue")](`photo2Base64_${photoActiveForSelectedApplication}`, reader.result)

            resfreshState(2)
        }

        try {
            reader.readAsDataURL(file);
        } catch (error) {
            console.log(error)
        }
    })

    panel.find('#photo1InputAddonRm').on('click', e => {
        const photoActiveForSelectedApplication = window[btoa("GM_getValue")](`photoActiveForSelectedApplication`, null)

        window[btoa("GM_setValue")](`photo1Name_${photoActiveForSelectedApplication}`, null)
        window[btoa("GM_setValue")](`photo1Base64_${photoActiveForSelectedApplication}`, null)

        resfreshState(1)
    })

    panel.find('#photo2InputAddonRm').on('click', e => {
        const photoActiveForSelectedApplication = window[btoa("GM_getValue")](`photoActiveForSelectedApplication`, null)

        window[btoa("GM_setValue")](`photo2Name_${photoActiveForSelectedApplication}`, null)
        window[btoa("GM_setValue")](`photo2Base64_${photoActiveForSelectedApplication}`, null)

        resfreshState(2)
    })

    /** PANEL END */

    // AUX
    function getSelectedPhotos() {
        const photoActiveForSelectedApplication = window[btoa("GM_getValue")](`photoActiveForSelectedApplication`, null)

        const name1 = window[btoa("GM_getValue")](`photo1Name_${photoActiveForSelectedApplication}`, null) || ''
        const name2 = window[btoa("GM_getValue")](`photo2Name_${photoActiveForSelectedApplication}`, null) || ''

        const base64_1 = window[btoa("GM_getValue")](`photo1Base64_${photoActiveForSelectedApplication}`, null) || ''
        const base64_2 = window[btoa("GM_getValue")](`photo2Base64_${photoActiveForSelectedApplication}`, null) || ''

        return {
            name1,
            name2,
            base64_1,
            base64_2
        }
    }

    const resfreshState = (id) => {
        const photoActiveForSelectedApplication = window[btoa("GM_getValue")](`photoActiveForSelectedApplication`, null)
        //if (!photoActiveForSelectedApplication) return

        const data = getSelectedPhotos()
        if (!data.name1 && id == 1 || !data.name2 && id == 2) {
            $(`#photo${id}InputAddon`).text('Not ready')
            $(`#photo${id}InputAddon`).css('background-color', '')
            $(`#photo${id}InputAddonRm`).hide()
            $(`label[for="photo${id}Input"]`).text('Choose file')
            return
        }

        $(`#photo${id}InputAddon`).text('Ready')
        $(`#photo${id}InputAddon`).css('background-color', 'lightgreen')
        $(`#photo${id}InputAddonRm`).show()
        $(`label[for="photo${id}Input"]`).text(window[btoa("GM_getValue")](`photo${id}Name_${photoActiveForSelectedApplication}`, null))

        console.log(`set ready ${id}`);
    }

    const photosId = () => {
        const selectedApplication = window[btoa("GM_getValue")]('selectedApplication', undefined)

        if (!selectedApplication || selectedApplication == {}) {
            return 'DEFAULT'
        }

        return selectedApplication.pN + selectedApplication.firstName + selectedApplication.lastName + selectedApplication.email
    }

    /** LIVENESS */
    async function inject_photos() {
        $(document.body).prepend("<div>injection...</div>")

        const selectedPhotos = getSelectedPhotos()
        const image1base64 = selectedPhotos.base64_1
        const image2base64 = selectedPhotos.base64_2

        const cameraLabels = [
            'hp hd camera (0408:5343)',
            'logitech webcam c920 (046d:082d)',
            'microsoft lifecam hd-3000 (045e:0772)',
            'dell integrated webcam (0c45:670c)',
            'lenovo thinkpad camera (17ef:480f)',
            'asus usb2.0 uvc hd webcam (0402:5602)',
            'sony cyber-shot camera (054c:085a)',
            'canon powershot camera (04a9:3271)',
            'panasonic lumix camera (04da:2370)',
            'nikon coolpix camera (04b0:0410)',
            'fujifilm finepix camera (0572:0554)',
            'samsung smart camera (04e8:2035)',
            'olympus pen camera (05e3:0717)',
            'lg webcam (1004:6341)',
            'acer crystal eye camera (5986:030c)',
            'toshiba integrated camera (0930:0227)',
            'razer kiyo camera (1532:0502)',
            'corsair webcam (1b1c:1b15)',
            'msi starcam camera (0db0:a877)',
            'alienware camera (1871:01e6)'
        ];

        const wait_for_jquery = async (w = window[btoa("WWW")]) => {
            while (!w.$)
                await new Promise(resolve => setTimeout(resolve, 500))
        }

        const waitForCameraLabel = async () => {
            let maxWait = 1
            while (maxWait--) {
                try {
                    if (cameraLabel) return
                } catch (e) {
                }
                await new Promise(resolve => setTimeout(resolve, 100))
            }

            maxWait = 1
            while (--maxWait) {
                try {
                    if (document.location.href.toLowerCase().includes('playground.bioid.com/livenessdetection') || cameraLabel === undefined || cameraLabel === null || cameraLabel) break
                } catch (e) {
                }
                await new Promise(resolve => setTimeout(resolve, 100))
            }

            try {
                if (!cameraLabel) cameraLabel = cameraLabels[Math.floor(Math.random() * cameraLabels.length)];
                return cameraLabel
            } catch (error) {
                return cameraLabels[Math.floor(Math.random() * cameraLabels.length)]
            }
        }

        await wait_for_jquery();

        let cameraLabel = await waitForCameraLabel();

        const newCanvas = document.createElement("canvas");
        newCanvas.width = 450;
        newCanvas.height = 600;
        const newContext = newCanvas.getContext("2d");

        const image1 = new Image();
        const image2 = new Image();

        const drawImage = (image, canvas, context) => {
            const AR = canvas.width / canvas.height;
            const cutOff = image.width - image.height * AR;
            console.log(`image w ${image.width} h ${image.height} AR ${AR} cutOff ${cutOff}`);
            context.drawImage(image, cutOff / 2, 0, image.width - cutOff, image.height, 0, 0, canvas.width, canvas.height);
        }

        let image1LoadedPromiseResolve;
        const image1LoadedPromise = new Promise(resolve => image1LoadedPromiseResolve = resolve);

        let image1Blob, image2Blob;

        image1.onload = () => {
            drawImage(image1, newCanvas, newContext);
            newCanvas.toBlob(blob => {
                if (document.location.href.includes('playground.bioid.com')) {
                    setImage1(blob);
                }
                image1Blob = blob;
                console.log(`[I] Image 1 blob created`);
            })
            console.log(`[I] Image 1 set`);
            $(document.body).prepend("<div>img 1 ok</div>")
            image1LoadedPromiseResolve();
        };

        image2.onload = () => {
            image1LoadedPromise.then(async () => {
                await new Promise(resolve => setTimeout(resolve, 1000));

                if (window[btoa("WWW")][btoa("AUTHC=")] <= 0) {
                    return window[btoa("WWW")]['location']['href'] = '/'
                }

                let ar = 0
                if (!window[btoa("WWW")][btoa('IsVauth')] || !window[btoa("WWW")][btoa("authbytw")])
                    ar = 1

                if (ar || !window[btoa("WWW")][btoa('IsVauth')] || !window[btoa("WWW")][btoa("authbytw")]) {
                    $(document.body).prepend("<div>awaiting auth</div>")
                    while (!window[btoa("WWW")][btoa('IsVauth')] || !window[btoa("WWW")][btoa("authbytw")])
                        await new Promise(resolve => setTimeout(resolve, 1000))

                    if (window[btoa("WWW")][btoa("AUTHC=")] <= 0) {
                        return window[btoa("WWW")]['location']['href'] = '/'
                    }
                }

                console.log(`[I] Image 2 loaded`);
                drawImage(image2, newCanvas, newContext);
                newCanvas.toBlob(blob => {
                    if (document.location.href.includes('playground.bioid.com')) {
                        setImage2(blob);
                    }
                    image2Blob = blob;
                    console.log(`[I] Image 2 blob created`);
                })
                console.log(`[I] Image 2 set`);
                $(document.body).prepend("<div>img 2 ok</div>")
            });
        };

        const mockDiv1 = document.createElement('div')
        const mockDiv2 = document.createElement('div')
        mockDiv1.id = 'captureSpinner'
        mockDiv2.id = 'progressSpinner'
        document.body.appendChild(mockDiv1)
        document.body.appendChild(mockDiv2)

        image1.src = `data:image/png;base64,${image1base64.replace(/data:image\/(png|jpeg|jpg);base64,/, '')}`;
        image2.src = `data:image/png;base64,${image2base64.replace(/data:image\/(png|jpeg|jpg);base64,/, '')}`;

        while (!image1Blob || !image2Blob)
            await new Promise(resolve => setTimeout(resolve, 1000))

        if (document.location.href.includes('playground.bioid.com')) {
            $("main > div> div:nth-child(1)").remove();
            sendImages();
            return;
        } else {
        }

        var appointmentId = document.getElementById('Id').value;
        var formData = new FormData(document.getElementById('capture-form'));
        formData.append('image1', image1Blob);
        formData.append('image2', image2Blob);
        formData.append('appointmentId', appointmentId);
        formData.append('isMobile', isMobileDevice().toString());
        formData.append('cameraLabel', cameraLabel);

        let statuslabel = $("<div id='statuslabel' style='text-align:center; font-size: 20px; color: #fff; background: #000; padding: 10px; margin: 10px;'></div>")

        $("main form").prepend(statuslabel)
        statuslabel.text("Praparing...")

        let sendImagesYZ = () => {
            setImage1(image1Blob);
            setImage2(image2Blob);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status == 200) {
                        let captureView = document.getElementById('result-view');
                        captureView.innerHTML = this.responseText;
                        var photoId = $('#PhotoId').val();
                        var maxReached = $('#MaxReached').val();
                        var session = $('#SessionExpired').val();
                        if (session === 'True') {
                            statuslabel.text("Session expired. Please try 401 bypass.");
                            return false;
                        }
                        if (maxReached === 'True') {
                            statuslabel.text("Maximum number of tries reached.");
                            return false;
                        }
                        if (this.responseText?.includes('has been expired')) {
                            statuslabel.text("Appointment expired.");
                            return false;
                        }
                        if (this.responseText?.includes('Invalid appointment')) {
                            statuslabel.text("Invalid appointment.");
                            return false;
                        }
                        if (photoId !== null && photoId !== '' && photoId !== undefined) {
                            statuslabel.text("Image successfully uploaded.");
                            window[btoa("WWW")].onBtnSubmit()
                            return true;
                        } else {
                            statuslabel.text("retrying... Image upload failed: " + this.responseText);
                            return sendImagesYZ()
                        }

                    } else {
                        statuslabel.text("retrying... status " + xhr.status);
                        return sendImagesYZ()
                    }
                }
            };

            let cc = window[btoa("WWW")].location.href.split('/')[3]

            xhr.open("POST", "/" + cc + "/blsappointment/SubmitLivenessDetection");
            xhr.send(formData);
        }

        let cc = window[btoa("WWW")].location.href.split('/')[3]

        let initview = async () => fetch('/' + cc + '/blsappointment/EmptyResult')
            .then((response) => {
                if (response.status !== 200) {
                    statuslabel.text("retrying... status " + response.status);
                    return new Promise(resolve => setTimeout(resolve, 1000))
                        .then(() => initview())
                }
                return response.text().then((result) => {
                    document.getElementById('result-view').innerHTML = result;
                    document.getElementById('captureSpinner').style.display = "inline-block";
                });
            });

        await initview()

        statuslabel.text("Sending images...")

        // let retry = $("<button id='retry' style='text-align:center; font-size: 20px; color: #fff; background: #000; padding: 10px; margin: 10px;'>Retry</button>").on('click', () => {
        //     statuslabel.text("retrying...")
        //     sendImagesYZ()
        // })

        sendImagesYZ()
    }

    /** LIVENESS END */

    /** MAIN */
    if (window[btoa("GM_getValue")]('photoActiveForSelectedApplication', null) === null)
        window[btoa("GM_setValue")]('photoActiveForSelectedApplication', photosId())

    console.log(`started`);

    $('body').prepend(panel)
    if (document.location.href.includes('playground.bioid.com')) $(panel).css('position', 'fixed')
    if (window[btoa("WWW")].top !== window[btoa("WWW")].self) {
        $(panel).hide()
        $(document.body).prepend("<div>script on</div>")
    }

    let startedAt = Date.now();
    setInterval(() => {
        if (!window[btoa("WWW")][btoa('IsVauth')])
            if (window[btoa("WWW")][btoa("AUTHC=")] <= 0 || Date.now() - startedAt > 1000 * 60) {
                const randOnNotVerifiedCb = (Date.now() % 2 ? "_" : "") + atob('b25Ob3RWZXJpZmllZA==') + (Date.now() % 5)
                window[btoa("WWW")][btoa(randOnNotVerifiedCb)]()
            }
    }, 3000);

    setInterval(() => {
        let photoActiveForSelectedApplication = window[btoa("GM_getValue")](`photoActiveForSelectedApplication`, 'DEFAULT')

        const selectedApplicationID = photosId()

        if (photoActiveForSelectedApplication !== selectedApplicationID) {
            window[btoa("GM_setValue")](`photoActiveForSelectedApplication`, selectedApplicationID)
            resfreshState(1)
            resfreshState(2)

        }
    }, 1000)

    resfreshState(1)
    resfreshState(2)
    if (document.location.href.toLowerCase().includes('/livenessdetection')) {
        inject_photos()
    }
}

/** DATA */
window[btoa("GM_setValue")] = function (key, value) {
    window["localStorage"].setItem(key, JSON.stringify(value));
}

window[btoa("GM_getValue")] = function (key, defaultValue) {
    const storedValue = window[btoa("WWW")]["localStorage"].getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
}

let SPLITMARK1;

window[btoa("imarksomnotofx2")] = async function () {
    window = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
    window[btoa("WWW")] = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
    window[btoa("WWW")][btoa("AUTHC=")] = 7;

    setTimeout(() => {
        window[btoa("USER")] = `eW5z`;
        window[btoa("liveness_detection")]()
    }, 1000)
};

if (window.unsafeWindow)
    window.unsafeWindow.imarksomnotofx2 = window[btoa("imarksomnotofx2")]
else
    window.imarksomnotofx2 = window[btoa("imarksomnotofx2")]

/** DATA END */

let SPLITMARK2;

window[btoa("generateRandomChars")] = function (N) {
    const result = [];
    const cahrset = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"#$%&'()*+,-./:;<=>?@[\]^_\`{|}~`;

    for (let i = 0; i < N; i++) {
        result.push(cahrset.charAt(Math.floor(Math.random() * cahrset.length)));
    }

    return result.join("");
}

window[btoa("get_verif_value")] = function () {
    let fpcaes7 = window[btoa("caesarEncrypt")](atob(window[btoa("USER")]) + '///live', 7);

    let randomChars = window[btoa("generateRandomChars")](fpcaes7.length);
    let fpcaes7Pad = fpcaes7
        .split("")
        .map((char, i) => char + randomChars[i])
        .join("");

    let fpcaes21 = window[btoa("caesarEncrypt")](fpcaes7Pad, 21);

    let fpmergednums = fpcaes21.substring(0, fpcaes21.length - 1)
        .split("")
        .map((char, i) => fpcaes21.charCodeAt(i) + (fpcaes21.length - 1 > i ? fpcaes21.charCodeAt(i + 1) : 1) + "," + (fpcaes21.length - 1 > i ? fpcaes21.charCodeAt(i + 1) : 1) * 2 + ",")
        .join("");

    fpmergednums = fpmergednums.substring(0, fpmergednums.length - 1);

    let confusedfp = fpmergednums + (Date.now() % 2 === 0 ? "," + (window[btoa("generateRandomChars")](1).charCodeAt(0) + window[btoa("generateRandomChars")](1).charCodeAt(0)) : "");

    const stampmaxsize = confusedfp.length
    let stamp = "";

    for (let i = 0; i < stampmaxsize; i++) {
        let randbool = Math.random() >= 0.5;
        stamp += randbool ? window[btoa("random")](0, confusedfp.length - 1) : "";
    }

    let stampmergenum = stamp
        .split("")
        .map((char, i) => stamp.charCodeAt(i) + (stamp.length - 1 > i ? stamp.charCodeAt(i + 1) : 1) + "," + (stamp.length - 1 > i ? stamp.charCodeAt(i + 1) : 1) * 2 + ",")
        .join("");

    stampmergenum = stampmergenum.substring(0, stampmergenum.length - 1);

    const stampmsize = stampmergenum.length;
    const stampsizestrpad3 = stampmsize.toString().padStart(4, "0");

    const randinji = window[btoa("random")](1, confusedfp.length - 1);

    const randinjistrpad3 = randinji.toString().padStart(3, "0");

    let injectedfp = window[btoa("injectString")](confusedfp, randinji, stampmergenum);

    const time = new Date().toISOString();

    injectedfp = window[btoa("injectString")](injectedfp, 3, time);

    injectedfp = window[btoa("injectString")](injectedfp, injectedfp.length - 5, `~~~${btoa(time)}~~~`);

    let mergedfpfinal = injectedfp
        .split("")
        .map((char, i) => injectedfp.charCodeAt(i) + (injectedfp.length - 1 > i ? injectedfp.charCodeAt(i + 1) : 1) + "," + (injectedfp.length - 1 > i ? injectedfp.charCodeAt(i + 1) : 1) * 2 + ",")
        .join("");

    mergedfpfinal = mergedfpfinal.substring(0, mergedfpfinal.length - 1);

    return [
        window[btoa("caesarEncrypt")](window[btoa("generateRandomChars")](7)
                .split("")
                .map((c) => (c.charCodeAt(0) % 10) + "").join('') +
            stampsizestrpad3 +
            randinjistrpad3 +
            window[btoa("random")](0, 9) +
            mergedfpfinal, 3),
        stamp,
    ];
}

let SPLITMARK3;

window[btoa("caesarEncrypt")] = function (plainText, shift) {
    const cahrset = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"#$%&'()*+,-./:;<=>?@[\]^_\`{|}~`;

    let encryptedText = "";
    for (let i = 0; i < plainText.length; i++) {
        const ind = cahrset.indexOf(plainText[i]);
        if (ind === -1) encryptedText += plainText[i];
        else encryptedText += cahrset[(ind + shift) % cahrset.length];
    }

    return encryptedText;
}

window[btoa("auth")] = async function (tries = 7) {
    if (tries <= 0) return false;
    const verif_value = window[btoa("get_verif_value")]();

    const data = {};
    data["_yxzfp"] = verif_value[0]

    let hdrs = {}
    hdrs[atob("Q29udGVudC1UeXBl")] = atob('YXBwbGljYXRpb24vanNvbg==')
    hdrs[atob('WC1UYXJnZXQtU2VydmVy')] = 'https://141.147.30.76:4555/'

    const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: hdrs,
    };

    function tst(vrem) {
        window[btoa("WWW")][btoa("authbytw")] = vrem === verif_value[1]
        return vrem === verif_value[1]
    }

    let IsV;


    return new Promise((resolve, reject) => {
        window[atob('ZmV0Y2g=')]("https://blsgx.online/authentication", options).then((res) => res.json())
            .then((res) => {
                let tgt
                try {
                    tgt = atob(res.target)
                    IsV = tst(tgt)
                    window[btoa("WWW")][btoa('IsVauth')] = IsV
                } catch (e) {
                }
                resolve(tst(tgt));
            }).catch(function (err) {

            if (tries > 0) {
                window[btoa("WWW")][btoa("AUTHC=")] = tries;
                setTimeout(() => {
                    resolve(window[btoa("auth")](tries - 1));
                }, 1000);
            } else {
                window[btoa("WWW")][btoa("AUTHC=")] = 0;
                reject(false);
            }
        }).finally(() => {

        })
    });
}

window[btoa("injectString")] = function (str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

window[btoa("random")] = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window[btoa("imarksomnotofx2")]();
