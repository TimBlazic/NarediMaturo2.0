import Button from '@/components/ui/Button';
import Link from 'next/link';
import React from 'react';

const page = () => {
  return (
    <div>
      Rezultati
      <br></br>
      <Link href="/">
        <Button>Domov</Button>
      </Link>
    </div>
  );
};

export default page;
