import apiClient from "../index";
import { HomeResponse } from "../model/Home";

class HomeService {
  static async getList(params: {}): Promise<HomeResponse[]> {
    // return apiClient.get("/home");
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
