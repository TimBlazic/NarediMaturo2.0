import { getSession } from '@/app/supabase-server';
import Wrapper from '@/components/testWrapper';

const Page: React.FC<{ params: { subject: string; userId: string } }> = async ({
  params
}) => {
  const session = await getSession();
  const userId = session?.user.id;

  if (session) {
    return (
      <div>
        <Wrapper subject={params.subject} user={userId}></Wrapper>
      </div>
    );
  } else {
    return <div>Ni si prijavljen</div>;
  }
};
export default Page;
