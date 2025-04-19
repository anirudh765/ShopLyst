function comparePrices(records) {
    const normalized = records.map(r => ({
      source: r.source,
      price: r.price,
      currency: r.currency
    }));
    normalized.sort((a, b) => a.price - b.price);
    return normalized;
  }
  
  /**
   * Aggregate product data from multiple services
   * @param {string} externalId
   * @param {Array} services [{ source, fn }]
   */
  async function aggregateProductData(externalId, services) {
    const results = await Promise.all(services.map(async s => {
      try {
        const data = await s.fn(externalId);
        return { source: s.source, price: data.price, currency: data.currency, data };
      } catch (err) {
        console.error(`Error fetching ${s.source}`, err.message);
        return null;
      }
    }));
    const valid = results.filter(r => r);
    return {
      externalId,
      comparison: comparePrices(valid),
      bestDeal: valid.length ? valid.sort((a,b)=>a.price-b.price)[0] : null
    };
  }
  
  module.exports = { comparePrices, aggregateProductData };