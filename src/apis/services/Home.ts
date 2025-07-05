import { Params } from "react-router-dom";
// import axios from "axios";
import { HomeResponse } from "../model/Home";

class HomeService {
  static async getList(params: Params<string>): Promise<HomeResponse[]> {
    // return axios.get("/home");
    return [
      {
        key: 1,
        content: "BTC",
      },
      {
        key: 2,
        content: "ETH",
      },
      {
        key: 3,
        content: "MEME",
      },
      {
        key: 4,
        content: "DOGE",
      },
    ];
  }
}

export default HomeService;
