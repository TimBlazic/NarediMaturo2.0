import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';

export default async function PricingPage() {
  const [session, products, subscription] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscription()
  ]);

  return (
    <>
      <h1 className="text-6xl font-bold mt-10 ml-5">Dashboard</h1>
      <Button className="mt-10 ml-5">
        <Link href={'/quiz'}>Quiz</Link>
      </Button>
    </>
  );
}
