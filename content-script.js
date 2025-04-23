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
                    span.a-price > span`.trim().replace(/\s*\n\s*/g, '');
  
    // 🟢 Función para convertir precios
    const aplicarConversion = (scope = document) => {
      scope.querySelectorAll(clases).forEach(el => {
        converter.convertElementText(el);
      });
  
      scope.querySelectorAll('span.a-price-symbol, span.a-price-fraction').forEach(el => el.remove());
    };
  
    // 🟢 Aplicación inicial
    aplicarConversion();
  
    // 🟢 Observador para dinámico (por ejemplo, ewc-loaded)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
  
          // Si el nodo es ewc-loaded o lo contiene
          if (
            node.dataset?.celWidget === "ewc-loaded" ||
            node.querySelector('[data-cel-widget="ewc-loaded"]')
          ) {
            console.log("🟢 Se detectó ewc-loaded, aplicando conversión...");
            aplicarConversion(node);
          }
        }
      }
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
  