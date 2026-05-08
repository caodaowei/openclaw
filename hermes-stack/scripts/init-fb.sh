#!/bin/sh
set -e

DB_FILE="/database/filebrowser.db"

# 初始化配置
if [ ! -f "$DB_FILE" ]; then
    echo "Initializing FileBrowser database..."
    filebrowser config init --database="$DB_FILE"
    # 先创建长密码用户
    filebrowser users add admin admin123456789 --perm.admin --database="$DB_FILE"
    echo "Admin user created: admin / admin123456789"
else
    echo "Database already exists, skipping initialization"
fi

# 启动 FileBrowser
exec filebrowser --database="$DB_FILE" --root=/srv --address=0.0.0.0 --port=80
