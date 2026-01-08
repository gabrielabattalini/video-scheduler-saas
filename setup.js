const fs = require('fs');
const crypto = require('crypto');

console.log('Criando projeto Autoedito...\n');

['backend/src', 'backend/prisma', 'frontend/app/page'].forEach((f) => fs.mkdirSync(f, { recursive: true }));

fs.writeFileSync(
  'docker-compose.yml',
  `version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: video_scheduler
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
`,
);

fs.writeFileSync(
  '.env',
  `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/video_scheduler
REDIS_URL=redis://localhost:6379
JWT_SECRET=teste-${Date.now()}
ENCRYPTION_KEY=${crypto.randomBytes(32).toString('hex')}
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_S3_BUCKET=videos
AWS_S3_ENDPOINT=http://localhost:9000
AWS_REGION=us-east-1
`,
);

fs.writeFileSync(
  'backend/package.json',
  `{
  "name": "backend",
  "scripts": {"dev": "ts-node src/main.ts"},
  "dependencies": {"express": "^4.18.2", "cors": "^2.8.5", "dotenv": "^16.3.1"},
  "devDependencies": {"typescript": "^5.3.3", "ts-node": "^10.9.2", "@types/express": "^4.17.21", "@types/node": "^20.10.6"}
}`,
);

fs.writeFileSync(
  'backend/src/main.ts',
  `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.listen(3001, () => console.log('Backend: http://localhost:3001'));
`,
);

fs.writeFileSync(
  'frontend/package.json',
  `{
  "name": "frontend",
  "scripts": {"dev": "next dev"},
  "dependencies": {"next": "14.0.4", "react": "^18.2.0", "react-dom": "^18.2.0"},
  "devDependencies": {"typescript": "^5.3.3", "@types/react": "^18.2.46", "@types/node": "^20.10.6"}
}`,
);

fs.writeFileSync(
  'frontend/app/page/page.tsx',
  `export default function Home() {
  return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#667eea,#764ba2)',fontFamily:'sans-serif'}}>
    <div style={{background:'white',padding:'3rem',borderRadius:'20px',boxShadow:'0 20px 60px rgba(0,0,0,0.3)',textAlign:'center'}}>
      <h1 style={{fontSize:'2.5rem',marginBottom:'1rem'}}>Autoedito</h1>
      <p style={{color:'#666'}}>Sistema funcionando!</p>
      <a href="http://localhost:3001/health" target="_blank" style={{color:'#3b82f6',marginTop:'1rem',display:'block'}}>Testar Backend</a>
    </div>
  </div>;
}`,
);

fs.writeFileSync(
  'frontend/app/layout.tsx',
  `export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html><body style={{margin:0}}>{children}</body></html>;
}`,
);

fs.writeFileSync('frontend/next.config.js', `module.exports = {reactStrictMode: true};`);

console.log('Pronto!\n');
console.log('Execute:\n');
console.log('  docker-compose up -d');
console.log('  cd backend && npm install && npm run dev');
console.log('  cd frontend && npm install && npm run dev\n');
