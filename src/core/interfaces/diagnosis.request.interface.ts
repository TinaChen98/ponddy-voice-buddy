export interface DiagnosisRequestInterface {
  del_indices: number[];
  predicted: string[];
  ins_indices: number[];
  input_text: string[];
  sub_indices: number[];
  token?: string;
  base64: string | ArrayBuffer;
}
