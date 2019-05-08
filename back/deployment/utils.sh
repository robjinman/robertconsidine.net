#!/bin/bash

extract_vars() {
  if [ $# -ne 1 ]; then
    echo Expected path to file of key-value pairs
  fi

  export $(grep "^[^\#].*=.*$" "$1" | xargs)
}
