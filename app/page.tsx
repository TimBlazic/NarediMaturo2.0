import { getSession } from '@/app/supabase-server';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';

export default async function PricingPage() {
  const [session] = await Promise.all([getSession()]);

  return (
    <div className="mt-20">
      <h1 className="text-6xl font-bold ml-5">Domov</h1>
      <Button className="mt-10 ml-5">
        <Link href={'pages/selection'}>Kviz</Link>
      </Button>
    </div>
  );
}
