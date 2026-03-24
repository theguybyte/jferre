import { X, Plus, Minus, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  material: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

export function CartDrawer({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartDrawerProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E4E0]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#1A1A1A]" strokeWidth={1.5} />
            <h2 className="text-sm font-display text-[#1A1A1A]">
              Tu Carrito ({itemCount})
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-[#E8E4E0] mb-4" strokeWidth={1} />
              <p className="text-sm font-display text-[#1A1A1A] mb-2">
                Tu carrito está vacío
              </p>
              <p className="text-xs font-sans text-[#6B6B6B]">
                Agrega algunas joyas para comenzar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 p-3 bg-[#F7F3EF]"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-white flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-display text-[#1A1A1A] truncate">
                      {item.name}
                    </h3>
                    <p className="text-[10px] font-sans text-[#6B6B6B] uppercase tracking-wide">
                      {item.material}
                    </p>
                    <p className="text-sm font-sans font-medium text-[#1A1A1A] mt-1">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center border border-[#E8E4E0] text-[#6B6B6B] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
                      >
                        <Minus className="w-3 h-3" strokeWidth={2} />
                      </button>
                      <span className="text-xs font-sans text-[#1A1A1A] w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center border border-[#E8E4E0] text-[#6B6B6B] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
                      >
                        <Plus className="w-3 h-3" strokeWidth={2} />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors self-start"
                  >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E8E4E0] px-6 py-5">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-sans text-[#6B6B6B]">Subtotal</span>
              <span className="text-lg font-sans font-medium text-[#1A1A1A]">
                {formatPrice(total)}
              </span>
            </div>

            {/* Checkout Button */}
            <button className="w-full btn-gold">
              Finalizar Compra
            </button>

            <p className="text-[10px] font-sans text-[#6B6B6B] text-center mt-3">
              Envío calculado en el checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}
