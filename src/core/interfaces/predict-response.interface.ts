export interface PredictResponseInterface {
  data?: {
    del_indices: number[];
    gop_results: string[];
    hyp: string[];
    ins_indices: any[];
    pinyins: string[];
    ref: string[];
    tone_results: string[];
  };
  error: boolean;
}
