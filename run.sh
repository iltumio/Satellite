#!/bin/bash
# Check for node
if which node > /dev/null
  then
      echo "Node is installed..."
  else
      echo "Please install Nodejs"
      exit 1
  fi

# Install yarn
if yarn -v > /dev/null
  then
      echo "Yarn is installed..."
  else
      npm i -g yarn
  fi

# Pull Submodules
git submodule update --init --recursive

# Install Deps
yarn


yarn dev