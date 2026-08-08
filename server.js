// server.js
const express = require('express');
const crypto = require('crypto'); // 用于生成随机ID
const path = require('path');

const app = express();
app.use(express.json()); 
app.use(express.static('public')); // 告诉服务器，前端网页放在 public 文件夹下

// 模拟数据库（存放在内存中）
const giftDatabase = {};

// 接口 1：生成包裹
app.post('/api/pack', (req, res) => {
    const { senderName, message, boxColor } = req.body;
    
    // 生成一个 8 位数的随机 ID
    const giftId = crypto.randomBytes(4).toString('hex');
    
    // 把礼物信息存入“数据库”
    giftDatabase[giftId] = {
        senderName,
        message,
        boxColor,
        createdAt: new Date()
    };

    
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    const giftUrl = `${protocol}://${host}/gift.html?id=${giftId}`;

    res.json({ success: true, giftId, url: giftUrl });
});

// 接口 2：获取包裹信息
app.get('/api/unpack/:id', (req, res) => {
    const giftId = req.params.id;
    const gift = giftDatabase[giftId];
    
    if (gift) {
        res.json({ success: true, data: gift });
    } else {
        res.json({ success: false, message: '包裹不存在或已过期！' });
    }
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🎁 服务器已启动！请在浏览器访问: http://localhost:${PORT}`);
});
