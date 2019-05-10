#!/bin/bash

extract_vars() {
  if [ $# -ne 1 ]; then
    echo Expected path to file of key-value pairs
    return 1
  fi

  export $(grep "^[^\#].*=.*$" "$1" | xargs)
}

