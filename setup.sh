#!/bin/bash

echo "🚀 Starting EDGE Football Setup..."

# 1. تثبيت الحزم
npm install

# 2. إنشاء ملف المتغيرات البيئية إن لم يكن موجوداً
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "📄 Created .env.local from template. Please fill in your API keys."
fi

# 3. التحقق من بنية TypeScript
echo "🔍 Running Type Check..."
npx tsc --noEmit

# 4. تشغيل خادم التطوير
echo "✨ Setup complete! Starting Next.js Dev Server..."
npm run dev