# capstone

## 系統分析文件

[API 文件](https://lucky-tumble-dd2.notion.site/5026f9ab16bf4845808e4bcf8b1471b8)

## 開始使用

1. 請確認已安裝 node.js 與 npm
2. 將專案 clone 到本地

   ```bash
   git clone ...
   ```

3. 依照 .env.example 設定環境變數
4. 建立種子資料

   ```bash
   npx sequelize db:migrate
   npx sequelize db:seed:all
   ```

5. 在本地開啟之後，透過終端機進入資料夾，輸入：

   ```bash
   npm install
   ```

6. 安裝完畢後，繼續輸入：

   ```bash
   npm run start
   ```

7. 若看見此行訊息則代表順利運行，打開瀏覽器進入網址

   ```bash
   Running on http://localhost:3000
   ```
