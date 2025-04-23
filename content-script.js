// Accede al almacenamiento local de la extensión para obtener la tasa de cambio configurada por el usuario.
chrome.storage.local.get('exchangeRate', (data) => {
  if (!data.exchangeRate) return;

  const converter = new CurrencyConverter(data.exchangeRate);

  const clases = `span.a-price-whole,
                  h2.a-size-mini,
                  #price-block-amount,
                  span.ewc-unit-price > span.a-size-base,
                  span.ewc-wider-compact-view-only > span,
                  div.ewc-subtotal > div.ewc-subtotal-value > span.ewc-subtotal-amount > h2.a-color-price,
                  span.sc-invisible-when-no-js > div.a-checkbox > label > span.a-label > span.a-color-price,
                  span.a-price > span,
                  div.sc-buy-box-inner-box > h3.a-spacing-none > div.sc-subtotal-buybox > #sc-subtotal-amount-buybox > span.sc-price`
    .trim()
    .replace(/\s*\n\s*/g, '');

  //* Esta función aplica conversión a un scope
  const aplicarConversion = (scope = document) => {

    // Por cada elemento que coincida con las clases, se aplica la conversión
    scope.querySelectorAll(clases).forEach(el => {
      converter.convertElementText(el);
    });

    // Limpiamos símbolos y centavos extras innecesarios.
    scope.querySelectorAll('span.a-price-symbol, span.a-price-fraction').forEach(el => el.remove());
  };

  // Conversión inicial de toda la página al cargar
  aplicarConversion();

  // Observador para detectar cambios
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        // Si se agrega un nuevo nodo (como el carrito actualizado, etc...) aplica la conversión a dicho bloque
        aplicarConversion(node);
      }

      // También reconvertir si cambió el contenido de los nodos (Ej; Si Amazon cambia el precio a través de JS)
      if (mutation.type === 'characterData') {
        aplicarConversion(mutation.target.parentElement);
      }
    }
  });

  // Inicia el observador sobre todo el documento
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true // Detecta cambios en textos
  });
});
