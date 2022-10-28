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
});


window.onload = async function () {
  await faceapi.nets.ssdMobilenetv1.load('/models')
  await faceapi.loadFaceLandmarkModel('/models')
  await faceapi.loadFaceExpressionModel('/models')
}