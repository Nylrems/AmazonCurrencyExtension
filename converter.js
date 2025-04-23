class CurrencyConverter {
  // Construtor recibe la tasa de cambio
  constructor(rate) {
    this.rate = rate;
  }

  // Convierte un valor en usd multiplicando por la tasa y devolviendo dos decimales
  convert(value) {
    return (value * this.rate).toFixed(2);
  }

  // Formatea el número a formato de moneda local, con sus respectivos separadores y símbolos
  format(value) {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      currencyDisplay: 'code', // muestra DOP en lugar de símbolo $
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  // Extrae un valor en USD desde una vadena de texto, obviamente usando regex
  extractUSD(text) {
    //* Regex: Busca un número que tenga dígitos con comas opcionales y exactamente dos decimales
    // Ejemplos que coinciden: US$ 1,134.56 || 1,134.56
    const match = text.match(/([\d,]+\.\d{2})/);
    if (match) return parseFloat(match[1].replace(/,/g, ""));
    return null;
  }

  // Aplica la conversión a elemento html que aún no han sido convertidos
  convertElementText(el) {
    // Evitando la doble conversión.
    if (el.dataset.converted) return;

    const raw = el.innerText;

    // Si el elemento es a-price-whole intentamo reconstruir el número completo
    if (el.classList.contains('a-price-whole')) {
      // Se limpia el número (removiendo comas, espacios, saltos de línea)
      const whole = el.childNodes[0]?.nodeValue?.replace(/[^\d]/g, "") ?? "0";
      const fraction = el.parentElement?.querySelector('.a-price-fraction')?.innerText ?? "00";

      raw = `${whole}.${fraction}`;
    }

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

    // Se marca el elemento como "Convertido" para evitar futuras modificaciones. 
    el.dataset.converted = "true";
  }

}

//! /([\d,]+\.\d{2})/	Número con comas y exactamente dos decimales	"1,234.56"
//! /[\d,]+(?:\.\d{1,2})?/	Número con comas, con o sin decimales	"1,000", "2,345.78"