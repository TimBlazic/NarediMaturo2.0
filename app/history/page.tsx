import { getSession } from '@/app/supabase-server';
import HistoryWrapper from '@/components/historyWrapper';
import Wrapper from '@/components/testWrapper';

const Page: React.FC<{ params: { subject: string; userId: string } }> = async ({
  params
}) => {
  const session = await getSession();
  const userId = session?.user.id;

  if (session) {
    return (
      <div>
        <HistoryWrapper user={userId}></HistoryWrapper>
      </div>
    );
  } else {
    return <div>Ni si prijavljen</div>;
  }
};
export default Page;
