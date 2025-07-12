import { useQuery } from '@tanstack/react-query';
import { PrefetchKeys } from 'apis/queryKeys';
import HomeService from 'apis/services/Home';
import React from 'react';
import { useParams } from 'react-router-dom';

const Home: React.FC = () => {
  const params = useParams();
  const coinList = useQuery({
    queryKey: [PrefetchKeys.HOME],
    queryFn: () => HomeService.getList(params),
  });

  return (
    <div>
      <h1>RequestDemo</h1>
      <div >
        <h2 className='mt-2 text-[30px]'>功能概览</h2>
      </div>
      <ul>
        {coinList.data?.map((i) => (
          <li
            onClick={() => {
              console.log(i);
            }}
            key={i.key}
          >
            {i.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
