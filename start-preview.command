#!/bin/zsh
cd "$(dirname "$0")"
# 使用已安装的 Node；这台电脑也可以使用 Codex 自带的 Node。
if ! command -v node >/dev/null 2>&1; then
  export PATH="/Users/ethan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
fi
if [ ! -d node_modules ]; then
  echo '请先安装依赖，参见 README.md。'
  read
  exit 1
fi
if curl -fsS 'http://127.0.0.1:5173/' 2>/dev/null | grep -q 'Bai Luping'; then
  open -a Safari 'http://127.0.0.1:5173/'
  exit 0
fi
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173 --strictPort &
preview_pid=$!
trap 'kill "$preview_pid" 2>/dev/null' EXIT INT TERM
for attempt in {1..40}; do
  if curl -fsS 'http://127.0.0.1:5173/' >/dev/null 2>&1; then
    open -a Safari 'http://127.0.0.1:5173/'
    echo '预览已在 Safari 打开。保持本窗口开启；按 Control + C 停止。'
    wait "$preview_pid"
    exit $?
  fi
  sleep 0.25
done
echo '启动失败：请检查 5173 端口是否被占用。'
read
exit 1
