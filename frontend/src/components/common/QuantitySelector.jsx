import { Minus, Plus } from 'lucide-react';

export function QuantitySelector({ quantity = 1, min = 1, max = 99, onChange, disabled = false }) {
  const handleDecrement = () => {
    if (quantity > min && !disabled) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max && !disabled) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="quantity-stepper">
      <button
        type="button"
        className="quantity-stepper-btn"
        onClick={handleDecrement}
        disabled={quantity <= min || disabled}
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="quantity-stepper-value">{quantity}</span>
      <button
        type="button"
        className="quantity-stepper-btn"
        onClick={handleIncrement}
        disabled={quantity >= max || disabled}
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export default QuantitySelector;
