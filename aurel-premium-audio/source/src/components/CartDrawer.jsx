import { useEffect, useRef } from 'react';

// The cart: a slide-over ledger. Quantities step in place, the subtotal is
// live, and checkout drafts a complete order email — honest about what a
// small-run studio storefront on static hosting actually does.
export default function CartDrawer({ open, cart, subtotal, onClose, onSetQty }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const orderLines = cart.map((p) =>
    `${p.qty} × ${p.name}${p.detail ? ` (${p.detail})` : ''} - $${(p.price * p.qty).toLocaleString('en-US')}`);
  const checkout = `mailto:studio@aurel.audio?subject=${encodeURIComponent('Order request')}&body=${encodeURIComponent(
    ['Hi Aurel,', '', 'I would like to order:', '', ...orderLines, '',
      `Subtotal: $${subtotal.toLocaleString('en-US')}`, '',
      'Ship to:', '', '- sent from the studio site'].join('\n')
  )}`;

  return (
    <div className="drawer-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Cart">
        <div className="drawer-head">
          <h2>Cart</h2>
          <button className="modal-close" ref={closeRef} onClick={onClose} aria-label="Close cart">×</button>
        </div>

        {cart.length === 0 ? (
          <div className="drawer-empty">
            <p>Nothing here yet.</p>
            <p className="drawer-note">The Reference and its hardware are one click away - and every purchase can start with an audition.</p>
            <button className="button button-secondary" onClick={onClose}>Keep looking</button>
          </div>
        ) : (
          <>
            <ul className="cart-lines" aria-label="Items">
              {cart.map((p) => (
                <li className="cart-line" key={p.key}>
                  <div className="line-main">
                    <strong>{p.name}</strong>
                    {p.detail && <span className="line-detail">{p.detail}</span>}
                  </div>
                  <div className="line-qty" aria-label={`Quantity of ${p.name}`}>
                    <button onClick={() => onSetQty(p.key, p.qty - 1)} aria-label={`Remove one ${p.name}`}>−</button>
                    <span aria-live="polite">{p.qty}</span>
                    <button onClick={() => onSetQty(p.key, p.qty + 1)} aria-label={`Add one ${p.name}`}>+</button>
                  </div>
                  <span className="line-price">${(p.price * p.qty).toLocaleString('en-US')}</span>
                  <button className="line-remove" onClick={() => onSetQty(p.key, 0)} aria-label={`Remove ${p.name} from cart`}>×</button>
                </li>
              ))}
            </ul>

            <div className="drawer-foot">
              <div className="subtotal-row">
                <span>Subtotal</span>
                <strong>${subtotal.toLocaleString('en-US')}</strong>
              </div>
              <p className="drawer-note">Assembled to order - ships in 2-3 weeks. Checkout drafts the order email; the studio confirms payment and shipping personally.</p>
              <a className="button button-primary checkout-btn" href={checkout}>Checkout by email</a>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
