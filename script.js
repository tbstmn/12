const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const images = ['docs/assests/images/Eggs/Black.png', 'docs/assests/images/Eggs/Blue.png', 'docs/assests/images/Eggs/Cyan.png'];

hamburger.addEventListener('click', () => {
  navbar.classList.toggle('active');
  hamburger.classList.toggle('fa-times');
});

let randomPicture;

let currentID;
let currentIDNumber;

function getRandomPicture(params) {
  const randomNumber = Math.floor(Math.random() * images.length);

  return images[randomNumber];
}

function handleScannedCode(result) {
  // const eggCode = result;
  console.log(result);
}

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

function startScanner(event) {
  // Get list of available video devices
  currentID = `picture-${event.target.getAttribute('data-box')}`;
  console.log(event.target);
  console.log(currentID);
  modal.style.display = 'block';
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    const videoDevices = devices.filter((device) => device.kind === 'videoinput');
    const lastDeviceId = videoDevices[videoDevices.length - 1].deviceId;

    // Initialize QuaggaJS
    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: document.querySelector('#scanner'), // This is where the live video will be rendered
        constraints: {
          width: {
            ideal: 1920,
            min: 640,
          },
          height: {
            ideal: 1080,
            min: 480,
          },
          deviceId: lastDeviceId, // Use the last available video device
        },
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
        ], // Specify the barcode format you want to read, e.g., EAN

      },
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Initialization finished. Ready to start');
      Quagga.start(); // Start the live stream
    });

    // Add event listener for when a barcode is detected
    Quagga.onDetected((data) => {
      console.log(`Barcode detected and processed: ${data.codeResult.code}`);
      replaceImage();
      // Do something with the scanned barcode, e.g., display it
      alert(`Scanned barcode: ${data.codeResult.code}`);
    });
  }).catch((err) => {
    console.error(err);
  });
}

document.addEventListener('DOMContentLoaded', (event) => {
  const modal = document.getElementById('modal');
  const btn = document.getElementById('picture-1');
  const span = document.getElementsByClassName('close')[0];

  // btn.onclick = function (event) {
  //   modal.style.display = 'block';
  //   // startCameraScan(currentDeviceId, event);
  //   startScanner();
  //   console.log(event.target.getAttribute('data-box'));
  //   console.log(event);
  //   currentIDNumber = event.target.getAttribute('data-box');
  // };

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
