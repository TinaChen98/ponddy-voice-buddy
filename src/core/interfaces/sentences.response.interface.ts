export interface PonddySentencesResponseInterface {
  id: number;
  ipa: any;
  type: string;
  content: string;
  connected_speech: string;
  level_cefr: number;
  level_cefr_name: string
  level_cefr_color: string
  saved: boolean;
}


export interface CustomizedSentencesResponseInterface {
  count: number;
  results: {
        id: number;
        type: string;
        content: string;
        ipa: string;
        level_cefr: number;
        level_cefr_name: string
        level_cefr_color: string
        created_at: string;
        updated_at: string;
        saved: boolean;
    }
}

export interface VoiceExercisesResponseInterface {
  result: {
    id: number;
    name_cht: string;
    name_en: string;
    scenarios: any;
    sequence_id: number;
    // practiced: boolean;
    // voice: string;
    // score: number;
  }
}

export interface CustomizedTopicResponseInterface {
  title: string;
  topic: {
    }
}


export interface ThemedDialoguesTopicResponseInterface {
  results: {
    id: number;
    practiced: boolean;
    voice: string;
    score: number;
  }
}

export interface ThemedDialoguesScenarioResponseInterface {
  id: number;
  name_cht: string;
  name_en: string;
  photo: any;
  diaglogs: {
    content: string;
    gender: string;
    id: number;
    ipa: string;
    role: string;
  }
}

export interface PinSentencesResponseInterface {
  count: number;
  results: {
    id: number;
    ipa: any;
    type: string;
    content: string;
    created_at: string;
    user: string
    updated_at: string;
    saved: boolean;
    sentence: {
      id: number;
      content: string;
      connected_speech: string;
      level_cefr: number;
      level_cefr_name: string
      level_cefr_color: string
      saved: boolean;
    }
  }
}
