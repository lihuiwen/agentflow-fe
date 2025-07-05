import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { PrefetchKeys } from "apis/queryKeys";
import HomeService from "apis/services/Home";
import { useEffect } from "react";

const Footer = styled.footer`
  background-color: var(--color-primary);
  color: var(--color-secondary);
  display: flex;
`;

const Home = () => {
  const params = useParams();
  const coinList = useQuery({
    queryKey: [PrefetchKeys.HOME],
    queryFn: () => HomeService.getList(params),
  });

  return (
    <>
      <div>
        <header className="w-full flex justify-center items-center h-[58px] text-green-300 bg-primary">
          header
          <Link className="ml-4 text-brand" to="/about">
            about
          </Link>
        </header>
        <main>
          Home
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
        </main>
        <Footer>footer</Footer>
      </div>
    </>
  );
};

export default Home;
