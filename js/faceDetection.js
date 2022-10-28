// Face Expression Recognition - Start
async function loadImage() {
    const imgFile = $('#imgInput').get(0).files[0];
    await faceapi.bufferToImage(imgFile);
    drawFace();
}

async function drawFace() {
    const imgViewerEl = $('#imgViewer').get(0)
    const options = faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });

    const results = await faceapi.detectAllFaces(imgViewerEl, options)
        .withFaceLandmarks()
        .withFaceExpressions();

    const canvas = $('#overlayCanvas').get(0)
    faceapi.matchDimensions(canvas, imgViewerEl)

    const resizedResults = faceapi.resizeResults(results, imgViewerEl)
    faceapi.draw.drawDetections(canvas, resizedResults)
    faceapi.draw.drawFaceExpressions(canvas, resizedResults, minConfidence = 0.05)

    hideLoader();
}

function hideLoader() {
    const loader = $('.loader').get(0);
    loader.style.display = 'none';
}
// Face Expression Recognition  - End
