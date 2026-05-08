import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "doodle-quiz",
  brand: {
    displayName: "두들 퀴즈", // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
    primaryColor: "#F06292", // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: "https://static.toss.im/appsintoss/25673/b1f6a51b-cdd6-458e-a54e-49fe727607db.png", // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
  },
  web: {
    host: "localhost",
    port: 5173,
    commands: {
      dev: "vite dev",
      build: "vite build",
    },
  },
  permissions: [],
  outdir: "dist",
});
