'use client';
import { OrderPageContent } from '../order/page';

export default function OrderShomedic() {
  return (
    <div style={{ colorScheme: 'light' }}>
      <OrderPageContent submitApiUrl="/api/order-shomedic/submit" />
    </div>
  );
}
