export interface AsrResponseInterface {
  response_time: string,
  gop: {
    score: string,
    gop_results: string[][],
    score_gop: number,
    recommended_sentences: [][],
    ipas: [],
    table_structure: {
      header: string[];
      data: {
        color: string;
        value: string;
        type: string
      }[][];
      recommendations: [];
    },
    awesome: boolean;
  };
  fluency: {
    level: string;
  };
  s3: {
    user_voice: string;
    upload_s3_spendtime: string;
  };
  scoring_diagnosis: {
    gop: {};
  };
}



