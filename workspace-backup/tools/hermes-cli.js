#!/usr/bin/env node
/**
 * Hermes CLI Tool for OpenClaw
 * 包装 hermes 命令，让 OpenClaw 可以调用 Hermes Agent
 */

const { execSync } = require('child_process');
const path = require('path');

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(JSON.stringify({
      error: "No command provided",
      usage: "hermes-cli <command> [args...]"
    }));
    process.exit(1);
  }

  const command = args.join(' ');
  
  try {
    // 执行 hermes 命令
    const result = execSync(`hermes ${command}`, {
      encoding: 'utf-8',
      timeout: 300000, // 5分钟超时
      cwd: process.cwd(),
      env: {
        ...process.env,
        HERMES_GATEWAY_TOKEN: '6337a60f34322d33d3161a3304ce01006e25e9a74768ffd0'
      }
    });
    
    console.log(JSON.stringify({
      success: true,
      output: result
    }));
  } catch (error) {
    console.log(JSON.stringify({
      success: false,
      error: error.message,
      stderr: error.stderr?.toString(),
      stdout: error.stdout?.toString()
    }));
    process.exit(1);
  }
}

main();
