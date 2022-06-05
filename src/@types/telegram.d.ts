export interface ITelegramResponse<T> {
  ok: boolean;
  result?: T;
  error_code?: number;
  description?: string;
}

export type TGetUpdates = ITelegramResponse<Array<IGetUpdatesMessage>>;

interface IGetUpdatesMessage {
  update_id: number;
  message: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name: string;
      username: string;
      language_code: string;
    };
    chat: {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      type: string;
    };
    date: number;
    text: string;
  };
}



