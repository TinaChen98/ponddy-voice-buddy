export interface GenerateWavResponseInterface {
  text: string;
  audio_path: string
}


export interface ConnectedResult {
  connected_words: string;
  start_end_word_index: number[];
}
