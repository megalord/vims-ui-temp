#!/bin/bash

shopt -s globstar

function write_index_html() {
  local replacer='<!--INSERT_JS-->'
  local scripts=''
  for f in js/**/*.js; do
    scripts+="\n    <script src=\"/$f\"></script>"
  done
  scripts=$(echo "$scripts" | sed -e 's/\//\\\//g')
  sed -e "s/$replacer/$scripts/" index-template.html > index.html
}


function sigint_handler() {
  echo "killing $server_pid"
  kill $server_pid
  exit $?
}

trap sigint_handler SIGINT

write_index_html
./pushstate.py &
server_pid=$!
echo "python server pid: $server_pid"

files=$(find js -name '*.js' -type f)
while inotifywait -e modify $files; do
  cat $files > bundle.js
done
