const { Client, LocalAuth } = require('whatsapp-web.js');
const mongoose = require('mongoose');
const User = require('./User'); // Import model User

const ownerNumber = '6285719707846'; // Nomor WhatsApp owner
const menuText = `
Hai, saya GameBot! Senang bisa bermain denganmu! Ayo, di bawah ini ada pilihan yang bisa kamu coba.
Terimakasih!!

• set nickname <nama yang ingin diganti>
• Teka-teki
• Profile
• Toko Boost

Catatan:
Terimakasih telah mencoba bot kami, saya sangat senang. Kamu juga bisa meningkatkan profilmu! Terimakasih banyak!!
`;

const riddles = [
    {question: "Apa yang bisa berdiri tetapi tidak bisa berjalan?", answer: "Pohon"},
{question: "Apa yang memiliki mata tapi tidak bisa melihat?", answer: "Jarum dan benang"},
{question: "Apa yang bisa dipotong tapi tidak pernah tumbuh?", answer: "Lautan"},
{question: "Apa yang naik tanpa pernah turun?", answer: "Usia"},
{question: "Apa yang tidak pernah bisa tertangkap?", answer: "Suara"},
{question: "Siapakah yang selalu tidur di kota ini?", answer: "Tukang tidur"},
{question: "Siapa yang bisa berdiri tetapi tidak pernah jatuh?", answer: "Bayangan"},
{question: "Apa yang bisa terbang tanpa sayap?", answer: "Waktu"},
{question: "Apa yang memiliki kunci tetapi tidak bisa membuka pintu?", answer: "Keyboard"},
{question: "Apa yang memiliki mata tapi tidak bisa melihat?", answer: "Jarum dan benang"},
{question: "Apa yang memiliki banyak kaki tetapi tidak bisa berjalan?", answer: "Meja"},
{question: "Apa yang bisa dimiliki tetapi tidak bisa dipegang?", answer: "Janji"},
{question: "Apa yang melewati 24 jam tetapi tidak pernah menua?", answer: "Hari"},
{question: "Apa yang bisa membolak-balikkan seluruh dunia tetapi tidak bisa membolak-balikkan koin?", answer: "Peta"},
{question: "Apa yang bisa menutup mata tetapi tidak bisa tidur?", answer: "Bulu mata"},
{question: "Apa yang bisa tumbuh tetapi tidak pernah berkembang?", answer: "Kuku"},
{question: "Apa yang dihitung tetapi tidak pernah dihitung?", answer: "Waktu"},
{question: "Apa yang bisa membaca pikiran tetapi tidak bisa berbicara?", answer: "Buku"},
{question: "Apa yang bisa terbang tetapi tidak memiliki sayap?", answer: "Waktu"},
{question: "Apa yang bisa menangis tanpa air?", answer: "Awan"},
{question: "Apa yang bisa berdiri tetapi tidak bisa dipakai?", answer: "Pohon"},
{question: "Apa yang bisa ditunjukkan tetapi tidak bisa disentuh?", answer: "Pikiran"},
{question: "Apa yang bisa terbang tetapi tidak bisa berjalan?", answer: "Roket"},
{question: "Apa yang bisa jalan tapi tidak bisa lari?", answer: "Peta"},
{question: "Apa yang bisa berbicara tanpa suara?", answer: "Buku"},
{question: "Apa yang bisa dipegang tetapi tidak bisa disentuh?", answer: "Pikiran"},
{question: "Apa yang bisa dimiliki tetapi tidak pernah digunakan?", answer: "Nama"},
{question: "Apa yang bisa mengubah segalanya tetapi tidak bisa berubah?", answer: "Pikiran"},
{question: "Apa yang bisa menyembuhkan tetapi tidak bisa disembuhkan?", answer: "Waktu"},
{question: "Apa yang bisa mengetuk tetapi tidak bisa berbicara?", answer: "Pintu"}
    // Tambahkan teka-teki lainnya di sini
];

const client = new Client({
    authStrategy: new LocalAuth()
});

// Koneksi ke MongoDB menggunakan Mongoose
mongoose.connect('mongodb+srv://atlas-sample-dataset-load-667ebe0982dd5d4c937597a2:<password>@cluster1000.niezvea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1000', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Terhubung ke MongoDB');
}).catch(err => {
    console.error('Gagal terhubung ke MongoDB', err);
});

// Event saat bot WhatsApp siap
client.on('ready', () => {
    console.log('Bot WhatsApp siap digunakan!');
});

// Event saat pesan diterima
client.on('message', async message => {
    const chatId = message.from;
    const command = message.body.toLowerCase().split(' ');

    let user = await User.findOne({ chatId });
    if (!user) {
        user = new User({ chatId });
        await user.save();
    }

    if (command[0] === 'set' && command[1] === 'nickname') {
        const newNickname = command.slice(2).join(' ');

        user.nickname = newNickname;
        await user.save();

        message.reply(`Nickname telah diganti menjadi ${newNickname}.`);
    }

    if (command[0] === 'menu') {
        message.reply(menuText);
    } else if (command[0] === 'profile') {
        const profile = `
Your Profile:
Nickname: ${user.nickname}
Level: ${user.level} [${user.exp}-${user.level * 500} Exp]
Coin: ${user.coins}
Boost yang dipakai: ${user.boosts.length ? user.boosts.map(boost => `${boost.name} [sisa waktu: ${boost.remaining} menit]`).join(', ') : 'Tidak ada'}
        `;
        message.reply(profile);
    } else if (command[0] === 'toko' && command[1] === 'boost') {
        const shop = `
Selamat datang di Toko Boost! Di bawah ini adalah barang-barang yang mungkin bisa kamu beli!
 • Exp Boost+ (minuman ini akan membuat levelmu naik lebih cepat 20% selama 10 menit, dengan harga 50 koin.)
 • Koin Boost+ (minuman ini akan membuat kamu mendapatkan 20% lebih banyak koin setiap kali menjawab teka-teki selama 10 menit, dengan harga 40 koin.)

Catatan:
Pastikan kamu mempunyai cukup koin untuk membeli barang-barang ini.
        `;
        message.reply(shop);
    } else if (command[0] === 'beli' && command[1] === 'exp' && command[2] === 'boost') {
        if (user.coins >= 50) {
            user.coins -= 50;
            user.boosts.push({ name: 'Exp Boost+', remaining: 10 }); // Durasi boost dalam menit
            await user.save();
            message.reply('Kamu telah membeli Exp Boost+!');
        } else {
            message.reply('Kamu tidak memiliki cukup koin untuk membeli Exp Boost+.');
        }
    } else if (command[0] === 'beli' && command[1] === 'koin' && command[2] === 'boost') {
        if (user.coins >= 40) {
            user.coins -= 40;
            user.boosts.push({ name: 'Koin Boost+', remaining: 10 }); // Durasi boost dalam menit
            await user.save();
            message.reply('Kamu telah membeli Koin Boost+!');
        } else {
            message.reply('Kamu tidak memiliki cukup koin untuk membeli Koin Boost+.');
        }
    } else if (command[0] === 'teka-teki') {
        if (riddleState[chatId]) {
            message.reply('Kamu masih memiliki teka-teki yang belum dijawab.');
            return;
        }
        const riddle = riddles[Math.floor(Math.random() * riddles.length)];
        riddleState[chatId] = {
            riddle,
            startTime: Date.now(),
            attempts: 0
        };
        message.reply(riddle.question);
        setTimeout(() => {
            if (riddleState[chatId]) {
                message.reply('Tersisa 30 detik untuk menjawab teka-teki ini!');
                setTimeout(() => {
                    if (riddleState[chatId]) {
                        message.reply('Tersisa 10 detik untuk menjawab teka-teki ini!');
                        setTimeout(() => {
                            if (riddleState[chatId]) {
                                message.reply('Waktu habis! Teka-teki tidak terjawab.');
                                delete riddleState[chatId];
                            }
                        }, 10000);
                    }
                }, 20000);
            }
        }, 30000);
    } else {
        message.reply('Perintah tidak dikenal.');
    }
});

// Inisialisasi client WhatsApp
client.initialize();

