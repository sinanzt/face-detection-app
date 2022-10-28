$(function () {
  const imgFile = $('#imgInput').get(0);
  const imgFile2 = $('#imgInput2').get(0);

  const imgViewer = $('#imgViewer').get(0);
  const imgViewer2 = $('#imgViewer2').get(0);

  const progressBar = $('#progress-bar').get(0);
  const rate = $('.rate').get(0);

  let images = { img1: null, img2: null }

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
      images['img1'] = await faceapi.computeFaceDescriptor(imgViewer)

      showLoader();
      if (images['img2']) {
        calculateDistance();
      }
    }
  };

  imgFile2.onclick = function (e) {
    e.target.value = null;
  };

  imgFile2.onchange = async function (e) {
    if (e.target.value) {
      const file = imgFile2.files[0];
      imgViewer2.src = await toBase64(file);
      images['img2'] = await faceapi.computeFaceDescriptor(imgViewer2)

      showLoader();
      if (images['img1']) {
        calculateDistance();
      }
    }
  };

  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  function showLoader() {
    // loader.style.display = 'block';
  }

  function hideLoader() {
    loader.style.display = 'none';
  }

  function calculateDistance() {
    const dist = faceapi.utils.round(
      faceapi.euclideanDistance(images.img1, images.img2)
    )
    progressBar.value = (1 - dist) * 100;
    rate.innerHTML = `%${Math.ceil(( 1 - dist) * 100)}`;
  }
});


window.onload = async function () {
  await faceapi.loadFaceRecognitionModel('/models')
}