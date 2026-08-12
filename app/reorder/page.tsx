import { OrderPageContent } from '../order/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  other: { 'color-scheme': 'light' },
};

export default function Reorder() {
  return (
    <div style={{ colorScheme: 'light' }}>
      <OrderPageContent submitApiUrl="/api/reorder/submit" requireCompanyAddress />
    </div>
  );
}
