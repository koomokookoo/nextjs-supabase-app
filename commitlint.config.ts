import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // 제목 최대 길이 (한국어 고려해 여유있게 설정)
    "header-max-length": [2, "always", 100],
    // 제목 끝 마침표 금지
    "subject-full-stop": [2, "never", "."],
    // 본문/꼬리말 최대 길이
    "body-max-line-length": [1, "always", 200],
    // 한국어 subject를 위해 대소문자 규칙 해제
    "subject-case": [0],
  },
};

export default config;
