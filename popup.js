console.log("✅ popup.js cargado");

document.getElementById('save').addEventListener('click', () => {
  console.log("🖱 Botón 'Guardar' fue clickeado");

  const rate = parseFloat(document.getElementById('rate').value);
  if (!isNaN(rate)) {
    chrome.storage.local.set({ exchangeRate: rate }, () => {
      console.log("💾 Tasa guardada:", rate);
      alert('Tasa guardada: ' + rate);
    });
  } else {
    console.warn("⚠️ Tasa no válida");
  }
});
