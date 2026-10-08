import { formatCurrency, calculateDiscount } from '../../utils/formatters';

export function PriceDisplay({ mrp, sellingPrice, size = 'md' }) {
  const discount = calculateDiscount(mrp, sellingPrice);

  return (
    <div className={`price-display price-display-${size}`}>
      <span className="price-selling">{formatCurrency(sellingPrice)}</span>
      {mrp && Number(mrp) > Number(sellingPrice) && (
        <>
          <span className="price-mrp">{formatCurrency(mrp)}</span>
          {discount > 0 && <span className="price-discount-percent">{discount}% OFF</span>}
        </>
      )}
    </div>
  );
}

export default PriceDisplay;
