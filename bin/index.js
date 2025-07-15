#!/usr/bin/env node
import { createNewRemoteApp } from "../lib/createRemote.js";
import { mfeScaffold } from "../lib/scaffold.js";

// const { createNewRemoteApp } = require("../lib/createRemote.js");
// const { mfeScaffold } = require("../lib/scaffold.js");

const args = process.argv.slice(2);

if (args[0] === "add" && args[1]) {
  createNewRemoteApp(args[1]);
} else {
  mfeScaffold();
}
