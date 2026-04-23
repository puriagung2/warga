const GAS_URL = "https://script.google.com/macros/s/AKfycbyS4SondgG4nv2_80mFW5GvkkiwxV5ySmcByB3L2Yj2eOMJkS1I0u8hkBwP76WG5tlwlQ/exec";

// Event Listener untuk memuat gambar ke canvas
document.getElementById('fileInput').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            document.getElementById('editorSection').classList.remove('hidden');
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});

function upload() {
    const kategori = document.getElementById('kategoriFile').value;
    const rt = document.getElementById('rtSelector').value;
    const nomorKK = document.getElementById('fileNameInput').value.trim();
    const fileName = kategori + " " + nomorKK + ".pdf";

    if (!nomorKK) {
        Swal.fire('Oops!', 'Nomor KK wajib diisi!', 'warning');
        return;
    }

    document.getElementById('btn').disabled = true;
    document.getElementById('status').innerText = "Mengunggah...";

    // Kirim data ke GAS
    fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({
            base64Data: document.getElementById('canvas').toDataURL('image/jpeg', 0.8),
            fileName: fileName,
            selectedRt: rt
        })
    })
    .then(res => res.json())
    .then(data => {
        Swal.fire('Berhasil!', fileName + ' disimpan ke ' + rt, 'success');
        document.getElementById('btn').disabled = false;
        document.getElementById('status').innerText = "✅ Selesai";
    })
    .catch(err => {
        Swal.fire('Error', 'Gagal terhubung ke server', 'error');
        document.getElementById('btn').disabled = false;
    });
}
