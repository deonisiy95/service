import axios from 'axios';
import { TGetUpdates } from "src/@types/telegram";

const DOMAIN = 'https://api.telegram.org';

export class TelegramApi {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  public getUpdates(): Promise<TGetUpdates>  {
    const url = `${DOMAIN}/bot${this.token}/getUpdates`;

    return axios.get<TGetUpdates>(url).then(response => response.data);
  }

  public sendMessage(chantId: number, text: string): Promise<TGetUpdates>  {
    const url = `${DOMAIN}/bot${this.token}/sendMessage?chat_id${chantId}`;

    return axios.post<TGetUpdates>(url, {
      chat_id: chantId,
      text
    }).then(response => response.data);
  }
}
