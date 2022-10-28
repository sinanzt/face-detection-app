$(function () {
  const imgFile = $('#imgInput').get(0);
  const imgViewer = $('#imgViewer').get(0);
  const loader = $('.loader').get(0);

  $(".back-button")[0].addEventListener("click", function () {
    window.location.href = '/';
  });

  imgFile.onclick = function (e) {
    e.target.value = null;
  };

  imgFile.onchange = async function (e) {
    if (e.target.value) {
      const file = imgFile.files[0];
      imgViewer.src = await toBase64(file);
      showLoader();
      await loadImage();
    }
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  function showLoader() {
    loader.style.display = 'block';
  }

  function hideLoader() {
    loader.style.display = 'none';
  }

  async function loadImage() {
    const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });

    const response = await faceapi.detectAllFaces(imgViewer, options)
      .withFaceLandmarks()
      .withAgeAndGender()

    const canvas = $('#overlayCanvas').get(0)
    faceapi.matchDimensions(canvas, imgViewer)

    const resizedResults = faceapi.resizeResults(response, imgViewer)
    faceapi.draw.drawDetections(canvas, resizedResults)

    resizedResults.forEach(result => {
      const { age, gender, genderProbability } = result
      new faceapi.draw.DrawTextField(
        [
          `${faceapi.utils.round(age, 0)} years`,
          `${gender} (${faceapi.utils.round(genderProbability)})`
        ],
        result.detection.box.bottomLeft
      ).draw(canvas)

      hideLoader();
    })
  }
});


window.onload = async function () {
  await faceapi.nets.ssdMobilenetv1.load('/models')
  await faceapi.loadFaceLandmarkModel('/models')
  await faceapi.nets.ageGenderNet.load('/models')
}