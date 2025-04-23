class CurrencyConverter {
    constructor(rate) {
      this.rate = rate;
    }
  
    convert(value) {
      return (value * this.rate).toFixed(2);
    }
  
    format(value) {
        return new Intl.NumberFormat('es-DO', {
          style: 'currency',
          currency: 'DOP',
          currencyDisplay: 'code', // muestra DOP en lugar de símbolo $
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
      }
  
    extractUSD(text) {
      const match = text.match(/([\d,]+\.\d{2})/);
      if (match) return parseFloat(match[1].replace(/,/g, ""));
      return null;
    }
  
    convertElementText(el) {
        if (el.dataset.converted) return;
      
        const raw = el.innerText;
      
        // Este regex soporta:
        // - "1,015.77"
        // - "1,015"
        // - "US$1,015.77"
        // - "$1,015.77"
        const match = raw.match(/[\d,]+(?:\.\d{1,2})?/);
        if (!match) return;
      
        const usd = parseFloat(match[0].replace(/,/g, ""));
        if (isNaN(usd)) return;
      
        const converted = this.convert(usd);
        const formatted = this.format(converted);
      
        // Reemplazamos todo el texto del elemento por el formateado
        el.innerText = formatted;
        el.dataset.converted = "true";
      }
      
  }
  