const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const images = ['/docs/assests/images/Eggs/Black.png', '/docs/assests/images/Eggs/Blue.png', '/docs/assests/images/Eggs/Cyan.png'];

hamburger.addEventListener('click', () => {
  navbar.classList.toggle('active');
  hamburger.classList.toggle('fa-times');
});

let randomPicture;

let currentID;

let selectedDeviceId;

document.addEventListener('DOMContentLoaded', async () => {
  const videoDevices = await getVideoDevices();
  if (videoDevices.length > 0) {
    selectedDeviceId = videoDevices[videoDevices.length - 1].deviceId;
  }
});

async function getVideoDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === 'videoinput');
}

function getRandomPicture(params) {
  const randomNumber = Math.floor(Math.random() * images.length);

  return images[randomNumber];
}

function handleScannedCode(result) {
  // const eggCode = result;
  console.log(result);
}

let currentDeviceId = null;
let devices = [];

function replaceImage(params) {
  const picture = document.getElementById(`${currentID}`);
  const image = document.createElement('img');
  image.setAttribute(
    'src',
    `${getRandomPicture()}`,
  );
  image.setAttribute(
    'id',
    `${currentID}`,
  );
  picture.replaceWith(image);
}

async function getCameras() {
  const deviceList = await navigator.mediaDevices.enumerateDevices();
  devices = deviceList.filter((device) => device.kind === 'videoinput');
  if (devices.length > 0) {
    currentDeviceId = devices[0].deviceId;
  }
}

function startCameraScan(deviceId, event) {
  Quagga.init(
    {
      inputStream: {
        type: 'LiveStream',
        constraints: {
          width: 1080,
          height: 740,
          deviceId: deviceId ? { exact: deviceId } : undefined,
        },
        target: document.querySelector('#scanner'),
      },
      decoder: {
        readers: [
          'code_128_reader',
          'ean_reader',
          'ean_8_reader',
          'code_39_reader',
          'code_39_vin_reader',
          'codabar_reader',
          'upc_reader',
          'upc_e_reader',
          'i2of5_reader',
        ],
      },
    },
    (err) => {
      if (err) {
        console.log(err);
        return;
      }
      Quagga.start();
    },
  );

  Quagga.onDetected((data) => {
    replaceImage();
    handleScannedCode(data.codeResult.code);
    Quagga.stop();
  });
}

function checkForBarcodeImage(event) {
  // getRandomPicture();
  currentID = `picture-${event.target.getAttribute('Value')}`;
  console.log(currentID);
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      scanBarcodeFromImage(e.target.result, currentID);
    };
    reader.readAsDataURL(file);
  }
}

// document.getElementById('file-input').addEventListener('change', (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = function (e) {
//       scanBarcodeFromImage(e.target.result);
//     };
//     reader.readAsDataURL(file);
//   }
// });

function scanBarcodeFromImage(dataUrl, event) {
  Quagga.decodeSingle(
    {
      src: dataUrl,
      numOfWorkers: 0, // Needs to be 0 when used within a Node environment
      inputStream: {
        size: 800, // restrict input-size to be 800px in width (long-side)
      },
      decoder: {
        readers: [
          'code_128_reader',
          'ean_reader',
          'ean_8_reader',
          'code_39_reader',
          'code_39_vin_reader',
          'codabar_reader',
          'upc_reader',
          'upc_e_reader',
          'i2of5_reader',
        ],
      },
    },
    (result) => {
      if (result && result.codeResult) {
        console.log(currentID);
        replaceImage();
        document.getElementById('scanned-code').textContent = result.codeResult.code;
        handleScannedCode(result.codeResult.code);
      } else {
        document.getElementById('scanned-code').textContent = 'No barcode detected.';
      }
    },
  );
}

getCameras();

document.addEventListener('DOMContentLoaded', (event) => {
  const modal = document.getElementById('modal');
  const btn = document.getElementById('picture-1');
  const span = document.getElementsByClassName('close')[0];

  btn.onclick = function (event) {
    modal.style.display = 'block';
    startCameraScan(selectedDeviceId, event);
    console.log(event);
  };

  span.onclick = function () {
    modal.style.display = 'none';
    Quagga.stop();
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
      Quagga.stop();
    }
  };
});
