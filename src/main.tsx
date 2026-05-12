import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const errors: string[] = [];

function showError(msg: string) {
  errors.push(msg);
  const el = document.getElementById('__debug_errors');
  if (el) el.innerText = errors.join('\n\n');
  else {
    const div = document.createElement('div');
    div.id = '__debug_errors';
    div.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:rgba(200,0,0,0.9);color:#fff;font-size:12px;padding:8px;z-index:9999;white-space:pre-wrap;max-height:40vh;overflow-y:auto;word-break:break-all';
    div.innerText = msg;
    document.body.appendChild(div);
  }
}

window.onerror = (msg, src, line, col, err) => {
  showError(`[JS Error] ${msg}\n${src}:${line}:${col}\n${err?.stack ?? ''}`);
};

window.onunhandledrejection = (e) => {
  showError(`[Promise] ${e.reason?.message ?? String(e.reason)}\n${e.reason?.stack ?? ''}`);
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
