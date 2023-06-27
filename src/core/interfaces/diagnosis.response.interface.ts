export interface DiagnosisResponseInterface {
  data: {
    awesome: boolean;
    fluency_level: string;
    gop_results: string[][] | number[][];
    ipas: string[];
    recommended_sentences: string[][];
    score: number;
    score_gop: number;
    table_structure: {
      connected_results: {
        confidence: number;
        connected_words: string;
        label: string;
        start_end_word_index: number[];
        status_code: number;
      };
      header: string[];
      data: {
        color: string;
        value: string;
        type: string
      }[][];
      recommendations: {
        error_sound: string;
        error_word: string;
        input_sound: string;
        input_word: string;
        sentence: string;
      }[];
    };
  };
  error: boolean;
}
