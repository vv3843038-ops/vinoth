const TelegramBot = require('node-telegram-bot-api');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// --- CONFIGURATION ---
const TELEGRAM_TOKEN = '8422044110:AAGOi2EANNPVwq_LtmbDYi5GygTtUJdHNGw'; 
const DAMAN_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIxNzc3NjMwMTU5IiwibmJmIjoiMTc3NzYzMDE1OSIsImV4cCI6IjE3Nzc2MzE5NTkiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiI1LzEvMjAyNiA0OjA5OjE5IFBNIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWNjZXNzX1Rva2VuIiwiVXNlcklkIjoiMzMzMzg0NCIsIlVzZXJOYW1lIjoiOTE5MTUwOTg0OTczIiwiVXNlclBob3RvIjoiMSIsIk5pY2tOYW1lIjoiTWVtYmVyTk5HQzVVVVgiLCJBbW91bnQiOiIwLjAwIiwiSW50ZWdyYWwiOiIwIiwiTG9naW5NYXJrIjoiSDUiLCJMb2dpblRpbWUiOiI1LzEvMjAyNiAzOjM5OjE5IFBNIiwiTG9naW5JUEFkZHJlc3MiOiIyNDA5OjQwZjQ6MjExMjo4YzdmOmYxMWE6NGE4MjpkNjk6ZTdiIiwiRGJOdW1iZXIiOiIwIiwiSXN2YWxpZGF0b3IiOiIwIiwiS2V5Q29kZSI6IjUiLCJUb2tlblR5cGUiOiJBY2Nlc3NfVG9rZW4iLCJQaG9uZVR5cGUiOiIwIiwiVXNlclR5cGUiOiIwIiwiVXNlck5hbWUyIjoiIiwiaXNzIjoiand0SXNzdWVyIiwiYXVkIjoibG90dGVyeVRpY2tldCJ9.0CrcdTI8KCPdcNnu-Wy4jjsqIAzHks9Pz95n4skT7Y4'; 
const DAMAN_COOKIE = 'ext_name=ojplmecpdpgccookcobabopnaifgidhf; _ga=GA1.1.1392287628.1777616271; _ga_L7Q7SEVMR6=GS2.1.s1777630158$o2$g1$t1777616270$j52$l0$h0';
// ---------------------

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling: true});
console.log("🚀 Jai Club AI Bot is starting on Localhost...");

bot.onText(/\/result/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "🔍 Analyzing Live Data...");
    
    try {
        const response = await fetch("https://damansuperstar1.com/api/web/lottery/results", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": DAMAN_TOKEN,
                "Cookie": DAMAN_COOKIE
            },
            body: JSON.stringify({ "typeid": 1, "pageno": 1, "pagesize": 10 })
        });

        const data = await response.json();
        console.log("Server Response:", data);

        if (data.code === 0) {
            const last = data.data.list[0];
            const num = parseInt(last.number);
            const period = parseInt(last.issueNumber) + 1;
            const res = num >= 5 ? "BIG 🟢" : "SMALL 🔴";
            bot.sendMessage(chatId, `🎯 *Jai Club Live*\n\nPeriod: ${period}\nResult: *${res}*`, {parse_mode: 'Markdown'});
        } else {
            bot.sendMessage(chatId, `❌ Error: ${data.msg || "Session Expired!"}`);
        }
    } catch (err) {
        bot.sendMessage(chatId, "⚠️ Connection Error! Try using mobile hotspot.");
    }
});