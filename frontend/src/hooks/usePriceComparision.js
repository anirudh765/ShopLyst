import { useEffect, useState } from 'react';
import productService from '../services/productService';

export default function usePriceComparison(productId) {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchComparison = async () => {
      try {
        const data = await productService.compareProductPrices(productId);
        setComparison(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [productId]);

  return { comparison, loading, error };
}
